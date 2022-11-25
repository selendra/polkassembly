// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnchainLinkType, PostType, PostTypeEnum } from '../types';

/**
 * Get Post link type from an event
 */
export default (onchainLink: OnchainLinkType): PostType => {
	const {
		onchain_motion_id,
		onchain_proposal_id,
		onchain_referendum_id,
		onchain_tip_id,
		onchain_bounty_id,
		onchain_treasury_proposal_id,
		onchain_tech_committee_proposal_id,
		onchain_child_bounty_id,
		onchain_referendumv2_id
	} = onchainLink;

	let type = PostTypeEnum.POST;

	if (onchain_bounty_id === 0 || onchain_bounty_id) {
		type = PostTypeEnum.BOUNTY;
	}

	if (onchain_child_bounty_id === 0 || onchain_child_bounty_id) {
		type = PostTypeEnum.CHILD_BOUNTY;
	}

	if (onchain_tip_id) {
		type = PostTypeEnum.TIP;
	}

	if (onchain_proposal_id === 0 || onchain_proposal_id) {
		type = PostTypeEnum.PROPOSAL;
	}

	if (onchain_treasury_proposal_id === 0 || onchain_treasury_proposal_id) {
		type = PostTypeEnum.TREASURY;
	}

	if (onchain_motion_id === 0 || onchain_motion_id) {
		type = PostTypeEnum.MOTION;
	}

	if (onchain_referendum_id === 0 || onchain_referendum_id) {
		type = PostTypeEnum.REFERENDUM;
	}

	if (onchain_tech_committee_proposal_id === 0 || onchain_tech_committee_proposal_id) {
		type = PostTypeEnum.TECH;
	}

	if (onchain_referendumv2_id === 0 || onchain_referendumv2_id) {
		type = PostTypeEnum.REFERENDUM_V2;
	}

	return type;
};

