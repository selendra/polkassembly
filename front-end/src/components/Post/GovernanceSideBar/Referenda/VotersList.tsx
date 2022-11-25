// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LeftOutlined, LikeFilled, RightOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import { Pagination, PaginationProps, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import subscanApiHeaders from 'src/global/subscanApiHeaders';
import { LoadingStatusType } from 'src/types';
import Address from 'src/ui-components/Address';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();

interface Props {
	className?: string
	referendumId: number
}

const VotersList = ({ className, referendumId } : Props) => {
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading votes' });
	const [votersList, setVotersList] = useState<any | null>(null);
	const [count, setCount] = useState<number | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const fetchVotersList = useCallback(() => {
		setLoadingStatus({
			isLoading: true,
			message: 'Loading Data'
		});

		fetch(`https://${NETWORK}.api.subscan.io/api/scan/democracy/votes`,
			{
				body: JSON.stringify({
					page: currentPage,
					referendum_index: referendumId,
					row: 10
				}),
				headers: subscanApiHeaders,
				method: 'POST'
			}).then(async (res) => {
			const votersData = await res.json();

			if(votersData && votersData.data && votersData.data.list) {
				if(!count) {
					setCount(votersData.data.count);
				}
				setVotersList(votersData.data.list);
			}

			setLoadingStatus({
				isLoading: false,
				message: 'Loading Data'
			});
		}).catch((err) => {
			console.error('Error in fetching vote data:', err);
		});
	}, [count, currentPage, referendumId]);

	useEffect(() => {
		fetchVotersList();
	}, [fetchVotersList]);

	const onChange: PaginationProps['onChange'] = page => {
		setCurrentPage(page);
	};

	return (
		<>
			{
				votersList &&
				<GovSidebarCard className={`${className}`}>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<div className="flex justify-between mb-6 bg-white z-10">
							<h6 className='dashboard-heading'>Voters</h6>
						</div>

						<div className='flex flex-col justify-between gap-y-1 h-screen overflow-y-auto px-0 md:px-3'>
							{votersList.map((voteData: any, index:number) =>
								<div className='flex items-center justify-between mb-4' key={index}>
									<div className='item overflow-ellipsis'>
										<Address address={voteData.account.address} />
									</div>

									{voteData.passed ?
										<div className='flex items-center text-aye_green text-md'>
											<LikeFilled className='mr-2' /> Aye
										</div>
										:
										<div className='flex items-center text-nay_red text-md'>
											<DislikeFilled className='mr-2' /> Nay
										</div>
									}
								</div>
							)}
						</div>

						<div className="flex justify-center pt-6 bg-white z-10">
							<Pagination
								size="small"
								defaultCurrent={1}
								onChange={onChange}
								total={count}
								showSizeChanger={false}
								pageSize={30}
								responsive={true}
								hideOnSinglePage={true}
								nextIcon={<div className='-mt-1 ml-1'><RightOutlined /></div>}
								prevIcon={<div className='-mt-1 mr-1'><LeftOutlined className='-mt-10' /></div>}
							/>
						</div>
					</Spin>
				</GovSidebarCard>
			}
		</>
	);
};

export default VotersList;