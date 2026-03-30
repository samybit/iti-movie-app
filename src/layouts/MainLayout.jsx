import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import BackToTop from '@/components/BackToTop';
import CommunityFooter from '@/components/CommunityFooter';
import { Film, Compass, Search, Heart, LogIn, Menu, X, User, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AccountSidebar from "@/components/AccountSidebar";
import SearchModal from "@/components/SearchModal";
import { useLanguage } from '@/contexts/LanguageContext';

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

    // Listen to auth changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // اسم المستخدم من Google أو Firebase
                if (currentUser.displayName) {
                    setUserName(currentUser.displayName.split(" ")[0]);
                } else {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const fullName = docSnap.data().name;
                        setUserName(fullName.split(" ")[0]);
                    }
                }
            } else {
                setUser(null);
                setUserName("");
            }
            setLoadingUser(false); // loading ended
        });

        return () => unsubscribe();
    }, []);

    // Shortcut to open search (typical for professional apps)
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

    // Logout function
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

    // nothing or loading spinner
    if (loadingUser) return null;

    return (
        // Added dark:from-background dark:to-background
        <div className='min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background text-foreground transition-colors duration-300'>
            {/* Added dark:border-border dark:bg-background/80 */}
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
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-500/10 dark:text-blue-400'
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent'
                                        }`}
                                >
                                    {icon} {t(labelKey)}
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

                        <div className='flex items-center gap-1 ml-2 pl-4 border-l border-slate-200 dark:border-border'>
                            <Globe size={16} className='text-slate-500 dark:text-muted-foreground' />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className='bg-transparent text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground cursor-pointer outline-none'
                            >
                                <option value="en" className="dark:bg-slate-900">EN</option>
                                <option value="ar" className="dark:bg-slate-900">AR</option>
                                <option value="fr" className="dark:bg-slate-900">FR</option>
                                <option value="zh" className="dark:bg-slate-900">ZH</option>
                            </select>
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
                                        {icon} {t(labelKey)}
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

                            <div className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-muted-foreground'>
                                <Globe size={16} />
                                <select
                                    value={language}
                                    onChange={(e) => { setLanguage(e.target.value); setMobileOpen(false); }}
                                    className='bg-transparent cursor-pointer outline-none w-full'
                                >
                                    <option value="en" className="dark:bg-slate-900">English (EN)</option>
                                    <option value="ar" className="dark:bg-slate-900">Arabic (AR)</option>
                                    <option value="fr" className="dark:bg-slate-900">French (FR)</option>
                                    <option value="zh" className="dark:bg-slate-900">Chinese (ZH)</option>
                                </select>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Account Sidebar */}
            <AccountSidebar
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
                user={user}
                onLogout={handleLogout}
            />

            <main className='flex-grow container mx-auto px-4 lg:px-8 py-6'>
                <Outlet context={{ setIsSearchOpen }} />
            </main>

            <BackToTop />
            <CommunityFooter />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}