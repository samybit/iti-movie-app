import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.displayName) {
                    setUserName(currentUser.displayName.split(' ')[0]);
                } else {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserName(docSnap.data().name.split(' ')[0]);
                    }
                }
            } else {
                setUser(null);
                setUserName('');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, userName, loading };
}
