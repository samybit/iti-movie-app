import { Heart, Star, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';
import { useLanguage } from '@/contexts/LanguageContext';

// TMDB image base URL
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, isWishlisted = false, onToggleWishlist, viewMode = 'grid' }) => {
	const { t, language } = useLanguage();
	const { id, title, name, poster_path, vote_average, release_date, first_air_date, genre_ids } = movie;
	const displayTitle = title || name || 'Unknown';
	const displayDate = release_date || first_air_date;
	const year = displayDate ? new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : language, { useGrouping: false }).format(new Date(displayDate).getFullYear()) : t('tba') || 'TBA';
	const mediaType = title ? 'movie' : 'tv';
	const imageUrl = poster_path
		? `https://image.tmdb.org/t/p/w500${poster_path}`
		: 'https://placehold.co/500x750?text=No+Image';

	// Color-coded rating
	const ratingColor =
		vote_average >= 7 ? 'bg-green-500' :
			vote_average >= 5 ? 'bg-yellow-400' :
				'bg-red-500';

	const ratingDisplay = new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : language, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(vote_average || 0);
	// Simulated duration & provider for UI matching
	const duration = mediaType === 'movie' ? (language === 'ar' ? 'ساعتان و 15 د' : language === 'fr' ? '2h 15m' : language === 'zh' ? '2小时 15分钟' : '2h 15m') : `1 ${t('season') || 'Season'}`;
	const providers = [
		{ name: 'Netflix', color: 'bg-red-600' },
		{ name: 'Amazon', color: 'bg-blue-900' },
		{ name: 'Disney+', color: 'bg-indigo-950' }
	];
	const randomProvider = providers[id % 3];

	if (viewMode === 'list') {
		return (
			<Link to={`/${mediaType}/${id}`} className='flex items-center gap-6 p-4 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 transition-all group'>
				<div className='w-40 aspect-[2/3] overflow-hidden rounded-2xl flex-shrink-0'>
					<img src={imageUrl} alt={displayTitle} className='w-full h-full object-cover transition-transform group-hover:scale-110' />
				</div>
				<div className='flex-grow space-y-4'>
					<div className='flex justify-between items-start'>
						<div>
							<h3 className='text-3xl font-black text-foreground'>{displayTitle}</h3>
							<div className='flex items-center gap-3 text-slate-400 font-bold text-sm'>
								<span>{year}</span>
								<span>•</span>
								<span>{duration}</span>
							</div>
						</div>
						<Button
							variant='ghost'
							size='icon'
							className={`rounded-xl border border-white/10 ${isWishlisted ? 'text-blue-500 bg-blue-500/10 border-blue-500/30' : 'text-slate-400'}`}
							onClick={(e) => { e.preventDefault(); onToggleWishlist?.(movie); }}
						>
							<Heart className={isWishlisted ? 'fill-current' : ''} size={20} />
						</Button>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500 text-white text-sm font-black'>
							<Star size={14} className='fill-current' />
							{ratingDisplay}
						</div>
						<div className='flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden'>
							<div className='h-full bg-green-500 rounded-full' style={{ width: `${vote_average * 10}%` }} />
						</div>
						<span className='text-xs font-black text-slate-500 uppercase'>{t('match') || 'Match'}</span>
					</div>
				</div>
			</Link>
		);
	}

	return (
		<div className='group flex flex-col gap-4 animate-in fade-in zoom-in duration-500'>
			<div className='relative aspect-[2/3] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl transition-all hover:shadow-blue-500/10'>
				<Link to={`/${mediaType}/${id}`} className='block w-full h-full'>
					<img
						src={imageUrl}
						alt={displayTitle}
						className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
						loading='lazy'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20' />
				</Link>

				{/* Streamer Badge */}
				<div className='absolute top-5 left-5'>
					<div className={`px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md text-[10px] uppercase font-black tracking-widest text-white ${randomProvider.color}`}>
						{randomProvider.name}
					</div>
				</div>

				{/* Rating Badge */}
				<div className='absolute bottom-5 left-5'>
					<div className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500 text-white text-xs font-black shadow-xl'>
						<Star size={14} className='fill-current' />
						{ratingDisplay}
					</div>
				</div>

				{/* Wishlist Button */}
				<div className='absolute top-5 right-5'>
					<Button
						variant='ghost'
						size='icon'
						className={`rounded-2xl backdrop-blur-md border border-white/10 shadow-xl transition-all ${
							isWishlisted 
							? 'bg-blue-600 text-white border-blue-400' 
							: 'bg-black/20 text-white hover:bg-black/40'
						}`}
						onClick={(e) => {
							e.preventDefault();
							onToggleWishlist?.(movie);
						}}
					>
						<Heart className={isWishlisted ? 'fill-current' : ''} size={20} />
					</Button>
				</div>
			</div>

			{/* Info Area */}
			<div className='px-4 space-y-1'>
				<h3 className='text-lg font-black text-foreground truncate group-hover:text-blue-500 transition-colors'>
					{displayTitle}
				</h3>
				<div className='flex items-center gap-2 text-xs font-bold text-slate-500'>
					<span>{year}</span>
					<span className='w-1 h-1 bg-slate-700 rounded-full' />
					<span>{duration}</span>
				</div>
                <div className='pt-2'>
                    <div className='h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                        <div className='h-full bg-green-500 rounded-full transition-all duration-1000 delay-300' style={{ width: `${vote_average * 10}%` }} />
                    </div>
                    <div className='flex justify-between items-center mt-1'>
                        <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{t('match') || 'Match'}</span>
                    </div>
                </div>
			</div>
		</div>
	);
};

export default MovieCard;
