import { EmailEvent } from 'EmailEvent';
import { DynamoDB, SNS } from 'aws-sdk';
import { badImplementation, notAcceptable } from '@hapi/boom';

import { verifySignature } from './crypto';
import { saveEmailEvent } from './db';
import { pushEmailEventToSNS } from './SNSClient';

export async function handleEvent(
	event: EmailEvent,
	db: DynamoDB,
	SNSClient: SNS,
	cb: Function
): Promise<void> {
	const { signature, 'event-data': eventData } = event;

	if (!verifySignature(signature)) {
		console.warn({
			message: 'Incorrect request signature',
			data: signature
		});

		return cb(notAcceptable());
	}

	try {
		await saveEmailEvent(db, eventData);
	} catch (error) {
		console.warn({
			data: error,
			text: 'Failed to save the email event'
		});

		return cb(badImplementation());
	}

	await pushEmailEventToSNS(SNSClient, eventData).catch(error => {
		console.warn({
			data: error,
			text: 'Failed to publish event to SNS'
		});
	});

	return cb({ statusCode: 200 });
}
