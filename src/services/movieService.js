import api from '../lib/api';

export const movieService = {
	getNowPlaying: (page = 1, language = 'en-US') =>
		api.get('/movie/now_playing', { params: { page, language } }),

	getTrending: (window = 'day') =>
		api.get(`/trending/movie/${window}`),

	getPopular: (page = 1) =>
		api.get('/movie/popular', { params: { page } }),

	getTopRated: (page = 1) =>
		api.get('/movie/top_rated', { params: { page } }),

	getUpcoming: (page = 1) =>
		api.get('/movie/upcoming', { params: { page } }),

	getDetails: (id) =>
		api.get(`/movie/${id}`, { params: { append_to_response: 'keywords' } }),

	getVideos: (id) =>
		api.get(`/movie/${id}/videos`),

	getCredits: (id) =>
		api.get(`/movie/${id}/credits`),

	getRecommendations: (id) =>
		api.get(`/movie/${id}/recommendations`),

	getSimilar: (id) =>
	api.get(`/movie/${id}/similar`),

	search: (query, page = 1) =>
		api.get('/search/movie', { params: { query, page } }),

	discover: (params) =>
		api.get('/discover/movie', { params }),

	getGenres: (language = 'en-US') => 
		api.get('/genre/movie/list', { params: { language } }),

	getLanguages: () =>
		api.get('/configuration/languages'),

	getCountries: () =>
		api.get('/configuration/countries'),
};
