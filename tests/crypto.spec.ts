import { strictEqual } from 'assert';
import { verifySignature } from '../src/crypto';

import {
	createPayloadWithInvalidSignature,
	createValidPayload
} from './testUtils';

describe('crypto', function() {
	describe('verify HMAC signature', function() {
		it('should return false when the token and timestamp do not match the signature', function() {
			const { signature: wrongSignature } = createPayloadWithInvalidSignature();

			strictEqual(verifySignature(wrongSignature), false);
		});

		it('should return true when the token and timestamp match the signature', function() {
			const { signature: rightSignature } = createValidPayload();

			strictEqual(verifySignature(rightSignature), true);
		});
	});
});
