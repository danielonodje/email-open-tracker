import { strictEqual, deepEqual, rejects } from 'assert';
import { DynamoDB } from 'aws-sdk';
import { saveEmailEvent } from '../src/db';
import {
	createDynamoDBMock,
	createFailingDynamoDBMock,
	createEventData
} from './testUtils';

const dynamoDBTableName = process.env.DYNAMO_DB_TABLE_NAME;

describe('DynamoDBClient', function() {
	describe('saveEmailEvent', function() {
		it('should create the request params correctly', async function() {
			const data = createEventData();

			const dynamoDbMock = (createDynamoDBMock() as unknown) as jest.Mocked<
				DynamoDB
			>;
			const putItemSpy = dynamoDbMock.putItem;

			const { id, event, timestamp } = data;

			const expectedParams = {
				TableName: dynamoDBTableName,
				Item: {
					MessageId: { S: id },
					EventType: { S: event },
					Timestamp: { S: timestamp }
				}
			};

			await saveEmailEvent((dynamoDbMock as unknown) as DynamoDB, data);

			const calledWithParams = putItemSpy.mock.calls[0][0];
			strictEqual(putItemSpy.mock.calls.length, 1);
			deepEqual(calledWithParams, expectedParams);
		});
	});

	it('should throw an error when saving to the db fails', async function() {
		const data = createEventData();

		const dynamoDbMock = (createFailingDynamoDBMock() as unknown) as jest.Mocked<
			DynamoDB
		>;

		const fn = () => saveEmailEvent(dynamoDbMock, data);

		rejects(fn);
	});
});
