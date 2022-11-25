// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from '@xstyled/styled-components';
import { Button, Form, Input, Modal, Select } from 'antd';
import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import { useDeleteAccountMutation, useLogoutMutation } from 'src/generated/graphql';
import { logout } from 'src/services/auth.service';
import { NotificationStatus } from 'src/types';
import FilteredError from 'src/ui-components/FilteredError';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';

import Header from './Header';

const Delete: FC<{className?: string}> = ({ className }) => {
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [isOther,setIsOther] = useState(false);
	const [deleteAccountMutation, { loading }] = useDeleteAccountMutation();
	const [form] = Form.useForm();
	const [logoutMutation] = useLogoutMutation();
	const { setUserDetailsContextState } = useUserDetailsContext();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutMutation();
		} catch (error) {
			console.error(error);
		}
		logout(setUserDetailsContextState);
		navigate('/');
	};

	const handleSubmit = (data: any) => {
		if (data?.password) {
			deleteAccountMutation({
				variables: {
					password: data?.password
				}
			})
				.then(handleLogout)
				.catch((e: any) => {
					setError(cleanError(e.message));
					queueNotification({
						header: 'Failed!',
						message: cleanError(e.message),
						status: NotificationStatus.ERROR
					});
					console.error('Delete account error', e);
				});
		}
	};
	const openModal = () => {
		setShowModal(true);
	};

	const dismissModal = () => {
		form.resetFields();
		setError('');
		setShowModal(false);
	};
	const Title = <span className='font-medium text-lg tracking-wide text-sidebarBlue'>Delete Account</span>;
	const { Option } = Select;
	return (
		<Form className={className} form={form} onFinish={handleSubmit}>
			<Header heading='Delete Account' subHeading='Once you delete your account, there is no going back. Please be certain.' />
			<Modal
				closable={false}
				title={Title}
				open={showModal}
				footer={[
					<Button
						htmlType='submit'
						key="delete"
						onClick={() => {
							form.submit();
						}}
						loading={loading}
						className='rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 inline-flex items-center justify-center bg-pink_primary'
					>
                            Delete
					</Button>,
					<Button
						key="cancel"
						onClick={dismissModal}
						className='rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 inline-flex items-center justify-center bg-pink_primary'
					>
                            Cancel
					</Button>
				]}
				className={className}
			>
				{error && <div className='mb-4'><FilteredError text={error}/></div>}
				<article>
					<label
						className="text-sm text-sidebarBlue font-normal tracking-wide leading-6"
						htmlFor="reason"
					>
                            Why are you deleting your account?
					</label>
					<Form.Item
						name="reason"
						className='m-0 mt-2.5'
					>
						<Select
							onChange={(value) => {
								if (value === 'other'){
									setIsOther(true);
								} else {
									if (isOther){
										setIsOther(false);
									}
								}
							}}
							size='large'
							placeholder='Select a reason'
							className='rounded-md border-grey_border select-reason'
						>
							<Option value="I use another platform for my governance needs">
                                I use another platform for my governance needs
							</Option>
							<Option value="I do not hold any SEL and would not be using Polkassembly anymore">
                                I do not hold any SEL and would not be using Polkassembly.
							</Option>
							<Option value="I have a duplicate account">
                                I have a duplicate account
							</Option>
							<Option htmlFor='other' value='other'>
                                Other
							</Option>
						</Select>
					</Form.Item>
					{
						isOther ? (
							<Form.Item
								name='other'
								className='mt-4'
							>
								<Input.TextArea
									placeholder='Other reason'
									id='other'
								/>
							</Form.Item>
						): null
					}
				</article>
				<article className='mt-12'>
					<label
						className="text-sm text-sidebarBlue font-normal tracking-wide leading-6"
						htmlFor="password"
					>
                            To continue, re-enter your password
					</label>
					<Form.Item
						name="password"
						className='m-0 mt-2.5'
					>
						<Input.Password
							placeholder='Password'
							className="rounded-md py-3 px-4 border-grey_border"
							id="password"
						/>
					</Form.Item>
					<div className="text-right text-pink_primary my-2.5">
						<Link onClick={dismissModal} to="/request-reset-password">
                                Forgot Password?
						</Link>
					</div>
				</article>
			</Modal>
			<Button
				onClick={openModal}
				htmlType="submit"
				className='mt-5 rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 flex items-center justify-center bg-red_primary'
			>
                    Delete My Account
			</Button>
		</Form>
	);
};

export default styled(Delete)`
.ant-select-item-option-content {
  white-space: unset !important;
  background-color: red !important;
}
`;