import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { movieService } from '../services/movieService';
import { tvService } from '../services/tvService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, Calendar, Globe, DollarSign, Play } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';

const MediaDetail = ({ type }) => {
	const { id } = useParams();
	const [details, setDetails] = useState(null);
	const [credits, setCredits] = useState(null);
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	usePageTitle(details?.title || details?.name || 'Loading details...');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const service = type === 'movie' ? movieService : tvService;
				const [detailsRes, creditsRes, videosRes] = await Promise.all([
					service.getDetails(id),
					service.getCredits(id),
					service.getVideos(id),
				]);
				setDetails(detailsRes.data);
				setCredits(creditsRes.data);
				setVideos(videosRes.data.results);
			} catch (error) {
				console.error('Error fetching media details:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		window.scrollTo(0, 0);
	}, [id, type]);

	if (loading) {
		return <MediaDetailSkeleton />;
	}

	if (!details) return null;

	const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
	const posterUrl = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
	const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

	return (
		<div className='-mx-4 sm:-mx-8 lg:-mx-12'>
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
								<p className='text-xl text-blue-400 font-medium italic'>{details.tagline}</p>
							)}
						</div>

						<div className='flex flex-wrap gap-4 items-center'>
							<div className='flex items-center gap-1.5 bg-yellow-400/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-400/20'>
								<Star size={16} fill="currentColor" />
								{details.vote_average.toFixed(1)}
							</div>
							<div className='flex items-center gap-1.5 text-slate-400 text-sm'>
								<Calendar size={16} />
								{(details.release_date || details.first_air_date || '').split('-')[0]}
							</div>
							{details.runtime && (
								<div className='flex items-center gap-1.5 text-slate-400 text-sm'>
									<Clock size={16} />
									{details.runtime} min
								</div>
							)}
							<div className='flex gap-2'>
								{details.genres?.map(g => (
									<Badge key={g.id} variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
										{g.name}
									</Badge>
								))}
							</div>
						</div>

						<div className='max-w-3xl space-y-4'>
							<h3 className='text-xl font-bold uppercase tracking-widest text-slate-500'>Overview</h3>
							<p className='text-slate-300 leading-relaxed text-lg'>
								{details.overview}
							</p>
						</div>

						{trailer && (
							<Button 
								size="lg" 
								className="rounded-full bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-8"
								onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
							>
								<Play fill="white" size={18} /> Watch Trailer
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Detailed Info Section */}
			<div className='container py-16 grid grid-cols-1 lg:grid-cols-4 gap-12'>
				<div className='lg:col-span-3 space-y-12'>
					{/* Cast Section */}
					<section className='space-y-6'>
						<h2 className='text-2xl font-bold'>Top Billed Cast</h2>
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
							<h2 className='text-2xl font-bold'>Official Trailer</h2>
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
				</div>

				{/* Sidebar Info */}
				<aside className='space-y-8'>
					<div className='p-6 rounded-2xl bg-white border shadow-sm space-y-6'>
						<div className='space-y-1'>
							<p className='text-xs font-bold uppercase text-slate-400'>Status</p>
							<p className='font-semibold'>{details.status}</p>
						</div>
						<div className='space-y-1'>
							<p className='text-xs font-bold uppercase text-slate-400'>Original Language</p>
							<p className='font-semibold uppercase'>{details.original_language}</p>
						</div>
						{details.budget > 0 && (
							<div className='space-y-1'>
								<p className='text-xs font-bold uppercase text-slate-400'>Budget</p>
								<p className='font-semibold'>${details.budget.toLocaleString()}</p>
							</div>
						)}
						{details.revenue > 0 && (
							<div className='space-y-1'>
								<p className='text-xs font-bold uppercase text-slate-400'>Revenue</p>
								<p className='font-semibold'>${details.revenue.toLocaleString()}</p>
							</div>
						)}
						<div className='space-y-4 pt-4 border-t'>
							<p className='text-xs font-bold uppercase text-slate-400'>Keywords</p>
							<div className='flex flex-wrap gap-2'>
								{(details.keywords?.keywords || details.keywords?.results)?.slice(0, 10).map(k => (
									<Badge key={k.id} variant="outline" className="rounded-sm font-normal text-[10px] text-slate-500">
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
	<div className='-mx-4 sm:-mx-8 lg:-mx-12 space-y-12 pb-20'>
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
