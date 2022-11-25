// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Button, Timeline } from 'antd';
import BN from 'bn.js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PASmallCirclePNG from 'src/assets/pa-small-circle.png';
import { CommentFieldsFragment, DiscussionPostFragment, Exact, MotionPostFragment,ProposalPostFragment, ReferendumPostFragment,  TreasuryProposalPostFragment } from 'src/generated/graphql';
import { useCurrentBlock } from 'src/hooks';
import Markdown from 'src/ui-components/Markdown';
import blockToTime from 'src/util/blockToTime';

import CreateOptionPoll from '../ActionsBar/OptionPoll/CreateOptionPoll';
import PostReactionBar from '../ActionsBar/Reactionbar/PostReactionBar';
import ReportButton from '../ActionsBar/ReportButton';
import ShareButton from '../ActionsBar/ShareButton';
import SubscriptionButton from '../ActionsBar/SubscriptionButton/SubscriptionButton';
import Comments from '../Comment/Comments';
import PostCommentForm from '../PostCommentForm';

interface Props {
	className?: string;
	canEdit: boolean | '' | undefined;
	id: number | null | undefined;
	isEditing: boolean;
	isOnchainPost: boolean;
	post: DiscussionPostFragment | ProposalPostFragment | ReferendumPostFragment| TreasuryProposalPostFragment| MotionPostFragment;
	toggleEdit: () => void
	TrackerButtonComp: JSX.Element
	Sidebar: ({ className }: {className?: string | undefined;}) => JSX.Element
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

interface ITimeline {
	isToday?: boolean;
	date: moment.Moment;
	status: string;
	id: number;
}

const getTimelineDate = (no: number, currentBlock: BN) => {
	const time = blockToTime(currentBlock.toNumber() - no);
	const timeArr = time.split(' ');
	const days = Number(timeArr[0].replace('d', ''));
	const hours = Number(timeArr[1].replace('h', ''));
	const minutes = Number(timeArr[2].replace('m', ''));
	const duration = moment.duration({ 'days': days, 'hours': hours, 'minutes': minutes });
	const date = moment().utc().subtract(duration);
	return date;
};

const PostDescription = ({ className, canEdit, id, isEditing, isOnchainPost, post, refetch, toggleEdit, Sidebar, TrackerButtonComp } : Props) => {
	const { content, onchain_link } = post;
	const currentBlock = useCurrentBlock();

	const [timeline, setTimeline] = useState(0);
	const [comments, setComments] = useState<CommentFieldsFragment[]>([]);
	useEffect(() => {
		setComments(post?.comments?.filter((_, index) => {
			return index < 8;
		}));
	}, [post?.comments]);

	const [timelines, setTimelines] = useState<ITimeline[]>([]);

	useEffect(() => {
		if (onchain_link && currentBlock) {
			const timelines: ITimeline[] = [];
			const { onchain_proposal, onchain_referendum, onchain_treasury_spend_proposal, onchain_tech_committee_proposal, onchain_motion } = onchain_link as any;

			if (onchain_proposal?.length > 0) {
				const obj = onchain_proposal[0]?.proposalStatus?.[0];
				timelines.push({
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Proposal'
				});
			}
			if (onchain_referendum?.length > 0) {
				const obj = onchain_referendum[0]?.referendumStatus?.[0];
				timelines.push({
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Referendum'
				});
			}
			if (onchain_treasury_spend_proposal?.length > 0) {
				const obj = onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0];
				timelines.push({
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Treasury Proposal'
				});
			}
			if (onchain_motion?.length > 0) {
				const obj = onchain_motion[0]?.motionStatus?.[0];
				timelines.push({
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Motion'
				});
			}
			if (onchain_tech_committee_proposal?.length > 0) {
				const obj = onchain_tech_committee_proposal[0]?.status?.[0];
				timelines.push({
					date: getTimelineDate(obj?.blockNumber?.number, currentBlock),
					id: timelines.length + 1,
					status: 'Tech. Comm. Proposal'
				});
			}
			const newTimelines = timelines.sort((a, b) => b.date.diff(a.date));
			if (newTimelines.length > 0) {
				if (newTimelines[0].date.isAfter(moment().subtract(1, 'days'))) {
					newTimelines[0].isToday = true;
					newTimelines[0].id = 0;
				} else {
					newTimelines.unshift({
						date: moment(),
						id: 0,
						isToday: true,
						status: ''
					});
				}
			}
			setTimelines(newTimelines);
		}
	}, [onchain_link, currentBlock]);

