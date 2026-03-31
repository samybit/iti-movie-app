import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';
import { TMDBAuthProvider } from '@/contexts/TMDBAuthContext';
import TMDBCallback from '@/pages/TMDBCallback';

// Import all pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Browse from '@/pages/Browse';
import Search from '@/pages/Search';
import SearchPage from '@/pages/SearchPage';
import MediaDetail from '@/pages/MediaDetail';
import Wishlist from '@/pages/Wishlist';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import History from '@/pages/History';
import HelpCenter from '@/pages/HelpCenter';
import UserPage from '@/pages/UserPage';
import VerifyEmail from '@/pages/VerifyEmail';
import NotFound404 from '@/pages/NotFound404';

function AppContent() {
	const { t } = useLanguage();
	const [bgIndex, setBgIndex] = useState(0);
	usePageTitle(t('home'));
	
	const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useMovies({
		type: 'trending',
		mediaType: 'movie'
	});

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

	const animations = [
		'fade-in zoom-in-125',
		'fade-in slide-in-from-right-20',
		'fade-in slide-in-from-left-20',
		'fade-in slide-in-from-bottom-20',
		'fade-in zoom-in-110'
	];

	return (
		<div className='space-y-16 pb-20'>
			<section className='relative overflow-hidden rounded-3xl min-h-[600px] flex items-center bg-slate-950 text-white shadow-2xl'>
				{trendingMovies?.[bgIndex]?.backdrop_path && (
					<div 
						key={bgIndex}
						className={`absolute inset-0 z-0 animate-in duration-[2500ms] ease-out ${animations[bgIndex % animations.length]}`}
					>
						<div 
							className='w-full h-full bg-cover bg-center bg-no-repeat'
							style={{
								backgroundImage: `url(https://image.tmdb.org/t/p/original${trendingMovies[bgIndex].backdrop_path})`
							}}
						/>
						<div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent' />
						<div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80' />
						<div className='absolute inset-0 backdrop-blur-[1px]' />
					</div>
				)}

				<div className='relative z-10 w-full p-8 md:p-14 lg:p-20 max-w-4xl space-y-8'>
					<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black backdrop-blur-xl border border-white/10 uppercase tracking-widest animate-in slide-in-from-left-4 duration-1000'>
						<TrendingUp size={12} /> {t('currentlyTrendingNow')}
					</span>
					<h1 className='text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase'>
						{t('discoverYourNext')}<br />
						<span className='bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic pr-2'>{t('favoriteMovie')}</span>
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

			{trendingError && (
				<Alert variant='destructive' className='rounded-2xl'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>{t('error')}</AlertTitle>
					<AlertDescription>
						{t('failedToLoad')}
					</AlertDescription>
				</Alert>
			)}

			<section>
				<HorizontalScroll 
					title={t('trendingMovies')} 
					data={trendingMovies} 
					isLoading={trendingLoading} 
				/>
			</section>

			<TrailerSection />

			<section>
				<HorizontalScroll 
					title={t('trendingTV')} 
					data={trendingTV} 
					isLoading={tvLoading} 
					mediaType='tv'
				/>
			</section>

			<section>
				<HorizontalScroll 
					title={t('comingSoon')} 
					data={upcomingMovies} 
					isLoading={upcomingLoading} 
				/>
			</section>

			<section>
				<HorizontalScroll 
					title={t('freeToWatch')} 
					data={freeMovies} 
					isLoading={freeLoading} 
				/>
			</section>

			<HomeStats />
		</div>
	);
}

// Main App component - NO BrowserRouter here! (RouterProvider is in main.jsx)
export default function App() {
	return (
		<TMDBAuthProvider>
			<Toaster 
				position="top-center" 
				reverseOrder={false}
				toastOptions={{
					style: {
						borderRadius: '12px',
						background: '#333',
						color: '#fff',
					},
				}}
			/>
			<Routes>
				<Route path="/" element={<AppContent />} />
				<Route path="/home" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/browse" element={<Browse />} />
				<Route path="/search" element={<Search />} />
				<Route path="/search-page" element={<SearchPage />} />
				<Route path="/movie/:id" element={<MediaDetail type="movie" />} />
				<Route path="/tv/:id" element={<MediaDetail type="tv" />} />
				<Route path="/wishlist" element={<Wishlist />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/history" element={<History />} />
				<Route path="/help" element={<HelpCenter />} />
				<Route path="/user/:userId" element={<UserPage />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/tmdb-callback" element={<TMDBCallback />} />
				<Route path="*" element={<NotFound404 />} />
			</Routes>
		</TMDBAuthProvider>
	);
}