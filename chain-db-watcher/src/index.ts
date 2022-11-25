// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { execute } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import chalk from 'chalk';
import dotenv from 'dotenv';
import http from 'http';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';

import {
	addDiscussionPostAndBounty,
	addDiscussionPostAndChildBounty,
	addDiscussionPostAndMotion,
	addDiscussionPostAndProposal,
	addDiscussionPostAndReferendumV2,
	addDiscussionPostAndTechCommitteeProposal,
	addDiscussionPostAndTip,
	addDiscussionPostAndTreasuryProposal,
	addDiscussionReferendum,
	bountyDiscussionExists,
	childBountyDiscussionExists,
	motionDiscussionExists,
	proposalDiscussionExists,
	referendumV2DiscussionExists,
	techCommitteeProposalDiscussionExists,
	tipDiscussionExists,
	treasuryProposalDiscussionExists,
	updateDiscussionReferendumV2Status,
	updateTreasuryProposalWithMotion
} from './graphql_helpers';
import { bountySubscription, childBountySubscription, motionSubscription, proposalSubscription, referendumStatusV2Subscription, referendumSubscription, referendumV2Subscription, techCommitteeProposalSubscription, tipSubscription, treasurySpendProposalSubscription } from './queries';
import { syncDBs } from './sync';
import { getMotionTreasuryProposalId } from './sync/utils';

dotenv.config();

const subscriptionMutation = {
	Created: 'CREATED'
};
const eventStatus = {
	Started: 'Started'
};

const graphQLEndpoint = process.env.CHAIN_DB_GRAPHQL_URL;
const startBlock = Number(process.env.START_FROM) || 0;

