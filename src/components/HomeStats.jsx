import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Clapperboard, MonitorPlay, UsersRound, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const HomeStats = () => {
	const stats = [
		{ 
			label: 'Movies Catalog', 
			value: '850K+', 
			icon: <Clapperboard size={24} className='fill-blue-500/10 dark:fill-blue-400/10' />, 
			color: 'text-blue-600 dark:text-blue-400', 
			bg: 'bg-blue-50/50 dark:bg-blue-500/10' 
		},
		{ 
			label: 'TV Series', 
			value: '150K+', 
			icon: <MonitorPlay size={24} className='fill-purple-500/10 dark:fill-purple-400/10' />, 
			color: 'text-purple-600 dark:text-purple-400', 
			bg: 'bg-purple-50/50 dark:bg-purple-500/10' 
		},
		{ 
			label: 'Global Members', 
			value: '4.2M+', 
			icon: <UsersRound size={24} className='fill-emerald-500/10 dark:fill-emerald-400/10' />, 
			color: 'text-emerald-600 dark:text-emerald-400', 
			bg: 'bg-emerald-50/50 dark:bg-emerald-500/10' 
		},
		{ 
			label: 'Daily Activity', 
			value: '1.2B+', 
			icon: <Activity size={24} className='fill-amber-500/10 dark:fill-amber-400/10' />, 
			color: 'text-amber-600 dark:text-amber-400', 
			bg: 'bg-amber-50/50 dark:bg-amber-500/10' 
		},
	];

	return (
		<div className='space-y-16'>
			{/* ── Stats Grid ──────────────────────────────────── */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
				{stats.map((stat, i) => (
					<Card key={i} className='border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group cursor-default bg-white dark:bg-slate-900'>
						<CardContent className='pt-8 pb-8 flex flex-col items-center text-center space-y-4'>
							<div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
								<div className={`${stat.color}`}>
									{stat.icon}
								</div>
							</div>
							<div className='space-y-1'>
								<div className='text-3xl font-black text-slate-900 dark:text-white tracking-tighter'>{stat.value}</div>
								<div className='text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]'>{stat.label}</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* ── CTA Banner ──────────────────────────────────── */}
			<div className='relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-10 md:p-16 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-blue-500/20'>
				{/* Decorative elements */}
				<div className='absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl' />
				
				<div className='relative space-y-6'>
					<h2 className='text-3xl md:text-5xl font-black max-w-2xl leading-tight tracking-tight'>
						Join Today & Start Building Your
						<span className='bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent'> Watchlist</span>
					</h2>
					<p className='text-blue-100 max-w-lg mx-auto text-lg leading-relaxed'>
						Get access to maintain your own custom personal lists, track what you've seen and search and filter for what to watch next.
					</p>
					<div className='flex flex-wrap gap-4 pt-4 justify-center'>
						<Button asChild size='lg' className='rounded-full px-8 bg-white text-blue-600 hover:bg-slate-100 font-bold shadow-xl gap-2'>
							<Link to='/register'>Sign Up Now <ArrowRight size={16} /></Link>
						</Button>
						<Button asChild size='lg' variant='ghost' className='rounded-full px-8 text-white hover:bg-white/10 border border-white/20 font-bold'>
							<Link to='/browse'>Learn More</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeStats;
