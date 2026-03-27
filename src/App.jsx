import { useState } from 'react';
import { useMovies } from '@/hooks/useMovies';
import MovieList from '@/components/MovieList';
import GenreFilter from '@/components/GenreFilter';
import SortSelect from '@/components/SortSelect';
import PaginationControls from '@/components/PaginationControls';
import EmptyState from '@/components/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function App() {
	const [selectedGenre, setSelectedGenre] = useState('');
	const [sortBy, setSortBy] = useState('popularity.desc');
	const [page, setPage] = useState(1);

	// Determine type: if filters are applied, use 'discover', otherwise 'now_playing'
	const fetchType = (selectedGenre || sortBy !== 'popularity.desc') ? 'discover' : 'now_playing';

	const { movies, totalPages, loading, error } = useMovies({
		type: fetchType,
		page,
		sort_by: sortBy,
		with_genres: selectedGenre,
	});

	const handleGenreSelect = (genreId) => {
		setSelectedGenre(genreId);
		setPage(1); // Reset to first page when filtering
	};

	const handleSortChange = (value) => {
		setSortBy(value);
		setPage(1); // Reset to first page when sorting
	};

	const handlePageChange = (newPage) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='space-y-8'>
			<section className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>
						{fetchType === 'now_playing' ? 'Now Playing' : 'Discovery'}
					</h2>
					<p className='text-slate-500'>
						Browse through the latest and most popular movies.
					</p>
				</div>
				<SortSelect value={sortBy} onValueChange={handleSortChange} />
			</section>

			<section>
				<h3 className='text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2'>
					Filter by Genre
				</h3>
				<GenreFilter selectedGenre={selectedGenre} onSelectGenre={handleGenreSelect} />
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

			{!loading && movies.length === 0 ? (
				<EmptyState />
			) : (
				<>
					<MovieList movies={movies} isLoading={loading} />
					<PaginationControls
						currentPage={page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</div>
	);
}

export default App;
