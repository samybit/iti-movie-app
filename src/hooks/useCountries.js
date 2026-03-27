import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

export function useCountries() {
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		movieService.getCountries().then((res) => {
			setCountries(res.data.sort((a, b) => a.english_name.localeCompare(b.english_name)));
			setLoading(false);
		});
	}, []);

	return { countries, loading };
}
