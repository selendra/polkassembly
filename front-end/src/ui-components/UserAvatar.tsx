// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Avatar } from 'antd';
import { AvatarSize } from 'antd/lib/avatar/SizeContext';
import React, { useEffect, useState } from 'react';
import { Profile, useGetUserDetailsLazyQuery } from 'src/generated/graphql';

interface Props {
	className?: string
	username: string | null
	id: number | null
	size?: AvatarSize;
}

const UserAvatar = ({ className, id, username, size }: Props) => {
	const [userProfileData, setUserProfileData] = useState<Profile | null>(null);

	const [refetch, { data }] = useGetUserDetailsLazyQuery({
		variables: {
			user_id: Number(id)
		}
	});

	useEffect(() => {
		if(!data?.userDetails) return;
		setUserProfileData(data?.userDetails);
	}, [data]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		userProfileData?.image ? <Avatar className={className} src={userProfileData?.image} size={size} />
			: <Avatar className={`${className} bg-gray-300`} size={size} shape='circle'>{username?.substring(0, 1)}</Avatar>
	);
};

export default UserAvatar;
