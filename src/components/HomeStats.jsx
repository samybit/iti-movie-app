import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Users, Film, Tv, Layout } from 'lucide-react';

const HomeStats = () => {
	const stats = [
		{ label: 'Movies', value: '850K+', icon: <Film className='text-blue-500' /> },
		{ label: 'TV Shows', value: '150K+', icon: <Tv className='text-purple-500' /> },
		{ label: 'Members', value: '4.2M+', icon: <Users className='text-green-500' /> },
		{ label: 'API Requests', value: '1.2B+', icon: <Layout className='text-orange-500' /> },
	];

	return (
		<div className='my-16 space-y-10'>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, i) => (
					<Card key={i} className='border-none shadow-none bg-slate-50'>
						<CardContent className='pt-6 flex flex-col items-center text-center space-y-2'>
							<div className='p-3 bg-white rounded-2xl shadow-sm'>{stat.icon}</div>
							<div className='text-2xl font-bold text-slate-900'>{stat.value}</div>
							<div className='text-sm text-slate-500 font-medium'>{stat.label}</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='relative rounded-[2.5rem] overflow-hidden bg-blue-600 text-white p-8 md:p-12 lg:p-16 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-blue-500/20'>
				<div className='absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl'></div>
				<div className='absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl'></div>
				
				<h2 className='text-3xl md:text-5xl font-extrabold max-w-2xl leading-tight'>
					Join Today to Get Exclusive Offers & Discounts
				</h2>
				<p className='text-blue-100 max-w-lg text-lg'>
					Get access to maintain your own custom personal lists, track what you've seen and search and filter for what to watch next.
				</p>
				<div className='flex gap-4 pt-4'>
					<Button size='lg' variant='secondary' className='rounded-full px-8 bg-white text-blue-600 hover:bg-slate-100'>
						Sign Up Now
					</Button>
					<Button size='lg' variant='ghost' className='rounded-full px-8 text-white hover:bg-white/10'>
						Learn More
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HomeStats;
