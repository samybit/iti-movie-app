import { Link } from 'react-router';
import { Button } from './ui/button';
import { Facebook, Twitter, Instagram, Github, Youtube } from 'lucide-react';

const CommunityFooter = () => {
	return (
		<footer className='border-t bg-slate-50/50 mt-20'>
			<div className='container mx-auto px-4 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
					<div className='space-y-6'>
						<h2 className='text-2xl font-bold text-blue-600'>MovieApp</h2>
						<p className='text-slate-500 leading-relaxed'>
							Your ultimate guide to movies and TV shows. Explore, discover, and build your perfect watchlist today.
						</p>
						<div className='flex gap-4'>
							<Button size='icon' variant='outline' className='rounded-full w-10 h-10'>
								<Facebook size={18} />
							</Button>
							<Button size='icon' variant='outline' className='rounded-full w-10 h-10'>
								<Twitter size={18} />
							</Button>
							<Button size='icon' variant='outline' className='rounded-full w-10 h-10'>
								<Instagram size={18} />
							</Button>
							<Button size='icon' variant='outline' className='rounded-full w-10 h-10'>
								<Github size={18} />
							</Button>
						</div>
					</div>

					<div className='space-y-6'>
						<h4 className='font-bold text-lg'>Quick Links</h4>
						<ul className='space-y-4 text-slate-500'>
							<li><Link to='/' className='hover:text-blue-600 transition-colors'>Home</Link></li>
							<li><Link to='/browse' className='hover:text-blue-600 transition-colors'>Browse</Link></li>
							<li><Link to='/search' className='hover:text-blue-600 transition-colors'>Search</Link></li>
							<li><Link to='/wishlist' className='hover:text-blue-600 transition-colors'>Wishlist</Link></li>
						</ul>
					</div>

					<div className='space-y-6'>
						<h4 className='font-bold text-lg'>Help & Support</h4>
						<ul className='space-y-4 text-slate-500'>
							<li><Link to='#' className='hover:text-blue-600 transition-colors'>FAQ</Link></li>
							<li><Link to='#' className='hover:text-blue-600 transition-colors'>API Documentation</Link></li>
							<li><Link to='#' className='hover:text-blue-600 transition-colors'>Support Center</Link></li>
							<li><Link to='#' className='hover:text-blue-600 transition-colors'>Privacy Policy</Link></li>
						</ul>
					</div>

					<div className='space-y-6'>
						<h4 className='font-bold text-lg'>Join the Community</h4>
						<p className='text-slate-500'>
							Subscribe to our newsletter and join our Discord group to get the latest updates.
						</p>
						<div className='flex gap-2'>
							<Button className='flex-grow bg-blue-600 hover:bg-blue-700'>
								Join Community
							</Button>
							<Button size='icon' variant='outline' className='text-red-600'>
								<Youtube size={18} />
							</Button>
						</div>
					</div>
				</div>
				<div className='border-t mt-16 pt-8 text-center text-slate-400 text-sm'>
					<p>© 2026 ITI by ELDash with 💖. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default CommunityFooter;
