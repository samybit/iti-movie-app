import { Outlet, Link, useLocation } from 'react-router';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { ThemeToggle } from '@/components/theme-toggle';
import BackToTop from '@/components/BackToTop';
import CommunityFooter from '@/components/CommunityFooter';

import {
	Film,
	Compass,
	Search,
	Heart,
	LogIn,
	Menu,
	X,
	User
} from 'lucide-react';

import { useState, useEffect } from 'react';

import { auth } from '@/lib/firebase';

import { onAuthStateChanged } from 'firebase/auth';

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

import AccountSidebar from "@/components/AccountSidebar";


const navItems = [
	{ to: '/', label: 'Home', icon: <Film size={16} /> },
	{ to: '/browse', label: 'Browse', icon: <Compass size={16} /> },
	{ to: '/search', label: 'Search', icon: <Search size={16} /> },
	{ to: '/wishlist', label: 'Wishlist', icon: <Heart size={16} /> },
];


export default function MainLayout() {

	const { pathname } = useLocation();

	const [mobileOpen, setMobileOpen] = useState(false);

	const [user, setUser] = useState(null);

	const [userName, setUserName] = useState("");


	///////////////////////////////////////////////////
	// Detect logged user
	///////////////////////////////////////////////////

	useEffect(() => {

		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

			setUser(currentUser);

			if (currentUser) {

				// Google login name

				if (currentUser.displayName) {

					setUserName(currentUser.displayName.split(" ")[0]);

				}

				// Email signup name

				else {

					const docRef = doc(db, "users", currentUser.uid);

					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {

						const fullName = docSnap.data().name;

						setUserName(fullName.split(" ")[0]);

					}

				}

			}

		});

		return () => unsubscribe();

	}, []);



	return (

		<div className='min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white'>


			{/* HEADER */}


			<header className='sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm'>

				<div className='container mx-auto flex h-16 items-center justify-between px-4 lg:px-8'>


					{/* LOGO */}


					<Link to='/' className='flex items-center gap-2.5 group'>

						<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow'>

							<Film size={18} className='text-white' />

						</div>

						<span className='text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>

							MovieApp

						</span>

					</Link>



					{/* DESKTOP NAVIGATION */}


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



						{/* ACCOUNT BUTTON */}


						{user ? (

							<AccountSidebar />

						) : (

							<Link
								to='/login'
								className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all'
							>

								<LogIn size={16} />

								Login

							</Link>

						)}



						{/* THEME TOGGLE */}


						<div className='ml-4 pl-4 border-l border-slate-200'>

							<ThemeToggle />

						</div>

					</nav>



					{/* MOBILE MENU BUTTON */}


					<div className='flex items-center md:hidden gap-2'>

						<ThemeToggle />

						<button
							className='p-2 rounded-xl hover:bg-slate-100 transition-colors'
							onClick={() => setMobileOpen(!mobileOpen)}
						>

							{mobileOpen ? <X size={22} /> : <Menu size={22} />}

						</button>

					</div>

				</div>



				{/* MOBILE DRAWER */}


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



							{/* ACCOUNT BUTTON MOBILE */}


							{user ? (

								<div onClick={() => setMobileOpen(false)}>

									<AccountSidebar />

								</div>

							) : (

								<Link
									to='/login'
									onClick={() => setMobileOpen(false)}
									className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800'
								>

									<LogIn size={16} />

									Login

								</Link>

							)}

						</nav>

					</div>

				)}

			</header>



			{/* MAIN CONTENT */}


			<main className='flex-grow container mx-auto px-4 lg:px-8 py-6'>

				<Outlet />

			</main>



			<BackToTop />

			<CommunityFooter />

		</div>

	);

}