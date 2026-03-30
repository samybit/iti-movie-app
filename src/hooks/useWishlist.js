import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

export function useWishlist() {
	const [wishlist, setWishlist] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				const userDocRef = doc(db, 'users', currentUser.uid);
				const unsubscribeWishlist = onSnapshot(userDocRef, (docSnap) => {
					if (docSnap.exists()) {
						setWishlist(docSnap.data().wishlist || []);
					} else {
						setWishlist([]);
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

	const isWishlisted = (movieId) => {
		return wishlist.some((item) => Number(item.id) === Number(movieId));
	};

	const toggleWishlist = async (movie) => {
		if (!user) {
			toast.error('Please login to use wishlist 🔐');
			return;
		}

		try {
			const userDocRef = doc(db, 'users', user.uid);
			const existingItem = wishlist.find((item) => Number(item.id) === Number(movie.id));

			if (existingItem) {
				await updateDoc(userDocRef, {
					wishlist: arrayRemove(existingItem)
				});
				toast.info(`Removed from wishlist`);
			} else {
				await updateDoc(userDocRef, {
					wishlist: arrayUnion(movie)
				});
				toast.success(`Added to wishlist ✨`);
			}
		} catch (error) {
			console.error('Wishlist error:', error);
			toast.error('Failed to update wishlist');
		}
	};

	return { wishlist, isWishlisted, toggleWishlist, loading };
}
