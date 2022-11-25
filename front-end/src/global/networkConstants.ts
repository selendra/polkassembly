// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import selendraLogo from 'src/assets/parachain-logos/selendra-logo.jpg';

import * as types from '../types';

export const network = {
	SELENDRA: 'selendra'
};

export const tokenSymbol = {
	SEL: 'SEL'
};

export const chainProperties: types.ChainPropType = {
	[network.SELENDRA]: {
		blockTime: 6000,
		category: 'selendra',
		chainId: 0,
		logo: selendraLogo,
		rpcEndpoint: 'wss://rpc.selendra.io',
		ss58Format: 204,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.SEL
	}
};

export const chainLinks: types.ChainLinksType = {
	[network.SELENDRA]: {
		blockExplorer: 'https://explorer.selendra.org/',
		discord: 'https://discord.gg/wGUDt2p',
		github: 'https://github.com/selendra/selendra',
		homepage: 'https://selendra.com/',
		reddit: 'https://www.reddit.com/r/selendra',
		telegram: 'https://t.me/selendrachainofficial',
		twitter: 'https://twitter.com/SelendraNetwork',
		youtube: 'https://www.youtube.com/channel/UCB7PbjuZLEba_znc7mEGNgw'
	}
};

export const chainDetails: { [index: string]: string} = {
	[network.SELENDRA]: 'Selendra enables scalability by allowing specialized blockchains to communicate with each other in a secure, trust-free environment. Selendra is built to connect and secure unique blockchains, whether they be public, permission-less networks, private consortium chains, or oracles and other Web3 technologies. It enables an internet where independent blockchains can exchange information under common security guarantees. Selendra uses a sophisticated governance mechanism that allows it to evolve gracefully overtime at the ultimate behest of its assembled stakeholders. The stated goal is to ensure that the majority of the stake can always command the network.'
};

export const addressPrefix: Record<string, number> = {
	'selendra': 204
};