// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import 'mocha';
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';

import rewiremock from 'rewiremock';
import User from '../../../src/model/User';
import { redisDel, redisGet, redisSetex } from '../../../src/redis';
import { ONE_DAY, getEmailVerificationTokenKey } from '../../../src/services/auth';

const noop = () => {};

// skipping this till mocks are fixed
xdescribe('Email Service', () => {
	const email = 'test@email.com';
	const password = 'testpass';
	const username = 'testuser';
	const salt = 'testsalt';

	it('should send verification email', async () => {
		const user = await User
			.query()
			.allowInsert('[email, password, username]')
			.insert({
				email,
				password,
				salt,
				username
			})
			.returning('*');
		const token = 'test-token';
		await redisSetex(getEmailVerificationTokenKey(token), ONE_DAY, email);

		let message: any;

		rewiremock('@sendgrid/mail').with({
			setApiKey: noop,
			send: (msg: any) => {
				message = msg;
				return Promise.resolve();
			}
		});
		rewiremock.enable();
		const { sendVerificationEmail } = require('../../../src/services/email');
		rewiremock.disable();

		sendVerificationEmail(user, token);

		expect(message.to).to.equals('test@email.com');
		expect(message.from).to.equals('noreply@polkassembly.io');
		expect(message.subject).to.equals('Verify your email address');
		expect(message.html).to.contains(`verify-email/${token}`);

		await User
			.query()
			.where({ id: user.id })
			.del();

		await redisDel(getEmailVerificationTokenKey(token));
	});

	it('should send password reset email', async () => {
		const user = await User
			.query()
			.allowInsert('[email, password, username]')
			.insert({
				email,
				password,
				salt,
				username,
			})
			.returning('*');
		const token = uuid();
		let message: any;

		rewiremock('@sendgrid/mail').with({
			setApiKey: noop,
			send: (msg: any) => {
				message = msg;
				return Promise.resolve();
			}
		});
		rewiremock.enable();
		const { sendResetPasswordEmail } = require('../../../src/services/email');
		rewiremock.disable();

		sendResetPasswordEmail(user, token);

		expect(message.to).to.equals('test@email.com');
		expect(message.from).to.equals('noreply@polkassembly.io');
		expect(message.subject).to.equals('Reset Your Password');
		expect(message.html).to.contains(`reset-password?token=${token}`);

		await User
			.query()
			.where({ id: user.id })
			.del();

	});
});
