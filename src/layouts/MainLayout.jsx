import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import BackToTop from '@/components/BackToTop';
import CommunityFooter from '@/components/CommunityFooter';
import { Film, Compass, Search, Heart, LogIn, Menu, X, User, Globe, Loader2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, Suspense } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import { doc, onSnapshot } from 'firebase/firestore';
import AccountSidebar from "@/components/AccountSidebar";
import SearchModal from "@/components/SearchModal";
import { useLanguage } from '@/contexts/LanguageContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANGUAGE_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'Arabic' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' },
];

const navItems = [
    { to: '/', labelKey: 'home', icon: <Film size={16} /> },
    { to: '/browse', labelKey: 'browse', icon: <Compass size={16} /> },
    { to: '/search', labelKey: 'search', icon: <Search size={16} /> },
    { to: '/wishlist', labelKey: 'wishlist', icon: <Heart size={16} /> },
];

export default function MainLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { wishlist } = useWishlist();

    useEffect(() => {
        let snapshotUnsub = null;

        const authUnsub = onAuthStateChanged(auth, async (currentUser) => {

            if (snapshotUnsub) snapshotUnsub();

            if (currentUser) {
                setUser(currentUser);

                if (currentUser.displayName) {
                    setUserName(currentUser.displayName.split(" ")[0]);
                }

                
                const docRef = doc(db, "users", currentUser.uid);
                snapshotUnsub = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserName(docSnap.data().name.split(" ")[0]);
                    }
                });

            } else {
                setUser(null);
                setUserName("");
            }
            setLoadingUser(false);
        });

        return () => {
            authUnsub();
            if (snapshotUnsub) snapshotUnsub();
        };
    }, []);

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully 👋");
            navigate("/login");
            setIsAccountOpen(false);
        } catch (error) {
            toast.error("Logout failed ❌");
        }
    };

    if (loadingUser) return null;

    return (
        <div className='min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background text-foreground transition-colors duration-300'>
            <header className='sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-border bg-white/80 dark:bg-background/80 backdrop-blur-xl shadow-sm'>
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
                        {navItems.map(({ to, labelKey, icon }) => {
                            if (labelKey === 'search') {
                                return (
                                    <button
                                        key={to}
                                        onClick={() => {
                                            if (pathname === '/browse') {
                                                navigate('/search');
                                            } else {
                                                setIsSearchOpen(true);
                                            }
                                        }}
                                        className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent transition-all duration-200'
                                    >
                                        {icon} {t(labelKey)}
                                    </button>
                                );
                            }
                            const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-500/10 dark:text-blue-400'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent'
                                        }`}
                                >
                                    {icon} {t(labelKey)}
                                    {labelKey === 'wishlist' && user && wishlist.length > 0 && (
                                        <Badge variant="secondary" className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-black border-2 border-white dark:border-background">
                                            {wishlist.length}
                                        </Badge>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Account / Login */}
                        {user ? (
                            <button
                                onClick={() => setIsAccountOpen(true)}
                                className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-foreground hover:bg-slate-50 dark:hover:bg-accent transition-all'
                            >
                                <User size={16} /> {userName}
                            </button>
                        ) : (
                            <Link
                                to='/login'
                                className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent transition-all'
                            >
                                <LogIn size={16} /> {t('login')}
                            </Link>
                        )}

                        <div className='flex items-center ml-2 pl-4 border-l border-slate-200 dark:border-border'>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 px-3 gap-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-blue-500 text-slate-500 dark:text-muted-foreground font-semibold">
                                        <Globe size={16} />
                                        <span className="uppercase">{language || 'en'}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-[150px] p-1.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
                                    {LANGUAGE_OPTIONS.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code)}
                                            className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 ${language === lang.code ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                                        >
                                            <span className="text-sm font-semibold">{lang.label} ({(lang.code).toUpperCase()})</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className='ml-4 pl-4 border-l border-slate-200 dark:border-border'>
                            <ThemeToggle />
                        </div>
                    </nav>

                    {/* Mobile Hamburger */}
                    <div className='flex items-center md:hidden gap-2'>
                        <ThemeToggle />
                        <button
                            className='p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-accent transition-colors'
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileOpen && (
                    <div className='md:hidden border-t border-slate-100 dark:border-border bg-white/95 dark:bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200'>
                        <nav className='container mx-auto flex flex-col gap-1 p-4'>
                            {navItems.map(({ to, labelKey, icon }) => {
                                if (labelKey === 'search') {
                                    return (
                                        <button
                                            key={to}
                                            onClick={() => {
                                                if (pathname === '/browse') {
                                                    navigate('/search');
                                                } else {
                                                    setIsSearchOpen(true);
                                                }
                                                setMobileOpen(false);
                                            }}
                                            className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent transition-all'
                                        >
                                            {icon} {t(labelKey)}
                                        </button>
                                    );
                                }
                                const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent'
                                            }`}
                                    >
                                        {icon}
                                        <span className="flex-grow">{t(labelKey)}</span>
                                        {labelKey === 'wishlist' && user && wishlist.length > 0 && (
                                            <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black">
                                                {wishlist.length}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Account / Login mobile */}
                            {user ? (
                                <button
                                    onClick={() => {
                                        setIsAccountOpen(true);
                                        setMobileOpen(false);
                                    }}
                                    className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-foreground hover:bg-slate-50 dark:hover:bg-accent transition-all'
                                >
                                    <User size={16} /> {userName}
                                </button>
                            ) : (
                                <Link
                                    to='/login'
                                    onClick={() => setMobileOpen(false)}
                                    className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent transition-all'
                                >
                                    <LogIn size={16} /> {t('login')}
                                </Link>
                            )}

                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button className='flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent transition-all'>
                                        <Globe size={16} />
                                        <span className="text-left flex-grow text-slate-500 dark:text-muted-foreground">{LANGUAGE_OPTIONS.find(l => l.code === language)?.label || 'English'} ({(language || 'en').toUpperCase()})</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[200px] p-1.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
                                    {LANGUAGE_OPTIONS.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                                            className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 ${language === lang.code ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                                        >
                                            <span className="text-sm font-semibold">{lang.label} ({(lang.code).toUpperCase()})</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </nav>
                    </div>
                )}
            </header>

            <AccountSidebar
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
                user={user}
                onLogout={handleLogout}
            />

            <main className='flex-grow container mx-auto px-4 lg:px-8 py-6'>
                <Suspense fallback={
                    <div className="w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                    </div>
                }>
                    <Outlet context={{ setIsSearchOpen }} />
                </Suspense>
            </main>

            <BackToTop />
            <CommunityFooter />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}