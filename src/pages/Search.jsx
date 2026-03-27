import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useMovies } from '@/hooks/useMovies';
import useDebounce from '@/hooks/useDebounce';
import MovieList from '@/components/MovieList';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import PaginationControls from '@/components/PaginationControls';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search as SearchIcon, Film, Tv } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

const Search = () => {
	usePageTitle('Search');
	const [urlParams] = useSearchParams();
	const initialQuery = urlParams.get('q') || '';
	const [query, setQuery] = useState(initialQuery);
	const [page, setPage] = useState(1);
	const [mediaType, setMediaType] = useState('movie');
	const debouncedQuery = useDebounce(query, 500);

	// Sync query if navigated with ?q= param
	useEffect(() => {
		const q = urlParams.get('q');
		if (q && q !== query) {
			setQuery(q);
			setPage(1);
		}
	}, [urlParams]);

	const { data: movies, totalPages, loading, error } = useMovies({
		type: 'search',
		mediaType,
		query: debouncedQuery,
		page,
	});

	const handleSearchChange = (val) => {
		setQuery(val);
		setPage(1);
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='space-y-8 min-h-[70vh]'>
			{/* ── Search Hero ──────────────────────────────────────────────── */}
			<section className='relative overflow-hidden flex flex-col items-center gap-6 py-14 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 rounded-3xl border border-slate-100/80 px-4'>
				{/* Decorative */}
				<div className='absolute top-0 right-0 w-40 h-40 bg-blue-100/40 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 w-56 h-56 bg-indigo-100/30 rounded-full blur-3xl' />

				<div className='relative text-center space-y-3'>
					<h2 className='text-4xl font-black tracking-tight text-slate-900'>
						Discover Something <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>New</span>
					</h2>
					<p className='text-slate-400 max-w-lg mx-auto'>
						Search across millions of movies and TV shows to find your next favorite title.
					</p>
				</div>
				
				<div className='relative w-full max-w-2xl flex flex-col items-center gap-5'>
					<SearchInput value={query} onChange={handleSearchChange} placeholder={`Search for ${mediaType === 'movie' ? 'movies' : 'series'}...`} />
					
					{/* Media type toggle */}
					<div className='flex gap-1 p-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 w-fit'>
						{[
							{ key: 'movie', label: 'Movies', icon: <Film size={14} /> },
							{ key: 'tv', label: 'TV Series', icon: <Tv size={14} /> },
						].map(({ key, label, icon }) => (
							<button
								key={key}
								className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
									mediaType === key
										? 'bg-blue-600 text-white shadow-md'
										: 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
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
				<Alert variant='destructive' className='rounded-2xl'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{error}. Please check your connection or API key.
					</AlertDescription>
				</Alert>
			)}

			{!loading && debouncedQuery && movies.length === 0 ? (
				<EmptyState message={`No ${mediaType === 'movie' ? 'movies' : 'series'} found for "${debouncedQuery}"`} />
			) : !debouncedQuery && !loading ? (
				<div className='py-20 text-center space-y-4'>
					<div className='inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 mb-4'>
						<SearchIcon className='text-slate-200' size={36} />
					</div>
					<h3 className='text-xl font-bold text-slate-300'>Enter a keyword to start searching...</h3>
				</div>
			) : (
				<div className='space-y-8'>
					<div className='flex items-center justify-between'>
						<h3 className='text-xl font-bold text-slate-800'>
							{debouncedQuery ? `Results for "${debouncedQuery}"` : ''}
						</h3>
						{movies.length > 0 && (
							<span className='text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full'>
								{movies.length} matches
							</span>
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
