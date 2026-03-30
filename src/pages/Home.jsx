import { useMovies } from '@/hooks/useMovies';
import HorizontalScroll from '@/components/HorizontalScroll';
import TrailerSection from '@/components/TrailerSection';
import HomeStats from '@/components/HomeStats';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Search as SearchIcon, Sparkles } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { Link, useOutletContext } from 'react-router';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
	const { t } = useLanguage();
	usePageTitle(t('home'));
	const { setIsSearchOpen } = useOutletContext();
	
	const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useMovies({
		type: 'trending',
		mediaType: 'movie'
	});

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
			<section className='relative overflow-hidden rounded-3xl min-h-[500px] flex items-center bg-slate-900 text-white'>
				{/* Dynamic Background Image */}
				{trendingMovies?.[0]?.backdrop_path && (
					<div 
						className='absolute inset-0 z-0'
						style={{
							backgroundImage: `url(https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						{/* Multi-layered overlays for depth and readability */}
						<div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent' />
						<div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent' />
						<div className='absolute inset-0 backdrop-blur-[2px]' />
					</div>
				)}

				{/* Decorative blobs (now subtle accents) */}
				<div className='absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-1' />
				
				<div className='relative z-10 w-full p-8 md:p-14 lg:p-20 max-w-4xl space-y-6'>
					<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black backdrop-blur-md border border-blue-500/20 uppercase tracking-widest'>
						<TrendingUp size={12} /> {t('trendingNow')}
					</span>
					<h1 className='text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase'>
						{t('discoverYourNext')}<br />
						<span className='bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic'>{t('favoriteMovie')}</span>
					</h1>
					<p className='text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed font-medium'>
						{t('exploreMillionsHome')}
					</p>
					<div className='flex flex-col sm:flex-row gap-4 pt-8 w-full max-w-2xl'>
						{/* Real Search Trigger (Above-Tab style) */}
						<button 
							onClick={() => setIsSearchOpen(true)}
							className='flex-1 group relative flex items-center gap-4 h-16 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 shadow-2xl transition-all duration-300'
						>
							<div className='flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform'>
								<SearchIcon size={18} strokeWidth={2.5} />
							</div>
							<div className='flex flex-col items-start'>
								<span className='text-[10px] font-black uppercase tracking-widest text-blue-300 mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity'>{t('quickDiscover')}</span>
								<span className='text-slate-200 text-sm font-bold opacity-80 group-hover:opacity-100'>{t('searchMoviesTv')}</span>
							</div>
							<div className='ml-auto px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-bold text-white/40 group-hover:text-blue-300 transition-colors uppercase'>⌘ K</div>
						</button>

						<Button asChild size='lg' className='h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-2xl shadow-blue-500/40 px-10 transition-all hover:scale-105 active:scale-95 group overflow-hidden relative'>
							<Link to='/browse'>
								<div className="flex items-center gap-2">
									<Sparkles size={18} className="animate-bounce" />
									{t('startBrowsing')}
								</div>
							</Link>
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
};

export default Home;
