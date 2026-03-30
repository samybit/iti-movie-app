import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const SortSelect = ({ value, onValueChange, className }) => {
	const { t } = useLanguage();
	return (
		<div className='flex items-center gap-1 sm:gap-2'>
			<span className='hidden sm:inline-block text-sm font-medium text-slate-500 whitespace-nowrap'>{t('sortBy')}</span>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className={className || 'w-[140px] sm:w-[180px]'}>
					<SelectValue placeholder={t('sortBy')} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='popularity.desc'>{t('popularity')} (Desc)</SelectItem>
					<SelectItem value='popularity.asc'>{t('popularity')} (Asc)</SelectItem>
					<SelectItem value='vote_average.desc'>{t('rating')} (Desc)</SelectItem>
					<SelectItem value='vote_average.asc'>{t('rating')} (Asc)</SelectItem>
					<SelectItem value='release_date.desc'>{t('latest')} (Desc)</SelectItem>
					<SelectItem value='release_date.asc'>{t('latest')} (Asc)</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default SortSelect;
