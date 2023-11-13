// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'@nuxt/image',
		[
			'@nuxtjs/google-fonts',
			{
				families: {
					Roboto: true,
					Inter: [400, 700],
					'Josefin+Sans': true,
					Lato: [100, 300],
					Raleway: {
						wght: [100, 400],
						ital: [100],
					},
				},
			},
		],
	],
	head: {
		link: [
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,600;0,700;1,400&display=swap',
			},
		],
	},
	build: {
		transpile: ['vue-clerk', '@clerk/clerk-js'],
	},
	runtimeConfig: {
		public: {
			clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
		},
		clerkSecretKey: process.env.CLERK_SECRET_KEY,
	},
	hooks: {
		'components:dirs': (dirs) => {
			dirs.unshift({
				path: '~/components/ui',
				// this is required else Nuxt will autoImport `.ts` file
				extensions: ['.vue'],
				// prefix for your components, eg: UiButton
				prefix: 'Ui',
				// prevent adding another prefix component by it's path.
				pathPrefix: false,
			})
		},
	},
})
