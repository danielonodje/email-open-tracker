import { DynamoDB, SNS } from 'aws-sdk';
import { notAcceptable, badImplementation } from '@hapi/boom';
import { handleEvent } from '../src/handler';

import {
	createValidPayload,
	createPayloadWithInvalidSignature,
	createDynamoDBMock,
	createSNSMock,
	createFailingDynamoDBMock
} from './testUtils';

describe('EmailEvent handling', function() {
	describe('handleEvent function', function() {
		it('should return a notAcceptableError(406) with a wrong signature', async function() {
			const payload = createPayloadWithInvalidSignature();

			const callback = jest.fn();
			const dynamoDBMock = createDynamoDBMock();
			const SNSMock = createSNSMock();

			await handleEvent(
				payload,
				// SNSMock and jest.Mocked<DynamoDB> do not overlap so we'll first
				// cast to unknown before casting to jest.Mocked<DynamoDB>
				(dynamoDBMock as unknown) as jest.Mocked<DynamoDB>,
				(SNSMock as unknown) as jest.Mocked<SNS>,
				callback
			);

			const response = callback.mock.calls[0][0];

			expect(response).toEqual(notAcceptable());
		});

		it('should return a badImplementation(500) when it fails to save', async function() {
			const payload = createValidPayload();

			const callback = jest.fn();
			const dynamoDBMock = createFailingDynamoDBMock();
			const SNSMock = createSNSMock();

			await handleEvent(
				payload,
				(dynamoDBMock as unknown) as jest.Mocked<DynamoDB>,
				(SNSMock as unknown) as jest.Mocked<SNS>,
				callback
			);

			const response = callback.mock.calls[0][0];

			expect(response).toEqual(badImplementation());
		});

		it('should return a 200 statusCode when no errors occur', async function() {
			const payload = createValidPayload();

			const callback = jest.fn();
			const dynamoDBMock = createDynamoDBMock();
			const SNSMock = createSNSMock();

			await handleEvent(
				payload,
				(dynamoDBMock as unknown) as jest.Mocked<DynamoDB>,
				(SNSMock as unknown) as jest.Mocked<SNS>,
				callback
			);

			const response = callback.mock.calls[0][0];

			expect(response).toEqual({ statusCode: 200 });
		});

		it('should attempt to push the event to the SNS service', async function() {
			const payload = createValidPayload();

			const callback = jest.fn();
			const dynamoDBMock = (createDynamoDBMock() as unknown) as jest.Mocked<
				DynamoDB
			>;
			const SNSMock = (createSNSMock() as unknown) as jest.Mocked<SNS>;
			const publishItemSpy = SNSMock.publish;

			await handleEvent(payload, dynamoDBMock, SNSMock, callback);

			expect(publishItemSpy.mock.calls).toHaveLength(1);
		});
	});
});
