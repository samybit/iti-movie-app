import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
	if (totalPages <= 1) return null;

	const handlePrevious = (e) => {
		e.preventDefault();
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = (e) => {
		e.preventDefault();
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};

	return (
		<div className='mt-10 mb-6'>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href='#'
							onClick={handlePrevious}
							className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
						/>
					</PaginationItem>
					
					<PaginationItem>
						<span className='px-4 py-2 text-sm'>
							Page {currentPage} of {Math.min(totalPages, 500)}
						</span>
					</PaginationItem>

					<PaginationItem>
						<PaginationNext
							href='#'
							onClick={handleNext}
							className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};

export default PaginationControls;
