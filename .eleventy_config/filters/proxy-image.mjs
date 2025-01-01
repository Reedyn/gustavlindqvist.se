import ImgProxy from 'imgproxy';

export default async function (imageUrl, width) {
	const imgProxy = new ImgProxy({
		baseUrl: process.env.IMGPROXY_HOST,
		key: process.env.IMGPROXY_KEY,
		salt: process.env.IMGPROXY_SALT,
		encode: true,
	});

	return imgProxy.builder().width(width).generateUrl(imageUrl);
}
