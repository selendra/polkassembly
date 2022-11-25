// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode
	className?: string
}

const OnchainInfoWrapper = ({ children, className }: Props) => {

	return (
		<div className={className}>{children}</div>
	);
};

export default styled(OnchainInfoWrapper)`
	background-color: white;
	font-size: sm;
	overflow-wrap: break-word;
	margin-bottom: 1rem;

	h6 {
		margin-bottom: 8px;
		font-weight: 500;
	}

	.ant-col, .arguments {
		margin-bottom: 48px;
	}

	.methodArguments {
		display: inline-block;
		overflow-x: auto;
		overflow-y: auto;
		width: 100%;
		max-height: 20rem;
		word-wrap: normal;
	}

	.motion-sub-info{
		.row {
			width: 100%;
		}
		&.with-table {
			background-color: #fff;
			.arguments-col {
				margin-top: 16px;
				margin-bottom: 20px;
			}
		}
		&.treasury-info {
			margin: 12px 9px 6px 9px;
		}
	}

	.child-bounty-item {
		margin-top: 4px;
		margin-bottom: 4px;

		.child-bounty-item-header {
			margin-bottom: 2px !important;
			color: #4183c4 !important;
		}
	}

	.child-bounty-show-btn {
		margin-top: 4px;
	}

	/* Arguments Style */
	.arguments-heading {
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		&.mt {
			margin-top: 16px;
		}
		.buttons {
			margin-left: 12px;
			.active-btn {
				background: #E5007A !important;
				color: #fff;
			}
		}
	}

	.json-view, .table-view {
		width: 100%;
		max-width: 100%;
		overflow-x: auto;
		background: #FFF !important;
	}

	.react-json-view {
		padding: 8px;
		font-size: 14px;
		min-width: min-content;
		
		.variable-value {
			max-width: 70vw;
			min-width: 956px !important;
			word-break: break-all;
		}
	}

	.json-view {
		overflow-x: auto;
		background-color: #fff !important;
	}

	.table-view, .json-view {
		max-height: 500px;
		overflow-y: auto;
		table {
			width: 100%;
			border-spacing: 0px;
		}
		td {
			width: 70vw;
			word-break: break-all;
			white-space: pre-line;
			overflow-wrap: break-word;
			text-align: justify;
			text-overflow: ellipsis;
			overflow: hidden;
			
			&.direct-data.data-2 {
				min-width: 400px !important;
			}

			&.indirect-data {
				background: #fff;
			}
			
			&.direct-data {
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 20px;
				height: 40px;
				border-style: solid;
				border-width: 1px 1px 0px 1px;
				border-color: rgb(238, 238, 238);
				min-width: 160px;
				padding: 10px 24px;
				background: #fff;
			}
		}
	}

	.prev-proposals-btn {
		display: flex;
		align-items: center;
		cursor: pointer;
		color: pink_primary;
		margin-left: 6px;
		font-weight: 500;

		&>div {
			margin-left: 12px;
		}
	}
`;