import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const toggle = () => setVisible(window.scrollY > 400);
		window.addEventListener('scroll', toggle);
		return () => window.removeEventListener('scroll', toggle);
	}, []);

	if (!visible) return null;

	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			className='fixed bottom-6 right-6 z-50 p-3 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
			aria-label='Back to top'
		>
			<ChevronUp size={20} strokeWidth={3} />
		</button>
	);
};

export default BackToTop;
