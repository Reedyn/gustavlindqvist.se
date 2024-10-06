module.exports = {
	filteredPopularPages: function (popularPages, collection, series) {
		console.log(popularPages);
		console.log(series);
		const seriesCollection = collection.filter((post) => {
			return typeof post.data.series !== "undefined" && post.data.series.includes(series);
		});

		console.log(seriesCollection);

		const popularPagesInSeries = collection.filter((post) => {
			return typeof post.data.url !== "undefined";
		});
		return popularPages.length;
	},
};
