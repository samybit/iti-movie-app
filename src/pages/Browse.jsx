import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieList from '../components/MovieList';
import PaginationControls from '../components/PaginationControls';
import AdvancedSidebar from '../components/AdvancedSidebar';
import EmptyState from '../components/EmptyState';
import SortSelect from '../components/SortSelect';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

const Browse = () => {
	usePageTitle('Browse');
	const [filters, setFilters] = useState({
		mediaType: 'movie',
		with_genres: '',
		with_original_language: '',
		release_date_gte: '',
		release_date_lte: '',
		episode_count_gte: '',
		episode_count_lte: '',
		sort_by: 'popularity.desc',
		page: 1,
	});

	const { data, totalPages, loading, error } = useMovies({
		type: 'discover',
		...filters,
	});

	const handleFilterChange = (newFilters) => {
		setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
	};

	return (
		<div className='flex flex-col lg:flex-row gap-8 py-6'>
			{/* Mobile Filter Trigger */}
			<div className='lg:hidden flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold tracking-tight'>Browse</h2>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline' size='sm' className='gap-2 rounded-full px-4 border-slate-300'>
							<Filter size={16} /> Filters
						</Button>
					</SheetTrigger>
					<SheetContent side='left' className='w-80 overflow-y-auto'>
						<div className='mt-6'>
							<AdvancedSidebar filters={filters} onFilterChange={handleFilterChange} />
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Sidebar Desktop */}
			<aside className='hidden lg:block w-72 flex-shrink-0'>
				<div className='sticky top-24'>
					<h2 className='text-2xl font-bold tracking-tight mb-6'>Filters</h2>
					<AdvancedSidebar filters={filters} onFilterChange={handleFilterChange} />
				</div>
			</aside>

			{/* Results Content */}
			<div className='flex-grow space-y-8'>
				<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-extrabold tracking-tight hidden lg:block'>
							Browse {filters.mediaType === 'movie' ? 'Movies' : 'Series'}
						</h1>
						<p className='text-slate-500'>
							Showing {filters.mediaType === 'movie' ? 'cinema masterworks' : 'binge-worthy shows'}.
						</p>
					</div>
					<SortSelect 
						value={filters.sort_by} 
						onValueChange={(val) => handleFilterChange({ sort_by: val })} 
					/>
				</div>

				{data.length === 0 && !loading ? (
					<EmptyState description='Try clearing some filters or changing your selection.' />
				) : (
					<div className='space-y-10'>
						<MovieList movies={data} isLoading={loading} />
						<PaginationControls
							currentPage={filters.page}
							totalPages={totalPages}
							onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Browse;
