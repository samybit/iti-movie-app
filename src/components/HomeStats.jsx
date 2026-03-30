import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Clapperboard, MonitorPlay, UsersRound, Activity, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const HomeStats = () => {
	const { t } = useLanguage();
	const stats = [
		{ 
			label: t('moviesCatalog'), 
			value: '850K+', 
			icon: <Clapperboard size={24} className='fill-blue-500/10 dark:fill-blue-400/10' />, 
			color: 'text-blue-600 dark:text-blue-400', 
			bg: 'bg-blue-50/50 dark:bg-blue-500/10' 
		},
		{ 
			label: t('tvSeries'), 
			value: '150K+', 
			icon: <MonitorPlay size={24} className='fill-purple-500/10 dark:fill-purple-400/10' />, 
			color: 'text-purple-600 dark:text-purple-400', 
			bg: 'bg-purple-50/50 dark:bg-purple-500/10' 
		},
		{ 
			label: t('globalMembers'), 
			value: '4.2M+', 
			icon: <UsersRound size={24} className='fill-emerald-500/10 dark:fill-emerald-400/10' />, 
			color: 'text-emerald-600 dark:text-emerald-400', 
			bg: 'bg-emerald-50/50 dark:bg-emerald-500/10' 
		},
		{ 
			label: t('dailyActivity'), 
			value: '1.2B+', 
			icon: <Activity size={24} className='fill-amber-500/10 dark:fill-amber-400/10' />, 
			color: 'text-amber-600 dark:text-amber-400', 
			bg: 'bg-amber-50/50 dark:bg-amber-500/10' 
		},
	];

	const { user, userName, loading } = useAuth();

	if (loading) return null;

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

			{/* ── Contextual CTA / Welcome Banner ──────────────────────────────────── */}
			{!user ? (
				<div className='relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-10 md:p-16 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-blue-500/20'>
					{/* Decorative elements */}
					<div className='absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl' />
					<div className='absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl' />
					
					<div className='relative space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
						<h2 className='text-3xl md:text-5xl font-black max-w-2xl leading-tight tracking-tight'>
							{t('joinToday')}
							<span className='bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent'> {t('watchlistText')}</span>
						</h2>
						<p className='text-blue-100 max-w-lg mx-auto text-lg leading-relaxed'>
							{t('getAccess')}
						</p>
						<div className='flex flex-wrap gap-4 pt-4 justify-center'>
							<Button asChild size='lg' className='rounded-xl px-8 bg-white text-blue-600 hover:bg-slate-100 font-bold shadow-xl gap-2 transition-all hover:scale-105 active:scale-95'>
								<Link to='/register'>{t('signUpNow')} <ArrowRight size={16} /></Link>
							</Button>
							<Button asChild size='lg' variant='ghost' className='rounded-xl px-8 text-white hover:bg-white/10 border border-white/20 font-bold'>
								<Link to='/browse'>{t('learnMore')}</Link>
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className='relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl group transition-all duration-500'>
					{/* Background Decorations */}
					<div className='absolute -left-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-1000' />
					<div className='absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-1000' />
					
					<div className='relative z-10 space-y-6 text-center md:text-left animate-in fade-in slide-in-from-left-4 duration-700'>
						<div className='space-y-4'>
							<span className='inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse'>{t('availableUpdates')}</span>
							<h2 className='text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter'>
								{t('welcomeBack')} <br />
								<span className='bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic'>{userName || t('friend')}!</span>
							</h2>
						</div>
						<p className='text-slate-400 max-w-md text-lg leading-relaxed font-medium'>
							{t('libraryGrowing')}
						</p>
					</div>

					<div className='relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-700'>
						<Button asChild size='lg' className='h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-2xl shadow-blue-500/20 px-10 transition-all hover:scale-105 active:scale-95 group'>
							<Link to='/wishlist' className='flex items-center gap-3'>
								<Heart className='fill-current' size={18} />
								{t('viewWatchlist')}
							</Link>
						</Button>
						<Button asChild size='lg' variant='outline' className='h-16 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold backdrop-blur-sm transition-all px-10'>
							<Link to='/browse'>{t('startDiscovering')}</Link>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default HomeStats;
