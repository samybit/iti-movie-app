import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
	const { t } = useLanguage();
	return (
		<div className='flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
			<div className='mx-auto flex max-w-md flex-col items-center justify-center text-center'>
				{/* Icon & 404 Text */}
				<div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6'>
					<FileQuestion className='h-10 w-10 text-muted-foreground' />
				</div>
				<h1 className='text-4xl font-extrabold tracking-tight text-primary sm:text-5xl'>404</h1>
				<h2 className='mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
					{t('pageNotFound')}
				</h2>

				{/* Descriptive Text */}
				<p className='mt-4 text-base text-muted-foreground'>
					{t('notFoundDesc')}
				</p>

				{/* Call to Action Buttons */}
				<div className='mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center'>
					<Button asChild variant='default' className='w-full sm:w-auto'>
						<Link to='/' className='flex items-center justify-center gap-2'>
							<Home className='h-4 w-4' />
							<span>{t('backToHome')}</span>
						</Link>
					</Button>
					<Button asChild variant='outline' className='w-full sm:w-auto'>
						<Link to='/help'>{t('contactSupport')}</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
