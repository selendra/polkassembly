// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const addPostAndProposalMutation = gql`
    mutation addPostAndProposalMutation (
        $onchainProposalId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_proposal_id: $onchainProposalId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndTreasurySpendProposalMutation = gql`
    mutation addPostAndTreasurySpendProposalMutation (
        $onchainTreasuryProposalId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_treasury_proposal_id: $onchainTreasuryProposalId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndTreasurySpendProposalWithTitleMutation = gql`
    mutation addPostAndTreasurySpendProposalWithTitleMutation (
        $onchainTreasuryProposalId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!,
        $title: String!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_treasury_proposal_id: $onchainTreasuryProposalId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId,
                title: $title
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndBountyMutation = gql`
    mutation addPostAndBountyMutation (
        $onchainBountyId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_bounty_id: $onchainBountyId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndChildBountyMutation = gql`
    mutation addPostAndChildBountyMutation (
        $onchainChildBountyId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
    ){
        __typename
        insert_onchain_links(objects: {
            onchain_child_bounty_id: $onchainChildBountyId,
            proposer_address: $proposerAddress,
            post: {
                data: {
                    author_id: $authorId,
                    content: $content,
                    topic_id: $topicId,
                    type_id: $typeId
                }
            }
        }) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndTechCommitteeProposalMutation = gql`
    mutation addPostAndTechCommitteeProposalMutation (
        $onchainTechCommitteeProposalId: Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_tech_committee_proposal_id: $onchainTechCommitteeProposalId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndTipMutation = gql`
    mutation addPostAndTipMutation (
        $onchainTipId:String!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_tip_id: $onchainTipId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndTipWithTitleMutation = gql`
    mutation addPostAndTipWithTitleMutation (
        $onchainTipId:String!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!,
        $title: String!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_tip_id: $onchainTipId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId,
                title: $title
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndMotionMutation = gql`
    mutation addPostAndMotionMutation (
        $onchainMotionProposalId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_motion_id: $onchainMotionProposalId,
            proposer_address: $proposerAddress,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const addPostAndReferendumV2Mutation = gql`
    mutation addPostAndReferendumV2Mutation (
        $onchainReferendumId:Int!,
        $authorId: Int!,
        $proposerAddress: String!,
        $status: String!,
        $track: Int!,
        $origin: String!,
        $content: String!,
        $topicId: Int!,
        $typeId: Int!
        ){
        __typename
        insert_onchain_links(objects: {
            onchain_referendumv2_id: $onchainReferendumId,
            proposer_address: $proposerAddress,
            origin: $origin,
            track: $track,
            onchain_referendumv2_status: $status,
            post: {data: {
                author_id: $authorId,
                content: $content,
                topic_id: $topicId,
                type_id: $typeId
            }
        }}) {
            returning {
                id
            }
        }
    }
`;

export const updateDiscussionReferendumV2Mutation = gql`
    mutation updateDiscussionReferendumV2Mutation (
        $onchainReferendumId:Int!,
        $status: String!,
        ){
        __typename
        update_onchain_links(where: {onchain_referendumv2_id: {_eq: $onchainReferendumId}}, _set: {onchain_referendumv2_status: $status}) {
            returning {
                id
            }
        }
    }
`;

export const getProposalWithNoAssociatedReferendumQuery = gql`
    query getProposalWithNoAssociatedReferendumQuery($onchainProposalId: Int!) {
        onchain_links(where: {_and: {
                onchain_proposal_id: {_eq: $onchainProposalId},
                onchain_referendum_id: {_is_null: true}
            }}) {
            id
        }
    }
`;

export const getMotionWithNoAssociatedReferendumQuery = gql`
    query getMotionWithNoAssociatedReferendumQuery($onchainMotionId: Int!) {
        onchain_links(where: {_and: {
                onchain_motion_id: {_eq: $onchainMotionId},
                onchain_referendum_id: {_is_null: true}
            }}) {
            id
        }
    }
`;

export const addReferendumIdToProposalMutation = gql`
    mutation addReferendumIdToProposalMutation($proposalId: Int!, $referendumId: Int!) {
        update_onchain_links(
            where: {
                onchain_proposal_id: {_eq: $proposalId}
            },
            _set: {
                onchain_referendum_id: $referendumId
            }
        ) {
            affected_rows
        }
    }
`;

export const addMotionIdToTreasuryProposalMutation = gql`
    mutation addMotionIdToTreasuryProposalMutation($treasuryProposalId: Int!, $motionId: Int!) {
        update_onchain_links(
            where: {
                onchain_treasury_proposal_id: {_eq: $treasuryProposalId}
            },
            _set: {
                onchain_motion_id: $motionId
            }
        ) {
            affected_rows
        }
    }
`;

export const addReferendumIdToMotionMutation = gql`
        mutation addReferendumIdToMotionMutation($motionId: Int!, $referendumId: Int!) {
            update_onchain_links(
                where: {
                    onchain_motion_id: {_eq: $motionId}
                },
                _set: {
                    onchain_referendum_id: $referendumId
                }
            ) {
            affected_rows
        }
    }
`;

export const loginMutation = gql`
    mutation loginMutation($password: String!, $username: String!) {
        login(password: $password, username: $username) {
            token
        }
    }
`;

export const getDiscussionProposalById = gql`
    query getDiscussionProposalById($onchainProposalId: Int!) {
        onchain_links(where: {onchain_proposal_id: {_eq: $onchainProposalId}}) {
            id
        }
    }
`;

export const getDiscussionMotionProposalById = gql`
    query getDiscussionMotionProposalById($onchainMotionProposalId: Int!) {
        onchain_links(where: {onchain_motion_id: {_eq: $onchainMotionProposalId}}) {
            id
        }
    }
`;

export const getDiscussionTreasurySpendProposalById = gql`
    query getDiscussionTreasurySpendProposalById($onchainTreasuryProposalId: Int!) {
        onchain_links(where: {onchain_treasury_proposal_id: {_eq: $onchainTreasuryProposalId}}) {
            id
        }
    }
`;

export const getDiscussionBountyById = gql`
    query getDiscussionBountyById($onchainBountyId: Int!) {
        onchain_links(where: {onchain_bounty_id: {_eq: $onchainBountyId}}) {
            id
        }
    }
`;

export const getDiscussionChildBountyById = gql`
    query getDiscussionChildBountyById($onchainChildBountyId: Int!) {
        onchain_links(where: {onchain_child_bounty_id: {_eq: $onchainChildBountyId}}) {
            id
        }
    }
`;

export const getDiscussionTipById = gql`
    query getDiscussionTipById($onchainTipId: String!) {
        onchain_links(where: {onchain_tip_id: {_eq: $onchainTipId}}) {
            id
        }
    }
`;

export const getDiscussionTechCommitteeProposalById = gql`
    query getDiscussionTechCommitteeProposalById($onchainTechCommitteeProposalId: Int!) {
        onchain_links(where: {onchain_tech_committee_proposal_id: {_eq: $onchainTechCommitteeProposalId}}) {
            id
        }
    }
`;

export const getDiscussionReferendumV2ById = gql`
    query getDiscussionReferendumV2ById($onchainReferendumId: Int!) {
        onchain_links(where: {onchain_referendumv2_id: {_eq: $onchainReferendumId}}) {
            id
        }
    }
`;
