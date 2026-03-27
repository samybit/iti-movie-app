import api from '../lib/api';

export const tvService = {
	getTrending: (window = 'day') =>
		api.get(`/trending/tv/${window}`),

	getPopular: (page = 1) =>
		api.get('/tv/popular', { params: { page } }),

	search: (query, page = 1) =>
		api.get('/search/tv', { params: { query, page } }),

	discover: (params) =>
		api.get('/discover/tv', { params }),

	getGenres: (language = 'en-US') => 
		api.get('/genre/tv/list', { params: { language } }),

	getDetails: (id) =>
		api.get(`/tv/${id}`, { params: { append_to_response: 'keywords' } }),

	getVideos: (id) =>
		api.get(`/tv/${id}/videos`),

	getCredits: (id) =>
		api.get(`/tv/${id}/credits`),
};
