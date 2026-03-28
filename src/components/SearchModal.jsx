import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, X, Film, Tv, Star, Calendar, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMovies } from '@/hooks/useMovies';
import useDebounce from '@/hooks/useDebounce';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  // Fetch Trending data for when search is empty
  const { data: trendingResults } = useMovies({
    type: 'trending',
    page: 1,
  });

  const { data: results, loading } = useMovies({
    type: 'search',
    query: debouncedQuery,
    page: 1,
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

  const saveSearch = (term) => {
    if (!term.trim()) return;
    const filtered = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(filtered);
    localStorage.setItem('recentSearches', JSON.stringify(filtered));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleResultClick = (type, id, title) => {
    saveSearch(title);
    navigate(`/${type}/${id}`);
    onClose();
  };

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-2xl rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Movies & TV Shows</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col max-h-[85vh]">
          {/* Input Area */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center px-6 h-20 border-b border-slate-100/50">
              <Search className="w-6 h-6 text-blue-600 mr-4" strokeWidth={2.5} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-slate-800 placeholder:text-slate-300"
              />
              {loading && query && (
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin mr-2" />
              )}
              {query && (
                <button 
                  type="button" 
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              )}
            </div>
          </form>

          {/* Results Area */}
          <div className="overflow-y-auto flex-1 custom-scrollbar min-h-[300px]">
            {query.trim().length > 0 ? (
              <div className="p-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Dynamic</span>
                    </div>
                    {results.slice(0, 6).map((item) => {
                      const mediaType = item.title ? 'movie' : 'tv';
                      const title = item.title || item.name;
                      const date = item.release_date || item.first_air_date;
                      const year = date ? new Date(date).getFullYear() : 'N/A';
                      const imageUrl = item.poster_path
                        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        : 'https://placehold.co/92x138?text=NO';

                      return (
                        <button
                          key={`${mediaType}-${item.id}`}
                          onClick={() => handleResultClick(mediaType, item.id, title)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-slate-100/80 rounded-2xl transition-all group"
                        >
                          <div className="relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-slate-100">
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className={`flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-md border ${
                                mediaType === 'movie' 
                                  ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                  : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                              }`}>
                                {mediaType === 'movie' ? <Film size={10} strokeWidth={3} /> : <Tv size={10} strokeWidth={3} />}
                                {mediaType === 'movie' ? 'MOVIE' : 'TV SHOW'}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                <Calendar size={12} strokeWidth={2.5} />
                                {year}
                              </span>
                              {item.vote_average > 0 && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                                  <Star size={12} className="fill-current" />
                                  {item.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-all pr-2 translate-x-2 group-hover:translate-x-0">
                             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <Film size={14} />
                             </div>
                          </div>
                        </button>
                      );
                    })}
                    
                    {results.length > 6 && (
                      <button 
                        onClick={handleSearch}
                        className="w-full py-5 text-center text-xs font-black text-slate-400 hover:text-blue-600 tracking-widest uppercase transition-colors"
                      >
                        + View all {results.length} matches
                      </button>
                    )}
                  </div>
                ) : !loading ? (
                  <div className="py-20 text-center animate-in zoom-in-95 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 mb-4">
                       <Search className="text-slate-200" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No matches found</h3>
                    <p className="text-sm text-slate-400 mt-1">Try different keywords or check spelling.</p>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500/20" />
                    <span className="text-xs font-bold tracking-widest uppercase">Searching Universe...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-6 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Searches</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {recentSearches.map(term => (
                        <button 
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-xs font-bold text-slate-500 border border-transparent hover:border-blue-200 transition-all"
                        >
                          {term}
                        </button>
                      ))}
                      <button 
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recentSearches');
                        }}
                        className="text-[10px] font-bold text-red-400 hover:text-red-600 px-2 py-1 transition-colors"
                      >
                        Clear History
                      </button>
                    </div>
                  </div>
                )}

                {/* Trending Section */}
                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trending Now</span>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {trendingResults.slice(0, 4).map(item => {
                       const title = item.title || item.name;
                       const type = item.title ? 'movie' : 'tv';
                       return (
                         <button 
                           key={item.id}
                           onClick={() => handleResultClick(type, item.id, title)}
                           className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group"
                         >
                           <img 
                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                            className="w-9 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" 
                           />
                           <div className="min-w-0">
                             <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                               {title}
                             </p>
                             <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">
                               {type === 'movie' ? 'Movie' : 'TV Series'}
                             </p>
                           </div>
                         </button>
                       )
                    })}
                  </div>
                </div>

                {/* Quick Categories */}
                <div className="p-6 pt-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discover Categories</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Marvel', 'Disney+', 'Action', 'Horror', 'Sci-Fi', 'Netflix Original'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100/50">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-500 shadow-sm">Enter</div>
                  <span className="text-[11px] font-bold text-slate-400">Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-500 shadow-sm">Esc</div>
                  <span className="text-[11px] font-bold text-slate-400">Close</span>
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={!query.trim()}
                className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                Full Search
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
