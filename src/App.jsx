import { useMovies } from '@/hooks/useMovies';
import HorizontalScroll from '@/components/HorizontalScroll';
import TrailerSection from '@/components/TrailerSection';
import HomeStats from '@/components/HomeStats';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Tv, Clock, Popcorn } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

function App() {
	usePageTitle('Home');
	
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
			<section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 md:p-14 lg:p-20'>
				{/* Decorative blobs */}
				<div className='absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
				<div className='absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl' />
				
				<div className='relative max-w-3xl space-y-6'>
					<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold backdrop-blur-sm border border-white/10'>
						<TrendingUp size={12} /> Trending Now
					</span>
					<h1 className='text-4xl md:text-6xl font-black tracking-tight leading-tight'>
						Discover Your Next<br />
						<span className='bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent'>Favorite Movie</span>
					</h1>
					<p className='text-blue-100 text-lg max-w-xl leading-relaxed'>
						Explore millions of movies and TV shows. Build your watchlist, track ratings, and find hidden gems.
					</p>
					<div className='flex flex-wrap gap-3 pt-2'>
						<Button asChild size='lg' className='rounded-full bg-white text-blue-600 hover:bg-slate-100 font-bold shadow-xl px-8'>
							<Link to='/browse'>Start Browsing</Link>
						</Button>
						<Button asChild size='lg' variant='ghost' className='rounded-full text-white hover:bg-white/10 border border-white/20 px-8'>
							<Link to='/search'>Search Movies</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ── Error Alert ────────────────────────────────────────────── */}
			{trendingError && (
				<Alert variant='destructive' className='rounded-2xl'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						Failed to load trending content. Check your API key.
					</AlertDescription>
				</Alert>
			)}

			{/* ── Trending Movies ─────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title='🔥 Trending Movies' 
					data={trendingMovies} 
					isLoading={trendingLoading} 
				/>
			</section>

			{/* ── Trailers ────────────────────────────────────────────────── */}
			<TrailerSection />

			{/* ── Trending TV Shows ────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title='📺 Trending TV Shows' 
					data={trendingTV} 
					isLoading={tvLoading} 
					mediaType='tv'
				/>
			</section>

			{/* ── Coming Soon ─────────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title='⏳ Coming Soon' 
					data={upcomingMovies} 
					isLoading={upcomingLoading} 
				/>
			</section>

			{/* ── Free to Watch ────────────────────────────────────────────── */}
			<section>
				<HorizontalScroll 
					title='🎬 Free to Watch' 
					data={freeMovies} 
					isLoading={freeLoading} 
				/>
			</section>

			{/* ── Stats / CTA ─────────────────────────────────────────────── */}
			<HomeStats />
		</div>
	);
}

export default App;