const startSubscriptions = (client: SubscriptionClient): void => {
	// leave next, error, complete in this order
	/* eslint-disable sort-keys */
	const link = new WebSocketLink(client);

	execute(link, {
		query: tipSubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Tip data received', JSON.stringify(data, null, 2));

			if (data?.tip.mutation === subscriptionMutation.Created) {
				const { hash, finder } = data.tip.node;
				tipDiscussionExists(hash).then(alreadyExist => {
					if (!alreadyExist) {
						addDiscussionPostAndTip({ onchainTipHash: hash, proposer: finder });
					} else {
						console.error(chalk.red(`✖︎ Tip id ${hash} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (tip) error: ${error}`); },
		complete: () => {
			console.log('Subscription (tip) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: treasurySpendProposalSubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Treasury data received', JSON.stringify(data, null, 2));

			if (data?.treasurySpendProposal.mutation === subscriptionMutation.Created) {
				const { treasuryProposalId, proposer } = data.treasurySpendProposal.node;
				treasuryProposalDiscussionExists(treasuryProposalId).then(alreadyExist => {
					if (!alreadyExist) {
						addDiscussionPostAndTreasuryProposal({ onchainTreasuryProposalId: Number(treasuryProposalId), proposer });
					} else {
						console.error(chalk.red(`✖︎ Treasury Proposal id ${treasuryProposalId.toString()} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (treasury) error: ${error}`); },
		complete: () => {
			console.log('Subscription (treasury) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: bountySubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Bounty data received', JSON.stringify(data, null, 2));

			if (data?.bounty?.mutation === subscriptionMutation.Created) {
				const { bountyId, proposer } = data.bounty.node;
				bountyDiscussionExists(bountyId).then(alreadyExist => {
					if (!alreadyExist) {
						addDiscussionPostAndBounty({ onchainBountyId: Number(bountyId), proposer });
					} else {
						console.error(chalk.red(`✖︎ Bounty id ${bountyId.toString()} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (bounty) error: ${error}`); },
		complete: () => {
			console.log('Subscription (bounty) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: childBountySubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Child bounty data received', JSON.stringify(data, null, 2));

			if (data?.childBounty?.mutation === subscriptionMutation.Created) {
				const { childBountyId, proposer } = data.childBounty.node;
				childBountyDiscussionExists(childBountyId).then(alreadyExist => {
					if (!alreadyExist) {
						addDiscussionPostAndChildBounty({ onchainChildBountyId: Number(childBountyId), proposer });
					} else {
						console.error(chalk.red(`✖︎ Child bounty id ${childBountyId.toString()} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (childBounty) error: ${error}`); },
		complete: () => {
			console.log('Subscription (childBounty) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: techCommitteeProposalSubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('TechCommitteeProposal data received', JSON.stringify(data, null, 2));

			if (data?.techCommitteeProposal.mutation === subscriptionMutation.Created) {
				const { proposalId, author } = data.techCommitteeProposal.node;
				techCommitteeProposalDiscussionExists(proposalId).then(alreadyExist => {
					if (!alreadyExist) {
						addDiscussionPostAndTechCommitteeProposal({ onchainTechCommitteeProposalId: Number(proposalId), proposer: author });
					} else {
						console.error(chalk.red(`✖︎ tech committee proposal id ${proposalId.toString()} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (techCommitteeProposal) error: ${error}`); },
		complete: () => {
			console.log('Subscription (techCommitteeProposal) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: motionSubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Motion data received', JSON.stringify(data, null, 2));

			if (data?.motion.mutation === subscriptionMutation.Created) {
				const { author, motionProposalId, motionProposalArguments, section } = data.motion.node;
				motionDiscussionExists(motionProposalId).then(alreadyExist => {
					if (!alreadyExist) {
						const treasuryProposalId = getMotionTreasuryProposalId(section, motionProposalArguments);
						const onchainMotionProposalId = Number(motionProposalId);

						if (treasuryProposalId || treasuryProposalId === 0) {
							// the motion comes from a treasury proposal
							updateTreasuryProposalWithMotion({ onchainMotionProposalId, onchainTreasuryProposalId: treasuryProposalId });
						} else {
							// the motion was created by a council member
							addDiscussionPostAndMotion({ onchainMotionProposalId, proposer: author });
						}
					} else {
						console.error(chalk.red(`✖︎ Motion id ${motionProposalId.toString()} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (motion) error: ${error}`); },
		complete: () => {
			console.log('Subscription (motion) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: proposalSubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Proposal data received', JSON.stringify(data, null, 2));

			if (data?.proposal.mutation === subscriptionMutation.Created) {
				const { proposalId, author } = data.proposal.node;
				proposalDiscussionExists(proposalId).then(alreadyExist => {
					if (!alreadyExist) {
						addDiscussionPostAndProposal({ onchainProposalId: Number(proposalId), proposer: author });
					} else {
						console.error(chalk.red(`✖︎ Proposal id ${proposalId.toString()} already exists in the discsussion db. Not inserted.`));
					}
				}).catch(error => console.error(chalk.red(error)));
			}
		},
		error: error => { throw new Error(`Subscription (proposal) error: ${error}`); },
		complete: () => {
			console.log('Subscription (proposal) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: referendumSubscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('Referendum data received', JSON.stringify(data, null, 2));

			if (data?.referendum.mutation === subscriptionMutation.Created) {
				const {
					preimageHash,
					referendumId,
					referendumStatus
				} = data?.referendum?.node;

				// At referendum creation, there should be only
				// a "Started" status event.
				if (!(referendumStatus?.[0]?.status === eventStatus.Started)) {
					console.error(
						chalk.red(
							`Referendem with id ${referendumId.toString()} has an unexpected status. Expect "${eventStatus.Started}", got ${referendumStatus?.[0]?.status}."`
						)
					);
					return;
				}

				if (!preimageHash) {
					throw new Error(`Unexpect preimage hash, got ${preimageHash}`);
				}

				if (!referendumId && referendumId !== 0) {
					throw new Error(`Unexpect referendumId, got ${referendumId}`);
				}

				addDiscussionReferendum({
					preimageHash,
					referendumCreationBlockNumber: referendumStatus?.[0]?.blockNumber?.number,
					referendumId
				}).catch(e => {
					console.error(chalk.red(e));
				});
			}
		},
		error: error => { throw new Error(`Subscription (proposal) error: ${error}`); },
		complete: () => {
			console.log('Subscription (proposal) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: referendumV2Subscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('ReferendumV2 data received', JSON.stringify(data, null, 2));
			if (data?.referendmV2.mutation === subscriptionMutation.Created) {
				const {
					referendumId,
					referendumStatus,
					origin,
					trackNumber,
					preimage,
					submitted
				} = data?.referendmV2?.node;

				let author = null;

				try {
					author = submitted?.who;
				} catch {
					console.log('error getting author for referendumV2 submitted not present', JSON.stringify(data?.referendmV2?.node));
				}

				addDiscussionPostAndReferendumV2({
					trackNumber,
					origin,
					status: referendumStatus,
					referendumId,
					proposer: author || preimage?.author
				}).catch(e => {
					console.error(chalk.red(e));
				});
			}
		},
		error: error => { throw new Error(`Subscription (referendumV2) error: ${JSON.stringify(error)}`); },
		complete: () => {
			console.log('Subscription (referendumV2) completed');
			process.exit(1);
		}
	});

	execute(link, {
		query: referendumStatusV2Subscription,
		variables: { startBlock }
	}).subscribe({
		next: ({ data }): void => {
			console.log('ReferendumStatusV2 data received', JSON.stringify(data, null, 2));
			const {
				referendum,
				status
			} = data?.referendumStatusV2?.node;

			referendumV2DiscussionExists(referendum.refendumId).then(alreadyExist => {
				if (!alreadyExist) {
					throw new Error(`Status recieved for refendumId ${referendum.refendumId} which is not present in discussion db`);
				} else {
					updateDiscussionReferendumV2Status({
						referendumId: referendum.refendumId,
						status
					});
				}
			}).catch(error => console.error(chalk.red(error)));
		},
		error: error => { throw new Error(`Subscription (referendumStatusV2) error: ${JSON.stringify(error)}`); },
		complete: () => {
			console.log('Subscription (referendumStatusV2) completed');
			process.exit(1);
		}
	});
};

async function main (): Promise<void> {
	if (!graphQLEndpoint) {
		console.error(
			chalk.red('GraphQL endpoint not set in environment variables!')
		);
		return;
	}

	const syncMessage = `🔄 Syncing chain-db and discussion-db using ${graphQLEndpoint}, from block ${startBlock}...`;

	console.log(syncMessage);
	await syncDBs();

	const client = new SubscriptionClient(
		graphQLEndpoint,
		{
			connectionCallback: (error): void => { if (error) console.error('connectionCallback', error); },
			reconnect: true,
			timeout: 30000
		},
		ws);

	client.onConnecting(() => { console.log('---> Connecting...'); });
	client.onConnected(() => { console.log('---> Connected'); });
	client.onError((error) => { console.error('---> WS Client error', error); });
	client.onDisconnected(() => { console.log('---> Disconnected'); });
	client.onReconnecting(() => { console.log('---> Reconnecting...'); });
	client.onReconnected(() => {
		console.log('---> Reconnected');
		console.log(syncMessage);
		syncDBs();
	});

	const resetTimeoutHours = 6; // in hours
	const resetTimeourSeconds = resetTimeoutHours * 3600; // seconds
	console.log(`⏰ Reset setup every ${resetTimeoutHours} hours`);
	startSubscriptions(client);
	setInterval(() => {
		console.log('⏰ Planned connection reset.');
		client.unsubscribeAll();
		client.close();
		console.log(syncMessage);
		syncDBs();
		startSubscriptions(client);
	}, resetTimeourSeconds * 1000);

	console.log(`🚀 Chain-db watcher listening to ${graphQLEndpoint} from block ${startBlock}`);

	const hostname = '0.0.0.0';
	const port = Number(process.env.HEALTH_PORT) || 8019;

	const server = http.createServer((req, res) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end('ok');
	});

	server.listen(port, () => {
		console.log(`[+] Health endpoint available at http://${hostname}:${port}/`);
	});
}

function verifyEnvVariables (): void {
	// HEALTH_PORT and START_FROM are optional, therefor not mentionned here.
	const envs = [
		'REACT_APP_HASURA_GRAPHQL_URL',
		'TREASURY_TOPIC_ID',
		'TECH_COMMITTEE_PROPOSAL_TOPIC_ID',
		'DEMOCRACY_TOPIC_ID',
		'HASURA_PROPOSAL_POST_TYPE_ID',
		'PROPOSAL_BOT_USER_ID',
		'PROPOSAL_BOT_USERNAME',
		'PROPOSAL_BOT_PASSWORD',
		'CHAIN_DB_GRAPHQL_URL',
		'COUNCIL_TOPIC_ID'
	];

	envs.forEach(env => {
		if (!process.env[env]) {
			console.error(chalk.red(`✖︎ Environment variable ${env} not set.`));
		}
	});
}

verifyEnvVariables();
main().catch(error => console.error(chalk.red(error)));
