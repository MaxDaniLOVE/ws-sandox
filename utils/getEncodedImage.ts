export const getEncodedImage = (bufferedImage?: Buffer | null, contentType = 'image/jpeg'): string | null => {
	if (!bufferedImage) return null;
	// @ts-ignore
	const b64encoded = Buffer.from(bufferedImage, 'binary').toString('base64');
	return `data:${contentType};base64,${b64encoded}`;
};