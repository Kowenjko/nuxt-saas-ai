import Stripe from 'stripe'
import prismadb from '@/lib/prismadb'
import { stripe } from '@/lib/stripe'

const webhookSecret = useRuntimeConfig().stripeWebhookSecret!

export default defineEventHandler(async (e) => {
	console.log('Webhook===>')
	const body = await readRawBody(e)
	const signature = getHeader(e, 'Stripe-Signature') as string

	let stripeEvent: Stripe.Event

	stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret)

	if (!stripeEvent) errorHandler(400, 'Webhook Error')
	const session = stripeEvent.data.object as Stripe.Checkout.Session

	if (stripeEvent.type === 'checkout.session.completed') {
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		)

		if (!session?.metadata?.userId) {
			throw createError({
				statusCode: 400,
				message: `User id is required`,
			})
		}

		await prismadb.userSubscription.create({
			data: {
				userId: session?.metadata?.userId,
				stripeSubscriptionId: subscription.id,
				stripeCustomerId: subscription.customer as string,
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(
					subscription.current_period_end * 1000
				),
			},
		})
	}

	if (stripeEvent.type === 'invoice.payment_succeeded') {
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		)

		await prismadb.userSubscription.update({
			where: {
				stripeSubscriptionId: subscription.id,
			},
			data: {
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(
					subscription.current_period_end * 1000
				),
			},
		})
	}

	return 200
})
