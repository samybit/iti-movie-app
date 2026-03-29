import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const SortSelect = ({ value, onValueChange, className }) => {
	return (
		<div className='flex items-center gap-1 sm:gap-2'>
			<span className='hidden sm:inline-block text-sm font-medium text-slate-500 whitespace-nowrap'>Sort by:</span>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className={className || 'w-[140px] sm:w-[180px]'}>
					<SelectValue placeholder='Select Sort' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='popularity.desc'>Popularity Desc</SelectItem>
					<SelectItem value='popularity.asc'>Popularity Asc</SelectItem>
					<SelectItem value='vote_average.desc'>Rating Desc</SelectItem>
					<SelectItem value='vote_average.asc'>Rating Asc</SelectItem>
					<SelectItem value='release_date.desc'>Release Date Desc</SelectItem>
					<SelectItem value='release_date.asc'>Release Date Asc</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SortSelect;
