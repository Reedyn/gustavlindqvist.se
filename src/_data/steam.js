const fetch = require('@11ty/eleventy-fetch');

function minutesToHoursMinutes(num) {
	let hours = Math.floor(num / 60);
	let minutes = num % 60;
	let string = '';
	if (hours === 0) {
		string = minutes + ' minuter';
	} else if (0 < hours && hours < 7) {
		string = hours + ' timmar';
		if (minutes !== 0) {
			string += ' ' + minutes + ' minuter';
		}
	} else {
		if (minutes >= 45) {
			hours++;
		}
		string = hours > 1 ? hours + ' timmar' : hours + ' timme';
	}
	return string;
}

module.exports = async () => {
	const steamId = process.env.STEAM_ID;
	const apiKey = process.env.STEAM_APIKEY;

	const getRecentlyPlayedGames = async (steamId, apiKey) => {
		const steamBaseURL = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/';
		const url = `${steamBaseURL}?key=${apiKey}&steamid=${steamId}&count=5`;

		try {
			const response = await fetch(url, {
				duration: '6h',
				type: 'json',
				directory: '.cache',
			});

			if (response.response.total_count) {
				const games = response.response.games.filter((game) => game.playtime_2weeks > 15);

				games.forEach((game) => {
					game.url = 'https://store.steampowered.com/app/' + game.appid;
					game.playtime_pretty = minutesToHoursMinutes(game.playtime_2weeks);
					game.playtime_forever_pretty = minutesToHoursMinutes(game.playtime_forever);
				});

				const filteredGames = games.filter((game) => game.playtime_2weeks > 60);

				console.log(
					'[' + '\x1b[37m%s\x1b[0m',
					'Steam' + '\x1b[0m' + ']: loaded',
					filteredGames.length,
					'recently played games.',
				);
				return filteredGames;
			} else {
				return undefined;
			}
		} catch (err) {
			console.error(err);
			return [];
		}
	};

	const recentlyPlayedGames = await getRecentlyPlayedGames(steamId, apiKey);
	return {
		recently_played_games: recentlyPlayedGames,
	};
};
