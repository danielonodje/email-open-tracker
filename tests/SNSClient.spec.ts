import { deepEqual, rejects } from 'assert';
import { SNS } from 'aws-sdk';

import { pushEmailEventToSNS } from '../src/SNSClient';
import {
	createSNSMock,
	createFailingSNSMock,
	createEventData
} from './testUtils';

const topicArn = process.env.SNS_TOPIC_ARN;

describe('SNSClient', function() {
	describe('pushEmailEventToSNS', function() {
		it('should create the request params correctly', async function() {
			const data = createEventData();
			const SNSmock = (createSNSMock() as unknown) as jest.Mocked<SNS>;
			const publishItemSpy = SNSmock.publish;

			const expectedParams = {
				Message: JSON.stringify(data),
				TopicArn: topicArn,
				MessageStructure: 'json'
			};

			await pushEmailEventToSNS(SNSmock, data);

			const calledWithParams = publishItemSpy.mock.calls[0][0];
			deepEqual(calledWithParams, expectedParams);
		});

		it('should throw an error when publishing to SNS fails', async function() {
			const data = createEventData();
			const SNSmock = (createFailingSNSMock() as unknown) as jest.Mocked<SNS>;

			const fn = () => pushEmailEventToSNS(SNSmock, data);

			rejects(fn);
		});
	});
});
