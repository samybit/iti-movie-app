import { Outlet, Link } from 'react-router';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import BackToTop from '@/components/BackToTop';
import CommunityFooter from '@/components/CommunityFooter';

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
						<NavigationMenu className='hidden md:block'>
							<NavigationMenuList className='flex gap-6'>
								<NavigationMenuItem>
									<Link to='/' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
										Home
									</Link>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<Link to='/browse' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
										Browse
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
							</NavigationMenuList>
						</NavigationMenu>

						<div className='flex items-center gap-2 md:gap-4'>
							<ThemeToggle />
							<Link to='/login'>
								<Button variant='default' size='sm' className='rounded-full px-5'>
									Login
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-grow container mx-auto p-4 md:p-8 min-w-0'>
				<Outlet />
			</main>

			<BackToTop />
			<CommunityFooter />
		</div>
	);
}