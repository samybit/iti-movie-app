import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTMDBAuth } from '../contexts/TMDBAuthContext';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TMDBCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { handleCallback } = useTMDBAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const requestToken = urlParams.get('request_token');
      const approved = urlParams.get('approved');

      if (approved === 'true' && requestToken) {
        try {
          await handleCallback(requestToken);
          navigate('/');
        } catch (err) {
          setError(t('tmdbLoginFailed'));
        }
      } else if (approved === 'false') {
        setError(t('tmdbLoginNotApproved'));
      } else {
        setError(t('tmdbInvalidRequest'));
      }
    };

    processCallback();
  }, [handleCallback, navigate, t]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
        <button 
          onClick={() => navigate('/register')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('backToRegister')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-600">{t('tmdbProcessing')}</p>
    </div>
  );
};

export default TMDBCallback;