// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Divider } from 'antd';
import React from 'react';
import kusamaLogo from 'src/assets/kusama-logo.gif';
import chainIcon from 'src/assets/parachains/chain-link.png';
import selendraLogo from 'src/assets/polkadot-logo-small-inverted.png';

interface Props {
	className?: string
	network: 'selendra' | 'kusama'
}

const ParachainInfoCard = ({ className, network }: Props) => {
	const selendraMetrics = {
		parachains: '1',
		projects: '1'
	};

	const kusamaMetrics = {
		crowdloans: '5',
		parachains: '29',
		projects: '23'
	};

	const metrics = network=='selendra' ? selendraMetrics : kusamaMetrics;

	return (
		<div className={className}>
			<div className="bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className='parachain-card-header'>
					<img src={network=='selendra' ? selendraLogo : kusamaLogo} alt="Chain Logo" />
					<span className='network-name text-sidebarBlue'>{network}</span>
				</div>
				<div className="mt-3 text-sidebarBlue font-medium">
					<span> <span className='text-navBlue'></span>
					</span>
				</div>
				<Divider className='my-3' />
				<div className='parachain-card-desc'>

					{/* Parachains */}
					<div className='metric-container'>
						<div className='metric-line'>
							<img src={chainIcon} alt="Parachains Icon" />
							<span className='metric-num text-sidebarBlue'>{metrics.projects}</span>
						</div>
						<div className='metric-name text-navBlue'>Parachains</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default styled(ParachainInfoCard)`
		.parachain-card-header {
			display: flex !important;
			align-items: center;
			font-size: 18px !important;

			@media only screen and (max-width: 768px) {
				font-size: 16px !important;
				font-weight: 500;
			}
			
			img {
				margin-right: 20px;
				margin-top: 2px;
				height: 33px;
				width: 33px;

				@media only screen and (max-width: 768px) {
					height: 24px;
					width: 24px;
				}
			}

			.network-name {
				text-transform: capitalize;
				font-weight: 500;
			}

			.dotDivider {
				height: 5px;
				width: 5px;
				background-color: #4E4E4E;
				margin: 0 20px;
				border-radius: 50%;
				display: inline-block;
			}
		}

		.parachain-card-meta {
			margin-left: 53px;
			margin-top: 12px;
			margin-bottom: 24px;
			font-size: 14px !important;

			@media only screen and (max-width: 768px) {
				font-size: 12px !important;
				margin-top: 0;
				margin-bottom: 16px;
				margin-left: 43px;

				.hidden-sm {
					display: none;
				}
			}
		}

		.parachain-card-desc{
			display: flex !important;
			align-items: center;
			justify-content: space-around;
			margin-left: 20px;
			margin-top: 24px;

			@media only screen and (max-width: 768px) {
				margin-left: 0;
				margin-top: 16px;
			}

			.metric-line {
				display: flex;
				align-items: center;

				img {
					@media only screen and (max-width: 768px) {
						height: 14px;
						width: auto;
					}
				}

				.metric-num {
					margin-left: 7px;
					font-weight: 500;
					font-size: 14px;

					@media only screen and (max-width: 768px) {
						font-size: 12px;
					}
				}
			}

			.metric-name {
				margin-top: 8px !important;
				font-size: 14px;

				@media only screen and (max-width: 768px) {
					font-size: 12px;
				}
			}
		}
`;
