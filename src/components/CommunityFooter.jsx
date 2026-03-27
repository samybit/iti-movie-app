import { Link } from 'react-router';
import { Button } from './ui/button';
import { Film, Facebook, Twitter, Instagram, Github, Youtube, Heart, ArrowUp } from 'lucide-react';

const CommunityFooter = () => {
	return (
		<footer className='bg-slate-900 text-slate-300 mt-20'>
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
							<span className='text-xl font-extrabold text-white'>MovieApp</span>
						</div>
						<p className='text-slate-400 leading-relaxed text-sm'>
							Your ultimate guide to movies and TV shows. Explore, discover, and build your perfect watchlist.
						</p>
						<div className='flex gap-2'>
							{[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
								<button key={i} className='w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-400 hover:text-white'>
									<Icon size={16} />
								</button>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div className='space-y-5'>
						<h4 className='font-bold text-sm uppercase tracking-widest text-white'>Quick Links</h4>
						<ul className='space-y-3'>
							{[
								{ to: '/', label: 'Home' },
								{ to: '/browse', label: 'Browse' },
								{ to: '/search', label: 'Search' },
								{ to: '/wishlist', label: 'Wishlist' },
							].map(({ to, label }) => (
								<li key={to}>
									<Link to={to} className='text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2'>
										<span className='w-1 h-1 rounded-full bg-slate-600' />
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Help */}
					<div className='space-y-5'>
						<h4 className='font-bold text-sm uppercase tracking-widest text-white'>Help & Support</h4>
						<ul className='space-y-3'>
							{['FAQ', 'API Documentation', 'Support Center', 'Privacy Policy'].map(label => (
								<li key={label}>
									<Link to='#' className='text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2'>
										<span className='w-1 h-1 rounded-full bg-slate-600' />
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Community */}
					<div className='space-y-5'>
						<h4 className='font-bold text-sm uppercase tracking-widest text-white'>Join Community</h4>
						<p className='text-slate-400 text-sm leading-relaxed'>
							Subscribe to our newsletter and join our Discord group for the latest updates.
						</p>
						<div className='flex gap-2'>
							<Button className='flex-grow rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20'>
								Join Community
							</Button>
							<Button size='icon' className='rounded-xl bg-red-600 hover:bg-red-700'>
								<Youtube size={16} />
							</Button>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className='border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4'>
					<p className='flex items-center gap-1'>
						© 2026 ITI by ELDash with <Heart size={12} className='text-red-500 fill-current' /> All rights reserved.
					</p>
					<p className='text-xs text-slate-600'>Powered by TMDB API</p>
				</div>
			</div>
		</footer>
	);
};

export default CommunityFooter;
