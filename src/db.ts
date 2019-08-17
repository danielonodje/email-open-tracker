import { DynamoDB } from 'aws-sdk';
import { EmailEventData } from 'EmailEvent';

const dynamoDBTableName = process.env.DYNAMO_DB_TABLE_NAME as string;

export async function saveEmailEvent(db: DynamoDB, data: EmailEventData) {
	const { id, event, timestamp } = data;

	const params: DynamoDB.PutItemInput = {
		TableName: dynamoDBTableName,
		Item: {
			MessageId: { S: id },
			EventType: { S: event },
			Timestamp: { S: timestamp }
		}
	};

	return db.putItem(params).promise();
}
