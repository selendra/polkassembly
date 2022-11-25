// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Request, Response } from 'express';
import { Config as KnexConfig } from 'knex';

export interface Config {
    [index: string]: KnexConfig;
}

interface FileType {
    path: string;
}

export interface FileRequestType extends Request {
    UserId: string;
    file: FileType;
}

export interface UserObjectType {
    id: number;
    email: string;
    username: string;
    email_verified: boolean;
    web3signup: boolean;
}

export interface TokenType {
    token: string;
}

export interface AuthObjectType extends TokenType {
    refreshToken: string;
}

export interface Context {
    req: Request;
    res: Response;
}

export enum Role {
    ANOONYMOUS = 'anonymous',
    ADMIN = 'admin',
    PROPOSAL_BOT = 'proposal_bot',
    USER = 'user',
    EVENT_BOT = 'event_bot',
}

// these are enforced by Hasura
export interface HasuraClaimPayload {
    'x-hasura-allowed-roles': Array<Role>;
    'x-hasura-default-role': Role;
    'x-hasura-user-email': string;
    'x-hasura-user-id': string;
    'x-hasura-kumandra': string;
    'x-hasura-kumandra-default': string;
    'x-hasura-selendra': string;
    'x-hasura-selendra-default': string;
}

export interface JWTPayploadType {
    sub: string;
    username: string;
    email: string;
    email_verified: boolean;
    iat: number;
    notification: NotificationPreferencesType;
    'https://hasura.io/jwt/claims': HasuraClaimPayload;
    web3signup: boolean;
}

export interface MessageType {
    message: string;
}

export interface HookResponseMessageType {
    sendNewProposalCreatedMessage?: string;
    sendOwnProposalCreatedMessage?: string;
}

export interface ChangeResponseType extends MessageType, TokenType {}

export interface PublicUser {
    id: number;
    kumandra_default_address?: string;
    selendra_default_address?: string;
    username: string;
}

export interface AboutType {
    network: string;
    address: string;
    title: string;
    description: string;
    image: string;
}

export interface Subscription {
    subscribed: boolean;
}

export interface AddressType {
    address: string;
    public_key: string;
}

export interface AddressLinkStartType extends MessageType {
    address_id: number;
    sign_message: string;
}

export interface UndoEmailChangeResponseType extends ChangeResponseType {
    email: string;
}

export interface NotificationPreferencesType {
    postParticipated: boolean;
    postCreated: boolean;
    newProposal: boolean;
    ownProposal: boolean;
}

export interface ChallengeMessage extends MessageType {
    signMessage: string;
}

export interface CommentCreationHookDataType {
    author_id: number;
    content: string;
    id: string;
    post_id: number;
}

export interface OnchainLinkType {
    proposer_address?: string;
    post_id: number;
    onchain_motion_id?: number;
    onchain_proposal_id?: number;
    onchain_referendum_id?: number;
    onchain_tip_id?: string;
    onchain_bounty_id?: number;
    onchain_treasury_proposal_id?: number;
    onchain_tech_committee_proposal_id?: number;
    onchain_child_bounty_id?: number;
    onchain_referendumv2_id?: number;
}

export interface JsonSchema {
    properties: {
        [key: string]: {
            maxLength?: number;
            minLength?: number;
            type: string;
        };
    };
    required: string[];
    type: string;
}

export interface AddressLinkConfirmArgs {
	address_id: number;
	signature: string;
}

export interface MultisigAddressLinkConfirmArgs {
    network: Network;
    address: string;
    addresses: string;
    ss58Prefix: number;
    threshold: number;
    signatory: string;
    signature: string;
}

export interface SubscriptionArgs {
	post_id: number;
}

export interface UserArgs {
	id: number;
}

export interface AddressArgs {
    address: string;
}

export interface AddressLinkStartArgs {
	network: Network;
	address: string;
}

export interface AddressLoginArgs {
	address: string;
	signature: string;
}

export interface ChangeEmailArgs {
    email: string;
    password: string;
}

export interface ChangeNotificationPreferenceArgs {
	notificationPreferences: NotificationPreferencesType;
}

export interface ChangePasswordArgs {
	newPassword: string;
	oldPassword: string;
}

export interface ChangeUsernameArgs {
    password: string;
    username: string;
}

export interface LoginArgs {
	username: string;
	password: string;
}

export interface PostSubscribeArgs {
	post_id: number;
}

export interface PostUnsubscribeArgs {
	post_id: number;
}

export interface ReportContentArgs {
	network: Network;
	type: string;
	content_id: string;
	reason: string;
	comments: string;
}

export interface RequestResetPasswordArgs {
	email: string;
}

export interface ResetPasswordArgs {
	newPassword: string;
    token: string;
    userId: number;
}

export interface SignupArgs {
	email: string;
	password: string;
	username: string;
}

export interface UndoEmailChangeArgs {
	token: string;
}

export interface VerifyEmailArgs {
	token: string;
}

export enum PostTypeEnum {
    BOUNTY = 'bounty',
    POST = 'post',
    PROPOSAL = 'proposal',
    TIP = 'tip',
    TREASURY = 'treasury',
    MOTION = 'motion',
    REFERENDUM = 'referendum',
    TECH = 'tech',
    CHILD_BOUNTY = 'child_bounty',
    REFERENDUM_V2 = 'referendum_v2',
}

export type PostType = PostTypeEnum;

export enum NetworkEnum {
    KUMANDRA = 'kumandra',
    SELENDRA = 'selendra'
}

export type Network = NetworkEnum;
export interface AddressSignupStartArgs {
    address: string;
    network: Network;
}

export interface AddressSignupConfirmArgs {
    address: string;
    network: Network;
    signature: string;
}

export interface SetCredentialsConfirmArgs {
    address: string;
    email: string;
    password: string;
    signature: string;
    username: string;
}

export interface UserAddressInfo {
    addresses: string;
    default: string;
}

export type NetworkUserAddressInfo = Record<Network, UserAddressInfo>;

export interface HashedPassword {
    password: string;
    salt: string;
}

export interface ContextUserId {
    ctx: Context;
    userId: number;
}

export interface ProfileArgs {
    username: string;
}

export interface AboutArgs {
    network: string;
    address: string;
}

export interface DeleteAccountArgs {
    password: string;
}

export interface TransferNoticeArgs {
    secret: string;
    mistake: boolean;
}

export interface ChangeAboutArgs {
    network: string;
    address: string;
    title: string;
    description: string;
    image: string;
    signature: string;
}

export interface CreatePostArgs {
    network: Network;
    address: string;
    title: string;
    content: string;
    signature: string;
}

export interface EditPostArgs {
    network: Network;
    address: string;
    title: string;
    content: string;
    signature: string;
    proposalType: string;
    proposalId: string;
}

export interface AddProfileArgs {
    bio?: string;
    image?: string;
    title?: string;
    badges?: string;
}

export interface GetProfileArgs {
    user_id: number;
}

export interface GetProfileWithUsernameArgs {
    username: string;
}

export interface ProfileDetails {
    id: number;
    user_id: number;
    bio?: string;
    badges?: string;
    title?: string;
    username?: string;
    image?: string;
}

export interface CreateProposalTrackerArgs {
    deadline: string;
    network: string;
    onchain_proposal_id: number;
    status: string;
    start_time: string;
}

export interface UpdateProposalTrackerArgs {
    id: number;
    status: string;
}

export interface LinkProxyAddressArgs {
    network: Network;
    proxied: string;
    proxy: string;
    message: string;
    signature: string;
}
