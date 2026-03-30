import { useState, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import HorizontalScroll from '@/components/HorizontalScroll';
import TrailerSection from '@/components/TrailerSection';
import HomeStats from '@/components/HomeStats';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function App() {
	const [bgIndex, setBgIndex] = useState(0);
	const { t } = useLanguage();
	usePageTitle(t('home'));
	
	const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useMovies({
		type: 'trending',
		mediaType: 'movie'
	});

	// Cycle background every 4 seconds
	useEffect(() => {
		if (trendingMovies?.length > 0) {
			const interval = setInterval(() => {
				setBgIndex((prev) => (prev + 1) % Math.min(trendingMovies.length, 10));
			}, 4000);
			return () => clearInterval(interval);
		}
	}, [trendingMovies]);

	const { data: trendingTV, loading: tvLoading } = useMovies({
		type: 'trending',
		mediaType: 'tv'
	});

	const { data: freeMovies, loading: freeLoading } = useMovies({
		type: 'discover',
		mediaType: 'movie',
		sort_by: 'vote_count.desc' 
	});

	const { data: upcomingMovies, loading: upcomingLoading } = useMovies({
		type: 'upcoming',
		mediaType: 'movie'
	});

	return (
		<div className='space-y-16 pb-20'>
			{/* ── Hero Banner ─────────────────────────────────────────────── */}
			<section className='relative overflow-hidden rounded-3xl min-h-[600px] flex items-center bg-slate-900 text-white shadow-2xl'>
				{/* Dynamic Background Image avec transition */}
				{trendingMovies?.[bgIndex]?.backdrop_path && (
					<div 
						key={bgIndex}
						className='absolute inset-0 z-0 animate-in fade-in zoom-in-105 duration-[2000ms] ease-out'
					>
						<div 
							className='w-full h-full bg-cover bg-center bg-no-repeat'
							style={{
								backgroundImage: `url(https://image.tmdb.org/t/p/original${trendingMovies[bgIndex].backdrop_path})`
							}}
						/>
						{/* Multi-layered overlays for depth and readability */}
						<div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent' />
						<div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent' />
						<div className='absolute inset-0 backdrop-blur-[1px]' />
					</div>
				)}

				{/* Foreground Content */}
				<div className='relative z-10 w-full p-8 md:p-14 lg:p-20 max-w-4xl space-y-8'>
					<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black backdrop-blur-xl border border-white/10 uppercase tracking-widest animate-in slide-in-from-left-4 duration-1000'>
						<TrendingUp size={12} /> {t('currentlyTrendingNow')}
					</span>
					<h1 className='text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase'>
						{t('discoverYourNext')}<br />
						<span className='bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic'>{t('favoriteMovie')}</span>
					</h1>
					<p className='text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed font-medium'>
						{t('exploreMillionsHome')}
					</p>
					<div className='flex flex-wrap gap-4 pt-4'>
						<Button asChild size='lg' className='h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-2xl shadow-blue-500/40 px-10 transition-all hover:scale-105 active:scale-95'>
							<Link to='/browse'>{t('startBrowsing')}</Link>
						</Button>
						<Button asChild size='lg' variant='ghost' className='h-14 rounded-2xl text-white hover:bg-white/10 border-2 border-white/20 px-10 font-bold backdrop-blur-sm transition-all hover:border-white/40'>
							<Link to='/search'>{t('quickSearch')}</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ── Error Alert ────────────────────────────────────────────── */}
			{trendingError && (
				<Alert variant='destructive' className='rounded-2xl'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>{t('error')}</AlertTitle>
					<AlertDescription>
						{t('failedToLoad')}
					</AlertDescription>
				</Alert>
			)}

			{/* ── Trending Movies ─────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title={t('trendingMovies')} 
					data={trendingMovies} 
					isLoading={trendingLoading} 
				/>
			</section>

			{/* ── Trailers ────────────────────────────────────────────────── */}
			<TrailerSection />

			{/* ── Trending TV Shows ────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title={t('trendingTV')} 
					data={trendingTV} 
					isLoading={tvLoading} 
					mediaType='tv'
				/>
			</section>

			{/* ── Coming Soon ─────────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title={t('comingSoon')} 
					data={upcomingMovies} 
					isLoading={upcomingLoading} 
				/>
			</section>

			{/* ── Free to Watch ────────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title={t('freeToWatch')} 
					data={freeMovies} 
					isLoading={freeLoading} 
				/>
			</section>

			{/* ── Stats / CTA ─────────────────────────────────────────────── */}
			<HomeStats />
		</div>
	);
}
