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
				<div className='container mx-auto flex justify-between items-center'>
					<h1 className='text-2xl font-bold tracking-tight text-primary'>
						<Link to='/'>🎬 MovieApp</Link>
					</h1>

					<div className='flex items-center gap-4'>
						<NavigationMenu>
							<NavigationMenuList className='flex gap-6'>
								<NavigationMenuItem>
									<Link to='/' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
										Home
									</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to='/search' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
										Search
									</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to='/wishlist' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
										Wishlist
									</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to='/login' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
										Login
									</Link>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>

						{/* The new theme toggle button */}
						<ThemeToggle />
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-grow container mx-auto p-4 md:p-6'>
				<Outlet />
			</main>

			{/* Footer UI */}
			<footer className='border-t bg-background p-6 text-center text-sm text-muted-foreground'>
				<p>© 2026 ITI by ELDash with 💖</p>
			</footer>
		</div>
	);
}