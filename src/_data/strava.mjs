/* eslint-disable no-console */
import AssetCache from '@11ty/eleventy-fetch';
import nodeFetch from 'node-fetch';
import stravaAPI from 'strava-v3';
import 'dotenv/config';

export default async () => {
	async function setValue(key, value) {
		let headers = {
			'X-Api-Key': process.env.THISDB_APIKEY,
		};
		const bucketId = process.env.THISDB_BUCKETID;

		let init = {
			headers: headers,
			method: 'POST',
			body: JSON.stringify(value),
		};

		let response = await nodeFetch(`https://api.thisdb.com/v1/${bucketId}/${key}`, init);

		return await response.text();
	}

	async function getValue(key) {
		let headers = {
			'X-Api-Key': process.env.THISDB_APIKEY,
		};
		const bucketId = process.env.THISDB_BUCKETID;

		let init = {
			headers: headers,
			method: 'GET',
		};

		let response = await nodeFetch(`https://api.thisdb.com/v1/${bucketId}/${key}`, init);

		return await response.json();
	}

	async function getAccessToken() {
		let bearerToken = await getValue('strava');
		const expirationDate = new Date(bearerToken.expires_at * 1000);
		if (expirationDate < new Date()) {
			// Is the token expired?

			let response = await nodeFetch('https://www.strava.com/api/v3/oauth/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					client_id: process.env.STRAVA_CLIENTID,
					client_secret: process.env.STRAVA_SECRET,
					grant_type: 'refresh_token',
					refresh_token: bearerToken.refresh_token,
				}),
			});

			bearerToken = await response.json();

			setValue('strava', bearerToken);

			return bearerToken.access_token;
		}
		return bearerToken.access_token;
	}

	function generateSVGMap(polyline) {
		function sign(value) {
			return value && 1 ? ~(value >>> 1) : value >>> 1;
		}
		function integers(value, start, end, fn) {
			let byte = 0;
			let current = 0;
			let bits = 0;

			for (let i = start; i < end; i++) {
				byte = value.charCodeAt(i) - 63;
				current = current | ((byte & 0x1f) << bits);
				bits += 5;

				if (byte < 0x20) {
					if (byte === -1 && bits === 5) {
						// special case - single byte 0 encoded as -1
						current = 0;
					}
					fn(sign(current));
					current = 0;
					bits = 0;
				}
			}
		}
		function decode(value, { factor = 1e5, mapFn, start = 0, end = value.length } = {}) {
			const points = [];
			let x;
			let y;
			let px = 0;
			let py = 0;
			let point;

			integers(value, start, end, function (v) {
				if (y === undefined) {
					// y (as in longitude) comes first
					y = v;
					return;
				}
				x = v;

				x = x + px;
				y = y + py;

				point = [x / factor, y / factor];
				if (mapFn) {
					point = mapFn(point);
				}
				points.push(point);

				px = x;
				py = y;

				x = y = undefined;
			});

			return points;
		}
		let outerBounds = {
			north: undefined,
			south: undefined,
			east: undefined,
			west: undefined,
		};

		const points = decode(polyline);
		let lineString = '';

		points.forEach((point) => {
			outerBounds.north =
				!outerBounds.north || outerBounds.north < point[1]
					? point[1] * 10
					: outerBounds.north;
			outerBounds.south =
				!outerBounds.south || outerBounds.south > point[1]
					? point[1] * 10
					: outerBounds.south;
			outerBounds.east =
				!outerBounds.east || outerBounds.east < point[1] ? point[0] * 10 : outerBounds.east;
			outerBounds.west =
				!outerBounds.west || outerBounds.west > point[1] ? point[0] * 10 : outerBounds.west;

			lineString += point[0] * 10 + ',' + point[1] * 10 + ' ';
		});

		lineString.trim();

		return {
			line: lineString,
			outerBounds: outerBounds,
		};
	}

	const accessToken = await getAccessToken();

	async function getAthlete() {
		const athlete = await stravaAPI.athlete.get({
			access_token: accessToken,
		});
		console.log('[' + '\x1b[33m%s\x1b[0m', 'Strava' + '\x1b[0m' + ']:', 'loaded athlete');
		return athlete;
	}

	async function getActivities() {
		try {
			const activities = await stravaAPI.athlete.listActivities({
				access_token: accessToken,
				per_page: 200,
			});

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
				activity.map.svg = generateSVGMap(activity.map.summary_polyline);
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
				visibleActivities.length + ' activities',
			);
			return visibleActivities;
		} catch (err) {}
	}

	return {
		athlete: await getAthlete(),
		activities: await getActivities(),
	};
};
