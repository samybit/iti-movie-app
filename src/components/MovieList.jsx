import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useWishlist } from '../hooks/useWishlist';

const MovieList = ({ movies, isLoading, viewMode = 'grid' }) => {
	const { isWishlisted, toggleWishlist } = useWishlist();

	if (isLoading) {
		const skeletonCount = 10;
		return (
			<div className={viewMode === 'grid' 
				? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8' 
				: 'flex flex-col gap-6'
			}>
				{Array.from({ length: skeletonCount }).map((_, i) => (
					<div key={i} className='flex flex-col space-y-4'>
						<Skeleton className={viewMode === 'grid' ? 'h-[350px] w-full rounded-[2.5rem]' : 'h-48 w-full rounded-[2rem]'} />
						<div className='space-y-2 px-4'>
							<Skeleton className='h-4 w-3/4' />
							<Skeleton className='h-3 w-1/2' />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={viewMode === 'grid' 
			? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8' 
			: 'flex flex-col gap-6'
		}>
			{movies.map((movie) => (
				<MovieCard 
					key={movie.id} 
					movie={movie} 
					isWishlisted={isWishlisted(movie.id)}
					onToggleWishlist={() => toggleWishlist(movie)}
					viewMode={viewMode}
				/>
			))}
		</div>
	);
};

export default MovieList;
