import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';

const HorizontalScroll = ({ title, data, isLoading, mediaType = 'movie' }) => {
	if (isLoading) {
		return (
			<div className='space-y-4 my-8'>
				<Skeleton className='h-8 w-48' />
				<div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className='min-w-[200px] max-w-[200px] space-y-3'>
							<Skeleton className='h-[300px] w-full rounded-xl' />
							<Skeleton className='h-4 w-full' />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-4 my-8 relative'>
			<div className='flex items-center justify-between'>
				<h3 className='text-2xl font-bold tracking-tight'>{title}</h3>
			</div>
			<div className='flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x'>
				{data.map((item) => (
					<div key={item.id} className='min-w-[200px] max-w-[200px] snap-start'>
						<MovieCard movie={item} />
					</div>
				))}
			</div>
		</div>
	);
};

export default HorizontalScroll;
