import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
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
	const [searchParams, setSearchParams] = useSearchParams();

	// These are the active filters being used for the API call
	const activeFilters = {
		mediaType: searchParams.get('type') || 'movie',
		with_genres: searchParams.get('genres') || '',
		with_original_language: searchParams.get('lang') || '',
		with_origin_country: searchParams.get('country') || '',
		language: searchParams.get('translate') || 'en-US',
		release_date_gte: searchParams.get('year_from') || '',
		release_date_lte: searchParams.get('year_to') || '',
		episode_count_gte: searchParams.get('ep_min') || '',
		episode_count_lte: searchParams.get('ep_max') || '',
		vote_average_gte: searchParams.get('score_min') || '',
		vote_count_gte: searchParams.get('votes_min') || '',
		with_runtime_gte: searchParams.get('runtime_min') || '',
		with_runtime_lte: searchParams.get('runtime_max') || '',
		with_keywords: searchParams.get('keywords') || '',
		sort_by: searchParams.get('sort') || 'popularity.desc',
		page: parseInt(searchParams.get('page') || '1', 10),
	};

	// These are the filters currently being edited in the sidebar
	const [pendingFilters, setPendingFilters] = useState(activeFilters);

	// Sync pending filters with searchParams when they change externally (e.g. navigation)
	useEffect(() => {
		setPendingFilters(activeFilters);
	}, [searchParams]);

	const { data, totalPages, loading, error } = useMovies({
		type: 'discover',
		...activeFilters,
	});

	const handleSearch = () => {
		const updatedParams = new URLSearchParams(searchParams);
		
		const paramMap = {
			mediaType: 'type',
			with_genres: 'genres',
			with_original_language: 'lang',
			with_origin_country: 'country',
			language: 'translate',
			release_date_gte: 'year_from',
			release_date_lte: 'year_to',
			episode_count_gte: 'ep_min',
			episode_count_lte: 'ep_max',
			vote_average_gte: 'score_min',
			vote_count_gte: 'votes_min',
			with_runtime_gte: 'runtime_min',
			with_runtime_lte: 'runtime_max',
			with_keywords: 'keywords',
			sort_by: 'sort', // Sort stays immediate for UX
			page: 'page',
		};

		Object.entries(pendingFilters).forEach(([key, value]) => {
			const paramName = paramMap[key] || key;
			if (value && value !== '0') {
				updatedParams.set(paramName, value);
			} else {
				updatedParams.delete(paramName);
			}
		});

		updatedParams.set('page', '1'); // Reset page on new search
		setSearchParams(updatedParams);
	};

	const handleSortChange = (newSort) => {
		const updatedParams = new URLSearchParams(searchParams);
		updatedParams.set('sort', newSort);
		setSearchParams(updatedParams);
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
					<SheetContent side='left' className='w-80 overflow-y-auto pt-10'>
						<AdvancedSidebar 
							filters={pendingFilters} 
							setFilters={setPendingFilters} 
							onSearch={handleSearch}
						/>
					</SheetContent>
				</Sheet>
			</div>

			{/* Sidebar Desktop */}
			<aside className='hidden lg:block w-72 flex-shrink-0'>
				<div className='sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 custom-scrollbar bg-white rounded-xl border p-4 shadow-sm'>
					<AdvancedSidebar 
						filters={pendingFilters} 
						setFilters={setPendingFilters} 
						onSearch={handleSearch}
					/>
				</div>
			</aside>

			{/* Results Content */}
			<div className='flex-grow space-y-8'>
				<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-extrabold tracking-tight hidden lg:block uppercase'>
							{activeFilters.mediaType === 'movie' ? 'Movies' : 'TV Series'}
						</h1>
						<p className='text-slate-500'>
							{loading ? 'Searching...' : `Discover the perfect ${activeFilters.mediaType === 'movie' ? 'movie' : 'series'}.` }
						</p>
					</div>
					<SortSelect 
						value={activeFilters.sort_by} 
						onValueChange={handleSortChange} 
					/>
				</div>

				{data.length === 0 && !loading ? (
					<EmptyState description='No matches found. Adjust your filters and try again.' />
				) : (
					<div className='space-y-10'>
						<MovieList movies={data} isLoading={loading} />
						<PaginationControls
							currentPage={activeFilters.page}
							totalPages={totalPages}
							onPageChange={(p) => {
								const updatedParams = new URLSearchParams(searchParams);
								updatedParams.set('page', p);
								setSearchParams(updatedParams);
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Browse;
