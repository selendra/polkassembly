// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';
import { commentFields } from 'src/fragments/comments';

export const ALL_GOV2_POSTS = gql`
    query GetLatestGov2Posts($limit: Int! = 10) {
        posts(limit: $limit, order_by: {id: desc}, where: {onchain_link: {onchain_referendumv2_id: {_is_null: false}}}) {
            id
            title
            author {
                ...authorFields
            }
            created_at
            updated_at
            comments_aggregate {
                aggregate {
                    count
                }
            }
            type {
                name
                id
            }
            topic {
                id
                name
            }
            onchain_link {
                proposer_address
                track
                origin
                onchain_referendumv2 {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    trackNumber
                    submitted
                    submittedAt
                    referendumId
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        method
                        metaDescription
                        section
                    }
                }
                onchain_referendumv2_id
            }
            post_reactions {
                reaction
            }
        }
    }  
  ${authorFields}
`;

export const GOV2_POSTS_BY_TRACK = gql`
    query GetGov2PostsByTrack($track: Int!, $limit: Int! = 10) {
        posts(limit: $limit, where: {onchain_link: {id: {_is_null: false}, track: {_eq: $track}}}, order_by: {id: desc}) {
            id
            title
            author {
                ...authorFields
            }
            created_at
            updated_at
            comments_aggregate {
                aggregate {
                    count
                }
            }
            type {
                name
                id
            }
            topic {
                id
                name
            }
            onchain_link {
                proposer_address
                track
                origin
                onchain_referendumv2 {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    trackNumber
                    submitted
                    submittedAt
                    referendumId
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        method
                        metaDescription
                        section
                    }
                }
                onchain_referendumv2_id
            }
            post_reactions {
                reaction
            }
        }
    }
    ${authorFields}
`;

export const GOV2_POSTS_BY_TRACK_AND_STATUS = gql`
    query GetGov2PostsByTrackAndStatus($track: Int!, $status: String!, $limit: Int! = 10) {
        posts(limit: $limit, where: {onchain_link: {onchain_referendumv2_id: {_is_null: false}, onchain_referendumv2_status: {_eq: $status}, track: {_eq: $track}}}, order_by: {id: desc}) {
            id
            title
            author {
                ...authorFields
            }
            created_at
            updated_at
            comments_aggregate {
                aggregate {
                    count
                }
            }
            type {
                name
                id
            }
            topic {
                id
                name
            }
            onchain_link {
                proposer_address
                track
                origin
                onchain_referendumv2 {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    trackNumber
                    submitted
                    submittedAt
                    referendumId
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        method
                        metaDescription
                        section
                    }
                }
                onchain_referendumv2_id
            }
            post_reactions {
                reaction
            }
        }
    }
    ${authorFields}
`;

export const REFERENDUMV2_POST_AND_COMMENTS = gql`
    query ReferendumV2PostAndComments ($id:Int!) {
        posts(where: {onchain_link: {onchain_referendumv2_id: {_eq: $id}}}) {
            author {
                ...authorFields
            }
            content
            created_at
            id
            updated_at
            comments(order_by: {created_at: asc}) {
                ...commentFields
            }
            onchain_link{
                proposer_address
                track
                origin
                onchain_referendumv2 {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    referendumId
                    trackNumber
                    submitted
                    submittedAt
                    referendumStatus(orderBy: id_DESC){
                        id
                        status
                        blockNumber {
                            number
                        }
                    }
                    preimage {
                        method
                        metaDescription
                        section
                        enactmentPeriod
                        depositAmount
                        hash
                        length
                        preimageArguments {
                          name
                          value
                        }
                    }
                }
                onchain_referendumv2_id
            }
            title
            topic {
                id
                name
            }
            type {
                id
                name
            }
        }
    }
    ${authorFields}
    ${commentFields}
`;

export const TRACK_INFO = gql`
    query GetTrackInfo($track: Int!) {
        track_info(where: {track_id: {_eq: $track}}) {
            confirm_period
            decision_deposit
            decision_period
            id
            max_deciding
            min_enactment_period
            name
            prepare_period
            track_id
        }
    }
`;