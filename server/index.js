import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors({
  origin: ['http://localhost:5173', 'https://swap-ai-theta.vercel.app', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'ok', message: 'SwapAI Payment Server' }))
app.get('/health', (req, res) => res.json({ status: 'ok' }))

const STRIPE_FEE_PERCENT = 10
const CRYPTO_FEE_PERCENT = 8.5

app.post('/api/stripe/create-account', async (req, res) => {
  try {
    const { email, userId } = req.body
    const account = await stripe.accounts.create({ type: 'express', email, metadata: { userId }, capabilities: { card_payments: { requested: true }, transfers: { requested: true } } })
    const accountLink = await stripe.accountLinks.create({ account: account.id, refresh_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard?stripe=refresh', return_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard?stripe=success&account=' + account.id, type: 'account_onboarding' })
    res.json({ accountId: account.id, url: accountLink.url })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

app.post('/api/stripe/create-checkout', async (req, res) => {
  try {
    const { listingId, listingTitle, price, sellerStripeAccountId, buyerEmail } = req.body
    if (!sellerStripeAccountId) return res.status(400).json({ error: 'Seller has not connected Stripe' })
    const priceInCents = Math.round(price * 100)
    const platformFee = Math.round(priceInCents * (STRIPE_FEE_PERCENT / 100))
    const session = await stripe.checkout.sessions.create({ payment_method_types: ['card'], line_items: [{ price_data: { currency: 'usd', product_data: { name: listingTitle }, unit_amount: priceInCents }, quantity: 1 }], mode: 'payment', success_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/listing/' + listingId + '?purchase=success', cancel_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/listing/' + listingId + '?purchase=cancelled', customer_email: buyerEmail, payment_intent_data: { application_fee_amount: platformFee, transfer_data: { destination: sellerStripeAccountId } } })
    res.json({ url: session.url, sessionId: session.id })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

app.get('/api/stripe/account-status/:accountId', async (req, res) => {
  try {
    const account = await stripe.accounts.retrieve(req.params.accountId)
    res.json({ chargesEnabled: account.charges_enabled, payoutsEnabled: account.payouts_enabled, detailsSubmitted: account.details_submitted })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

app.post('/api/stripe/refresh-account-link', async (req, res) => {
  try {
    const { accountId } = req.body
    const accountLink = await stripe.accountLinks.create({ account: accountId, refresh_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard?stripe=refresh', return_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard?stripe=success&account=' + accountId, type: 'account_onboarding' })
    res.json({ url: accountLink.url })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

// Coinbase Commerce - Create Checkout
app.post('/api/coinbase/create-checkout', async (req, res) => {
  try {
    const { listingId, listingTitle, price, sellerId, buyerEmail } = req.body
    if (!process.env.COINBASE_COMMERCE_API_KEY) {
      return res.status(500).json({ error: 'Coinbase Commerce not configured' })
    }

    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: listingTitle,
        description: `Purchase of ${listingTitle} on SwapAI`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: price.toString(),
          currency: 'USD'
        },
        metadata: {
          listing_id: listingId,
          seller_id: sellerId,
          buyer_email: buyerEmail,
          platform_fee_percent: CRYPTO_FEE_PERCENT
        },
        redirect_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/listing/' + listingId + '?purchase=success&method=crypto',
        cancel_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/listing/' + listingId + '?purchase=cancelled'
      })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create Coinbase charge')
    }

    res.json({ url: data.data.hosted_url, chargeId: data.data.id })
  } catch (error) { res.status(500).json({ error: error.message }) }
})

// Email notifications (optional - requires RESEND_API_KEY)
app.post('/api/notifications/purchase', async (req, res) => {
  try {
    const { buyerEmail, buyerName, sellerEmail, sellerName, listingTitle, amount, paymentMethod, purchaseId } = req.body

    if (!process.env.RESEND_API_KEY) {
      // Email not configured, skip silently
      return res.json({ success: true, message: 'Email notifications not configured' })
    }

    const emailPromises = []

    // Email to buyer
    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'SwapAI <notifications@' + (process.env.EMAIL_DOMAIN || 'swapai.app') + '>',
          to: buyerEmail,
          subject: `Purchase Confirmed: ${listingTitle}`,
          html: `
            <h2>Thanks for your purchase, ${buyerName}!</h2>
            <p>Your order has been confirmed.</p>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Item:</strong> ${listingTitle}</p>
              <p><strong>Amount:</strong> $${amount}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod === 'crypto' ? 'Cryptocurrency' : 'Card'}</p>
              <p><strong>Order ID:</strong> ${purchaseId}</p>
            </div>
            <p>The seller has been notified and will reach out with delivery details. You can also message them directly through SwapAI.</p>
            <p>Thanks for using SwapAI!</p>
          `
        })
      })
    )

    // Email to seller
    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'SwapAI <notifications@' + (process.env.EMAIL_DOMAIN || 'swapai.app') + '>',
          to: sellerEmail,
          subject: `New Sale: ${listingTitle}`,
          html: `
            <h2>Congratulations ${sellerName}! You made a sale! 🎉</h2>
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Item Sold:</strong> ${listingTitle}</p>
              <p><strong>Sale Amount:</strong> $${amount}</p>
              <p><strong>Buyer:</strong> ${buyerName}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod === 'crypto' ? 'Cryptocurrency' : 'Card'}</p>
              <p><strong>Order ID:</strong> ${purchaseId}</p>
            </div>
            <p>Please deliver the product to the buyer. A conversation has been automatically started - check your messages on SwapAI.</p>
            <p>Thanks for selling on SwapAI!</p>
          `
        })
      })
    )

    await Promise.all(emailPromises)
    res.json({ success: true })

  } catch (error) {
    console.error('Email notification error:', error)
    res.json({ success: false, error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT))
// force redeploy

