import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Trash2, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router';
import usePageTitle from '@/hooks/usePageTitle';
import { useLanguage } from '@/contexts/LanguageContext';

const Wishlist = () => {
	const { t } = useLanguage();
	usePageTitle(t('myWishlist'));
	const [user, setUser] = useState(null);
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, movie, tv

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				const userDocRef = doc(db, 'users', currentUser.uid);
				const unsubscribeWishlist = onSnapshot(userDocRef, (docSnap) => {
					if (docSnap.exists()) {
						setWishlist(docSnap.data().wishlist || []);
					}
					setLoading(false);
				});
				return () => unsubscribeWishlist();
			} else {
				setWishlist([]);
				setLoading(false);
			}
		});

		return () => unsubscribeAuth();
	}, []);

	const handleRemoveItem = async (movie) => {
		if (!user) return;
		try {
			const userDocRef = doc(db, 'users', user.uid);
			await updateDoc(userDocRef, {
				wishlist: arrayRemove(movie)
			});
		} catch (error) {
			console.error('Error removing from wishlist:', error);
		}
	};

	const filteredWishlist = wishlist.filter(item => {
		if (filter === 'all') return true;
		const type = item.title ? 'movie' : 'tv';
		return type === filter;
	});

	if (loading) {
		return <WishlistSkeleton />;
	}

	if (!user) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6'>
				<div className='w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
					<Heart size={40} />
				</div>
				<h2 className='text-3xl font-black tracking-tighter'>{t('signInForWishlist')}</h2>
				<p className='text-slate-500 max-w-sm'>
					{t('keepTrack')}
				</p>
				<div className='flex gap-4 pt-2'>
					<Button asChild size='lg' className='rounded-full px-8 font-bold bg-blue-600'>
						<Link to='/login'>{t('signIn')}</Link>
					</Button>
					<Button asChild variant='outline' size='lg' className='rounded-full px-8 font-bold'>
						<Link to='/register'>{t('joinNow')}</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-10 py-6 max-w-7xl mx-auto'>
			{/* Header Section */}
			<div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
				<div className='space-y-1'>
					<div className='flex items-center gap-3'>
						<h1 className='text-4xl font-black tracking-tight uppercase'>{t('myLibrary')}</h1>
						<Badge variant='secondary' className='bg-blue-50 text-blue-600 rounded-full border-blue-100 px-3 py-1 font-black text-sm'>
							{wishlist.length}
						</Badge>
					</div>
					<p className='text-slate-500 font-medium'>
						{t('personalCollection')}
					</p>
				</div>

				{/* Filter Controls */}
				<div className='flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit'>
					{[
						{ key: 'all', label: t('allItems') },
						{ key: 'movie', label: t('movies') },
						{ key: 'tv', label: t('series') }
					].map(({ key, label }) => (
						<button
							key={key}
							onClick={() => setFilter(key)}
							className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
								filter === key 
									? 'bg-white shadow-lg text-blue-600 ring-1 ring-blue-500/10' 
									: 'text-slate-400 hover:text-slate-600'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Main Grid */}
			{wishlist.length === 0 ? (
				<div className='rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-20 text-center space-y-6'>
					<div className='mx-auto w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-200 rotate-12 group hover:rotate-0 transition-transform duration-500'>
						<Heart size={44} className='fill-slate-100 group-hover:fill-red-100 group-hover:text-red-300 transition-colors' />
					</div>
					<div className='space-y-2'>
						<h3 className='text-2xl font-black tracking-tight'>{t('wishlistEmpty')}</h3>
						<p className='text-slate-400 max-w-xs mx-auto text-sm font-medium'>
							{t('exploreThousands')}
						</p>
					</div>
					<Button asChild size='lg' className='rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 px-10 gap-2'>
						<Link to='/browse'>{t('findMovies')} <ArrowRight size={18} /></Link>
					</Button>
				</div>
			) : filteredWishlist.length === 0 ? (
				<EmptyState description={filter === 'movie' ? t('noMoviesWishlist') : t('noSeriesWishlist')} />
			) : (
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10'>
					{filteredWishlist.map((item) => (
						<div key={item.id} className='relative group'>
							<MovieCard 
								movie={item} 
								isWishlisted={true} 
								onToggleWishlist={() => handleRemoveItem(item)} 
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const WishlistSkeleton = () => (
	<div className='space-y-10 py-6 max-w-7xl mx-auto'>
		<div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
			<div className='space-y-4'>
				<Skeleton className='h-12 w-64' />
				<Skeleton className='h-4 w-48' />
			</div>
			<Skeleton className='h-12 w-64 rounded-2xl' />
		</div>
		<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
			{[...Array(12)].map((_, i) => (
				<Skeleton key={i} className='aspect-[2/3] rounded-2xl' />
			))}
		</div>
	</div>
);

export default Wishlist;
