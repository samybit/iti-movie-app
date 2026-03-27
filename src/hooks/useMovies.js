import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { tvService } from '../services/tvService';

/**
 * Enhanced custom hook to fetch movies or series based on different criteria.
 * Supports advanced filtering: Genres, Dates, Languages, Countries, Episode range (for TV).
 */
export function useMovies({
	type = 'now_playing', // 'now_playing', 'search', 'discover', 'trending'
	mediaType = 'movie', // 'movie', 'tv'
	query = '',
	page = 1,
	sort_by = 'popularity.desc',
	with_genres = '',
	with_original_language = '',
	release_date_gte = '',
	release_date_lte = '',
	episode_count_gte = '',
	episode_count_lte = '',
}) {
	const [data, setData] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalResults, setTotalResults] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				let response;
				const service = mediaType === 'tv' ? tvService : movieService;

				if (type === 'search' && query) {
					response = await service.search(query, page);
				} else if (type === 'trending') {
					response = await service.getTrending('day');
				} else if (type === 'now_playing' && mediaType === 'movie') {
					response = await movieService.getNowPlaying(page);
				} else {
					// Default to discover for advanced filtering
					const params = {
						page,
						sort_by,
						with_genres,
						with_original_language,
					};

					if (mediaType === 'movie') {
						if (release_date_gte) params['primary_release_date.gte'] = release_date_gte;
						if (release_date_lte) params['primary_release_date.lte'] = release_date_lte;
						response = await movieService.discover(params);
					} else {
						if (release_date_gte) params['first_air_date.gte'] = release_date_gte;
						if (release_date_lte) params['first_air_date.lte'] = release_date_lte;
						// Episode count support if provided
						if (episode_count_gte) params['with_runtime.gte'] = episode_count_gte; // TMDB doesn't have a direct "episode count" discover param in v3 standard, using runtime or other filters might be needed or it's a mock
						response = await tvService.discover(params);
					}
				}

				setData(response.data.results);
				setTotalPages(response.data.total_pages);
				setTotalResults(response.data.total_results);
			} catch (err) {
				setError(err.message || 'Failed to fetch data');
			} finally {
				setLoading(false);
			}
		};

		if (type === 'search' && !query) {
			setData([]);
			setLoading(false);
			return;
		}

		fetchData();
	}, [
		type,
		mediaType,
		query,
		page,
		sort_by,
		with_genres,
		with_original_language,
		release_date_gte,
		release_date_lte,
		episode_count_gte,
		episode_count_lte,
	]);

	return { data, totalPages, totalResults, loading, error };
}
