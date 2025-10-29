/* eslint-disable no-console */
import nodeFetch from 'node-fetch';
import fetch from '@11ty/eleventy-fetch';
import 'dotenv/config';

export default async () => {
	async function setToken (access_token, refresh_token, expiry_date) {
		let config = {
			headers: {
				authorization: 'Bearer ' + process.env.DIRECTUS_TOKEN,
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			body: JSON.stringify({
				'access_token': access_token,
				'refresh_token': refresh_token,
				'expiry_date': expiry_date
			})
		};

		let response = await nodeFetch(`https://cms.gustavlindqvist.se/items/Strava`, config);

		if (response.ok) {
			let jsonResponse = await response.json();
			return jsonResponse.data;
		}
		return undefined;
	}

	async function getToken () {
		let config = {
			headers: {
				'authorization': 'Bearer ' + process.env.DIRECTUS_TOKEN,
				'Content-Type': 'application/json'
			},
			method: 'GET'
		};

		let response = await nodeFetch(`https://cms.gustavlindqvist.se/items/Strava`, config);

		if (response.ok) {
			let jsonResponse = await response.json();
			return jsonResponse.data;
		}
		return undefined;
	}

	async function getAccessToken () {
		const tokens = await getToken();
		const expirationDate = new Date(tokens.expiry_date);

		if (typeof tokens.access_token === 'undefined' || expirationDate < new Date()) {
			let response = await nodeFetch('https://www.strava.com/api/v3/oauth/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					client_id: process.env.STRAVA_CLIENTID,
					client_secret: process.env.STRAVA_SECRET,
					grant_type: 'refresh_token',
					refresh_token: tokens.refresh_token
				})
			});

			const newTokens = await response.json();
			await setToken(
				newTokens.access_token,
				newTokens.refresh_token,
				new Date(newTokens.expires_at * 1000)
					.toISOString());

			return newTokens.access_token;
		}
		return tokens.access_token;
	}

	const accessToken = await getAccessToken();

	async function getAthlete () {
		const athlete = await fetch('https://www.strava.com/api/v3/athlete', {
			duration: '1d',
			type: 'json',
			directory: '.cache',
			fetchOptions: {
				headers: { Authorization: 'Bearer ' + accessToken }
			}
		});

		console.log('[' + '\x1b[33m%s\x1b[0m', 'Strava' + '\x1b[0m' + ']:', 'loaded athlete');
		return athlete;
	}

	async function getActivities () {
		const activities = await fetch(
			'https://www.strava.com/api/v3/athlete/activities?per_page=200',
			{
				duration: '1h',
				type: 'json',
				directory: '.cache',
				fetchOptions: {
					headers: { Authorization: 'Bearer ' + accessToken }
				}
			}
		);

		activities.forEach((activity) => {
			activity.start_date = new Date(activity.start_date);
			if (activity.type === 'Run' || activity.type === 'Walk') {
				const pace =
					activity.workout_type === 1
						? (activity.elapsed_time / activity.distance) * 1000
						: (activity.moving_time / activity.distance) * 1000;

				let wholeSeconds = Math.round(pace % 60);
				wholeSeconds = String(wholeSeconds).padStart(2, '0');
				let wholeMinutes = (pace - (pace % 60)) / 60;

				activity.pace = wholeMinutes + ':' + wholeSeconds;
			}
			activity.distance_km = Number(activity.distance / 1000).toFixed(1);
			activity.average_speed_km = Math.round(activity.average_speed * 3.6);
		});

		const visibleActivities = activities.filter((activity) => {
			return activity.visibility === 'everyone';
		});

		console.log(
			'[' + '\x1b[33m%s\x1b[0m',
			'Strava' + '\x1b[0m' + ']:',
			'loaded',
			visibleActivities.length + ' activities'
		);
		return visibleActivities;
	}

	return {
		athlete: await getAthlete(),
		activities: await getActivities()
	};
};
