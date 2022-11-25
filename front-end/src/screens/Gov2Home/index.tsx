// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Gov2LatestActivity from 'src/components/Gov2Home/Gov2LatestActivity';
import AboutNetwork from 'src/components/Home/AboutNetwork';
import News from 'src/components/Home/News';
import TreasuryOverview from 'src/components/Home/TreasuryOverview';
import UpcomingEvents from 'src/components/Home/UpcomingEvents';

const Gov2Home = () => {
	return (
		<>
			<h1 className='dashboard-heading'>Overview</h1>

			<div className="mt-6 mx-1">
				<AboutNetwork showGov2Links />
			</div>

			<div className="mt-8 mx-1">
				<TreasuryOverview />
			</div>

			<div className="mt-8 mx-1">
				<Gov2LatestActivity />
			</div>

			<div className="mt-8 mx-1 flex flex-col xl:flex-row items-center justify-between gap-4">
				<div className='w-full xl:w-[60%]'>
					<UpcomingEvents />
				</div>

				<div className='w-full xl:w-[40%]'>
					<News />
				</div>
			</div>
		</>
	);
};

export default Gov2Home;