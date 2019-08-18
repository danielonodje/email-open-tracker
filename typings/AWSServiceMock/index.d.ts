declare module 'AWSServiceMock' {
	interface MockDynamoDBService {
		putItem(): AWSServiceCallMock;
	}

	interface MockSNSService {
		publish(): AWSServiceCallMock;
	}

	interface AWSServiceCallMock {
		promise(): JestResolveOrRejectResponse;
	}

	type JestResolveOrRejectResponse =
		| jest.ResolvedValue<undefined>
		| jest.RejectedValue<undefined>;

	export var MockDynamoDBService: MockDynamoDBService;
	export var MockSNSService: MockSNSService;
	export var AWSServiceCallMock: AWSServiceCallMock;
}
