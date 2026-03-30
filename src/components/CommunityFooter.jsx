import { Link } from 'react-router';
import { Button } from './ui/button';
import { Film, Facebook, Twitter, Instagram, Github, Youtube, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CommunityFooter = () => {
	const { t } = useLanguage();

	return (
		<footer className='bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300'>
			{/* Top gradient bar */}
			<div className='h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600' />

			<div className='container mx-auto px-6 lg:px-8 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

					{/* Brand */}
					<div className='space-y-6'>
						<div className='flex items-center gap-2.5'>
							<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center'>
								<Film size={18} className='text-white' />
							</div>
							<span className='text-xl font-extrabold text-slate-900 dark:text-white'>MovieApp</span>
						</div>
						<p className='leading-relaxed text-sm'>
							{t('footerDesc')}
						</p>
						<div className='flex gap-2'>
							{[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
								<button key={i} className='w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'>
									<Icon size={16} />
								</button>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div className='space-y-5'>
						<h4 className='font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white'>{t('quickLinks')}</h4>
						<ul className='space-y-3'>
							{[
								{ to: '/', labelKey: 'home' },
								{ to: '/browse', labelKey: 'browse' },
								{ to: '/search', labelKey: 'search' },
								{ to: '/wishlist', labelKey: 'wishlist' },
							].map(({ to, labelKey }) => (
								<li key={to}>
									<Link to={to} className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2'>
										<span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
										{t(labelKey)}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Help */}
					<div className='space-y-5'>
						<h4 className='font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white'>{t('helpSupport')}</h4>
						<ul className='space-y-3'>
							{[
								{ labelKey: 'faq', to: '/help#faq' },
								{ labelKey: 'apiDoc', to: '/help#api' },
								{ labelKey: 'supportCenter', to: '/help#support' },
								{ labelKey: 'privacyPolicy', to: '/help#privacy' },
							].map(({ labelKey, to }) => (
								<li key={labelKey}>
									<Link to={to} className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm flex items-center gap-2'>
										<span className='w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600' />
										{t(labelKey)}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Community */}
					<div className='space-y-5'>
						<h4 className='font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white'>{t('joinCommunity')}</h4>
						<p className='text-sm leading-relaxed'>
							{t('newsletterDesc')}
						</p>
						<div className='flex gap-2'>
							<Button className='flex-grow rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 text-white'>
								{t('joinCommunity')}
							</Button>
							<Button size='icon' className='rounded-xl bg-red-600 hover:bg-red-700 text-white'>
								<Youtube size={16} />
							</Button>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className='border-t border-slate-200 dark:border-slate-800 mt-16 pt-8 flex flex-col items-center justify-center text-sm gap-4 text-center'>
					<p className='flex items-center justify-center gap-1 flex-wrap font-medium'>
						© 2026 ITI by Group 5 (Belal Mahmoud, Shimaa Mohamed, Mostafa Nageh, Samy Barsoum) with <Heart size={12} className='text-red-500 fill-current' /> {t('allRightsReserved')}
					</p>
					<p className='text-xs text-slate-500'>{t('poweredBy')}</p>
				</div>
			</div>
		</footer>
	);
};

export default CommunityFooter;
