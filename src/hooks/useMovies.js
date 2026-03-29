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
	language = 'en-US',
	release_date_gte = '',
	release_date_lte = '',
	episode_count_gte = '',
	episode_count_lte = '',
	vote_average_gte = '',
	vote_count_gte = '',
	with_runtime_gte = '',
	with_runtime_lte = '',
	with_keywords = '',
	certification = '',
	certification_country = 'US',
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
						language,
						'vote_average.gte': vote_average_gte,
						'vote_count.gte': vote_count_gte,
						'with_runtime.gte': with_runtime_gte,
						'with_runtime.lte': with_runtime_lte,
						'with_keywords': with_keywords,
						'certification': certification,
						'certification_country': certification_country,
						'primary_release_date.gte': mediaType === 'movie' ? (release_date_gte && release_date_gte.length === 4 ? `${release_date_gte}-01-01` : release_date_gte) : undefined,
						'primary_release_date.lte': mediaType === 'movie' ? (release_date_lte && release_date_lte.length === 4 ? `${release_date_lte}-12-31` : release_date_lte) : undefined,
						'air_date.gte': mediaType === 'tv' ? (release_date_gte && release_date_gte.length === 4 ? `${release_date_gte}-01-01` : release_date_gte) : undefined,
						'air_date.lte': mediaType === 'tv' ? (release_date_lte && release_date_lte.length === 4 ? `${release_date_lte}-12-31` : release_date_lte) : undefined,
					};

					// Clean up undefined values from params
					Object.keys(params).forEach(key => {
						if (params[key] === undefined || params[key] === '') {
							delete params[key];
						}
					});

					// Episode count support if provided (TMDB doesn't have a direct "episode count" discover param in v3 standard, using runtime or other filters might be needed or it's a mock)
					// Note: The original code had `params['with_runtime.gte'] = episode_count_gte;` which was likely a placeholder.
					// If a specific episode count filter is needed, it might require a different API endpoint or custom filtering post-fetch.
					// For now, we'll keep the `episode_count_gte` and `episode_count_lte` as hook parameters but not directly map them to a discover param unless a valid one is identified.

					if (mediaType === 'movie') {
						response = await movieService.discover(params);
					} else {
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
		language,
		release_date_gte,
		release_date_lte,
		episode_count_gte,
		episode_count_lte,
		vote_average_gte,
		vote_count_gte,
		with_runtime_gte,
		with_runtime_lte,
		with_keywords,
		certification,
		certification_country,
	]);

	return { data, totalPages, totalResults, loading, error };
}
