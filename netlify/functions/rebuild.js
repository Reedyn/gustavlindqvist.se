export default async (req) => {
	const { next_run } = await req.json();

	// eslint-disable-next-line no-undef
	const response = await fetch(Netlify.env.get('BUILD_HOOK'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	// eslint-disable-next-line no-console
	console.log('Posted build. Next invocation at:', next_run);
};
