// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import getNetwork from './getNetwork';

export default function(): 'kumandra_default_address' | 'selendra_default_address' {
	const network = getNetwork();

	switch (network) {
	case 'kusama':
		return 'kumandra_default_address';
	case 'selendra':
		return 'selendra_default_address';
	default:
		return 'selendra_default_address';
	}
}
