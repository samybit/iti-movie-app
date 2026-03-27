import { Outlet, Link, useLocation } from 'react-router';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import BackToTop from '@/components/BackToTop';
import CommunityFooter from '@/components/CommunityFooter';
import { Film, Compass, Search, Heart, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
	{ to: '/', label: 'Home', icon: <Film size={16} /> },
	{ to: '/browse', label: 'Browse', icon: <Compass size={16} /> },
	{ to: '/search', label: 'Search', icon: <Search size={16} /> },
	{ to: '/wishlist', label: 'Wishlist', icon: <Heart size={16} /> },
	{ to: '/login', label: 'Login', icon: <LogIn size={16} /> },
];

export default function MainLayout() {
	const { pathname } = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className='min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white'>
			{/* ── Premium Navbar ──────────────────────────────────────────── */}
			<header className='sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm'>
				<div className='container mx-auto flex h-16 items-center justify-between px-4 lg:px-8'>
					{/* Logo */}
					<Link to='/' className='flex items-center gap-2.5 group'>
						<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow'>
							<Film size={18} className='text-white' />
						</div>
						<span className='text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
							MovieApp
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex items-center gap-1'>
						{navItems.map(({ to, label, icon }) => {
							const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
							return (
								<Link
									key={to}
									to={to}
									className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
										isActive
											? 'bg-blue-50 text-blue-600 shadow-sm'
											: 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
									}`}
								>
									{icon} {label}
								</Link>
							);
						})}
					</nav>

					{/* Mobile Hamburger */}
					<button
						className='md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors'
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						{mobileOpen ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>

				{/* Mobile Nav Drawer */}
				{mobileOpen && (
					<div className='md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200'>
						<nav className='container mx-auto flex flex-col gap-1 p-4'>
							{navItems.map(({ to, label, icon }) => {
								const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
								return (
									<Link
										key={to}
										to={to}
										onClick={() => setMobileOpen(false)}
										className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
											isActive
												? 'bg-blue-50 text-blue-600'
												: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
										}`}
									>
										{icon} {label}
									</Link>
								);
							})}
						</nav>
					</div>
				)}
			</header>

			{/* ── Main Content ────────────────────────────────────────────── */}
			<main className='flex-grow container mx-auto px-4 lg:px-8 py-6'>
				<Outlet />
			</main>

			<BackToTop />
			<CommunityFooter />
		</div>
	);
}