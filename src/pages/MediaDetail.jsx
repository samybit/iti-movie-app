import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { movieService } from '../services/movieService';
import { tvService } from '../services/tvService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, Calendar, Globe, DollarSign, Play, Heart } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { useWishlist } from '@/hooks/useWishlist';
import { useLanguage } from '@/contexts/LanguageContext';

const MediaDetail = ({ type }) => {
	const { id } = useParams();
	const { isWishlisted, toggleWishlist } = useWishlist();
	const [details, setDetails] = useState(null);
	const [credits, setCredits] = useState(null);
	const [videos, setVideos] = useState([]);

	const [similar, setSimilar] = useState([]);

	const [loading, setLoading] = useState(true);
	const { t, language } = useLanguage();

	usePageTitle(details?.title || details?.name || t('loadingDetails'));

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const service = type === 'movie' ? movieService : tvService;
				const [detailsRes, creditsRes, videosRes , similarRes ] = await Promise.all([
					service.getDetails(id),
					service.getCredits(id),
					service.getVideos(id),
					service.getSimilar(id),
				]);
				const data = detailsRes.data;
				setDetails(data);
				setCredits(creditsRes.data);
				setVideos(videosRes.data.results);
				setSimilar(similarRes.data.results);

				// 🕒 Track Visited History (for Account Sidebar)
				const newItem = {
					id: data.id,
					title: data.title || data.name,
					poster_path: data.poster_path,
					vote_average: data.vote_average,
					release_date: data.release_date || data.first_air_date,
					mediaType: type
				};
				
				const history = JSON.parse(localStorage.getItem('visitedHistory') || '[]');
				const filteredHistory = history.filter(item => item.id !== data.id);
				const newHistory = [newItem, ...filteredHistory].slice(0, 15);
				localStorage.setItem('visitedHistory', JSON.stringify(newHistory));

			} catch (error) {
				console.error('Error fetching media details:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		window.scrollTo(0, 0);
	}, [id, type, language]);

	if (loading) {
		return <MediaDetailSkeleton />;
	}

	if (!details) return null;

	const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
	const posterUrl = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : `https://placehold.co/500x750?text=${encodeURIComponent(t('noImage'))}`;
	const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    // i18n formatting
    const ratingDisplay = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(details.vote_average);
    const year = (details.release_date || details.first_air_date || '').split('-')[0];
    const yearDisplay = year ? new Intl.NumberFormat(language, { useGrouping: false }).format(year) : '';
    const budgetDisplay = details.budget > 0 ? new Intl.NumberFormat(language, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(details.budget) : null;
    const revenueDisplay = details.revenue > 0 ? new Intl.NumberFormat(language, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(details.revenue) : null;

    const statusMap = {
        'Released': t('statusReleased'),
        'Ended': t('statusEnded'),
        'In Production': t('statusInProduction'),
        'Returning Series': t('statusReturningSeries'),
        'Post Production': t('statusPostProduction'),
        'Planned': t('statusPlanned'),
    };
    const translatedStatus = statusMap[details.status] || details.status;

	return (
		<div className='overflow-hidden'>
			{/* Hero Section */}
			<div className='relative w-full h-[500px] lg:h-[600px] overflow-hidden'>
				{/* Backdrop */}
				<div 
					className='absolute inset-0 bg-cover bg-center transition-all duration-700'
					style={{ backgroundImage: `url(${backdropUrl})` }}
				>
					<div className='absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent' />
				</div>

				{/* Content Overlay */}
				<div className='relative h-full container flex flex-col lg:flex-row items-end lg:items-center gap-8 pb-12 lg:pb-0'>
					{/* Poster */}
					<div className='hidden lg:block w-72 h-[450px] shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10'>
						<img src={posterUrl} alt={details.title || details.name} className='w-full h-full object-cover' />
					</div>

					{/* Text Details */}
					<div className='flex-grow space-y-6'>
						<div className='space-y-2'>
							<h1 className='text-4xl lg:text-6xl font-black tracking-tighter'>
								{details.title || details.name}
							</h1>
							{details.tagline && (
								<p className='text-xl text-blue-600 dark:text-blue-400 font-medium italic'>{details.tagline}</p>
							)}
						</div>

						<div className='flex flex-wrap gap-4 items-center'>
							<div className='flex items-center gap-1.5 bg-yellow-400/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-400/20'>
								<Star size={16} fill="currentColor" />
								{ratingDisplay}
							</div>
							<div className='flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-sm'>
								<Calendar size={16} />
								{yearDisplay}
							</div>
							{details.runtime && (
								<div className='flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-sm'>
									<Clock size={16} />
									{details.runtime} {t('minutes')}
								</div>
							)}
							<div className='flex gap-2'>
								{details.genres?.map(g => (
									<Badge key={g.id} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
										{g.name}
									</Badge>
								))}
							</div>
						</div>

						<div className='max-w-3xl space-y-4'>
							<h3 className='text-xl font-bold uppercase tracking-widest text-slate-700 dark:text-slate-500'>{t('overview')}</h3>
							<p className='text-slate-700 dark:text-slate-300 leading-relaxed text-lg'>
								{details.overview}
							</p>
						</div>

						<div className='flex flex-wrap gap-4 pt-4'>
							{trailer && (
								<Button 
									size="lg" 
									className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black px-8 shadow-2xl shadow-blue-500/20"
									onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
								>
									<Play fill="currentColor" size={18} /> {t('watchTrailer')}
								</Button>
							)}
							<Button 
								size="lg" 
								variant={isWishlisted(details.id) ? 'default' : 'outline'}
								className={`h-12 rounded-xl gap-2 text-sm font-bold px-6 transition-all duration-300 active:scale-95 ${isWishlisted(details.id) ? 'bg-rose-500 hover:bg-rose-600 border-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-slate-200 border-slate-300 text-slate-900 hover:bg-slate-300 dark:bg-white/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40 backdrop-blur-sm'}`}
								onClick={() => toggleWishlist({
									id: details.id,
									title: details.title || details.name,
									poster_path: details.poster_path,
									mediaType: type,
									vote_average: details.vote_average
								})}
							>
								{isWishlisted(details.id) ? (
									<span className='flex items-center gap-2'>
										<Heart size={16} className='fill-current scale-110' />
										{t('removeWishlist')}
									</span>
								) : (
									<span className='flex items-center gap-2'>
										<Heart size={16} />
										{t('addWishlist')}
									</span>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Detailed Info Section */}
			<div className='container py-16 grid grid-cols-1 lg:grid-cols-4 gap-12'>
				<div className='lg:col-span-3 space-y-12'>
					{/* Cast Section */}
					<section className='space-y-6'>
						<h2 className='text-2xl font-bold'>{t('topCast')}</h2>
						<div className='flex gap-4 overflow-x-auto pb-4 custom-scrollbar'>
							{credits?.cast?.slice(0, 10).map(person => (
								<div key={person.id} className='w-32 shrink-0 space-y-3 group'>
									<div className='aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 shadow-md transition-transform group-hover:scale-105'>
										{person.profile_path ? (
											<img 
												src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} 
												alt={person.name} 
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center text-slate-600 font-bold text-center p-2'>
												{person.name}
											</div>
										)}
									</div>
									<div className='text-center'>
										<p className='text-sm font-bold line-clamp-1'>{person.name}</p>
										<p className='text-xs text-slate-500 line-clamp-1'>{person.character}</p>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Trailer Section (Embedded) */}
					{trailer && (
						<section className='space-y-6'>
							<h2 className='text-2xl font-bold'>{t('officialTrailer')}</h2>
							<div className='aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-900'>
								<iframe
									className='w-full h-full'
									src={`https://www.youtube.com/embed/${trailer.key}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						</section>
					)}

					{/* recommended movies & Similar Movies Section */}
					{similar.length > 0 && (
						<section className='space-y-6'>
							<h2 className='text-2xl font-bold'>
								{t('similar')} {type === 'movie' ? t('movies') : t('tvSeries')}
							</h2>

							<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
								{similar.slice(0, 10).map(item => (
									<Link
										key={item.id}
										to={`/${type}/${item.id}`}
										className='group space-y-3'
									>
										<div className='aspect-[2/3] rounded-xl overflow-hidden bg-slate-800'>
											{item.poster_path ? (
												<img
													src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
													alt={item.title || item.name}
													className='w-full h-full object-cover group-hover:scale-105 transition'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-slate-500'>
													{t('noImage')}
												</div>
											)}
										</div>

										<p className='text-sm font-semibold line-clamp-1'>
											{item.title || item.name}
										</p>
									</Link>
								))}
							</div>
						</section>
					)}

				</div>

				{/* Sidebar Info */}
				<aside className='space-y-8'>
					<div className='p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-800 dark:text-slate-200'>
						<div className='space-y-1'>
							<p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-400'>{t('status')}</p>
							<p className='font-semibold'>{translatedStatus}</p>
						</div>
						<div className='space-y-1'>
							<p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-400'>{t('originalLang')}</p>
							<p className='font-semibold uppercase'>{details.original_language}</p>
						</div>
						{budgetDisplay && (
							<div className='space-y-1'>
								<p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-400'>{t('budget')}</p>
								<p className='font-semibold'>{budgetDisplay}</p>
							</div>
						)}
						{revenueDisplay && (
							<div className='space-y-1'>
								<p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-400'>{t('revenue')}</p>
								<p className='font-semibold'>{revenueDisplay}</p>
							</div>
						)}
						<div className='space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800'>
							<p className='text-xs font-bold uppercase text-slate-500 dark:text-slate-400'>{t('keywords')}</p>
							<div className='flex flex-wrap gap-2'>
								{(details.keywords?.keywords || details.keywords?.results)?.slice(0, 10).map(k => (
									<Badge key={k.id} variant="outline" className="rounded-sm font-normal text-[10px] text-slate-500 dark:text-slate-400">
										{k.name}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
};

const MediaDetailSkeleton = () => (
	<div className='overflow-hidden space-y-12 pb-20'>
		<Skeleton className='w-full h-[600px]' />
		<div className='container grid grid-cols-1 lg:grid-cols-4 gap-12'>
			<div className='lg:col-span-3 space-y-12'>
				<div className='space-y-4'>
					<Skeleton className='h-8 w-48' />
					<div className='flex gap-4 overflow-hidden'>
						{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className='w-32 h-48 shrink-0 rounded-xl' />)}
					</div>
				</div>
				<Skeleton className='aspect-video w-full rounded-3xl' />
			</div>
			<Skeleton className='h-[400px] w-full rounded-2xl' />
		</div>
	</div>
);

export default MediaDetail;
