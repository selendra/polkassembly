// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useReferendumV2PostAndCommentsLazyQuery } from 'src/generated/graphql';
import BackToListingView from 'src/ui-components/BackToListingView';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

interface Props {
	councilBoardSidebar?: boolean;
	postID?: number;
	trackName?: string;
}

const ReferendumV2Post = ({ councilBoardSidebar=false, postID, trackName }: Props) => {
	const { id } = useParams();
	const idNumber = Number(id) || Number(postID) || 0;

	const [getData, { called, data, error, refetch }] = useReferendumV2PostAndCommentsLazyQuery({ variables: { 'id': idNumber } });

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return (<div>
		{trackName && !councilBoardSidebar && <BackToListingView trackName={trackName} />}

		<div className='mt-6'>
			<Post data={data} trackName={trackName} isReferendumV2 refetch={refetch} />
		</div>
	</div>);

	return <div className='mt-16'><LoadingState /></div>;
};

export default ReferendumV2Post;
