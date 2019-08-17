import { createHmac } from 'crypto';
import { EmailEvent, EmailEventData, EmailEventSignature } from 'EmailEvent';

function createMock(shouldFail = false): jest.Mock<AWSServiceCallMock> {
	return jest.fn().mockReturnValue({
		promise: function() {
			return shouldFail ? Promise.reject() : Promise.resolve();
		}
	});
}

export function createSNSMock(): MockSNSService {
	return { publish: createMock() };
}

export function createFailingSNSMock(): MockSNSService {
	return { publish: createMock(true) };
}
export function createDynamoDBMock(): MockDynamoDBService {
	return { putItem: createMock() };
}

export function createFailingDynamoDBMock(): MockDynamoDBService {
	return { putItem: createMock(true) };
}

export function createValidPayload(): EmailEvent {
	const signature = createValidSignature();

	return {
		'event-data': {
			...createEventData(),
			timestamp: signature.timestamp
		},
		signature: signature
	};
}

function createValidSignature(): EmailEventSignature {
	const hashAlgorithm = 'sha256';
	// this conversion is fine because we know process.env.HMAC_SEED is available
	// if the app is running because we're using require-environment-variables
	const HmacSecret: string = process.env.HMAC_SEED as string;

	const timestamp = '2398920390920923509325325';
	const token = '3lkad829328293hosidfla29322skjds';

	const hmac = createHmac(hashAlgorithm, Buffer.from(HmacSecret));
	hmac.update(`${timestamp}${token}`);

	const signature = hmac.digest('hex');

	return {
		token,
		timestamp,
		signature
	};
}

export function createEventData(): EmailEventData {
	const id = '283932';
	const eventType = 'opened';
	const timestamp = '273892802093022212';

	return {
		id,
		event: eventType,
		timestamp
	};
}

export function createPayloadWithInvalidSignature(): EmailEvent {
	// A correct signature would be the HMAC hex digest of a concatenation of the timestamp and token
	const invalidSignature = {
		timestamp: '237892323232',
		token: '82938knasdalkwslfks3238923',
		signature: '23898sbnlfkns83292323rqffafase322'
	};

	return {
		'event-data': createEventData(),
		signature: invalidSignature
	};
}
