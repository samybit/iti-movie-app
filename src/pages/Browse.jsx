import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useMovies } from '../hooks/useMovies';
import MovieList from '../components/MovieList';
import PaginationControls from '../components/PaginationControls';
import AdvancedSidebar from '../components/AdvancedSidebar';
import EmptyState from '../components/EmptyState';
import SortSelect from '../components/SortSelect';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

const Browse = () => {
	usePageTitle('Browse');
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [browseQuery, setBrowseQuery] = useState('');

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
				<div className='sticky top-20 bg-white rounded-xl border p-4 shadow-sm'>
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

				{/* Search Field — redirects to /search */}
				<div className='relative'>
					<Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
					<Input
						placeholder={`Search ${activeFilters.mediaType === 'movie' ? 'movies' : 'series'}...`}
						value={browseQuery}
						onChange={(e) => setBrowseQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && browseQuery.trim()) navigate(`/search?q=${encodeURIComponent(browseQuery.trim())}`);
						}}
						className='pl-11 pr-24 h-12 rounded-2xl bg-white border-slate-200 shadow-sm text-sm placeholder:text-slate-300 focus-visible:ring-blue-500'
					/>
					<Button
						onClick={() => { if (browseQuery.trim()) navigate(`/search?q=${encodeURIComponent(browseQuery.trim())}`); }}
						size='sm'
						className='absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold px-5 h-8'
					>
						Search
					</Button>
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
