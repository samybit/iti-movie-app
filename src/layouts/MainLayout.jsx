// src/layouts/MainLayout.jsx
import { Outlet, Link } from 'react-router';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from '@/components/theme-toggle';

export default function MainLayout() {
	return (
		<div className='min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300'>
			{/* Navbar UI */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4'>
				<div className='container mx-auto flex justify-between items-center gap-2 md:gap-4'>

					{/* Logo */}
					<h1 className='text-xl md:text-2xl font-bold tracking-tight text-primary shrink-0'>
						<Link to='/'>🎬 MovieApp</Link>
					</h1>

					{/* Nav and Toggle Container */}
					<div className='flex items-center gap-2 md:gap-4 min-w-0'>

						{/* Scrollable Nav Links for Mobile */}
						<div className='overflow-x-auto pb-1 md:pb-0'>
							<NavigationMenu>
								<NavigationMenuList className='flex gap-3 md:gap-6 px-1'>
									<NavigationMenuItem>
										<Link to='/' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap'>
											Home
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<Link to='/search' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap'>
											Search
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<Link to='/wishlist' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap'>
											Wishlist
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<Link to='/login' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap'>
											Login
										</Link>
									</NavigationMenuItem>
								</NavigationMenuList>
							</NavigationMenu>
						</div>

						{/* Theme Toggle */}
						<div className='shrink-0'>
							<ThemeToggle />
						</div>

					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-grow container mx-auto p-4 md:p-6 min-w-0'>
				<Outlet />
			</main>

			{/* Footer UI */}
			<footer className='border-t bg-background p-6 text-center text-sm text-muted-foreground'>
				<p>© 2026</p>
			</footer>
		</div>
	);
}