// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useGetTrackInfoLazyQuery } from 'src/generated/graphql';
import { chainProperties } from 'src/global/networkConstants';
import { trackInfo } from 'src/global/post_trackInfo';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import Loader from 'src/ui-components/Loader';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string;
	trackName: string;
}

const currentNetwork = getNetwork();

const AboutTrackCard = ({ className, trackName } : Props) => {
	const trackMetaData = trackInfo[trackName];

	const [getData, { called, data, error, loading, refetch }] = useGetTrackInfoLazyQuery({ variables: {
		track: trackMetaData.trackId
	} });

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	return (
		<div className={`${className} bg-white drop-shadow-md rounded-md p-4 md:p-8 text-sidebarBlue`}>
			<div className="flex justify-between capitalize font-medium">
				<h2 className="text-lg capitalize">
						About {trackName.split(/(?=[A-Z])/).join(' ')}
				</h2>

				<h2 className="text-sm text-pink_primary">{trackMetaData.group}</h2>
			</div>

			<p className="mt-5 text-sm font-normal">{trackMetaData.description}</p>

			{error && <ErrorAlert className="mt-8" errorMsg={error.message} />}

			{!data && <Loader />}

			{data && data.track_info && data.track_info.length && !error ? <div className="mt-8 text-xs w-full max-w-[1000px]">
				<Spin spinning={!data || loading} indicator={<LoadingOutlined />}>
					<Row gutter={[{ xs: 4, sm: 4, md: 16, lg: 32, xl: 32, xxl: 32 }, 16]}>
						<Col xs={24} sm={24} md={12} lg={12} xl={8}>
							{data?.track_info[0].max_deciding && <Row>
								<Col span={15} className='font-bold'>Max Deciding:</Col>
								<Col span={9}>{data?.track_info[0].max_deciding}</Col>
							</Row>
							}

							{data?.track_info[0].decision_deposit && <Row className='mt-2'>
								<Col span={15} className='font-bold'>Decision Deposit({chainProperties[currentNetwork].tokenSymbol}):</Col>
								<Col span={9}>{data?.track_info[0].decision_deposit && formatBnBalance(data?.track_info[0].decision_deposit, { numberAfterComma: 2, withUnit: false })}</Col>
							</Row>
							}
						</Col>

						<Col xs={24} sm={24} md={12} lg={12} xl={8}>
							{data?.track_info[0].prepare_period && <Row>
								<Col span={15} className='font-bold'>Prepare Period:</Col>
								<Col span={9}>{data?.track_info[0].prepare_period}</Col>
							</Row>}

							{data?.track_info[0].confirm_period && <Row className='mt-2'>
								<Col span={15} className='font-bold'>Confirm Period:</Col>
								<Col span={9}>{data?.track_info[0].confirm_period}</Col>
							</Row>}
						</Col>

						<Col xs={24} sm={24} md={12} lg={12} xl={8}>
							{data?.track_info[0].min_enactment_period &&<Row>
								<Col span={15} className='font-bold'>Min Enactment Period:</Col>
								<Col span={9}>{data?.track_info[0].min_enactment_period}</Col>
							</Row>}

							{data?.track_info[0].decision_period && <Row className='mt-2'>
								<Col span={15} className='font-bold'>Decision Period:</Col>
								<Col span={9}>{data?.track_info[0].decision_period}</Col>
							</Row>}
						</Col>

						{/* <Col xs={24} sm={24} md={12} lg={12} xl={6}>
							<Row>
								<Col span={15} className='font-bold'>Minimum Approval:</Col>
								<Col span={9}>VALUE_HERE</Col>
							</Row>

							<Row className='mt-2'>
								<Col span={15} className='font-bold'>Minimum Support:</Col>
								<Col span={9}>VALUE_HERE</Col>
							</Row>
						</Col> */}
					</Row>
				</Spin>
			</div>
				:
				<></>
			}
		</div>
	);
};

export default AboutTrackCard;