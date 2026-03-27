import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router';

const MovieCard = ({ movie, isWishlisted = false, onToggleWishlist }) => {
	const { id, title, poster_path, vote_average, release_date } = movie;
	const imageUrl = poster_path
		? `https://image.tmdb.org/t/p/w500${poster_path}`
		: 'https://placehold.co/500x750?text=No+Image';

	return (
		<Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group'>
			<div className='relative aspect-[2/3] overflow-hidden'>
				<img
					src={imageUrl}
					alt={title}
					className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
					loading='lazy'
				/>
				<div className='absolute top-2 right-2'>
					<Button
						variant='ghost'
						size='icon'
						className={`rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm ${
							isWishlisted ? 'text-red-500' : 'text-slate-500'
						}`}
						onClick={(e) => {
							e.preventDefault();
							onToggleWishlist?.(movie);
						}}
					>
						<Heart className={isWishlisted ? 'fill-current' : ''} size={20} />
					</Button>
				</div>
				<div className='absolute bottom-2 left-2'>
					<Badge variant='secondary' className='flex items-center gap-1 bg-yellow-400 text-yellow-950 border-none'>
						<Star size={14} className='fill-current' />
						{vote_average?.toFixed(1)}
					</Badge>
				</div>
			</div>
			<CardHeader className='p-4 pb-0'>
				<Link to={`/movie/${id}`} className='hover:no-underline'>
					<CardTitle className='text-md line-clamp-1 hover:text-blue-600 transition-colors'>
						{title}
					</CardTitle>
				</Link>
			</CardHeader>
			<CardContent className='p-4 pt-1 flex-grow'>
				<p className='text-xs text-slate-500'>
					{release_date ? new Date(release_date).getFullYear() : 'N/A'}
				</p>
			</CardContent>
			<CardFooter className='p-4 pt-0'>
				<Button asChild variant='outline' className='w-full'>
					<Link to={`/movie/${id}`}>View Details</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default MovieCard;
