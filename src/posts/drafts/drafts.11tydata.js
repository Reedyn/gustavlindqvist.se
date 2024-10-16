const isDevEnv = process.env.ELEVENTY_ENV === 'development';

export default function () {
	return {
		eleventyComputed: {
			eleventyExcludeFromCollections: function (data) {
				if (isDevEnv) {
					return data.eleventyExcludeFromCollections;
				} else {
					return true;
				}
			},
			permalink: function (data) {
				if (!isDevEnv) {
					return false;
				} else if (!data.permalink.startsWith('/utkast/')) {
					// If the permalink does not start with /drafts
					return '/utkast' + data.permalink; // add the /drafts prefix
				} else {
					return data.permalink;
				}
			},
		},
	};
}
