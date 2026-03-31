import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import usePageTitle from '@/hooks/usePageTitle';

export default function NotFound404() {
	const { t } = useLanguage();
	usePageTitle(t('pageNotFound') || '404 - Page Not Found');

	return (
		<div className='flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4 animate-in fade-in zoom-in duration-700'>
			<div className='relative'>
				<div className='absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 blur-3xl rounded-full' />
				<div className='relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6'>
					<div className='w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400'>
						<FileQuestion size={48} strokeWidth={1.5} />
					</div>
					<div className='space-y-2'>
						<h1 className='text-7xl font-black tracking-tighter text-slate-900 dark:text-white'>404</h1>
						<h2 className='text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-300'>
							{t('pageNotFound')}
						</h2>
					</div>
					<p className='text-slate-500 dark:text-slate-400 max-w-sm font-medium'>
						{t('notFoundDesc')}
					</p>
				</div>
			</div>

			<div className='flex flex-col sm:flex-row items-center gap-4 pt-4'>
				<Button asChild size='lg' className='w-full sm:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-14 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 gap-2'>
					<Link to='/'>
						<Home size={18} />
						{t('backToHome')}
					</Link>
				</Button>
				<Button asChild size='lg' variant='outline' className='w-full sm:w-auto rounded-2xl font-bold px-8 h-14 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 gap-2'>
					<Link to='/search'>
						<Search size={18} />
						{t('search')}
					</Link>
				</Button>
			</div>
		</div>
	);
}
