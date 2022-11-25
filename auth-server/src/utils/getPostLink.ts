// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PostType, PostTypeEnum } from '../types';

/**
 * Get Post link type from an event
 */
export default (type: PostType, id: number | string): string => {
	const DOMAIN = process.env.DOMAIN_NAME && process.env.DOMAIN_PROTOCOL ? `${process.env.DOMAIN_PROTOCOL}${process.env.DOMAIN_NAME}` : 'https://test.polkassembly.io';
	let postType = type;
	if (postType === PostTypeEnum.REFERENDUM_V2) {
		postType = PostTypeEnum.REFERENDUM;
	}
	return `${DOMAIN}/${postType}/${id}`;
};

