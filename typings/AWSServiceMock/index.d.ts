declare module 'AWSService' {
	interface MockDynamoDBService {
		putItem(params: PutItemInput): AWSServiceCallMock;
	}

	interface MockSNSService {
		publish(params: PublishInput): AWSServiceCallMock;
	}

	interface AWSServiceCallMock {
		promise(): JestResolveOrRejectResponse;
	}

	type JestResolveOrRejectResponse =
		| jest.ResolvedValue<undefined>
		| jest.RejectedValue<undefined>;

	type DynamoDBService = MockDynamoDBService | AWS.DynamoDB;
	type SNSService = MockSNSService | AWS.SNS;
	type PutItemInput = AWS.DynamoDB.PutItemInput;
	type PublishInput = AWS.SNS.PublishInput;

	export var AWSServiceCallMock: AWSServiceCallMock;
	export var DynamoDBService: DynamoDBService;
	export var SNSService: SNSService;
	export var PutItemInput: PutItemInput;
	export var PublishInput: PublishInput;
}
