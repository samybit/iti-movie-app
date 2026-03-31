import { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Clock, Film, Tv } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '@/contexts/LanguageContext';
import usePageTitle from '@/hooks/usePageTitle';

export default function History() {
  const { t } = useLanguage();
  usePageTitle(t('history'));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('visitedHistory') || '[]');
    setHistory(saved);
  }, []);

  const removeItem = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem('visitedHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const clearHistory = () => {
    localStorage.removeItem('visitedHistory');
    setHistory([]);
  };

  return (
    <div className='space-y-12 min-h-[70vh] pb-20'>
      {/* ── Cinematic Hero ───────────────────────────────────── */}
      <section className='relative flex flex-col items-center justify-center gap-6 py-20 px-6 overflow-hidden rounded-[40px] border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 transition-colors'>
        {/* Floating Animated Background Elements */}
        <div className='absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none' />
        <div className='absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none delay-1000' />
        <div className='absolute top-[20%] right-[15%] w-32 h-32 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-[60px] pointer-events-none' />

        <div className='relative text-center space-y-4 max-w-2xl'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none mb-2'>
            <HistoryIcon size={12} strokeWidth={3} /> {t('yourActivity')}
          </div>
          <h1 className='text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-[1.1]'>
            {t('viewing')} <br />
            <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent'>
              {t('history')}
            </span>
          </h1>
          <p className='text-slate-400 dark:text-slate-300 font-medium text-lg leading-relaxed'>
            {t('recentlyViewed')}
          </p>
        </div>

        {history.length > 0 && (
          <div className='relative mt-6'>
            <button 
              onClick={clearHistory}
              className='flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all font-black text-sm uppercase tracking-wider backdrop-blur-md shadow-lg shadow-red-500/10 hover:shadow-red-500/30'
            >
              <Trash2 size={16} /> {t('clearAll')}
            </button>
          </div>
        )}
      </section>

      {!history || history.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500'>
          <div className='p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-slate-400 dark:text-slate-500 shadow-xl shadow-slate-200/50 dark:shadow-none'>
            <Clock size={48} strokeWidth={1.5} />
          </div>
          <h2 className='text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight'>
            {t('noActivity')}
          </h2>
          <p className='text-slate-500 max-w-sm'>
            {t('startExploring')}
          </p>
          <Link to='/browse' className='mt-6 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95'>
            {t('exploreNow')}
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700'>
          {history.map(item => (
            <div key={item.id} className='group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50'>
              <Link to={`/${item.mediaType}/${item.id}`} className='block aspect-[2/3] w-full overflow-hidden bg-slate-200 dark:bg-slate-800'>
                {item.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                    alt={item.title} 
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <Film size={40} className='text-slate-400 opacity-50' />
                  </div>
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </Link>
              
              <button
                onClick={(e) => removeItem(e, item.id)}
                className='absolute top-3 right-3 p-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-red-500 hover:scale-110 shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 z-10'
                title={t('delete')}
              >
                <Trash2 size={16} />
              </button>

              <div className='absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                <h3 className='text-white font-black truncate mb-1.5 drop-shadow-md'>{item.title}</h3>
                <div className='flex items-center gap-2 text-[10px] font-black tracking-wider uppercase'>
                  <span className='flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/10'>
                    {item.mediaType === 'movie' ? <Film size={10} /> : <Tv size={10} />}
                    {item.mediaType}
                  </span>
                  <span className='text-yellow-400 drop-shadow-md font-bold text-sm'>★ {item.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
