import { FileQuestion } from 'lucide-react';

const EmptyState = ({ message = 'No movies found.', description = 'Try adjusting your filters or search query.' }) => {
	return (
		<div className='flex flex-col items-center justify-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center'>
			<div className='bg-slate-100 p-4 rounded-full mb-4'>
				<FileQuestion size={48} className='text-slate-400' />
			</div>
			<h3 className='text-xl font-semibold text-slate-900'>{message}</h3>
			<p className='text-slate-500 mt-2 max-w-xs'>{description}</p>
		</div>
	);
};

export default EmptyState;
