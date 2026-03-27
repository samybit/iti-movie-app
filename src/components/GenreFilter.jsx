import { Badge } from '@/components/ui/badge';
import { useGenres } from '@/hooks/useGenres';

const GenreFilter = ({ selectedGenre, onSelectGenre }) => {
	const { genres, loading } = useGenres();

	if (loading) {
		return (
			<div className='flex flex-wrap gap-2 mb-6'>
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className='h-6 w-16 bg-slate-200 animate-pulse rounded-full'></div>
				))}
			</div>
		);
	}

	return (
		<div className='flex flex-wrap gap-2 mb-6'>
			<Badge
				variant={selectedGenre === '' ? 'default' : 'outline'}
				className='cursor-pointer'
				onClick={() => onSelectGenre('')}
			>
				All
			</Badge>
			{genres.map((genre) => (
				<Badge
					key={genre.id}
					variant={selectedGenre === String(genre.id) ? 'default' : 'outline'}
					className='cursor-pointer'
					onClick={() => onSelectGenre(String(genre.id))}
				>
					{genre.name}
				</Badge>
			))}
		</div>
	);
};

export default GenreFilter;
