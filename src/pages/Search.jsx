import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useMovies } from '@/hooks/useMovies';
import useDebounce from '@/hooks/useDebounce';
import MovieList from '@/components/MovieList';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import PaginationControls from '@/components/PaginationControls';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search as SearchIcon, Film, Tv, TrendingUp, History, Sparkles } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { useLanguage } from '@/contexts/LanguageContext';

const Search = () => {
	const { t } = useLanguage();
	usePageTitle(t('search'));
	const [urlParams] = useSearchParams();
	const initialQuery = urlParams.get('q') || '';
	const [query, setQuery] = useState(initialQuery);
	const [page, setPage] = useState(1);
	const [mediaType, setMediaType] = useState('movie');
	const [recentSearches, setRecentSearches] = useState([]);
	const debouncedQuery = useDebounce(query, 500);

	// Fetch Trending data for initial state
	const { data: trendingMovies } = useMovies({
		type: 'trending',
		page: 1,
	});

	// Main search results
	const { data: movies, totalPages, loading, error } = useMovies({
		type: 'search',
		mediaType,
		query: debouncedQuery,
		page,
	});

	// Sync local history
	useEffect(() => {
		const saved = localStorage.getItem('recentSearches');
		if (saved) setRecentSearches(JSON.parse(saved));
	}, []);

	// Sync query if navigated with ?q= param
	useEffect(() => {
		const q = urlParams.get('q');
		if (q && q !== query) {
			setQuery(q);
			setPage(1);
		}
	}, [urlParams]);

	const handleSearchChange = (val) => {
		setQuery(val);
		setPage(1);
	};

	const onTagClick = (tag) => {
		setQuery(tag);
		setPage(1);
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='space-y-12 min-h-[70vh] pb-20'>
			{/* ── Cinematic Search Hero ───────────────────────────────────── */}
			<section className='relative min-h-[460px] flex flex-col items-center justify-center gap-10 py-20 px-6 overflow-hidden rounded-[40px] border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 transition-colors'>

				{/* Floating Animated Background Elements */}
				<div className='absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none' />
				<div className='absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none delay-1000' />
				<div className='absolute top-[20%] right-[15%] w-32 h-32 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-[60px] pointer-events-none' />

				<div className='relative text-center space-y-4 max-w-2xl'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none mb-2'>
						<Sparkles size={12} strokeWidth={3} className='animate-bounce' /> {t('cinematicDiscoveries')}
					</div>
					<h1 className='text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-[1.1]'>
						{t('findYourNext')} <br />
						<span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent'>
							{t('masterpiece')}
						</span>
					</h1>
					<p className='text-slate-400 dark:text-slate-300 font-medium text-lg leading-relaxed'>
						{t('searchMillions')}
					</p>
				</div>

				<div className='relative w-full max-w-3xl flex flex-col items-center gap-8'>
					<SearchInput
						value={query}
						onChange={handleSearchChange}
						placeholder={t('whatLooking')}
						className="max-w-2xl  h-20 shadow-2xl shadow-blue-500/10 dark:shadow-none "
					/>

					{/* Media Type Segmented Toggle */}
					<div className='flex p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-inner max-w-sm w-full transition-colors'>
						{[
							{ key: 'movie', label: t('movies'), icon: <Film size={16} /> },
							{ key: 'tv', label: t('tvSeries'), icon: <Tv size={16} /> },
						].map(({ key, label, icon }) => (
							<button
								key={key}
								className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-black transition-all duration-300 ${mediaType === key
									? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/10 dark:ring-blue-500/20'
									: 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40'
									}`}
								onClick={() => setMediaType(key)}
							>
								{icon} {label}
							</button>
						))}
					</div>
				</div>
			</section>

			{error && (
				<Alert variant='destructive' className='rounded-[32px] border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-6'>
					<AlertCircle className='h-5 w-5' />
					<AlertTitle className='font-black'>{t('systemAlert')}</AlertTitle>
					<AlertDescription className='text-sm opacity-80'>
						{error}. {t('troubleReaching')}
					</AlertDescription>
				</Alert>
			)}

			{!loading && debouncedQuery && movies.length === 0 ? (
				<EmptyState message={`${t('noMatchesQuery')} "${debouncedQuery}"`} />
			) : !debouncedQuery && !loading ? (
				<div className='animate-in fade-in slide-in-from-top-8 duration-700 delay-200'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
						{/* Recent History */}
						{recentSearches.length > 0 && (
							<div className='space-y-6'>
								<div className='flex items-center gap-3'>
									<div className='p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800'>
										<History className='text-slate-400 dark:text-slate-500' size={18} />
									</div>
									<h3 className='text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest'>{t('jumpBack')}</h3>
								</div>
								<div className='flex flex-wrap gap-2.5'>
									{recentSearches.map(term => (
										<button
											key={term}
											onClick={() => onTagClick(term)}
											className='px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-none transition-all duration-300 active:scale-95'
										>
											{term}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Trending Now */}
						<div className='space-y-6 lg:col-span-2'>
							<div className='flex items-center gap-3'>
								<div className='p-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20'>
									<TrendingUp className='text-orange-500 dark:text-orange-400' size={18} />
								</div>
								<h3 className='text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest'>{t('trendingDiscoveries')}</h3>
							</div>
							<div className='flex flex-wrap gap-2.5'>
								{['Marvel', 'Academy Awards', 'Animation', 'Horror classics', 'Netflix', 'IMDb TOP 250'].map(tag => (
									<button
										key={tag}
										onClick={() => onTagClick(tag)}
										className='px-5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-1'
									>
										{tag}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Trending Preview Grid */}
					<div className='mt-20 pt-12 border-t border-slate-100 dark:border-slate-800'>
						<div className='flex items-center justify-between mb-8 px-2'>
							<h4 className='text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]'>{t('recommended')}</h4>
							<span className='px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black rounded-lg border border-green-100 dark:border-green-500/20'>{t('live')}</span>
						</div>
						<MovieList movies={trendingMovies.slice(0, 8)} isLoading={loading} />
					</div>
				</div>
			) : (
				<div className='space-y-12 animate-in fade-in duration-500'>
					<div className='flex items-end justify-between px-2 pt-4 border-b border-slate-100/50 dark:border-slate-800/50 pb-6'>
						<div>
							<span className='text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-500/20 mb-3 inline-block'>
								{t('databaseMatch')}
							</span>
							<h3 className='text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight'>
								{debouncedQuery ? `${t('showingResults')} "${debouncedQuery}"` : ''}
							</h3>
						</div>
						{movies.length > 0 && (
							<div className='flex flex-col items-end gap-1'>
								<span className='text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest'>{t('collectionSize')}</span>
								<span className='text-lg font-black text-slate-800 dark:text-slate-100'>
									{movies.length} <span className='text-slate-300 dark:text-slate-600 font-bold'>{t('titles')}</span>
								</span>
							</div>
						)}
					</div>
					<MovieList movies={movies} isLoading={loading} />
					{movies.length > 0 && (
						<PaginationControls
							currentPage={page}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default Search;
