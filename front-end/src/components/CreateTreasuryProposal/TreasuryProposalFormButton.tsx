// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckCircleFilled, DownOutlined, UpOutlined, WarningFilled } from '@ant-design/icons';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';
import { Button, Divider, Form, Input, Modal, Tooltip } from 'antd';
import BN from 'bn.js';
import React, { useContext, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddPolkassemblyProposalMutation } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { chainProperties } from 'src/global/networkConstants';
import { LoadingStatusType, NotificationStatus } from 'src/types';
import BalanceInput from 'src/ui-components/BalanceInput';
import Card from 'src/ui-components/Card';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import queueNotification from 'src/ui-components/QueueNotification';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';
import styled from 'styled-components';

import { PolkassemblyProposalTypes } from '../../types';
import AddressComponent from '../../ui-components/Address';
import { inputToBn } from '../../util/inputToBn';
import ContentForm from '../ContentForm';
import TitleForm from '../TitleForm';

const currentNetwork = getNetwork();

const minimumBond = chainProperties[currentNetwork].tokenSymbol === 'SEL' ? '100.0000 SEL' : '66.66 mKSM';

interface Props {
	className?: string
	// setTipModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

enum AvailableAccountsInput {
	submitWithAccount,
	beneficiary
}

const TreasuryProposalFormButton = ({
	className
	// setTipModalOpen,
} : Props) => {

	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);
	const [availableAccounts, setAvailableAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [showAvailableAccountsObj, setShowAvailableAccountsObj] = useState<{ [key: string]: boolean}>({
		'beneficiary': false,
		'submitWithAccount': false
	});
	const [submitWithAccount, setSubmitWithAccount] = useState<string>('');
	const [beneficiaryAccount, setBeneficiaryAccount] = useState<string>('');
	const [value, setValue] = useState<BN>(new BN(0));
	const [postTitle, setPostTitle] = useState<string>('');
	const [postDescription, setPostDescription] = useState<string>('');
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message:'' });
	const [addPolkassemblyProposalMutation] = useAddPolkassemblyProposalMutation();

	const [errorsFound, setErrorsFound] = useState<string[]>(['']);

	const { id } = useContext(UserDetailsContext);

	const handleDetect = async (updateForInput: AvailableAccountsInput) => {
		const extensions = await web3Enable(APPNAME);
		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			return;
		} else {
			setExtensionNotAvailable(false);
		}

		const allAccounts = await web3Accounts();
		setAvailableAccounts(allAccounts);

		const availableAccountsObj : { [key: string]: boolean } = {
			'beneficiary': false,
			'submitWithAccount': false
		};

		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			availableAccountsObj.submitWithAccount = !showAvailableAccountsObj['submitWithAccount'];
			break;
		case AvailableAccountsInput.beneficiary:
			availableAccountsObj.beneficiary = !showAvailableAccountsObj['beneficiary'];
			break;
		}

		setShowAvailableAccountsObj(availableAccountsObj);
	};

	const isSelected = (updateForInput: AvailableAccountsInput, address: string) => {
		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			return submitWithAccount === address;
		case AvailableAccountsInput.beneficiary:
			return beneficiaryAccount === address;
		}
	};

	const handleSelectAvailableAccount = (updateForInput: AvailableAccountsInput, address: string) => {
		switch (updateForInput) {
		case AvailableAccountsInput.submitWithAccount:
			setSubmitWithAccount(address);
			break;
		case AvailableAccountsInput.beneficiary:
			setBeneficiaryAccount(address);
		}

		// Close dropdown on select
		const availableAccountsObj : { [key: string]: boolean } = {
			'beneficiary': false,
			'submitWithAccount': false
		};
		setShowAvailableAccountsObj(availableAccountsObj);
	};

	const getAvailableAccounts = (updateForInput: AvailableAccountsInput) => {
		return (
			<div className=' w-full pl-[1.5em] pr-[1em]'>
				{availableAccounts.map(account => {
					const address = getEncodedAddress(account.address);

					return address &&
							<div key={address} onClick={() => handleSelectAvailableAccount(updateForInput, address)} className=' mb-[10px] flex justify-between items-center cursor-pointer'>
								<div className='item'>
									<AddressComponent className='item' address={address} extensionName={account.meta.name} />
								</div>
								{isSelected(updateForInput, address) ? <CheckCircleFilled style={{ color:'green' }} />: <div style={{ border:'1px solid grey', borderRadius:'50%', height:'1em', width:'1em' }}></div>}
							</div>;
				})}
			</div>
		);
	};

	const onBalanceChange = (balance: BN) => setValue(balance);

	const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {setPostTitle(event.currentTarget.value); return event.currentTarget.value;};
	const onPostDescriptionChange = (data: string) => {setPostDescription(data); return data.length ? data : null;};

	const isFormValid = () => {
		const errorsFound: string[] = [''];

		if(!beneficiaryAccount){
			errorsFound.push('beneficiaryAccount');
		}
		if(!submitWithAccount){
			errorsFound.push('submitWithAccount');
		}

		const [balance, isValid] = inputToBn(`${value}`, false);
		if(!isValid){
			return false;
		}else{
			setValue(balance);
		}

		if(errorsFound.length > 0){
			setErrorsFound(errorsFound);
			return false;
		}else{
			setErrorsFound([]);
		}

		return true;
	};
	const { api, apiReady } = useContext(ApiContext);

	const saveProposal = async (authorId: number, proposalType: number, title: string, content: string, proposalHash: string, proposerAddress: string) => {

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const proposalId: number = ((await api.query.treasury.proposalCount()) as any).toNumber();

		addPolkassemblyProposalMutation({ variables: { authorId, content, proposalHash, proposalId, proposalType, proposerAddress, title } }).catch((e) => console.error('Error creating to proposal',e));
	};

	const handleSignAndSubmit = async () => {

		if(!isFormValid()) return;

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const injected = await web3FromSource(availableAccounts[0].meta.source);

		api.setSigner(injected.signer);

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });
		try {
			const proposal = api.tx.treasury.proposeSpend(value, beneficiaryAccount);
			proposal.signAndSend(submitWithAccount, ({ status }) => {
				if (status.isInBlock) {
					queueNotification({
						header: 'Success!',
						message: `Propsal #${proposal.hash} successful.`,
						status: NotificationStatus.SUCCESS
					});
					setLoadingStatus({ isLoading: false, message: '' });
					console.log(`Completed at block hash #${status.asInBlock.toString()}`);
					setModalOpen(false);
					const authorId = id;
					if (!authorId){
						return;
					}
					saveProposal(authorId, PolkassemblyProposalTypes.TreasurySpendProposal, postTitle, postDescription, proposal.hash.toString(), submitWithAccount);
				} else {
					if (status.isBroadcast){
						setLoadingStatus({ isLoading: true, message: 'Broadcasting the endorsement' });
					}
					console.log(`Current status: ${status.type}`);
				}
			}).catch((error) => {
				setLoadingStatus({ isLoading: false, message: '' });
				console.log(':( transaction failed');
				console.error('ERROR:', error);
				setModalOpen(false);
				queueNotification({
					header: 'Failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
			});
		}
		catch(error){
			setLoadingStatus({ isLoading: false, message: '' });
			console.log(':( transaction failed');
			console.error('ERROR:', error);
			setModalOpen(false);
			queueNotification({
				header: 'Failed!',
				message: error.message,
				status: NotificationStatus.ERROR
			});
		}
	};

	const triggerBtn = <Button disabled={!id} className='w-full rounded-md h-[40px] md:h-[69px] bg-pink_primary hover:bg-pink_secondary transition-colors duration-300 text-white'  onClick={() => setModalOpen(true)}> Create Treasury Proposal</Button>;
	const triggerBtnLoginDisabled = <Tooltip  color='#E5007A' title='Please signup/login to create treasury proposal'> <Button type='primary' disabled={true} className='w-full h-[40px] md:h-[69px] rounded-md' > Create Treasury Proposal</Button></Tooltip>;

	return (
		loadingStatus.isLoading
			? <Card className={'LoaderWrapper'}>
				<Loader text={loadingStatus.message}/>
			</Card>:
			<>
				{!id ? triggerBtnLoginDisabled : triggerBtn}

				<Modal
					className={className}
					onCancel={() => setModalOpen(false)}
					centered
					title='Create Treasury Proposal'
					footer={[
						<Button key='submit'  className='bg-pink_primary text-white' onClick={handleSignAndSubmit}>Sign &amp; Submit</Button>
					]}
					open={modalOpen}
				>
					<div>
						<div className='modal-desc'>
							<Form className='identity-form'>
								<div>
									{/* Submit with account */}
									<div className=' mb-[1.5em]'>
										<label className='mb-3 font-bold flex items-center text-sm text-sidebarBlue'>
													Submit with account
											<HelperTooltip className='ml-2' text='This account will make the proposal and be responsible for the bond.' />
										</label>

										<div className=' flex items-center'>
											<Identicon
												className='z-10 absolute left-8'
												value={submitWithAccount}
												size={26}
												theme={'polkadot'}
											/>
											<Form.Item className=' mb-0 w-full' validateStatus={errorsFound.includes('submitWithAccount') ? 'error' : ''}>
												<Input
													value={submitWithAccount}
													className={`${submitWithAccount === '' ? 'px-[0.5em]' : 'pl-10'}`}
													onChange={ (e) => setSubmitWithAccount(e.target.value)}
													placeholder='Account Address'
												// error={errorsFound.includes('submitWithAccount')}
												/>

											</Form.Item>
										</div>

										{!extensionNotAvailable && <div className=' flex justify-between mb-[1em]'>
											<div onClick={() => handleDetect(AvailableAccountsInput.submitWithAccount)} className=' text-pink_primary cursor-pointer ml-[1.5em] mt-[0.25em]'>
														or choose from available addresses
												{showAvailableAccountsObj['submitWithAccount'] ? <UpOutlined className='ml-1 align-middle' /> : <DownOutlined className='ml-1 align-middle'/>}
											</div>
										</div>}
										{extensionNotAvailable && <div className="error">Please install polkadot.js extension</div>}
										{showAvailableAccountsObj['submitWithAccount'] && availableAccounts.length > 0 && getAvailableAccounts(AvailableAccountsInput.submitWithAccount)}
									</div>

									{/* Beneficiary account */}
									<>
										<div  className='mb-[1.5em]'>
											<label className=' mb-3 font-bold flex items-center text-sm text-sidebarBlue'>
													Beneficiary Account
												<HelperTooltip className='ml-2' text='The beneficiary will receive the full amount if the proposal passes.' />
											</label>

											<div className=' flex items-center'>
												<Identicon
													className='z-10 absolute left-8'
													value={beneficiaryAccount}
													size={26}
													theme={'polkadot'}
												/>
												<Form.Item className=' mb-0 w-full' validateStatus={errorsFound.includes('beneficiaryAccount') ? 'error' : ''}>
													<Input
														value={beneficiaryAccount}
														className={`${beneficiaryAccount === '' ? 'px-[0.5em]' : 'pl-10'}`}
														onChange={ (e) => setBeneficiaryAccount(e.target.value)}
														placeholder='Account Address'
													/>

												</Form.Item>
											</div>

											{!extensionNotAvailable && <div className=' flex justify-between mb-[1em]'>
												<div onClick={() => handleDetect(AvailableAccountsInput.beneficiary)} className=' text-pink_primary cursor-pointer ml-[1.5em] mt-[0.25em]'>
														or choose from available addresses
													{showAvailableAccountsObj['beneficiary'] ? <UpOutlined className='ml-1 align-middle' /> : <DownOutlined className='ml-1 align-middle'/>}
												</div>
											</div>}
											{extensionNotAvailable && <div className="error">Please install polkadot.js extension</div>}
											{showAvailableAccountsObj['beneficiary'] && availableAccounts.length > 0 && getAvailableAccounts(AvailableAccountsInput.beneficiary)}
										</div>
									</>

									{/* Value */}
									<div className='flex items-center mb-[1.5em]'>
										<BalanceInput
											label={'Value'}
											helpText={'The value is the amount that is being asked for and that will be allocated to the beneficiary if the proposal is approved.'}
											placeholder={'0'}
											className=' w-full m-0'
											onChange={onBalanceChange}
											size='middle'
										/>
										<span className='ml-1 mt-8'>
											{chainProperties[currentNetwork].tokenSymbol}
										</span>
									</ div>

									{/* Proposal Bond */}
									<div className='mb-[1.5em]'>
										<label className='mb-3 font-bold flex items-center text-sm text-sidebarBlue'>
													Proposal Bond
											<HelperTooltip className='ml-2' text='Of the beneficiary amount, at least 5.00% would need to be put up as collateral. The maximum of this and the minimum bond will be used to secure the proposal, refundable if it passes.' />
										</label>

										<Input
											className=' hide-pointer'
											value='5.00%'
										/>
									</div>

									{/* Minimum Bond */}
									<div className='mb-[1.5em]'>
										<label className=' mb-3 font-bold flex items-center text-sm text-sidebarBlue'>
												Minimum Bond
											<HelperTooltip className='ml-2' text='The minimum amount that will be bonded.' />
										</label>

										<Input
											className=' hide-pointer'
											value={minimumBond}
										/>
									</div>

									<p><WarningFilled /> Be aware that once submitted the proposal will be put to a council vote. If the proposal is rejected due to a lack of info, invalid requirements or non-benefit to the network as a whole, the full bond posted (as describe above) will be lost.</p>
								</div>
								<Divider className='my-[1.5em]' />

								<div >
									<TitleForm
										onChange={onTitleChange}
									/>
									<ContentForm
										onChange={onPostDescriptionChange}
									/>
								</div>
							</Form>
						</div>
					</div>
				</Modal>
			</>
	);

};

export default styled(TreasuryProposalFormButton)`


	.textarea-input {
		min-height: 100;
		margin-left: 1.5em !important;
	}

	.hide-pointer{
		pointer-events:none;
	}

	/* Hides Increment Arrows in number input */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type=number] {
		-moz-appearance: textfield;
	}
`;

