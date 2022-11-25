// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import { Signer } from '@polkadot/api/types';
import { isWeb3Injected, web3Enable } from '@polkadot/extension-dapp';
import { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import { Form } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { gov2ReferendumStatus, motionStatus, proposalStatus, referendumStatus, tipStatus } from 'src/global/statuses';
import { OnchainLinkReferendumV2Fragment, Wallet } from 'src/types';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import getEncodedAddress from 'src/util/getEncodedAddress';
import styled from 'styled-components';

import ExtensionNotDetected from '../../ExtensionNotDetected';
import BountyChildBounties from './Bounty/BountyChildBounties';
import MotionVoteInfo from './Motions/MotionVoteInfo';
import VoteMotion from './Motions/VoteMotion';
import ProposalDisplay from './Proposals';
import ReferendumVoteInfo from './Referenda/ReferendumVoteInfo';
import VoteReferendum from './Referenda/VoteReferendum';
import EndorseTip from './Tips/EndorseTip';
import TipInfo from './Tips/TipInfo';
import EditProposalStatus from './TreasuryProposals/EditProposalStatus';

interface Props {
	canEdit?: boolean | '' | undefined
	className?: string
	isBounty?: boolean
	isChildBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isReferendumV2?: boolean
	isTreasuryProposal?: boolean
	isTipProposal?: boolean
	isTechCommitteeProposal?: boolean
	onchainId?: string | number | null
	onchainLink?: OnchainLinkReferendumV2Fragment | OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkProposalFragment | OnchainLinkReferendumFragment | OnchainLinkTreasuryProposalFragment | OnchainLinkTipFragment
	status?: string
	startTime: string
}

const GovernanceSideBar = ({ canEdit, className, isBounty, isMotion, isProposal, isReferendum, isReferendumV2, isTipProposal, isTreasuryProposal, onchainId, onchainLink, startTime, status }: Props) => {
	const [address, setAddress] = useState<string>('');
	const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const [accountsMap, setAccountsMap] = useState<{[key:string]:string}>({});
	const [signersMap, setSignersMap] = useState<{[key:string]: Signer}>({});

	const { api, apiReady } = useContext(ApiContext);
	const [lastVote, setLastVote] = useState<string | null | undefined>(undefined);

	const canVote = !!status && !![proposalStatus.PROPOSED, referendumStatus.STARTED, motionStatus.PROPOSED, tipStatus.OPENED, gov2ReferendumStatus.ONGOING].includes(status);
	const onchainTipProposal = (onchainLink as OnchainLinkTipFragment)?.onchain_tip;

	const onAccountChange = (address: string) => {
		setAddress(address);
	};

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const signer: Signer = signersMap[accountsMap[address]];
		api?.setSigner(signer);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	const getWalletAccounts = async (chosenWallet: Wallet): Promise<InjectedAccount[] | undefined> => {
		const injectedWindow = window as Window & InjectedWindow;

		let wallet = isWeb3Injected
			? injectedWindow.injectedWeb3[chosenWallet]
			: null;

		if (!wallet) {
			wallet = Object.values(injectedWindow.injectedWeb3)[0];
		}

		if (!wallet) {
			return;
		}

		let injected: Injected | undefined;

		try {
			injected = await new Promise((resolve, reject) => {
				const timeoutId = setTimeout(() => {
					reject(new Error('Wallet Timeout'));
				}, 60000); // wait 60 sec

				wallet!.enable(APPNAME).then(value => {
					clearTimeout(timeoutId);
					resolve(value);
				}).catch(error => {
					reject(error);
				});
			});
		} catch (err) {
			console.log('Error fetching wallet accounts : ', err);
		}

		if(!injected) {
			return;
		}

		const accounts = await injected.accounts.get();

		if (accounts.length === 0) return;

		accounts.forEach((account) => {
			account.address = getEncodedAddress(account.address) || account.address;
		});

		return accounts;
	};

	const getAccounts = async (): Promise<undefined> => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const extensions = await web3Enable(APPNAME);

		if (extensions.length === 0) {
			setExtensionNotFound(true);
			return;
		} else {
			setExtensionNotFound(false);
		}

		let accounts: InjectedAccount[] = [];
		let polakadotJSAccounts : InjectedAccount[] | undefined;
		let subwalletAccounts: InjectedAccount[] | undefined;
		let talismanAccounts: InjectedAccount[] | undefined;

		const signersMapLocal = signersMap as {[key:string]: Signer};
		const accountsMapLocal = accountsMap as {[key:string]: string};

		for (const extObj of extensions) {
			if(extObj.name == 'polkadot-js') {
				signersMapLocal['polkadot-js'] = extObj.signer;
				polakadotJSAccounts = await getWalletAccounts(Wallet.POLKADOT);
			} else if(extObj.name == 'subwallet-js') {
				signersMapLocal['subwallet-js'] = extObj.signer;
				subwalletAccounts = await getWalletAccounts(Wallet.SUBWALLET);
			} else if(extObj.name == 'talisman') {
				signersMapLocal['talisman'] = extObj.signer;
				talismanAccounts = await getWalletAccounts(Wallet.TALISMAN);
			}
		}

		if(polakadotJSAccounts) {
			accounts = accounts.concat(polakadotJSAccounts);
			polakadotJSAccounts.forEach((acc: InjectedAccount) => {
				accountsMapLocal[acc.address] = 'polkadot-js';
			});
		}

		if(subwalletAccounts) {
			accounts = accounts.concat(subwalletAccounts);
			subwalletAccounts.forEach((acc: InjectedAccount) => {
				accountsMapLocal[acc.address] = 'subwallet-js';
			});
		}

		if(talismanAccounts) {
			accounts = accounts.concat(talismanAccounts);
			talismanAccounts.forEach((acc: InjectedAccount) => {
				accountsMapLocal[acc.address] = 'talisman';
			});
		}

		if (accounts.length === 0) {
			setAccountsNotFound(true);
			return;
		} else {
			setAccountsNotFound(false);
			setAccountsMap(accountsMapLocal);
			setSignersMap(signersMapLocal);
		}

		setAccounts(accounts);
		if (accounts.length > 0) {
			const signer: Signer = signersMapLocal[accountsMapLocal[accounts[0].address]];
			api.setSigner(signer);
		}

		return;
	};

	if (extensionNotFound) {
		return (
			<div className={className}>
				<GovSidebarCard>
					<ExtensionNotDetected />
				</GovSidebarCard>
			</div>
		);
	}

	if (accountsNotFound) {
		return (
			<GovSidebarCard>
				<div className='mb-4'>You need at least one account in Polkadot-js extenstion to use this feature.</div>
				<div className='text-muted'>Please reload this page after adding accounts.</div>
			</GovSidebarCard>
		);
	}

	return (
		<>
			{<div className={className}>
				<Form>
					{isMotion && <>
						{canVote &&
							<VoteMotion
								accounts={accounts}
								address={address}
								getAccounts={getAccounts}
								motionId={onchainId as number}
								motionProposalHash={(onchainLink as OnchainLinkMotionFragment)?.onchain_motion?.[0]?.motionProposalHash}
								onAccountChange={onAccountChange}
							/>
						}

						{(onchainId || onchainId === 0) &&
							<MotionVoteInfo
								motionId={onchainId as number}
							/>
						}
					</>}

					{isProposal &&
						<ProposalDisplay
							accounts={accounts}
							address={address}
							canVote={canVote}
							getAccounts={getAccounts}
							onAccountChange={onAccountChange}
							status={status}
							proposalId={onchainId  as number}
						/>
					}

					{isTreasuryProposal &&
						<EditProposalStatus
							proposalId={onchainId  as number}
							canEdit={canEdit}
							startTime={startTime}
						/>
					}

					{isReferendum &&
						<>
							{canVote &&
								<GovSidebarCard>
									<h6 className="dashboard-heading mb-6">Cast your Vote!</h6>
									<VoteReferendum
										lastVote={lastVote}
										setLastVote={setLastVote}
										accounts={accounts}
										address={address}
										getAccounts={getAccounts}
										onAccountChange={onAccountChange}
										referendumId={onchainId  as number}
									/>
								</GovSidebarCard>
							}

							{(onchainId || onchainId === 0) && (onchainLink as OnchainLinkReferendumFragment).onchain_referendum &&
								<div className={className}>
									<ReferendumVoteInfo
										referendumId={onchainId as number}
									/>
								</div>
							}

							<div>
								{lastVote != undefined ? lastVote == null ?
									<GovSidebarCard>
										You haven&apos;t voted yet, vote now and do your bit for the community
									</GovSidebarCard>
									:
									<GovSidebarCard className='flex items-center'>
										You Voted: { lastVote == 'aye' ? <LikeFilled className='text-aye_green ml-2' /> : <DislikeFilled className='text-nay_red ml-2' /> }
										<span className={`last-vote-text ${lastVote == 'aye' ? 'green-text' : 'red-text'}`}>{lastVote}</span>
									</GovSidebarCard>
									: <></>
								}
							</div>
						</>
					}

					{isReferendumV2 &&
						<>
							{canVote &&
								<GovSidebarCard>
									<h6 className="dashboard-heading mb-6">Cast your Vote!</h6>
									<VoteReferendum
										lastVote={lastVote}
										setLastVote={setLastVote}
										accounts={accounts}
										address={address}
										getAccounts={getAccounts}
										onAccountChange={onAccountChange}
										referendumId={onchainId  as number}
										isReferendumV2={true}
									/>
								</GovSidebarCard>
							}

							{/* {(onchainId || onchainId === 0) && (onchainLink as OnchainLinkReferendumV2Fragment).onchain_referendumv2 &&
								<div className={className}>
									<ReferendumVoteInfo
										referendumId={onchainId as number}
									/>
								</div>
							} */}

							<div>
								{lastVote != undefined ? lastVote == null ?
									<GovSidebarCard>
										You haven&apos;t voted yet, vote now and do your bit for the community
									</GovSidebarCard>
									:
									<GovSidebarCard className='flex items-center'>
										You Voted: { lastVote == 'aye' ? <LikeFilled className='text-aye_green ml-2' /> : <DislikeFilled className='text-nay_red ml-2' /> }
										<span className={`last-vote-text ${lastVote == 'aye' ? 'green-text' : 'red-text'}`}>{lastVote}</span>
									</GovSidebarCard>
									: <></>
								}
							</div>
						</>
					}

					{isTipProposal && canVote &&
					<GovSidebarCard>
						<EndorseTip
							accounts={accounts}
							address={address}
							getAccounts={getAccounts}
							tipHash={onchainId as string}
							onAccountChange={onAccountChange}
						/>
						<TipInfo who={onchainTipProposal?onchainTipProposal?.[0]?.who: ''} onChainId={onchainId as string}/>
					</GovSidebarCard>
					}

					{isBounty && <>
						<BountyChildBounties onchainId={Number(onchainId)} />
					</>
					}
				</Form>
			</div>
			}
		</>
	);
};

export default styled(GovernanceSideBar)`
	.edit-icon-wrapper{
		transition: all 0.5s;
	}
	.edit-icon-wrapper .edit-icon{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 20px;
		display: none;
	}
	.edit-icon-wrapper:hover{
		background-image: linear-gradient(to left, #E5007A, #ffffff);
	}
	.edit-icon-wrapper:hover .edit-icon{
		display: block;
	}
`;
