import Stripe from 'stripe'
import prismadb from '@/lib/prismadb'
import { stripe } from '@/lib/stripe'

export default defineEventHandler(async (e) => {
	console.log('Вход===>')
	const body = await readBody(e)
	const signature = getHeader(e, 'Stripe-Signature') as string
	// const signature = e.node.req.headers['stripe-signature']
	console.log('signature===>', signature)
	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			useRuntimeConfig().stripeWebhookSecret!
		)

		console.log(event)
	} catch (error: any) {
		throw createError({
			statusCode: 400,
			message: `Webhook Error: ${error.message}`,
		})
	}

	const session = event.data.object as Stripe.Checkout.Session

	if (event.type === 'checkout.session.completed') {
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

	if (event.type === 'invoice.payment_succeeded') {
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

	return { status: 200 }
})
