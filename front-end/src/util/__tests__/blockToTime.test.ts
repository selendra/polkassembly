// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import blockToTime from '../blockToTime';

jest.mock('../getNetwork', () => jest.fn(() => {return 'selendra';}));
const getNetwork = require('../getNetwork');

const SEC = 1000;

describe('Testing blockToTime', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it('with Kusama default blocktime (blocks equaling 1m to return 1m)', () => {
		getNetwork.mockImplementation(() => 'kusama');
		expect(blockToTime(10)).toEqual('0d 0h 1m');
	});

	it('with Kusama default blocktime (blocks equaling 7d 23h 59m to return 7d 23h 59m)', () => {
		getNetwork.mockImplementation(() => 'kusama');
		expect(blockToTime(115199)).toEqual('7d 23h 59m');
	});

	it('with Selendra default blocktime (blocks equaling 1m to return 1m)', () => {
		getNetwork.mockImplementation(() => 'selendra');
		expect(blockToTime(10)).toEqual('0d 0h 1m');
	});

	it('with Selendra default blocktime (blocks equaling 7d 23h 59m to return 7d 23h 59m)', () => {
		getNetwork.mockImplementation(() => 'selendra');
		expect(blockToTime(115199)).toEqual('7d 23h 59m');
	});
});

it('Testing blockToTime with blocks equaling less than 1m to get rounded up to 1m', () => {
	expect(blockToTime(1, SEC*6)).toEqual('0d 0h 1m');
});

it('Testing blockToTime with a blocktime set to 2 sec and blocks equaling 2m to return 2m', () => {
	expect(blockToTime(60, SEC*2)).toEqual('0d 0h 2m');
});
