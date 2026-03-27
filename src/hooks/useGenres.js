import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useGenres() {
	const [genres, setGenres] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const response = await api.get('/genre/movie/list');
				setGenres(response.data.genres);
			} catch (err) {
				setError(err.message || 'Failed to fetch genres');
			} finally {
				setLoading(false);
			}
		};

		fetchGenres();
	}, []);

	return { genres, loading, error };
}
