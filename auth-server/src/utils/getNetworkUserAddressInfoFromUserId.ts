// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NetworkEnum, NetworkUserAddressInfo } from '../types';
import getAllAddressesFromUserId from './getAllAddressesFromUserId';

/**
 * Get verified addresses from userId for a given network
 */
export default async (userId: number): Promise<NetworkUserAddressInfo> => {
	const allAddresses = await getAllAddressesFromUserId(userId);

	const kumandraAdresses: string[] = [];
	const selendraAddressses: string[] = [];

	let kumandraDefault = '';
	let selendraDefault = '';

	allAddresses.forEach(addressInfo => {
		switch (addressInfo.network) {
		case NetworkEnum.KUMANDRA:
			if (addressInfo.verified) {
				kumandraAdresses.push(addressInfo.address);
				if (addressInfo.default) {
					kumandraDefault = addressInfo.address;
				}
			}
			break;

		case NetworkEnum.SELENDRA:
			if (addressInfo.verified) {
				selendraAddressses.push(addressInfo.address);
				if (addressInfo.default) {
					selendraDefault = addressInfo.address;
				}
			}
			break;
		default:
			break;
		}
	});

	const result = {
		[NetworkEnum.KUMANDRA]: {
			addresses: kumandraAdresses,
			default: kumandraDefault
		},
		[NetworkEnum.SELENDRA]: {
			addresses: selendraAddressses,
			default: selendraDefault
		}
	} as unknown as NetworkUserAddressInfo;

	return result;
};

