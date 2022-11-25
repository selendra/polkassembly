// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGov2PostsByTrackLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { EmptyLatestActivity, ErrorLatestActivity, Gov2PopulatedLatestActivityCard, LoadingLatestActivity, PopulatedLatestActivity } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import StatusTag from 'src/ui-components/StatusTag';
import getDefaultAddressField from 'src/util/getDefaultAddressField';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

import { Gov2PostsRowData } from './AllGov2PostsTable';

const columns: ColumnsType<Gov2PostsRowData> = [
	{
		title: '#',
		dataIndex: 'id',
		key: 'id',
		width: 65,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 350,
		fixed: 'left',
		render: (title, { subTitle }) => {
			return (
				<>
					<h4>
						<div>
							{title}
						</div>
					</h4>
					{subTitle && <div className='text-sm text-sidebarBlue'>{subTitle}</div>}
				</>
			);
		}
	},
	{
		title: 'Posted By',
		dataIndex: 'username',
		key: 'postedBy',
		render: (username, { address }) => <NameLabel defaultAddress={address} username={username} disableIdenticon={true} />
	},
	{
		title: 'Created',
		key: 'created',
		dataIndex: 'createdAt',
		render: (createdAt) => {
			const relativeCreatedAt = getRelativeCreatedAt(createdAt);
			return (
				<span>{relativeCreatedAt}</span>
			);
		}
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (status) => {
			if(status) return <StatusTag status={status} />;
		}
	}
];

const defaultAddressField = getDefaultAddressField();

interface Props {
	trackNumber: number;
}

const TrackPostsTable = ({ trackNumber } : Props) => {
	const navigate = useNavigate();

	function gotoPost(rowData: Gov2PostsRowData){
		if(rowData.postOrigin) {
			navigate(`/${rowData.postOrigin.split(/(?=[A-Z])/).join('-').toLowerCase()}/${rowData.id}`);
		}
	}

	const [getData, { called, data, error, refetch }] = useGetGov2PostsByTrackLazyQuery({
		variables: {
			limit: 8,
			track: trackNumber
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

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		if(!data.posts || !data.posts.length) return <EmptyLatestActivity />;

		const tableData: Gov2PostsRowData[] = [];

		data.posts.forEach(post => {

			if(post && post?.author?.username) {
				// truncate title
				let title = post.title || post.onchain_link?.onchain_referendumv2?.[0]?.preimage?.method || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));
				const subTitle = !title && post.onchain_link?.onchain_referendumv2?.[0]?.preimage?.method ? post.onchain_link?.onchain_referendumv2?.[0]?.preimage?.method : null;

				const tableDataObj:Gov2PostsRowData = {
					key: post.id,
					id: post.onchain_link ? Number(post.onchain_link?.onchain_referendumv2[0]?.referendumId) : post.id,
					title,
					subTitle,
					address: post.onchain_link?.onchain_referendumv2[0]?.submitted.who ? post.onchain_link?.onchain_referendumv2[0]?.submitted.who : post.author[defaultAddressField]!,
					username: post.author.username,
					createdAt: post.created_at,
					postOrigin: post.onchain_link?.origin || null,
					status: post.onchain_link?.onchain_referendumv2?.[0]?.referendumStatus?.[0].status || null,
					track: Number(post.onchain_link?.onchain_referendumv2?.[0]?.trackNumber)
				};

				tableData.push(tableDataObj);
			}
		});

		return (
			<>
				<div className='hidden lg:block'>
					<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => gotoPost(rowData)} />
				</div>

				<div className="block lg:hidden h-[520px] overflow-y-auto">
					<Gov2PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => gotoPost(rowData)} />
				</div>
			</>
		);
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default TrackPostsTable;