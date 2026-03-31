import { createContext, useContext, useState, useEffect } from 'react';
import { createRequestToken, createSession, getAccountDetails, deleteSession } from '../services/tmdbAuthService';

const TMDBAuthContext = createContext();

export const useTMDBAuth = () => useContext(TMDBAuthContext);

export const TMDBAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkSession = async () => {
      const storedSession = localStorage.getItem('tmdb_session_id');
      const storedUser = localStorage.getItem('tmdb_user');
      
      if (storedSession && storedUser) {
        setSessionId(storedSession);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    
    checkSession();
  }, []);


  const loginWithTMDB = async () => {
    try {
      const tokenData = await createRequestToken();
      const requestToken = tokenData.request_token;
      
      localStorage.setItem('tmdb_request_token', requestToken);
      
      const approveUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${window.location.origin}/tmdb-callback`;
      window.location.href = approveUrl;
      
    } catch (error) {
      console.error('TMDB login failed:', error);
      throw error;
    }
  };


  const handleCallback = async (requestToken) => {
    try {
      const sessionData = await createSession(requestToken);
      const sessionId = sessionData.session_id;
      
      const accountDetails = await getAccountDetails(sessionId);
      
      const userData = {
        id: accountDetails.id,
        name: accountDetails.username,
        email: accountDetails.email || `${accountDetails.username}@tmdb.com`,
        avatar: accountDetails.avatar?.tmdb?.avatar_path 
          ? `https://www.themoviedb.org/t/p/w150${accountDetails.avatar.tmdb.avatar_path}`
          : null,
        provider: 'tmdb',
        sessionId: sessionId
      };
      
      localStorage.setItem('tmdb_session_id', sessionId);
      localStorage.setItem('tmdb_user', JSON.stringify(userData));
      localStorage.removeItem('tmdb_request_token');
      
      setSessionId(sessionId);
      setUser(userData);
      
      return userData;
      
    } catch (error) {
      console.error('TMDB callback failed:', error);
      throw error;
    }
  };


  const logout = async () => {
    if (sessionId) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
    
    localStorage.removeItem('tmdb_session_id');
    localStorage.removeItem('tmdb_user');
    setSessionId(null);
    setUser(null);
  };

  const value = {
    user,
    sessionId,
    loading,
    loginWithTMDB,
    handleCallback,
    logout,
    isAuthenticated: !!user
  };

  return (
    <TMDBAuthContext.Provider value={value}>
      {children}
    </TMDBAuthContext.Provider>
  );
};