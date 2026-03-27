import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router';

const MovieCard = ({ movie, isWishlisted = false, onToggleWishlist }) => {
	const { id, title, name, poster_path, vote_average, release_date, first_air_date } = movie;
	const displayTitle = title || name || 'Unknown';
	const displayDate = release_date || first_air_date;
	const mediaType = title ? 'movie' : 'tv';
	const imageUrl = poster_path
		? `https://image.tmdb.org/t/p/w500${poster_path}`
		: 'https://placehold.co/500x750?text=No+Image';
	const isComingSoon = displayDate && new Date(displayDate) > new Date();

	// Color-coded rating
	const ratingColor =
		vote_average >= 7 ? 'bg-green-500 text-white' :
		vote_average >= 5 ? 'bg-yellow-400 text-yellow-950' :
		'bg-red-500 text-white';

	return (
		<Card className='overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full group rounded-2xl bg-white'>
			<div className='relative aspect-[2/3] overflow-hidden rounded-t-2xl'>
				<Link to={`/${mediaType}/${id}`} className='block w-full h-full'>
					<img
						src={imageUrl}
						alt={displayTitle}
						className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
						loading='lazy'
					/>
					{/* Gradient overlay for readability */}
					<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
				</Link>

				{/* Coming Soon badge */}
				{isComingSoon && (
					<div className='absolute top-3 left-3'>
						<Badge className='bg-amber-500/90 backdrop-blur-sm text-white border-none shadow-lg font-bold text-[10px] px-2.5 py-1 animate-pulse'>
							Coming Soon
						</Badge>
					</div>
				)}

				{/* Wishlist heart */}
				<div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
					<Button
						variant='ghost'
						size='icon'
						className={`rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20 shadow-lg ${
							isWishlisted ? 'text-red-400 opacity-100' : 'text-white'
						}`}
						onClick={(e) => {
							e.preventDefault();
							onToggleWishlist?.(movie);
						}}
					>
						<Heart className={isWishlisted ? 'fill-current' : ''} size={18} />
					</Button>
				</div>

				{/* Rating badge */}
				<div className='absolute bottom-3 left-3'>
					<div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black shadow-lg backdrop-blur-sm ${ratingColor}`}>
						<Star size={12} className='fill-current' />
						{vote_average?.toFixed(1)}
					</div>
				</div>

				{/* View details on hover */}
				<div className='absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
					<Link to={`/${mediaType}/${id}`}>
						<Button size='sm' className='rounded-xl bg-white/90 text-slate-900 hover:bg-white text-xs font-bold shadow-lg backdrop-blur-sm h-8 px-3'>
							Details →
						</Button>
					</Link>
				</div>
			</div>

			{/* Card body */}
			<CardHeader className='p-3 pb-0'>
				<Link to={`/${mediaType}/${id}`} className='hover:no-underline'>
					<CardTitle className='text-sm font-bold line-clamp-1 hover:text-blue-600 transition-colors'>
						{displayTitle}
					</CardTitle>
				</Link>
			</CardHeader>
			<CardContent className='p-3 pt-1 flex-grow'>
				<p className='text-[11px] text-slate-400 flex items-center gap-1'>
					<Calendar size={10} />
					{displayDate ? new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
				</p>
			</CardContent>
		</Card>
	);
};

export default MovieCard;
