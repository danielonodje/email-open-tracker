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
			const SNSmock = createSNSMock();
			const publishItemSpy = SNSmock.publish as jest.Mock;

			const expectedParams = {
				Message: JSON.stringify(data),
				TopicArn: topicArn
			};

			await expect(pushEmailEventToSNS(SNSmock, data)).resolves.toBe(undefined);
			const calledWithParams = publishItemSpy.mock.calls[0][0];
			expect(calledWithParams).toEqual(expectedParams);
		});

		it('should throw an error when publishing to SNS fails', async function() {
			const data = createEventData();
			const SNSmock = createFailingSNSMock();

			await expect(pushEmailEventToSNS(SNSmock, data)).rejects.toBe(undefined);
		});
	});
});
