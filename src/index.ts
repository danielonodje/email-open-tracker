import { EmailEvent } from 'EmailEvent';
import { DynamoDB, SNS, config as AWSConfig } from 'aws-sdk';
import { handleEvent } from './handler';

function verifyEnvVariables() {
	const expectedEnvVariables = [
		'HMAC_SEED',
		'SNS_TOPIC_ARN',
		'DYNAMO_DB_TABLE_NAME',
		'AWS_ACCESS_KEY_ID',
		'AWS_SECRET_ACCESS_KEY',
		'AWS_REGION'
	];

	const missingEnvVariables = expectedEnvVariables.filter(
		k => process.env[k] === undefined
	);

	if (missingEnvVariables.length > 0) {
		console.error(
			`The following required env variables are missing: ${missingEnvVariables.join(
				','
			)}`
		);
	}
}

export const handler = async (event: any, _context: {}, callback: Function) => {
	verifyEnvVariables();

	const db = new DynamoDB({ apiVersion: '2012-08-10' });
	var SNSClient = new SNS({ apiVersion: '2010-03-31' });
	const region = process.env.AWS_REGION;
	AWSConfig.update({ region });

	await handleEvent(event as EmailEvent, db, SNSClient, callback);
};
