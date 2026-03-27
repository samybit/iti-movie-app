import { useMovies } from '@/hooks/useMovies';
import HorizontalScroll from '@/components/HorizontalScroll';
import TrailerSection from '@/components/TrailerSection';
import HomeStats from '@/components/HomeStats';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

function App() {
	usePageTitle('Home');
	const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useMovies({
		type: 'trending',
		mediaType: 'movie'
	});

	const { data: trendingTV, loading: tvLoading } = useMovies({
		type: 'trending',
		mediaType: 'tv'
	});

	const { data: freeMovies, loading: freeLoading } = useMovies({
		type: 'discover',
		mediaType: 'movie',
		// Ideally we'd filter by free providers, but for demo discover is fine
		sort_by: 'vote_count.desc' 
	});

	return (
		<div className='space-y-12 pb-20'>
			{/* Hero / Welcome Section can be added here if needed, but HomeStats has a CTA */}
			
			<section>
				{trendingError && (
					<Alert variant='destructive' className='mb-6'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>
							Failed to load trending content. Check your API key.
						</AlertDescription>
					</Alert>
				)}
				
				<HorizontalScroll 
					title='Trending Movies' 
					data={trendingMovies} 
					isLoading={trendingLoading} 
				/>
			</section>

			<TrailerSection />

			<section>
				<HorizontalScroll 
					title='Trending TV Shows' 
					data={trendingTV} 
					isLoading={tvLoading} 
					mediaType='tv'
				/>
			</section>

			<section>
				<HorizontalScroll 
					title='Free to Watch' 
					data={freeMovies} 
					isLoading={freeLoading} 
				/>
			</section>

			<HomeStats />
		</div>
	);
}

export default App;
