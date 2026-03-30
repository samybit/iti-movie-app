import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { Skeleton } from '@/components/ui/skeleton';
import { Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TrailerSection = () => {
	const [trailers, setTrailers] = useState([]);
	const [loading, setLoading] = useState(true);
	const { t } = useLanguage();

	useEffect(() => {
		const fetchTrailers = async () => {
			try {
				const { data: movies } = await movieService.getNowPlaying();
				// Fetch videos for the first 5 movies
				const trailerData = await Promise.all(
					movies.results.slice(0, 5).map(async (movie) => {
						const { data: videos } = await movieService.getVideos(movie.id);
						const trailer = videos.results.find((v) => v.type === 'Trailer');
						return { ...movie, trailerKey: trailer?.key };
					})
				);
				setTrailers(trailerData.filter((t) => t.trailerKey));
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchTrailers();
	}, []);

	if (loading) {
		return <Skeleton className='h-[400px] w-full rounded-3xl my-8' />;
	}

	return (
		<div className='my-10 space-y-4'>
			<h3 className='text-2xl font-bold tracking-tight'>{t('latestTrailers')}</h3>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{trailers.map((movie) => (
					<div key={movie.id} className='relative group rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 shadow-xl'>
						<img
							src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
							alt={movie.title}
							className='w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300'
						/>
						<div className='absolute inset-0 flex flex-col items-center justify-center p-4 text-center'>
							<a
								href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
								target='_blank'
								rel='noreferrer'
								className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/20'
							>
								<Play className='fill-current' />
							</a>
							<div className='mt-4'>
								<h4 className='text-white font-bold text-lg line-clamp-1'>{movie.title}</h4>
								<p className='text-slate-300 text-sm'>{t('officialTrailer')}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TrailerSection;
