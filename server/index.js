// Simple Express server for Stripe operations
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://swap-ai-theta.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SwapAI Stripe Server is running' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PLATFORM_FEE_PERCENT = 10

// Create Stripe Connect account link for seller onboarding
app.post('/api/stripe/create-account', async (req, res) => {
  try {
    const { email, userId } = req.body
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      metadata: { userId: userId },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?stripe=refresh`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?stripe=success&account=${account.id}`,
      type: 'account_onboarding',
    })
    res.json({ accountId: account.id, url: accountLink.url })
  } catch (error) {
    console.error('Error creating Stripe account:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create checkout session for purchasing a tool
app.post('/api/stripe/create-checkout', async (req, res) => {
  try {
    const { listingId, listingTitle, price, sellerStripeAccountId, buyerEmail } = req.body
    if (!sellerStripeAccountId) {
      return res.status(400).json({ error: 'Seller has not connected Stripe account' })
    }
    const priceInCents = Math.round(price * 100)
    const platformFee = Math.round(priceInCents * (PLATFORM_FEE_PERCENT / 100))
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: listingTitle,
            description: 'AI Tool from SwapAI Marketplace',
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/listing/${listingId}?purchase=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/listing/${listingId}?purchase=cancelled`,
      customer_email: buyerEmail,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: { destination: sellerStripeAccountId },
      },
      metadata: { listingId: listingId },
    })
    res.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
})

// Check if seller's Stripe account is fully onboarded
app.get('/api/stripe/account-status/:accountId', async (req, res) => {
  try {
    const account = await stripe.accounts.retrieve(req.params.accountId)
    res.json({
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    })
  } catch (error) {
    console.error('Error checking account status:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create new account link if onboarding was interrupted
app.post('/api/stripe/refresh-account-link', async (req, res) => {
  try {
    const { accountId } = req.body
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?stripe=refresh`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?stripe=success&account=${accountId}`,
      type: 'account_onboarding',
    })
    res.json({ url: accountLink.url })
  } catch (error) {
    console.error('Error refreshing account link:', error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stripe server running on port ${PORT}`)
})
