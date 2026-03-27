import { useState } from 'react';
import { useMovies } from '@/hooks/useMovies';
import useDebounce from '@/hooks/useDebounce';
import MovieList from '@/components/MovieList';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import PaginationControls from '@/components/PaginationControls';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

const Search = () => {
	usePageTitle('Search');
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [mediaType, setMediaType] = useState('movie');
	const debouncedQuery = useDebounce(query, 500);

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
			<section className='flex flex-col items-center gap-6 py-12 bg-slate-50/50 rounded-[3rem] border border-slate-100 px-4'>
				<div className='text-center space-y-3'>
					<h2 className='text-4xl font-extrabold tracking-tight text-slate-900'>Discover Something New</h2>
					<p className='text-slate-500 max-w-lg mx-auto'>
						Search across millions of movies and TV shows to find your next favorite title.
					</p>
				</div>
				
				<div className='w-full max-w-2xl flex flex-col items-center gap-6'>
					<SearchInput value={query} onChange={handleSearchChange} placeholder={`Search for ${mediaType === 'movie' ? 'movies' : 'series'}...`} />
					
					<div className='flex gap-2 p-1 bg-slate-100 rounded-full w-fit'>
						<button
							className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mediaType === 'movie' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
							onClick={() => setMediaType('movie')}
						>
							Movies
						</button>
						<button
							className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mediaType === 'tv' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
							onClick={() => setMediaType('tv')}
						>
							TV Series
						</button>
					</div>
				</div>
			</section>

			{error && (
				<Alert variant='destructive'>
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
				<div className='py-20 text-center'>
					<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4'>
						<SearchInput className="hidden" /> {/* just for reference, better use a lucide icon */}
						<AlertCircle className='text-slate-200' size={40} />
					</div>
					<h3 className='text-xl font-medium text-slate-400'>Enter a keyword to start searching...</h3>
				</div>
			) : (
				<div className='space-y-10 px-2'>
					<div className='flex items-center justify-between'>
						<h3 className='text-xl font-bold text-slate-800'>
						{debouncedQuery ? `Results for "${debouncedQuery}"` : ''}
						</h3>
						{movies.length > 0 && <span className='text-sm text-slate-400'>{movies.length} matches found</span>}
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
