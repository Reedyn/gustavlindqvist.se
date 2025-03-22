/* eslint-disable no-console */
import 'dotenv/config';

export default () => {
	return { url: process.env.UMAMI_URL, website_id: process.env.UMAMI_SITE_ID };
};
