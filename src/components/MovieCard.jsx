import { Heart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';

// TMDB image base URL
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, isWishlisted = false, onToggleWishlist }) => {
	// Safely extract TMDB data with fallbacks for both Movies and Series
	const id = movie?.id;
	const title = movie?.title || movie?.name || 'Unknown Title';
	const releaseYear = (movie?.release_date || movie?.first_air_date) 
		? new Date(movie.release_date || movie.first_air_date).getFullYear() 
		: 'N/A';
	const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : 'NR';
	const posterUrl = movie?.poster_path
		? `${IMAGE_BASE_URL}${movie.poster_path}`
		: 'https://placehold.co/500x750/1f2937/ffffff?text=No+Poster';

	const mediaType = movie?.title ? 'movie' : 'tv';

	return (
		<Card className='group relative overflow-hidden flex flex-col h-full border-slate-200 bg-white hover:shadow-2xl hover:border-blue-200 transition-all duration-300 rounded-2xl'>
			{/* Poster Image Container */}
			<div className='relative aspect-[2/3] overflow-hidden bg-slate-100'>
				<img
					src={posterUrl}
					alt={`${title} poster`}
					className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-110'
					loading='lazy'
				/>

				{/* Rating Badge Overlay */}
				<div className='absolute top-3 left-3'>
					<Badge className='flex items-center gap-1 bg-black/60 text-white border-none backdrop-blur-md px-2 py-1'>
						<Star className='w-3 h-3 text-yellow-400 fill-yellow-400' />
						<span className='font-bold text-xs'>{rating}</span>
					</Badge>
				</div>

				{/* Wishlist Button Overlay */}
				<div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
					<Button
						variant='ghost'
						size='icon'
						className={`w-9 h-9 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-90 ${
							isWishlisted ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-white hover:bg-black/60'
						}`}
						onClick={(e) => {
							e.preventDefault();
							onToggleWishlist?.(movie);
						}}
					>
						<Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
						<span className='sr-only'>Toggle wishlist</span>
					</Button>
				</div>
			</div>

			{/* Card Body */}
			<CardHeader className='p-4 pb-0'>
				<Link to={`/${mediaType}/${id}`} className='hover:no-underline'>
					<CardTitle className='text-base font-bold line-clamp-1 group-hover:text-blue-600 transition-colors' title={title}>
						{title}
					</CardTitle>
				</Link>
			</CardHeader>
			
			<CardContent className='p-4 pt-1 flex-grow flex flex-col justify-between'>
				<div className='flex items-center justify-between'>
					<p className='text-xs font-medium text-slate-500 uppercase tracking-tighter'>
						{mediaType === 'movie' ? 'Movie' : 'TV Series'}
					</p>
					<p className='text-xs font-bold text-slate-400'>
						{releaseYear}
					</p>
				</div>
			</CardContent>

			<CardFooter className='p-4 pt-0'>
				<Button asChild variant='outline' className='w-full rounded-xl border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group/btn'>
					<Link to={`/${mediaType}/${id}`} className='flex items-center justify-center gap-2'>
						<span>View Details</span>
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default MovieCard;
