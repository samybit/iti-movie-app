import { useEffect } from 'react';
import { useLocation } from 'react-router';

const usePageTitle = (title) => {
	const location = useLocation();

	useEffect(() => {
		document.title = title ? `${title} | MovieApp` : 'MovieApp | Discover Your Next Favorite';
	}, [title, location]);
};

export default usePageTitle;
