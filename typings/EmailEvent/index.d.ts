declare module 'EmailEvent' {
	interface EmailEvent {
		signature: EmailEventSignature;
		'event-data': EmailEventData;
	}

	interface EmailEventSignature {
		timestamp: string;
		token: string;
		signature: string;
	}

	interface EmailEventData {
		event: string;
		timestamp: string;
		id: string;
	}
}
