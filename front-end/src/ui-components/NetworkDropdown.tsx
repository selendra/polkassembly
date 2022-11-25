// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined } from '@ant-design/icons';
import { Card, Col, Dropdown, Row } from 'antd';
import React, { FC } from 'react';
import chainLogo from 'src/assets/parachain-logos/chain-logo.jpg';
import { chainProperties, network } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

type DropdownMenuItemType = {
	key: any,
	label: any
}

const selendraChains: DropdownMenuItemType[] = [];
const kusamaChains: DropdownMenuItemType[] = [];
const soloChains: DropdownMenuItemType[] = [];
const testChains: DropdownMenuItemType[] = [];

const currentNetwork = getNetwork();

for (const key of Object.keys(network)) {
	const keyVal = network[key as keyof typeof network];
	const link = ['MOONBASE', 'MOONRIVER', 'MOONBEAM', 'KILT'].includes(key) ? `https://${key}.polkassembly.network` : `https://${key}.polkassembly.io`;
	const optionObj: DropdownMenuItemType = {
		key,
		label: <a href={link} className='flex items-center my-2'>
			<img
				className='w-5 h-5 mr-3 rounded-full'
				src={chainProperties[keyVal]?.logo ? chainProperties[keyVal].logo : chainLogo}
				alt='Logo'
			/>
			<span className='capitalize'> {keyVal == 'hydradx' ? 'HydraDX' : keyVal} </span>
		</a>
	};

	switch(chainProperties[keyVal]?.category) {
	case 'selendra':
		selendraChains.push(optionObj);
		break;
	case 'kusama':
		kusamaChains.push(optionObj);
		break;
	case 'test':
		testChains.push(optionObj);
		break;
	default:
		soloChains.push(optionObj);
	}
}

const NetworkDropdown: FC<{setSidedrawer: React.Dispatch<React.SetStateAction<boolean>>}> = ({ setSidedrawer }) => {
	return (
		<Dropdown
			trigger={['click']}
			dropdownRender={() => {
				return (
					<Card className='max-w-[356px] max-h-[52vh] overflow-y-auto'>
						<>
							<div className='text-navBlue font-medium'>Selendra &amp; Parachains</div>
							<Row className="mt-2">
								{
									selendraChains.map(optionObj => (
										<Col span={12} key={optionObj.key} className="flex">{optionObj.label}</Col>
									))
								}
							</Row>

							<div className='text-navBlue font-medium mt-4'>Kusama &amp; Parachains</div>
							<Row className="mt-2">
								{
									kusamaChains.map(optionObj => (
										<Col span={12} key={optionObj.key} className="flex">{optionObj.label}</Col>
									))
								}
							</Row>

							<div className='text-navBlue font-medium mt-4'>Solo Chains</div>
							<Row className="mt-2">
								{
									soloChains.map(optionObj => (
										<Col span={12} key={optionObj.key} className="flex">{optionObj.label}</Col>
									))
								}
							</Row>

							<div className='text-navBlue font-medium mt-4'>Test Chains</div>
							<Row className="mt-2">
								{
									testChains.map(optionObj => (
										<Col span={12} key={optionObj.key} className="flex">{optionObj.label}</Col>
									))
								}
							</Row>
						</>
					</Card>
				);}
			}
		>
			<a className='flex items-center justify-between text-navBlue hover:text-pink_primary' onClick={e => {
				e.preventDefault();
				setSidedrawer(false);
			}}
			>
				<img
					className='w-[20px] h-[20px] mr-2 rounded-full'
					src={chainProperties[currentNetwork]?.logo ? chainProperties[currentNetwork].logo : chainLogo}
					alt='Logo'
				/>
				<span className='mr-2 capitalize font-medium hidden md:inline-block'>{currentNetwork == 'hydradx' ? 'HydraDX' : currentNetwork}</span>
				<DownOutlined />
			</a>
		</Dropdown>
	);
};

export default NetworkDropdown;