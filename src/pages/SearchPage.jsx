import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieCard } from '@/components/MovieCard';
import { MovieCardSkeleton } from '@/components/MovieCardSkeleton';

// Dummy data for layout testing
const DUMMY_MOVIES = [
    {
        id: 1,
        title: "Fallout: The Wasteland",
        release_date: "2026-10-23",
        vote_average: 8.9,
        poster_path: null
    },
    {
        id: 2,
        title: "Blue Lock: Episode Nagi",
        release_date: "2024-04-19",
        vote_average: 8.5,
        poster_path: null
    },
    {
        id: 3,
        title: "Fate/stay night: Heaven's Feel",
        release_date: "2020-08-15",
        vote_average: 8.2,
        poster_path: null
    }
];

const GENRES = ["All", "Action", "Anime", "Sci-Fi", "Drama", "Gaming"];

export default function SearchPage() {
    // UI state for demonstration to show where to plug in
    const [activeGenre, setActiveGenre] = useState("All");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search Header */}
            <div className="flex flex-col items-center space-y-4 text-center max-w-2xl mx-auto mt-8">
                <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
                <p className="text-muted-foreground">
                    Search by title or filter by genre to find your next watch.
                </p>

                {/* Search Bar */}
                <div className="flex w-full max-w-lg items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
                {GENRES.map(genre => (
                    <Badge
                        key={genre}
                        variant={activeGenre === genre ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary/80 transition-colors text-sm py-1 px-3"
                        onClick={() => setActiveGenre(genre)}
                    >
                        {genre}
                    </Badge>
                ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pt-4 border-t">
                {/* Dummy Data */}
                {DUMMY_MOVIES.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}

                {/* Skeletons to show loading state */}
                <MovieCardSkeleton />
                <MovieCardSkeleton />
            </div>
        </div>
    );
}