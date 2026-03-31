import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';


export const createRequestToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/authentication/token/new`, {
      params: { api_key: API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating request token:', error);
    throw error;
  }
};


export const createSession = async (requestToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/authentication/session/new`, {
      api_key: API_KEY,
      request_token: requestToken
    });
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};


export const getAccountDetails = async (sessionId) => {
  try {
    const response = await axios.get(`${BASE_URL}/account`, {
      params: {
        api_key: API_KEY,
        session_id: sessionId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting account details:', error);
    throw error;
  }
};


export const deleteSession = async (sessionId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/authentication/session`, {
      data: {
        api_key: API_KEY,
        session_id: sessionId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};