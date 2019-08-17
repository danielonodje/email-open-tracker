import { SNS } from 'aws-sdk';
import { EmailEventData } from 'EmailEvent';

const topicArn = process.env.SNS_TOPIC_ARN;

export async function pushEmailEventToSNS(
	SNSClient: SNS,
	data: EmailEventData
) {
	const params: SNS.PublishInput = {
		Message: JSON.stringify(data),
		TopicArn: topicArn,
		MessageStructure: 'json'
	};

	return SNSClient.publish(params).promise();
}
