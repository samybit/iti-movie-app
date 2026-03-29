import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useMovies } from '../hooks/useMovies';
import { useGenres } from '../hooks/useGenres';
import MovieList from '../components/MovieList';
import PaginationControls from '../components/PaginationControls';
import AdvancedSidebar from '../components/AdvancedSidebar';
import EmptyState from '../components/EmptyState';
import SortSelect from '../components/SortSelect';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, X } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

const Browse = () => {
	usePageTitle('Browse');
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [browseQuery, setBrowseQuery] = useState('');
	const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
	const resultRef = useRef(null);

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
		certification: searchParams.get('certification') || '',
		sort_by: searchParams.get('sort') || 'popularity.desc',
		page: parseInt(searchParams.get('page') || '1', 10),
	};

	const { data, totalPages, totalResults, loading, error } = useMovies({
		type: 'discover',
		...activeFilters,
	});

	const { genres } = useGenres(activeFilters.mediaType, activeFilters.language);

	const handleFilterChange = (newFiltersUpdater) => {
		const nextFilters = typeof newFiltersUpdater === 'function' 
			? newFiltersUpdater(activeFilters) 
			: newFiltersUpdater;
			
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
			certification: 'certification',
			sort_by: 'sort',
			page: 'page',
		};

		Object.entries(nextFilters).forEach(([key, value]) => {
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

	const removeFilter = (key, valToRemove = null) => {
		const next = { ...activeFilters };
		if (valToRemove !== null) {
			const cur = next[key].split(key === 'with_keywords' ? ',' : '|').filter(x => x !== valToRemove);
			next[key] = cur.join(key === 'with_keywords' ? ',' : '|');
		} else {
			next[key] = '';
		}
		handleFilterChange(next);
	};

	return (
		<div className='flex flex-col lg:flex-row gap-8 py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-screen bg-transparent'>
			
			{/* Mobile Header */}
			<div className='lg:hidden flex justify-between items-center mb-6'>
				<h2 className='text-3xl font-black tracking-tight text-foreground'>Browse</h2>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline' size='sm' className='gap-2 rounded-xl border-slate-700 bg-slate-900'>
							<Filter size={16} /> Filters
						</Button>
					</SheetTrigger>
					<SheetContent side='left' className='w-80 overflow-y-auto bg-slate-950 border-r-slate-800 pt-12'>
						<AdvancedSidebar 
							filters={activeFilters} 
							setFilters={handleFilterChange} 
						/>
					</SheetContent>
				</Sheet>
			</div>

			{/* Sidebar Desktop */}
			<aside className='hidden lg:block w-72 flex-shrink-0'>
				<div className='sticky top-24 bg-card/50 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl'>
					<AdvancedSidebar 
						filters={activeFilters} 
						setFilters={handleFilterChange} 
					/>
				</div>
			</aside>

			{/* Results Content */}
			<div className='flex-grow space-y-10'>
				
				{/* Promotional Banner */}
				<div className='relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-10 lg:p-14 border border-white/10 shadow-3xl group'>
					<div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8'>
						<div className='space-y-4'>
							<h2 className='text-4xl lg:text-5xl font-black text-white tracking-tight'>New this week</h2>
							<p className='text-blue-100/70 max-w-md text-lg leading-relaxed'>
								Fresh releases added across all your favorite streaming platforms.
							</p>
						</div>
						<Button 
							size='lg' 
							onClick={() => {
								resultRef.current?.scrollIntoView({ behavior: 'smooth' });
							}}
							className='bg-white/10 hover:bg-white/20 text-white rounded-2xl h-14 px-8 border border-white/20 backdrop-blur-md transition-all active:scale-95 text-lg font-bold'
						>
							Browse new arrivals
						</Button>
					</div>
					{/* Abstract Background Element */}
					<div className='absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000' />
				</div>

				{/* Header Section */}
				<div ref={resultRef} className='flex flex-col gap-6 pt-4'>
					<div className='flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4'>
						<div>
							<h1 className='text-5xl font-black tracking-tighter text-foreground mb-2'>
								{activeFilters.mediaType === 'movie' ? 'Movies' : 'TV Series'}
							</h1>
							<p className='text-muted-foreground text-lg font-medium'>
								Discover the perfect {activeFilters.mediaType === 'movie' ? 'movie' : 'series'}.
							</p>
						</div>
						
						{/* View Toggle & Mini Sort */}
						<div className='flex items-center gap-2 sm:gap-4 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto overflow-x-auto scrollbar-hide'>
							<div className='flex gap-1 flex-shrink-0'>
								<Button 
									variant={viewMode === 'grid' ? 'default' : 'ghost'} 
									size='sm' 
									className={`rounded-xl h-9 px-4 font-bold text-xs ${viewMode === 'grid' ? 'bg-white shadow-lg text-slate-900 hover:bg-white' : 'text-slate-500'}`}
									onClick={() => setViewMode('grid')}
								>
									Grid
								</Button>
								<Button 
									variant={viewMode === 'list' ? 'default' : 'ghost'} 
									size='sm' 
									className={`rounded-xl h-9 px-4 font-bold text-xs ${viewMode === 'list' ? 'bg-white shadow-lg text-slate-900 hover:bg-white' : 'text-slate-500'}`}
									onClick={() => setViewMode('list')}
								>
									List
								</Button>
							</div>
							<div className='hidden sm:block w-px h-6 bg-slate-700 mx-1 flex-shrink-0' />
							<SortSelect 
								value={activeFilters.sort_by} 
								onValueChange={(v) => handleFilterChange({ sort_by: v })} 
								className='h-9 border-0 bg-transparent text-xs font-black ring-0 focus:ring-0 w-[140px] sm:w-[180px] flex-shrink-0'
							/>
						</div>
					</div>

					{/* Active Filter Chips */}
					<div className='flex flex-wrap items-center gap-3'>
						{activeFilters.with_genres && activeFilters.with_genres.split('|').map(gid => {
							const genre = genres.find(g => String(g.id) === gid);
							return (
								<Badge key={gid} variant='secondary' className='pl-3 pr-1 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 gap-2 flex items-center font-bold text-xs'>
									{genre ? genre.name : gid} <X size={14} className='cursor-pointer hover:text-white transition-colors' onClick={() => removeFilter('with_genres', gid)} />
								</Badge>
							);
						})}
						{activeFilters.with_keywords && activeFilters.with_keywords.split(',').map(keyword => (
							<Badge key={keyword} variant='secondary' className='pl-3 pr-1 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 gap-2 flex items-center font-bold text-xs capitalize'>
								{keyword.replace(/-/g, ' ')} <X size={14} className='cursor-pointer hover:text-white transition-colors' onClick={() => removeFilter('with_keywords', keyword)} />
							</Badge>
						))}
						{activeFilters.with_original_language && activeFilters.with_original_language.split('|').map(lang => {
							const langMap = { en: 'English', ar: 'Arabic', tr: 'Turkish', es: 'Spanish', fr: 'French', ko: 'Korean', ja: 'Japanese' };
							return (
								<Badge key={lang} variant='secondary' className='pl-3 pr-1 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 gap-2 flex items-center font-bold text-xs'>
									{langMap[lang] || lang} <X size={14} className='cursor-pointer hover:text-white transition-colors' onClick={() => removeFilter('with_original_language', lang)} />
								</Badge>
							);
						})}
						{activeFilters.release_date_gte && (
							<Badge variant='secondary' className='pl-3 pr-1 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 gap-2 flex items-center font-bold text-xs'>
								{activeFilters.release_date_gte.substring(0, 4)}s <X size={14} className='cursor-pointer hover:text-white' onClick={() => { removeFilter('release_date_gte'); removeFilter('release_date_lte'); }} />
							</Badge>
						)}
						{activeFilters.certification && (
							<Badge variant='secondary' className='pl-3 pr-1 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 gap-2 flex items-center font-bold text-xs'>
								{activeFilters.certification} <X size={14} className='cursor-pointer hover:text-white' onClick={() => removeFilter('certification')} />
							</Badge>
						)}
						{(activeFilters.with_genres || activeFilters.release_date_gte || activeFilters.certification || activeFilters.with_keywords || activeFilters.with_original_language) && (
							<button 
								onClick={() => handleFilterChange({ ...activeFilters, with_genres: '', release_date_gte: '', release_date_lte: '', certification: '', with_keywords: '', with_original_language: '' })}
								className='text-xs font-black text-slate-500 hover:text-foreground ml-2 transition-colors underline underline-offset-4'
							>
								Clear all
							</button>
						)}
					</div>

					<div className='flex items-center gap-2'>
						<span className='text-sm font-black text-foreground'>{totalResults.toLocaleString()}</span>
						<span className='text-sm font-bold text-slate-500'>results found</span>
					</div>
				</div>

				{/* Search Bar */}
				<div className='relative group'>
					<Search size={20} className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
					<Input
						placeholder="Search in the output categories..."
						value={browseQuery}
						onChange={(e) => setBrowseQuery(e.target.value)}
						className='pl-14 pr-12 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 border-white/5 shadow-xl text-lg font-medium placeholder:text-slate-500 focus-visible:ring-blue-500/30'
					/>
					{browseQuery && (
						<button 
							onClick={() => setBrowseQuery('')}
							className='absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all'
						>
							<X size={20} className='text-slate-400' />
						</button>
					)}
				</div>

				{/* Movie Grid */}
				<div className='space-y-10'>
					<div className='flex items-center justify-between'>
						<h3 className='text-xl font-black text-foreground tracking-tight'>All results</h3>
						<button className='text-sm font-bold text-blue-500 hover:underline'>See all</button>
					</div>
					
					{(() => {
						const filteredMovies = data.filter(movie => {
							const title = (movie.title || movie.name || '').toLowerCase();
							return title.includes(browseQuery.toLowerCase());
						});
						
						if (filteredMovies.length === 0 && !loading) {
							return <EmptyState message='No matches found' description='Try adjusting filters.' />;
						}
						
						return (
							<div className='space-y-12'>
								<MovieList movies={filteredMovies} isLoading={loading} viewMode={viewMode} />
								{!browseQuery && (
									<div className='flex justify-center pt-8'>
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
						);
					})()}
				</div>
			</div>
		</div>
	);
};

export default Browse;
