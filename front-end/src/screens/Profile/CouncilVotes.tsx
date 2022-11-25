// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import {
	ApolloClient,
	ApolloProvider,
	gql,
	InMemoryCache,
	useQuery  } from '@apollo/client';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Link } from 'react-router-dom';

// import { Link } from 'react-router-dom';
import FilteredError from '../../ui-components/FilteredError';
// import HelperTooltip from '../../ui-components/HelperTooltip';
import Loader from '../../ui-components/Loader';
import getNetwork from '../../util/getNetwork';

interface Props {
	address: string;
	className?: string
}

interface SUBQUERY_LINKS_TYPE {
	[network: string]: string
}

const SUBQUERY_LINKS: SUBQUERY_LINKS_TYPE = {
	kusama: 'https://api.subquery.network/sq/Premiurly/kusama-council-proposals',
	selendra: 'https://api.subquery.network/sq/subquery/tutorial---councillor-voting'
};

const NETWORK = getNetwork();

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: SUBQUERY_LINKS[NETWORK]
});

const CouncilVotes = ({ className, address } : Props) => {

	const VOTES_QUERY = gql`
		query {
			councillor (id: "${address}") {
				id
				numberOfVotes
				voteHistory(orderBy:BLOCK_DESC) {
					nodes {
						block
						approvedVote
						votedYes
						votedNo
						proposalHash {
							index
							hash
						}
					}
				}
			}
		}
	`;

	const { loading, error, data } = useQuery(VOTES_QUERY);

	const dataSource = data?.councillor?.voteHistory?.nodes?.length ? [...data.councillor.voteHistory.nodes.map((node:any) => ({
		block: node?.block,
		proposal: node.proposalHash?.index,
		vote: node?.approvedVote
	}) )] : [];

	const columns : ColumnsType<any> = [
		{
			dataIndex:'proposal',
			key: 'proposal',
			render: (proposal) => (
				<Link to={`/motion/${proposal}`}>
					<h3>Motion #{proposal}</h3>
				</Link>
			),
			title:'Proposals'
		},
		{
			dataIndex:'block',
			key: 'block',
			render: (block) => (
				<a href={`https://${NETWORK}.subscan.io/block/${block}`}>
					<h6>#{block}</h6>
				</a>
			),
			title:'Block'
		},
		{
			dataIndex:'vote',
			key: 'vote',
			render: (vote) => (
				<>
					{vote ? <div className='flex items-center'>
						<LikeFilled className='text-green_primary' /> <span className='text-green_primary ml-2'>Aye</span>
					</div> : <div className='flex items-center'>
						<DislikeFilled className='text-red_primary' /> <span className='text-red_primary ml-2'>Nay</span>
					</div>}
				</>
			),
			title:'Vote'
		}
	];

	return (
		<div className={`${className} p-3 lg:p-6 `}>
			{/* <div className='dashboard-heading mb-4'>Voting History <HelperTooltip className='align-middle ml-3' text='This represents the onchain votes of council member'/></div> */}
			<div>
				{loading ? <Loader text={'Loading...'} /> : null}
				{error ? <FilteredError text={error.message} /> : null}
				{data?.councillor?.voteHistory?.nodes?.length ? <Table dataSource={dataSource} columns={columns} /> : null}
			</div>
		</div>
	);

};

const Container = ({ address }: { address: string }) => {
	return (
		<ApolloProvider client={client}>
			<CouncilVotes address={address} />
		</ApolloProvider>
	);
};

export default Container;