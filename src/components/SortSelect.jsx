import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SortSelect = ({ value, onValueChange, className }) => {
	const { t } = useLanguage();

	const sortOptions = [
		{ value: 'popularity.desc', label: `${t('popularity')} (Desc)` },
		{ value: 'popularity.asc', label: `${t('popularity')} (Asc)` },
		{ value: 'vote_average.desc', label: `${t('rating')} (Desc)` },
		{ value: 'vote_average.asc', label: `${t('rating')} (Asc)` },
		{ value: 'release_date.desc', label: `${t('latest')} (Desc)` },
		{ value: 'release_date.asc', label: `${t('latest')} (Asc)` },
	];

	const selectedOption = sortOptions.find(opt => opt.value === value);

	return (
		<div className='flex items-center gap-1 sm:gap-2'>
			<span className='hidden sm:inline-block text-sm font-medium text-slate-500 whitespace-nowrap'>{t('sortBy')}</span>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<button className={`flex items-center justify-between gap-2 px-3 rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className || 'w-[140px] sm:w-[180px] h-9'}`}>
						<span className="truncate">{selectedOption ? selectedOption.label : t('sortBy')}</span>
						<ChevronDown size={16} className="opacity-50 flex-shrink-0" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-[180px] p-1.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
					{sortOptions.map((opt) => (
						<DropdownMenuItem
							key={opt.value}
							onClick={() => onValueChange(opt.value)}
							className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 ${value === opt.value ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
						>
							<span className="text-sm font-semibold">{opt.label}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default SortSelect;
