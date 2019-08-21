import { DynamoDBService, PutItemInput } from 'AWSService';
import { EmailEventData } from 'EmailEvent';

const dynamoDBTableName = process.env.DYNAMO_DB_TABLE_NAME as string;

export async function saveEmailEvent(
	db: DynamoDBService,
	data: EmailEventData
) {
	const { id, event, timestamp } = data;

	const params: PutItemInput = {
		TableName: dynamoDBTableName,
		Item: {
			MessageId: { S: id },
			EventType: { S: event },
			Timestamp: { S: timestamp }
		}
	};

	return db.putItem(params).promise();
}
