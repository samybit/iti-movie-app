import { useState, useEffect } from 'react';
import api from '@/lib/api';

/**
 * Custom hook to fetch movies based on different criteria.
 * @param {Object} options - Fetch options.
 * @param {string} options.type - 'now_playing', 'search', or 'discover'.
 * @param {string} options.query - The search query (used if type is 'search').
 * @param {number} options.page - The page number.
 * @param {string} options.sort_by - The sort parameter (used if type is 'discover').
 * @param {string} options.with_genres - Comma separated genre IDs (used if type is 'discover').
 * @param {string} options.language - Language code.
 */
export function useMovies({
	type = 'now_playing',
	query = '',
	page = 1,
	sort_by = 'popularity.desc',
	with_genres = '',
	language = 'en-US',
}) {
	const [movies, setMovies] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			setError(null);
			try {
				let endpoint = '/movie/now_playing';
				let params = { page, language };

				if (type === 'search' && query) {
					endpoint = '/search/movie';
					params.query = query;
				} else if (type === 'discover' || with_genres || sort_by !== 'popularity.desc') {
					endpoint = '/discover/movie';
					params.sort_by = sort_by;
					params.with_genres = with_genres;
				}

				const response = await api.get(endpoint, { params });
				setMovies(response.data.results);
				setTotalPages(response.data.total_pages);
			} catch (err) {
				setError(err.message || 'Failed to fetch movies');
			} finally {
				setLoading(false);
			}
		};

		// If it's a search but no query, don't fetch if it's strictly a search page
		if (type === 'search' && !query) {
			setMovies([]);
			setTotalPages(0);
			setLoading(false);
			return;
		}

		fetchMovies();
	}, [type, query, page, sort_by, with_genres, language]);

	return { movies, totalPages, loading, error };
}
