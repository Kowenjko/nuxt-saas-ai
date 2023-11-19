import prismadb from '@/lib/prismadb'
import { absoluteUrl } from '@/lib/utils'
import { stripe } from '@/lib/stripe'

const settingsUrl = absoluteUrl('/settings')

export default defineEventHandler(async (event) => {
	const { user } = await readBody(event)

	console.log('user===', user)

	if (!user?.id) errorHandler(401, 'Unauthorized')

	const userSubscription = await prismadb.userSubscription.findUnique({
		where: { userId: user.id },
	})

	if (userSubscription && userSubscription.stripeCustomerId) {
		const stripeSession = await stripe.billingPortal.sessions.create({
			customer: userSubscription.stripeCustomerId,
			return_url: settingsUrl,
		})

		return { url: stripeSession.url }
	}

	const stripeSession = await stripe.checkout.sessions.create({
		success_url: settingsUrl,
		cancel_url: settingsUrl,
		payment_method_types: ['card'],
		mode: 'subscription',
		billing_address_collection: 'auto',
		customer_email: user.emailAddresses[0].emailAddress,
		line_items: [
			{
				price_data: {
					currency: 'USD',
					product_data: {
						name: 'Genius Pro',
						description: 'Unlimited AI Generations',
					},
					unit_amount: 20000,
					recurring: {
						interval: 'month',
					},
				},
				quantity: 1,
			},
		],
		metadata: { userId: user.id },
	})

	if (stripeSession?.url) return { url: stripeSession.url }

	errorHandler(500, 'Internal Error')
})
