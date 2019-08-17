import { strictEqual, rejects } from 'assert';
import * as handleEventModule from '../src/handler';
import { handler } from '../src';
jest.mock('../src/handler');

import { createValidPayload } from './testUtils';

describe('EmailEvent handling', function() {
	describe('index handler', function() {
		const event = createValidPayload();

		it('calls handleEvent on receiving an event', async function() {
			const handleEventSpy = handleEventModule.handleEvent as jest.Mock;

			await handler(event, {}, jest.fn());

			strictEqual(handleEventSpy.mock.calls.length, 1);

			jest.clearAllMocks();
		});

		it('throws if any required environment variables are missing', async function() {
			const fn = async () => await handler(event, {}, jest.fn());

			const capturedEnvVar = process.env.DYNAMO_DB_TABLE_NAME;

			// force a required env var to be undefined
			delete process.env.DYNAMO_DB_TABLE_NAME;

			rejects(fn);

			// restore env var value
			process.env.DYNAMO_DB_TABLE_NAME = capturedEnvVar;
		});
	});
});
