import { DynamoDB } from 'aws-sdk';
import { saveEmailEvent } from '../src/db';
import {
	createDynamoDBMock,
	createFailingDynamoDBMock,
	createEventData
} from './testUtils';

const dynamoDBTableName = process.env.DYNAMO_DB_TABLE_NAME;

describe.only('DynamoDBClient', function() {
	describe('saveEmailEvent', function() {
		it('should create the request params correctly', async function() {
			const data = createEventData();

			const dynamoDbMock = createDynamoDBMock();
			const putItemSpy = dynamoDbMock.putItem as jest.Mock;

			const { id, event, timestamp } = data;

			const expectedParams = {
				TableName: dynamoDBTableName,
				Item: {
					MessageId: { S: id },
					EventType: { S: event },
					Timestamp: { S: timestamp }
				}
			};

			await expect(saveEmailEvent(dynamoDbMock, data));
			const calledWithParams = putItemSpy.mock.calls[0][0];
			expect(putItemSpy.mock.calls).toHaveLength(1);
			expect(calledWithParams).toEqual(expectedParams);
		});
	});

	it('should throw an error when saving to the db fails', async function() {
		const data = createEventData();

		const dynamoDbMock = createFailingDynamoDBMock();

		await expect(saveEmailEvent(dynamoDbMock, data)).rejects.toBe(undefined);
	});
});