	return (
		<div className={`${className} mt-4`}>
			{content && <Markdown md={content} />}

			{/* Actions Bar */}
			<div id='actions-bar' className={`flex md:items-center mt-9 ${canEdit && 'flex-col'} md:flex-row mb-8`}>
				<div className='flex items-center'>
					<PostReactionBar className='reactions' postId={post.id} />
					{id && !isEditing && <SubscriptionButton postId={post.id}/>}
					{canEdit && <Button className={'text-pink_primary flex items-center border-none shadow-none px-1.5'} onClick={toggleEdit}><FormOutlined />Edit</Button>}
				</div>
				<div className='flex items-center'>
					{id && !isEditing && !isOnchainPost && <ReportButton type='post' contentId={`${post.id}`} />}
					{canEdit && !isEditing && <CreateOptionPoll postId={post.id} />}
					{TrackerButtonComp}
					<ShareButton title={post.title} />
				</div>
			</div>

			{!isEditing && <div className='flex xl:hidden mb-8 mx-2'><Sidebar /></div>}

			<div className='flex relative'>
				{
					onchain_link && !!post.comments?.length && currentBlock && timelines.length > 0 &&
					<div style={{
						height: `${window.innerHeight}px`
					}} className='hidden xl:flex mr-4 min-w-[100px] -ml-4 sticky top-[10%] pt-10 xl:items-center'>
						<Timeline className='flex flex-col h-full w-full' mode='right'>
							{timelines.map(({ date, id, isToday, status }) => {
								return (<Timeline.Item style={{
									height: '100%'
								}} dot={timeline === id && <img style={ { maxWidth:'20px' } } src={PASmallCirclePNG} />} color={`${timeline === id? '#334D6E':'#90A0B7'}`} key={id}>
									<button onClick={() => {
										setTimeline(id);
										setComments(
											isToday
												?post?.comments?.filter((_, index) => {
													return index < 8;
												})
												:comments.filter((comment) => {
													const commentDate = moment(comment?.updated_at);
													const index = timelines.findIndex((v) => (v.id === id));
													if (index === timelines.length - 1) {
														return commentDate.isSameOrBefore(timelines[index].date);
													} else {
														return commentDate.isSameOrBefore(timelines[index].date) && commentDate.isAfter(timelines[index + 1].date);
													}
												}));
									}} className={`text-xs flex flex-col border-none outline-none items-end w-full ${timeline === id? 'text-sidebarBlue':'text-navBlue'}`}>
										{
											isToday
												?<span>Today</span>
												:<>
													<span>{date.format('MMM Do')}</span>
													<span className='text-right'>{status}</span>
												</>
										}
									</button>
								</Timeline.Item>);
							})}
						</Timeline>
					</div>
				}

				<div className='w-full'>
					<div className='text-sidebarBlue text-sm font-medium mb-5'>{comments.length} comments</div>
					{ id && <PostCommentForm postId={post.id} refetch={refetch} /> }

					{ !!comments?.length &&
						<>
							<Comments
								className='ml-0 xl:ml-4 xl:max-w-[490px] 2xl:max-w-[100%]'
								comments={comments}
								refetch={refetch}
							/>
							{post?.comments.length > 8 ?<div>
								<Button
									className='border-none outline-none bg-transparent shadow-none text-sm font-medium text-sidebarBlue'
									onClick={() => setComments(post?.comments)}
								>
									Load {post?.comments.length - comments.length} older comments
								</Button>
							</div>: null}
						</>
					}
				</div>
			</div>

		</div>
	);
};

export default PostDescription;