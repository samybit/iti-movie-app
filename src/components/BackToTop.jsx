import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener('scroll', toggleVisibility);
		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	if (!isVisible) return null;

	return (
		<Button
			variant='secondary'
			size='icon'
			className='fixed bottom-8 right-8 rounded-full shadow-lg z-50'
			onClick={scrollToTop}
		>
			<ChevronUp />
		</Button>
	);
};

export default BackToTop;
