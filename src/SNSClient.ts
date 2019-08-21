import { SNSService, PublishInput } from 'AWSService';
import { EmailEventData } from 'EmailEvent';

const topicArn = process.env.SNS_TOPIC_ARN;

export async function pushEmailEventToSNS(
	SNSClient: SNSService,
	data: EmailEventData
) {
	const params: PublishInput = {
		Message: JSON.stringify(data),
		TopicArn: topicArn
	};

	return SNSClient.publish(params).promise();
}
