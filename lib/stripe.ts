import Stripe from 'stripe'

export const stripe = new Stripe(useRuntimeConfig().stripeApiKey!, {
	apiVersion: '2023-10-16',
	typescript: true,
})
