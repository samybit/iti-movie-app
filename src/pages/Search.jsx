import { useState } from 'react';
import { useMovies } from '@/hooks/useMovies';
import useDebounce from '@/hooks/useDebounce';
import MovieList from '@/components/MovieList';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import PaginationControls from '@/components/PaginationControls';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Search = () => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const debouncedQuery = useDebounce(query, 500);

	const { movies, totalPages, loading, error } = useMovies({
		type: 'search',
		query: debouncedQuery,
		page,
	});

	const handleSearchChange = (val) => {
		setQuery(val);
		setPage(1); // Reset page on new search
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='space-y-8'>
			<section className='flex flex-col items-center gap-6 py-6'>
				<div className='text-center space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Search Movies</h2>
					<p className='text-slate-500 max-w-lg'>
						Find your favorite movies from our vast database of cinematic titles.
					</p>
				</div>
				<SearchInput value={query} onChange={handleSearchChange} />
			</section>

			{error && (
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{error}. Please try again later.
					</AlertDescription>
				</Alert>
			)}

			{!loading && debouncedQuery && movies.length === 0 ? (
				<EmptyState message={`No results for "${debouncedQuery}"`} />
			) : !debouncedQuery && !loading ? (
				<div className='py-20 text-center text-slate-400'>
					<p>Start typing to search for movies...</p>
				</div>
			) : (
				<>
					<MovieList movies={movies} isLoading={loading} />
					{movies.length > 0 && (
						<PaginationControls
							currentPage={page}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default Search;
