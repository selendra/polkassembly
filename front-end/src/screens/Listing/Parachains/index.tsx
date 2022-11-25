// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Col,Row,Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import ParachainInfoCard from 'src/components/ParachainInfoCard';

import ChainDataTable from './ChainDataTable';

interface Props {
  className?: string
}

const Parachains = ({ className }: Props) => {

	const [parachainsData, setParachainsData] = useState([]);

	useEffect(() => {
		fetch('parachains.json')
			.then((r) => r.json())
			.then((data) => {
				setParachainsData(data);
			});
	},[]);

	const tabItems = [
		// eslint-disable-next-line sort-keys
		{ label: `All (${parachainsData?.length})`, key: 'all', children: <ChainDataTable data={parachainsData} chain='all' /> },
		// eslint-disable-next-line sort-keys
		{ label: `Selendra (${parachainsData?.filter((item : any) => item?.chain === 'selendra').length})`, key: 'selendra', children: <ChainDataTable data={parachainsData} chain='selendra' /> }
	];

	return (
		<div className={className}>
			<h1 className='dashboard-heading mb-4 md:mb-6'>Selendra ecosystem and directory</h1>

			<Row gutter={[{ lg:16 }, 16]} className='mb-4 md:mb-6'>
				<Col span={24} lg={{ span:12 }}>
					<ParachainInfoCard network='selendra' />
				</Col>
			</Row>

			<div className={`${className} bg-white drop-shadow-md p-2 lg:p-6 rounded-md h-[650px]`}>
				<h2 className='dashboard-heading mb-6'>Projects</h2>
				<Tabs
					tabBarStyle={{ color:'#334D6E' }}
					type="card"
					className='ant-tabs-tab-bg-white'
					items={tabItems}
				/>
			</div>
		</div>
	);
};

export default styled(Parachains)`

	.loader-cont {
		display: flex;
    justify-content: center;
    margin-top: 30%;
	}

	.ma-sm-1 {
		@media only screen and (max-width: 768px) {
			margin: 1rem;
		}
	}

	.card-group {
		margin-top: 32px;
		flex-wrap: nowrap;
		max-width: 99.9%;
		overflow-x: hidden !important;

		&:hover {
			overflow-x: auto !important;
		}

		@media only screen and (max-width: 768px){
			overflow-x: hidden !important;
			padding-left: 1em;
			flex-direction: column;
			align-items: center;
			max-width: 100%;
			margin-left: 4px;
			margin-top: 22px;


			&:hover {
				overflow-x: hidden !important;
			}
		}
	}
`;