import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';

const MovieList = ({ movies, isLoading, totalPages }) => {
	if (isLoading) {
		return (
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
				{Array.from({ length: 10 }).map((_, i) => (
					<div key={i} className='flex flex-col space-y-3'>
						<Skeleton className='h-[350px] w-full rounded-xl' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[250px]' />
							<Skeleton className='h-4 w-[200px]' />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
			{movies.map((movie) => (
				<MovieCard key={movie.id} movie={movie} />
			))}
		</div>
	);
};

export default MovieList;
