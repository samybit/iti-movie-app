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
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  const { data: results, loading } = useMovies({
    type: 'search',
    query: debouncedQuery,
    page: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const handleResultClick = (type, id) => {
    navigate(`/${type}/${id}`);
    onClose();
    setQuery('');
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
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {query.trim().length > 0 ? (
              <div className="p-2">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-4 py-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Results</span>
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
                          onClick={() => handleResultClick(mediaType, item.id)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-blue-50/50 rounded-2xl transition-all group"
                        >
                          <div className="relative w-12 h-18 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                {mediaType === 'movie' ? <Film size={12} /> : <Tv size={12} />}
                                {mediaType === 'movie' ? 'Movie' : 'TV Show'}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                <Calendar size={12} />
                                {year}
                              </span>
                              {item.vote_average > 0 && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                                    <Star size={12} className="fill-current" />
                                    {item.vote_average.toFixed(1)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                             <span className="text-blue-600 text-sm font-black">View →</span>
                          </div>
                        </button>
                      );
                    })}
                    
                    {results.length > 6 && (
                      <button 
                        onClick={handleSearch}
                        className="w-full py-4 text-center text-sm font-bold text-slate-500 hover:text-blue-600 border-t border-slate-100/50 mt-2 transition-colors"
                      >
                        View all {results.length} results for "{query}"
                      </button>
                    )}
                  </div>
                ) : !loading ? (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 mb-3">
                       <Search className="text-slate-300" size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No results found for "{query}"</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mb-2">
                   <Search size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800">Quick Search</h3>
                <p className="text-slate-400 text-sm max-w-[280px] mx-auto font-medium">
                  Start typing to see instant movie and TV show suggestions.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {['Action', 'Comedy', 'Horror', 'Sci-Fi', 'Netflix'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
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
