import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { tvService } from '../services/tvService';

export function useGenres(type = 'movie', language = 'en-US') {
	const [genres, setGenres] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGenres = async () => {
			setLoading(true);
			try {
				const service = type === 'tv' ? tvService : movieService;
				const response = await service.getGenres(language);
				setGenres(response.data.genres);
			} catch (err) {
				setError(err.message || 'Failed to fetch genres');
			} finally {
				setLoading(false);
			}
		};

		fetchGenres();
	}, [type, language]);

	return { genres, loading, error };
}
