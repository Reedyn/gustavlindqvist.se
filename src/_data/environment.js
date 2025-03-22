/* eslint-disable no-console */
import 'dotenv/config';

export default () => {
	return process.env.ELEVENTY_ENVIRONMENT;
};
