export async function handler(event, context) {
	try {
		// eslint-disable-next-line no-undef
		const response = await fetch(Netlify.env.get('BUILD_HOOK'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json().catch(() => null);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'POST request successful',
				response: data,
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: error.message,
			}),
		};
	}
}
