import { EmailEvent } from 'EmailEvent';
import { DynamoDB, SNS, config as AWSConfig } from 'aws-sdk';
import requireEnv from 'require-environment-variables';
import { handleEvent } from './handler';

const expectedEnvVariables = [
	'HMAC_SEED',
	'SNS_TOPIC_ARM',
	'DYNAMO_DB_TABLE_NAME',
	'AWS_ACCESS_KEY_ID',
	'AWS_SECRET_ACCESS_KEY'
];

export const handler = async (event: any, _context: {}, callback: Function) => {
	requireEnv(expectedEnvVariables);

	const db = new DynamoDB({ apiVersion: '2012-08-10' });
	var SNSClient = new SNS({ apiVersion: '2012-08-10' });
	const region = process.env.AWS_REGION;
	AWSConfig.update({ region });

	await handleEvent(event as EmailEvent, db, SNSClient, callback);
};
