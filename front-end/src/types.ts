// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Maybe } from 'graphql/jsutils/Maybe';
import { Dispatch, SetStateAction } from 'react';

import { AuthorFieldsFragment, BlockNumber, CommentFieldsFragment, Onchain_Links, Post_Topics, Post_Types,Posts, PreimageArgumentV2, PreimageV2, ReferendumStatusV2, ReferendumV2 } from './generated/graphql';
import { network, tokenSymbol } from './global/networkConstants';

export interface UserDetailsContextType {
  id?: number | null;
  picture?: string | null;
  username?: string | null;
  email?: string | null;
  email_verified?: boolean | null;
  addresses?: string[] | null;
  allowed_roles?: string[] | null;
  defaultAddress?: string | null;
  notification: {
    postParticipated: boolean;
    postCreated: boolean;
    newProposal: boolean;
    ownProposal: boolean;
  } | null;
  setUserDetailsContextState: Dispatch<SetStateAction<UserDetailsContextType>>;
  web3signup?: boolean | null;
}

export enum Role {
  ANONYMOUS = 'anonymous',
  ADMIN = 'admin',
  PROPOSAL_BOT = 'proposal_bot',
  USER = 'user',
  EVENT_BOT = 'event_bot',
}

// these are enforced by Hasura
export interface HasuraClaimPayload {
  'x-hasura-allowed-roles': Role[];
  'x-hasura-default-role': Role;
  'x-hasura-user-email': string;
  'x-hasura-user-id': string;
  'x-hasura-kumandra': string;
  'x-hasura-kumandra-default': string;
  'x-hasura-selendra': string;
  'x-hasura-selendra-default': string;
}

export interface JWTPayploadType {
  exp: number;
  sub: string;
  username: string;
  email: string;
  email_verified: boolean;
  iat: string;
  notification: {
    postParticipated: boolean;
    postCreated: boolean;
    newProposal: boolean;
    ownProposal: boolean;
  };
  'https://hasura.io/jwt/claims': HasuraClaimPayload;
  web3signup: boolean;
}

export enum NotificationStatus {
  SUCCESS= 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface ModalType {
  content?: string;
  title?: string;
}

export interface ModalContextType {
  dismissModal: () => void;
  modal: ModalType;
  setModal: (modal: ModalType) => void;
}

export interface AccountMeta {
  genesisHash: string | undefined;
  name: string;
  source: string;
}

export interface Account {
  address: string;
  meta: AccountMeta;
}

export type Network = typeof network[keyof typeof network];
export type TokenSymbol = typeof tokenSymbol[keyof typeof tokenSymbol];

export type ChainPropType = {
  [index: string]: ChainProps;
};

export interface ChainProps {
  'blockTime': number;
  'logo'?: any;
  'ss58Format': number;
  'tokenDecimals': number;
  'tokenSymbol': TokenSymbol;
  'chainId': number;
  'rpcEndpoint': string;
  'category': string;
}

export type ChainLinksType = {
  [index: string]: ChainLinks;
};

export interface ChainLinks {
  blockExplorer: string;
  homepage: string;
  github: string;
  discord: string;
  twitter: string;
  telegram: string;
  youtube: string;
  reddit: string;
}

export interface LoadingStatusType {
  isLoading: boolean;
  message: string;
}

export interface ReactionMapFields {
  count: number;
  userNames: string[];
}

export enum VoteThresholdEnum {
  Supermajorityapproval = 'Supermajorityapproval',
  Supermajorityrejection = 'Supermajorityrejection',
  Simplemajority = 'Simplemajority',
}

export type VoteThreshold = keyof typeof VoteThresholdEnum;

export interface MetaContextType {
  description: string;
  image: string;
  setMetaContextState: Dispatch<SetStateAction<MetaContextType>>;
  title: string;
  type: string;
  url: string;
}

export enum Vote {
  AYE = 'AYE',
  NAY = 'NAY',
}

export enum PolkassemblyProposalTypes {
  TreasurySpendProposal,
  TipProposal,
}

export interface CouncilVote {
  address: string;
  vote: Vote;
}

export interface ReactionMapFields {
  count: number;
  userNames: string[];
}

export enum Wallet {
  TALISMAN = 'talisman',
  POLKADOT = 'polkadot-js',
  SUBWALLET = 'subwallet-js',
  NOVAWALLET = 'polkadot-js',
  OTHER = ''
}

export const PostOrigin = {
	AUCTION_ADMIN : 'AuctionAdmin',
	BIG_SPENDER : 'BigSpender',
	BIG_TIPPER : 'BigTipper',
	FELLOWSHIP_ADMIN : 'FellowshipAdmin',
	GENERAL_ADMIN : 'GeneralAdmin',
	LEASE_ADMIN : 'LeaseAdmin',
	MEDIUM_SPENDER : 'MediumSpender',
	REFERENDUM_CANCELLER : 'ReferendumCanceller',
	REFERENDUM_KILLER : 'ReferendumKiller',
	ROOT : 'Root',
	SMALL_SPENDER : 'SmallSpender',
	SMALL_TIPPER : 'SmallTipper',
	STAKING_ADMIN : 'StakingAdmin',
	TREASURER : 'Treasurer',
	WHITELISTED_CALLER : 'WhitelistedCaller'
};

export type TrackInfoType = {
  [index: string]: TrackProps;
};

export interface TrackProps {
  'trackId': number;
  'group'?: string;
  'description': string;
}

export type OnchainLinkReferendumV2Fragment = (
  { __typename?: 'onchain_links' }
  & Pick<Onchain_Links, 'proposer_address' | 'track' | 'origin'>
  & { onchain_referendumv2: Array<Maybe<(
    { __typename?: 'ReferendumV2' }
    & Pick<ReferendumV2, 'deciding' | 'decisionDeposit' | 'enactmentAfter' | 'enactmentAt' | 'id' | 'origin' | 'preimageHash' | 'referendumId' | 'trackNumber' | 'submitted' | 'submittedAt'>
    & { referendumStatus?: Maybe<Array<(
      { __typename?: 'ReferendumStatusV2' }
      & Pick<ReferendumStatusV2, 'id' | 'status'>
      & { blockNumber: (
        { __typename?: 'BlockNumber' }
        & Pick<BlockNumber, 'number'>
      ) }
    )>>, preimage?: Maybe<(
      { __typename?: 'PreimageV2' }
      & Pick<PreimageV2, 'method' | 'metaDescription' | 'section' | 'enactmentPeriod' | 'depositAmount' | 'hash' | 'length'>
      & { preimageArguments?: Maybe<Array<(
        { __typename?: 'PreimageArgumentV2' }
        & Pick<PreimageArgumentV2, 'name' | 'value'>
      )>> }
    )> }
  )>> }
)

// TODO: Should be on graphql.tsx
export type ReferendumV2PostFragment = (
  Pick<Posts, 'content' | 'created_at' | 'id' | 'updated_at' | 'title'>
    & { author?: Maybe<(
      { __typename?: 'User' }
      & AuthorFieldsFragment
    )>, comments: Array<(
      { __typename?: 'comments' }
      & CommentFieldsFragment
    )>, onchain_link?: Maybe<(
      { __typename?: 'onchain_links' }
      & OnchainLinkReferendumV2Fragment
    )>, topic: (
      { __typename?: 'post_topics' }
      & Pick<Post_Topics, 'id' | 'name'>
    ), type: (
      { __typename?: 'post_types' }
      & Pick<Post_Types, 'id' | 'name'>
    ) }
);