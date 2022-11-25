// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import GovernanceCard from 'src/components/GovernanceCard';
import { useGetGov2PostsByTrackAndStatusLazyQuery } from 'src/generated/graphql';
import { trackInfo } from 'src/global/post_trackInfo';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import { LoadingState, PostEmptyState } from 'src/ui-components/UIStates';

interface Props {
	className?: string;
	status: string;
	trackName: string;
}

const TrackListingStatusTabContent = ({ className, status, trackName } : Props) => {

	const { trackId } = trackInfo[trackName];

	const [getData, { called, data, error, loading, refetch }] = useGetGov2PostsByTrackAndStatusLazyQuery({
		variables : {
			limit: 10,
			status,
			track: trackId
		}
	});

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	if(error) return <div className={className}><ErrorAlert errorMsg={error.message} /></div>;

	if(!data || loading) return <div className={className}><LoadingState /></div>;

	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentReferendum = data.posts.some((post) => {
		if(post.onchain_link?.onchain_referendumv2.length){
			// this breaks the loop as soon as
			// we find a post that has a tip.
			return true;
		}
		return false;
	});

	if (noPost || !atLeastOneCurrentReferendum) return <div className={className}><PostEmptyState /></div>;

	return (
		<div className={`${className} proposals__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_referendumv2[0]?.referendumId;

					return !!post?.author?.username && !!post?.onchain_link?.onchain_referendumv2.length &&
						<div key={post.id} className='my-5'>
							{<Link to={`/${trackName.split(/(?=[A-Z])/).join('-').toLowerCase()}/${onchainId}`}>
								<GovernanceCard
									postReactions={(post as any)?.post_reactions}
									address={post.onchain_link.onchain_referendumv2[0]?.submitted.who}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: 'no'}
									method={post.onchain_link.onchain_referendumv2[0]?.preimage?.method}
									onchainId={onchainId}
									status={post.onchain_link.onchain_referendumv2[0]?.referendumStatus?.[0].status}
									title={post.title}
									topic={post.topic.name}
								/>
							</Link>}
						</div>
					;
				}
			)}
		</div>
	);
};

export default TrackListingStatusTabContent;