import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';

export function useLanguages() {
	const [languages, setLanguages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		movieService.getLanguages().then((res) => {
			// Sort to have English, Turkish at top or just alphabetical
			setLanguages(res.data.sort((a, b) => a.english_name.localeCompare(b.english_name)));
			setLoading(false);
		});
	}, []);

	return { languages, loading };
}
