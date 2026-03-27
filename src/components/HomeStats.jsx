import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Users, Film, Tv, Layout, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const HomeStats = () => {
	const stats = [
		{ label: 'Movies', value: '850K+', icon: <Film size={22} />, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
		{ label: 'TV Shows', value: '150K+', icon: <Tv size={22} />, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
		{ label: 'Members', value: '4.2M+', icon: <Users size={22} />, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
		{ label: 'API Requests', value: '1.2B+', icon: <Zap size={22} />, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
	];

	return (
		<div className='space-y-16'>
			{/* ── Stats Grid ──────────────────────────────────── */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
				{stats.map((stat, i) => (
					<Card key={i} className='border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group cursor-default'>
						<CardContent className='pt-6 pb-6 flex flex-col items-center text-center space-y-3'>
							<div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
								<div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
									{stat.icon}
								</div>
							</div>
							<div className='text-3xl font-black text-slate-900 tracking-tight'>{stat.value}</div>
							<div className='text-sm text-slate-400 font-semibold uppercase tracking-wider'>{stat.label}</div>
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
