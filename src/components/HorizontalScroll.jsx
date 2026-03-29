import { useRef, useState } from 'react';
import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

const HorizontalScroll = ({ title, data, isLoading }) => {
	const { isWishlisted, toggleWishlist } = useWishlist();
	const scrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const checkScroll = () => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 10);
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
	};

	const scroll = (dir) => {
		const el = scrollRef.current;
		if (!el) return;
		const amount = el.clientWidth * 0.7;
		el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
		setTimeout(checkScroll, 400);
	};

	if (isLoading) {
		return (
			<div className='space-y-4 my-8'>
				{title && <Skeleton className='h-8 w-48 rounded-xl' />}
				<div className='flex gap-4 overflow-hidden'>
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className='min-w-[180px] max-w-[180px] space-y-3'>
							<Skeleton className='aspect-[2/3] w-full rounded-2xl' />
							<Skeleton className='h-4 w-3/4 rounded' />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-4 my-8 group/section relative'>
			{title && (
				<div className='flex items-center justify-between'>
					<h3 className='text-2xl font-extrabold tracking-tight'>{title}</h3>
					<div className='hidden sm:flex gap-2'>
						<button
							onClick={() => scroll('left')}
							disabled={!canScrollLeft}
							className={`p-2 rounded-full border transition-all ${canScrollLeft ? 'bg-white dark:bg-slate-950 shadow-md hover:shadow-lg text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800' : 'bg-slate-50 dark:bg-slate-900 text-slate-200 dark:text-slate-700 border-slate-100 dark:border-slate-800 cursor-default'}`}
						>
							<ChevronLeft size={18} />
						</button>
						<button
							onClick={() => scroll('right')}
							disabled={!canScrollRight}
							className={`p-2 rounded-full border transition-all ${canScrollRight ? 'bg-white dark:bg-slate-950 shadow-md hover:shadow-lg text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800' : 'bg-slate-50 dark:bg-slate-900 text-slate-200 dark:text-slate-700 border-slate-100 dark:border-slate-800 cursor-default'}`}
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			)}

			{/* Fade edges */}
			<div className='relative'>
				{canScrollLeft && (
					<div className='absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
				)}
				{canScrollRight && (
					<div className='absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />
				)}
				<div
					ref={scrollRef}
					onScroll={checkScroll}
					className='flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x scrollbar-hide'
				>
					{data.map((item) => (
						<div key={item.id} className='min-w-[180px] max-w-[180px] snap-start'>
							<MovieCard 
								movie={item} 
								isWishlisted={isWishlisted(item.id)}
								onToggleWishlist={() => toggleWishlist(item)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HorizontalScroll;
