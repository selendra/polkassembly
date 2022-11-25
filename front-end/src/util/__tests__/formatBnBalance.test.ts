// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import formatBnBalance from '../formatBnBalance';

jest.mock('../getNetwork', () => jest.fn(() => {return 'selendra';}));
const getNetwork = require('../getNetwork');

describe('Testing formatBnBalance', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	// Kusama formatting
	it('for Kusama with numberAfterComma option set to 2', () => {
		getNetwork.mockImplementation(() => 'kusama');
		expect(formatBnBalance('1000000000000', { numberAfterComma: 2 } )).toEqual('1.00');
	});

	it('for Kusama with withThousandDelimitor option set to false', () => {
		getNetwork.mockImplementation(() => 'kusama');
		expect(formatBnBalance('1000000000000000', { numberAfterComma: 0, withThousandDelimitor: false } )).toEqual('1000');
	});

	it('for Kusama with withUnit option set to true', () => {
		getNetwork.mockImplementation(() => 'kusama');
		expect(formatBnBalance('53000000000000', { numberAfterComma: 1, withUnit: true } )).toEqual('53.0 KSM');
	});

	// Selendra formatting
	it('for Selendra with numberAfterComma option set to 2', () => {
		getNetwork.mockImplementation(() => 'selendra');
		expect(formatBnBalance('1000000000000000000', { numberAfterComma: 2 } )).toEqual('1.00');
	});

	it('for Selendra with withThousandDelimitor option set to false', () => {
		getNetwork.mockImplementation(() => 'selendra');
		expect(formatBnBalance('1000000000000000000000', { numberAfterComma: 0, withThousandDelimitor: false  } )).toEqual('1000');
	});

	it('for Selendra with withUnit option set to true', () => {
		getNetwork.mockImplementation(() => 'selendra');
		expect(formatBnBalance('53000000000000000000', { numberAfterComma: 1, withUnit: true } )).toEqual('53.0 SEL');
	});
});
