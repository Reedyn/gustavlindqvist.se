/**
 * Send a POST request to the URL defined in the `BUILD_HOOK` environment variable
 * @param req
 * @returns {Promise<void>}
 */
export default async (req) => {
	const { next_run } = await req.json();

	// eslint-disable-next-line no-undef
	await fetch(Netlify.env.get('BUILD_HOOK'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	// eslint-disable-next-line no-console
	console.log('Posted build. Next invocation at:', next_run);
};

/**
 * Set the function to run hourly
 * @type {{schedule: string}}
 */
export const config = {
	schedule: '@hourly',
};
