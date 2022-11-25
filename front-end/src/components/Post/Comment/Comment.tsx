// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UserOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Avatar } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CommentFieldsFragment, Exact } from 'src/generated/graphql';
import CreationLabel from 'src/ui-components/CreationLabel';
import UpdateLabel from 'src/ui-components/UpdateLabel';
import UserAvatar from 'src/ui-components/UserAvatar';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import EditableCommentContent from './EditableCommentContent';
import Replies from './Replies';

interface Props{
	className?: string,
	comment: CommentFieldsFragment,
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

export const Comment = ({ className, comment, refetch } : Props) => {
	const { author, content, created_at, id, replies, updated_at } = comment;
	const { hash } = useLocation();
	const commentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hash === `#${id}`) {
			window.scrollTo(0, commentRef.current?.offsetTop || 0);
		}
	}, [hash, id]);

	if (!author || !author.id || !author.username || !content) return (<div className={`${className} mb-5`}>
		<Avatar className='bg-gray-300' size="large" icon={<UserOutlined />} />

		<div className='comment-content'>
			Comment not available
		</div>
	</div>);

	const defaultAddressField = getDefaultAddressField();
	const defaultAddress = author[defaultAddressField];

	return (
		<div id={id} ref={commentRef} className={`${className} flex gap-x-4 mb-9`}>
			<UserAvatar
				className='tm-1 hidden md:inline-block flex-none'
				username={author.username}
				size='large'
				id={author.id}
			/>
			<div className='w-full pr-5'>
				<CreationLabel
					className='creation-label py-2 px-0 md:px-4 bg-comment_bg rounded-t-md'
					created_at={created_at}
					defaultAddress={defaultAddress}
					text={'commented'}
					username={author.username}
				>
					<UpdateLabel
						created_at={created_at}
						updated_at={updated_at}
					/>
				</CreationLabel>
				<EditableCommentContent
					authorId={author.id}
					created_at={created_at}
					className='rounded-md'
					comment={comment}
					commentId={id}
					content={content}
					refetch={refetch}
				/>
				<Replies className='comment-content' repliesArr={replies} refetch={refetch} />
			</div>
		</div>
	);
};

export default Comment;
