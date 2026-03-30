import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, Book, Shield, LifeBuoy, Mail, MessageSquare } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { useLanguage } from '@/contexts/LanguageContext';

const HelpCenter = () => {
	const { t } = useLanguage();
	usePageTitle(t('helpCenter'));
	const { hash } = useLocation();

	useEffect(() => {
		if (hash) {
			const element = document.getElementById(hash.substring(1));
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, [hash]);

	return (
		<div className='max-w-4xl mx-auto space-y-16 py-10 px-4'>
			{/* Header */}
			<section className='text-center space-y-4'>
				<div className='inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4'>
					<LifeBuoy size={32} />
				</div>
				<h1 className='text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase'>{t('helpSupport')}</h1>
				<p className='text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium'>
					{t('helpSupportDesc')}
				</p>
			</section>

			{/* FAQ Section */}
			<section id='faq' className='space-y-8 scroll-mt-24'>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-xl bg-slate-100 dark:bg-slate-800'>
						<HelpCircle size={20} className='text-blue-600 dark:text-blue-400' />
					</div>
					<h2 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase'>{t('frequentlyAskedQuestions')}</h2>
				</div>
				<Accordion type='single' collapsible className='w-full space-y-4 font-medium'>
					<AccordionItem value='item-1' className='border border-slate-200 dark:border-slate-800 rounded-2xl px-6 bg-white dark:bg-slate-900/50'>
						<AccordionTrigger className='hover:no-underline text-lg font-bold py-6'>{t('faq1Question')}</AccordionTrigger>
						<AccordionContent className='text-slate-500 dark:text-slate-400 pb-6'>
							{t('faq1Answer')}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-2' className='border border-slate-200 dark:border-slate-800 rounded-2xl px-6 bg-white dark:bg-slate-900/50'>
						<AccordionTrigger className='hover:no-underline text-lg font-bold py-6'>{t('faq2Question')}</AccordionTrigger>
						<AccordionContent className='text-slate-500 dark:text-slate-400 pb-6'>
							{t('faq2Answer')}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-3' className='border border-slate-200 dark:border-slate-800 rounded-2xl px-6 bg-white dark:bg-slate-900/50'>
						<AccordionTrigger className='hover:no-underline text-lg font-bold py-6'>{t('faq3Question')}</AccordionTrigger>
						<AccordionContent className='text-slate-500 dark:text-slate-400 pb-6'>
							{t('faq3Answer')}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			{/* API Documentation */}
			<section id='api' className='p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-blue-900 text-white space-y-6 shadow-2xl scroll-mt-24 overflow-hidden relative'>
				<div className='absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl' />
				<div className='relative space-y-4'>
					<div className='flex items-center gap-3'>
						<Book size={24} className='text-blue-300' />
						<h2 className='text-2xl font-black tracking-tight uppercase'>{t('apiDoc')}</h2>
					</div>
					<p className='text-blue-100/70 max-w-xl text-lg font-medium'>
						{t('apiDocDesc')}
					</p>
					<div className='pt-4'>
						<Button asChild className='rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black px-8 h-14 text-lg shadow-xl shadow-blue-500/20'>
							<a href='https://developer.themoviedb.org/docs' target='_blank' rel='noopener noreferrer'>
								{t('visitTmdbDoc')}
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Privacy & Policy */}
			<section id='privacy' className='space-y-8 scroll-mt-24'>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-xl bg-slate-100 dark:bg-slate-800'>
						<Shield size={20} className='text-blue-600 dark:text-blue-400' />
					</div>
					<h2 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase'>{t('privacyPolicyTitle')}</h2>
				</div>
				<div className='prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-6'>
					<p>
						{t('privacyDesc')}
					</p>
					<ul className='list-disc pl-6 space-y-2'>
						<li>{t('privacyPoint1')}</li>
						<li>{t('privacyPoint2')}</li>
						<li>{t('privacyPoint3')}</li>
					</ul>
				</div>
			</section>

			{/* Contact / Support */}
			<section id='support' className='py-12 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-8 scroll-mt-24'>
				<div className='text-center space-y-2'>
					<h2 className='text-2xl font-black text-slate-900 dark:text-white uppercase'>{t('stillNeedHelp')}</h2>
					<p className='text-slate-500 dark:text-slate-400 font-medium'>{t('supportTeamDesc')}</p>
				</div>
				<div className='flex flex-col sm:flex-row gap-4 w-full justify-center'>
					<Button variant='outline' className='flex-1 h-20 rounded-2xl flex flex-col gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-accent font-bold'>
						<Mail size={20} className='text-blue-600' />
						<span>{t('emailSupport')}</span>
					</Button>
					<Button variant='outline' className='flex-1 h-20 rounded-2xl flex flex-col gap-1 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-accent font-bold'>
						<MessageSquare size={20} className='text-emerald-600' />
						<span>{t('liveChat')}</span>
					</Button>
				</div>
			</section>
		</div>
	);
};

export default HelpCenter;
