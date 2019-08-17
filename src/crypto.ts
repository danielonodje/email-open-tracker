import { createHmac } from 'crypto';
import { EmailEventSignature } from 'EmailEvent';

const HmacSecret = process.env.HMAC_SEED as string;
const hashAlgorithm = 'sha256';

export function verifySignature(signature: EmailEventSignature): boolean {
	const { timestamp, token, signature: payloadDigest } = signature;

	const hmac = createHmac(hashAlgorithm, Buffer.from(HmacSecret));
	const secret = `${timestamp}${token}`;
	hmac.update(secret);

	const digest = hmac.digest('hex');

	return digest === payloadDigest;
}
