import { Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// TMDB image base URL
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function MovieCard({ movie, isFavorite = false, onToggleFavorite }) {
    // Safely extract TMDB data with fallbacks
    const title = movie?.title || movie?.name || 'Unknown Title';
    const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : 'NR';
    const posterUrl = movie?.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://placehold.co/500x750/1f2937/ffffff?text=No+Poster'; // Fallback image

    return (
        <Card className="group relative overflow-hidden flex flex-col h-full border-muted bg-card hover:border-primary/50 transition-colors">
            {/* Poster Image */}
            <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                <img
                    src={posterUrl}
                    alt={`${title} poster`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Rating Badge Overlay */}
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="flex items-center gap-1 bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{rating}</span>
                    </Badge>
                </div>

                {/* Wishlist Button Overlay */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onToggleFavorite?.(movie)}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="sr-only">Toggle wishlist</span>
                </Button>
            </div>

            {/* Card Content (Title & Year) */}
            <CardContent className="p-4 flex-grow flex flex-col justify-between gap-2">
                <h3 className="font-semibold text-foreground line-clamp-1" title={title}>
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {releaseYear}
                </p>
            </CardContent>
        </Card>
    );
}