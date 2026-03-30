import axios from 'axios';

const api = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
	},
	params: {
		api_key: import.meta.env.VITE_TMDB_API_KEY,
	},
});

// Intercept every request to dynamically append the active language
api.interceptors.request.use((config) => {
	const lang = localStorage.getItem('app-language') || 'en';
	const tmdbLangMap = {
		en: 'en-US',
		ar: 'ar-SA',
		fr: 'fr-FR',
		zh: 'zh-CN',
	};
	config.params = {
		...config.params,
		language: tmdbLangMap[lang] || 'en-US',
	};
	return config;
});

export default api;
