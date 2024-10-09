/* eslint-disable no-console */
const fetch = require('@11ty/eleventy-fetch');

require('dotenv').config();

module.exports = async () => {
	const brewfatherId = process.env.BREWFATHER_ID;
	const apiKey = process.env.BREWFATHER_APIKEY;
	const rawAuthorizationHeader = Buffer.from(`${brewfatherId}:${apiKey}`);
	const authorizationHeader = rawAuthorizationHeader.toString('base64');

	const asyncForEach = async function (array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	};

	const calculateBalanceValue = (og, fg, ibu) => {
		og = og * 1000 - 1000;
		fg = fg * 1000 - 1000;
		const rte = 0.82 * fg + 0.18 * og;
		return ((0.8 * ibu) / rte).toFixed(2);
	};

	const convertSRMtoEBC = (srm) => {
		return Math.round(srm * 1.97);
	};

	const setEBCColor = (ebc) => {
		const mappingTable = [
			{
				ebc: 8,
				hexColor: '#f9e06c',
			},
			{
				ebc: 12,
				hexColor: '#eaaf1e',
			},
			{
				ebc: 15,
				hexColor: '#d68019',
			},
			{
				ebc: 18,
				hexColor: '#b7521a',
			},
			{
				ebc: 20,
				hexColor: '#9d3414',
			},
			{
				ebc: 25,
				hexColor: '#892515',
			},
			{
				ebc: 30,
				hexColor: '#731c0b',
			},
			{
				ebc: 35,
				hexColor: '#5b0b0a',
			},
			{
				ebc: 40,
				hexColor: '#450b0a',
			},
			{
				ebc: 99999,
				hexColor: '#240a0b',
			},
		];
		for (const mapping of mappingTable) {
			if (ebc < mapping.ebc) {
				return mapping.hexColor;
			}
		}

		return undefined;
	};

	const getBatches = async () => {
		const getBatch = async (batchId) => {
			try {
				const batch = await fetch('https://api.brewfather.app/v1/batches/' + batchId, {
					duration: '1h',
					type: 'json',
					directory: '.cache',
					fetchOptions: {
						headers: { Authorization: 'Basic ' + authorizationHeader },
					},
				});

				if (
					typeof batch.measuredOg !== 'undefined' &&
					typeof batch.measuredFg !== 'undefined' &&
					typeof batch.ibu !== 'undefined'
				) {
					batch.bv = calculateBalanceValue(
						batch.measuredOg,
						batch.measuredFg,
						batch.recipe.ibu,
					);
				} else {
					batch.bv = null;
				}

				if (
					typeof batch.recipe.og !== 'undefined' &&
					typeof batch.recipe.fg !== 'undefined' &&
					typeof batch.recipe.ibu !== 'undefined'
				) {
					batch.recipe.bv = calculateBalanceValue(
						batch.recipe.og,
						batch.recipe.fg,
						batch.recipe.ibu,
					);
				} else {
					batch.recipe.bv = null;
				}

				let status = 'Färdig';
				let statusCode = 'completed';

				switch (batch.status) {
					case 'Planning':
						status = 'Planerad';
						statusCode = 'planning';
						break;
					case 'Brewing':
						status = 'Bryggdag! 🍺';
						statusCode = 'brewing';
						break;
					case 'Fermenting':
						status = 'Fermenteras';
						statusCode = 'fermenting';
						break;
					case 'Conditioning':
						status = 'Efterbehandling';
						statusCode = 'conditioning';
						break;
					case 'Completed':
						status = 'Färdig';
						statusCode = 'completed';
				}
				batch.notes.forEach((note) => {
					note.time = new Date(note.timestamp);
				});
				batch.notes = batch.notes.filter((note) => {
					return (
						note.status.toLowerCase() === statusCode &&
						typeof note.type === 'undefined' &&
						note.note.length
					);
				});

				batch.status = {
					label: status,
					code: statusCode,
				};

				return batch;
			} catch (err) {
				console.error(err);
				return [];
			}
		};
		const getBatchReadings = async (batchId) => {
			let readings = {};
			try {
				const batchReadings = await fetch(
					'https://api.brewfather.app/v1/batches/' + batchId + '/readings',
					{
						duration: '1h',
						type: 'json',
						directory: '.cache',
						fetchOptions: {
							headers: { Authorization: 'Basic ' + authorizationHeader },
						},
					},
				);

				batchReadings.forEach((reading) => {
					reading.time = new Date(reading.time);
				});

				const temperatures = batchReadings
					.filter((reading) => reading.temp)
					.map((reading) => {
						return { time: new Date(reading.time), value: reading.temp };
					})
					.sort((a, b) => {
						return new Date(a.time) - new Date(b.time);
					});

				const gravity = batchReadings
					.filter((reading) => reading.sg)
					.map((reading) => {
						return { time: new Date(reading.time), value: reading.sg };
					})
					.sort((a, b) => {
						return new Date(a.time) - new Date(b.time);
					});

				readings.last = {
					sg: gravity[gravity.length - 1],
					temp: temperatures[temperatures.length - 1],
				};

				readings.all = batchReadings.sort((a, b) => new Date(a.time) - new Date(b.time));

				return readings;
			} catch (err) {
				console.error(err);
				return [];
			}
		};
		const batches = [];
		try {
			const batchList = await fetch('https://api.brewfather.app/v1/batches', {
				duration: '1h',
				type: 'json',
				directory: '.cache',
				fetchOptions: {
					headers: { Authorization: 'Basic ' + authorizationHeader },
				},
			});

			await asyncForEach(batchList, async (batch) => {
				let batchData = await getBatch(batch._id);
				batchData.all_readings = [];
				batchData.last_reading = undefined;
				if (batchData.status.code === 'fermenting') {
					let readings = await getBatchReadings(batch._id);
					batchData.all_readings = readings.all;
					batchData.last_reading = readings.last;
				}
				batchData.brewDate = new Date(batchData.brewDate);
				batches.push(batchData);
			});

			console.log(
				'[' + '\x1b[33m%s\x1b[0m',
				'Brewfather' + '\x1b[0m' + ']: loaded',
				batches.length,
				'batches.',
			);
			return batches;
		} catch (err) {
			console.error(err);
			return [];
		}
	};
	const getRecipes = async () => {
		try {
			const recipes = await fetch(
				'https://api.brewfather.app/v1/recipes?complete=true&limit=50',
				{
					duration: '1h',
					type: 'json',
					directory: '.cache',
					fetchOptions: {
						headers: { Authorization: 'Basic ' + authorizationHeader },
					},
				},
			);

			console.log(
				'[' + '\x1b[33m%s\x1b[0m',
				'Brewfather' + '\x1b[0m' + ']: loaded',
				recipes.length,
				'recipes.',
			);

			recipes.forEach((recipe) => {
				recipe.og = recipe.og.toFixed(3);
				recipe.abv = recipe.abv.toFixed(1);

				if (
					typeof recipe.og !== 'undefined' &&
					typeof recipe.fg !== 'undefined' &&
					typeof recipe.ibu !== 'undefined'
				) {
					recipe.bv = calculateBalanceValue(recipe.og, recipe.fg, recipe.ibu);
				} else {
					recipe.bv = null;
				}

				recipe.colorHEX = setEBCColor(convertSRMtoEBC(recipe.color));

				recipe.fermentables.forEach((fermentable) => {
					fermentable.color = convertSRMtoEBC(fermentable.color);
					fermentable.colorHEX = setEBCColor(fermentable.color);

					switch (fermentable.type) {
						case 'Grain':
							fermentable.type = {
								label: 'Malt',
								code: 'grain',
							};
							break;
						case 'Liquid Extract':
							fermentable.type = {
								label: 'Extrakt',
								code: 'extract',
							};
							break;
						case 'Sugar':
							fermentable.type = {
								label: 'Socker',
								code: 'sugar',
							};
					}
				});

				recipe.hops.forEach((hop) => {
					switch (hop.use) {
						case 'Boil':
							hop.use = 'Kok';
							break;
						case 'Aroma':
							hop.use = 'Efter kok';
							break;
						case 'Dry Hop':
							hop.use = 'Torrhumling';
					}

					if (typeof hop.timeunit !== 'undefined') {
						switch (hop.timeunit) {
							case 'days':
								hop.timeunit = 'dagar';
								break;
							case 'minutes':
								hop.timeunit = 'min';
						}
					} else {
						hop.timeunit = 'min';
					}
				});

				recipe.yeasts.forEach((yeast) => {
					switch (yeast.unit) {
						case 'pkg':
							yeast.unit = 'paket';
							break;
						case 'ml':
							yeast.unit = 'ml';
					}

					switch (yeast.form) {
						case 'Dry':
							yeast.form = 'Torrjäst';
							break;
						case 'Liquid':
							yeast.form = 'Flytande jäst';
							break;
						case 'Culture':
							yeast.form = 'Förkultur';
					}
				});

				recipe.miscs.forEach((additive) => {
					switch (additive.use) {
						case 'Boil':
							additive.use = 'Kok';
							break;
						case 'Mash':
							additive.use = 'Mäskning';
							break;
						case 'Primary':
							additive.use = 'Jäsning';
							break;
						case 'Secondary':
							additive.use = 'Sekundärjäsning';
							break;
						case 'Dry Hop':
							additive.use = 'Torrhumling';
					}
					switch (additive.type) {
						case 'Water Agent':
							additive.type = 'Vattentillsats';
							break;
						case 'Fining':
							additive.type = 'Klarningsmedel';
					}

					switch (additive.unit) {
						case 'items':
							additive.unit = 'st';
					}
				});
			});
			return recipes;
		} catch (err) {
			console.error(err);
			return [];
		}
	};

	const batches = await getBatches(brewfatherId, apiKey);
	const recipes = await getRecipes(brewfatherId, apiKey);

	return {
		batches: batches,
		recipes: recipes,
	};
};
