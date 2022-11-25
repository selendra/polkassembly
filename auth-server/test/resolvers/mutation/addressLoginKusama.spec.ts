// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { expect } from 'chai';
import { ForbiddenError } from 'apollo-server';
import 'mocha';

import User from '../../../src/model/User';
import Address from '../../../src/model/Address';
import addressLinkStart from '../../../src/resolvers/mutation/addressLinkStart';
import addressLinkConfirm from '../../../src/resolvers/mutation/addressLinkConfirm';
import addressLogin from '../../../src/resolvers/mutation/addressLogin';
import { Context, NetworkEnum } from '../../../src/types';
import messages from '../../../src/utils/messages';
import { redisSetex } from '../../../src/redis';
import { ADDRESS_LOGIN_TTL, getAddressLoginKey } from '../../../src/services/auth';
import { getNewUserCtx } from '../../helpers';

describe('addressLogin mutation on Kusama', () => {
	let signupUserId = -1;
	let fakectx: Context;
	const email = 'test@email.com';
	const password = 'testpass';
	const username = 'testuser';
	const network = NetworkEnum.KUMANDRA;
	const address = 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F'; //Alice
	const signMessage = 'da194645-4daf-43b6-b023-6c6ce99ee709';
	const signature = '0x048ffa02dd58557ab7f7ffb316ac75fa942d2bdb83f4480a6698a1f39d6fa1184dd85d95480bfab59f516de578b102a2b01b81ca0e69134f90e0cd08ada7ca88';

	before(async () => {
		const result = await getNewUserCtx(email, password, username);
		fakectx = result.ctx;
		signupUserId = result.userId;

		const linkStartRes = await addressLinkStart(undefined, { network, address }, fakectx);

		await Address
			.query()
			.patch({
				sign_message: signMessage
			})
			.findById(linkStartRes.address_id);

		await addressLinkConfirm(undefined, { signature, address_id: linkStartRes.address_id }, fakectx);

		// mock the addressLoginStart
		await redisSetex(getAddressLoginKey(address), ADDRESS_LOGIN_TTL, signMessage);
	});

	after(async () => {
		await User
			.query()
			.where({ id: signupUserId })
			.del();

		await Address
			.query()
			.where({ user_id: signupUserId })
			.del();
	});

	it('should not be able to login with invalid signature', async () => {
		const signature = '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

		try {
			await addressLogin(undefined, { address, signature }, fakectx);
		} catch (error) {
			expect(error).to.exist;
			expect(error).to.be.an.instanceof(ForbiddenError);
			expect(error.message).to.eq(messages.ADDRESS_LOGIN_INVALID_SIGNATURE);
		}
	});

	it('should be able to login with addresss', async () => {
		const signature = '0x20ecf8208acc2e357ec98af1cde7d446b6458483c33c23a3da16e9a7bd5ec56ffeec92d0da02c53e71d164f6e8b69a29b58f47ab4ffb11db429f65b479b65189';

		const result = await addressLogin(undefined, { address, signature }, fakectx);

		expect(result.token).to.exist;
		expect(result.token).to.be.a('string');
	});

	it('should not be able to login with the same signed message again', async () => {
		const signature = '0x20ecf8208acc2e357ec98af1cde7d446b6458483c33c23a3da16e9a7bd5ec56ffeec92d0da02c53e71d164f6e8b69a29b58f47ab4ffb11db429f65b479b65189';

		try {
			await addressLogin(undefined, { address, signature }, fakectx);
		} catch (error) {
			expect(error).to.exist;
			expect(error).to.be.an.instanceof(ForbiddenError);
			expect(error.message).to.eq(messages.ADDRESS_LOGIN_SIGN_MESSAGE_EXPIRED);
		}
	});
});
