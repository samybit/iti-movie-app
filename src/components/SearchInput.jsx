import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchInput = ({ value, onChange, placeholder = 'Search for a movie...', className }) => {
	return (
		<div className={cn('relative w-full max-w-2xl group transition-all duration-300', className)}>
			<div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
			<Search className='absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors' strokeWidth={2.5} />
			<Input
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={cn(
					'h-16 pl-14 pr-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-lg font-medium text-slate-900 dark:text-slate-100 shadow-xl shadow-slate-200/20 dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500/50 transition-all active:scale-[0.995]',
					className
				)}
			/>
		</div>
	);
};

export default SearchInput;