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
		api.get(`/movie/${id}`),

	getVideos: (id) =>
		api.get(`/movie/${id}/videos`),

	getRecommendations: (id) =>
		api.get(`/movie/${id}/recommendations`),

	search: (query, page = 1) =>
		api.get('/search/movie', { params: { query, page } }),

	discover: (params) =>
		api.get('/discover/movie', { params }),

	getGenres: () =>
		api.get('/genre/movie/list'),

	getLanguages: () =>
		api.get('/configuration/languages'),

	getCountries: () =>
		api.get('/configuration/countries'),
};
