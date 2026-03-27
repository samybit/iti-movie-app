import { useState, useEffect } from 'react';
import { useGenres } from '../hooks/useGenres';
import { useLanguages } from '../hooks/useLanguages';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AdvancedSidebar = ({ filters, onFilterChange }) => {
	const { genres } = useGenres(filters.mediaType);
	const { languages } = useLanguages();

	const handleGenreToggle = (genreId) => {
		const newGenres = filters.with_genres.split(',').filter(Boolean);
		const idStr = String(genreId);
		
		if (newGenres.includes(idStr)) {
			onFilterChange({ with_genres: newGenres.filter(id => id !== idStr).join(',') });
		} else {
			onFilterChange({ with_genres: [...newGenres, idStr].join(',') });
		}
	};

	return (
		<div className='w-full space-y-6 pb-10'>
			<div className='space-y-2'>
				<h4 className='font-bold text-sm uppercase text-slate-400 tracking-wider'>Media Type</h4>
				<div className='flex gap-2 p-1 bg-slate-100 rounded-lg'>
					<button
						className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${filters.mediaType === 'movie' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
						onClick={() => onFilterChange({ mediaType: 'movie', with_genres: '' })}
					>
						Movies
					</button>
					<button
						className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${filters.mediaType === 'tv' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
						onClick={() => onFilterChange({ mediaType: 'tv', with_genres: '' })}
					>
						Series
					</button>
				</div>
			</div>

			<Accordion type='multiple' defaultValue={['genres', 'language', 'date']}>
				<AccordionItem value='genres'>
					<AccordionTrigger className='font-bold py-2 hover:no-underline'>Genres</AccordionTrigger>
					<AccordionContent>
						<div className='grid grid-cols-1 gap-2 mt-2'>
							{genres.map((genre) => (
								<div key={genre.id} className='flex items-center space-x-2'>
									<Checkbox
										id={`genre-${genre.id}`}
										checked={filters.with_genres.split(',').includes(String(genre.id))}
										onCheckedChange={() => handleGenreToggle(genre.id)}
									/>
									<Label htmlFor={`genre-${genre.id}`} className='text-sm font-normal cursor-pointer text-slate-600'>
										{genre.name}
									</Label>
								</div>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='language'>
					<AccordionTrigger className='font-bold py-2 hover:no-underline'>Language/Country</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-4 mt-2'>
							<Select 
								value={filters.with_original_language} 
								onValueChange={(val) => onFilterChange({ with_original_language: val })}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select Language' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='en'>English</SelectItem>
									<SelectItem value='tr'>Turkish</SelectItem>
									<SelectItem value='fr'>French</SelectItem>
									<SelectItem value='ar'>Arabic</SelectItem>
									<SelectItem value='zh'>Chinese</SelectItem>
									{languages.filter(l => !['en', 'tr', 'fr', 'ar', 'zh'].includes(l.iso_639_1)).map(lang => (
										<SelectItem key={lang.iso_639_1} value={lang.iso_639_1}>
											{lang.english_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='date'>
					<AccordionTrigger className='font-bold py-2 hover:no-underline'>Release Date</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-4 mt-2'>
							<div className='grid grid-cols-2 gap-2'>
								<div className='space-y-1.5'>
									<Label className='text-xs text-slate-500'>From</Label>
									<input
										type='date'
										className='flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors'
										value={filters.release_date_gte}
										onChange={(e) => onFilterChange({ release_date_gte: e.target.value })}
									/>
								</div>
								<div className='space-y-1.5'>
									<Label className='text-xs text-slate-500'>To</Label>
									<input
										type='date'
										className='flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors'
										value={filters.release_date_lte}
										onChange={(e) => onFilterChange({ release_date_lte: e.target.value })}
									/>
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{filters.mediaType === 'tv' && (
					<AccordionItem value='episodes'>
						<AccordionTrigger className='font-bold py-2 hover:no-underline'>Total Episodes</AccordionTrigger>
						<AccordionContent>
							<div className='space-y-6 mt-4 px-2'>
								<Slider
									defaultValue={[0, 100]}
									max={100}
									step={1}
									onValueChange={(val) => onFilterChange({ episode_count_gte: val[0], episode_count_lte: val[1] })}
								/>
								<div className='flex justify-between text-xs text-slate-500 font-medium'>
									<span>Min: {filters.episode_count_gte || 0}</span>
									<span>Max: {filters.episode_count_lte || 100}+</span>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
		</div>
	);
};

export default AdvancedSidebar;
