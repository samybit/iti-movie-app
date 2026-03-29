import { useState } from 'react';
import { useGenres } from '../hooks/useGenres';
import { useLanguages } from '../hooks/useLanguages';
import { useCountries } from '../hooks/useCountries';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search, SlidersHorizontal, Tv, Film, X } from 'lucide-react';

// ── Reusable sub-heading ────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
	<h4 className='text-[13px] font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wide'>{children}</h4>
);

// ── Slider with ticks ───────────────────────────────────────────────────────
const SliderWithTicks = ({ label, min = 0, max, step, value, onChange, format }) => {
	const ticks = [];
	for (let i = min; i <= max; i += step) ticks.push(i);
	return (
		<div className='space-y-2 border-t border-dashed border-slate-100 pt-5'>
			<SectionLabel>{label}</SectionLabel>
			<div className='px-1 pt-1 pb-2'>
				<Slider
					defaultValue={Array.isArray(value) ? value : [value]}
					min={min}
					max={max}
					step={step}
					onValueChange={onChange}
					className='cursor-pointer'
				/>
				<div className='flex justify-between mt-1.5'>
					{ticks.filter((_, i) => i % Math.max(1, Math.floor(ticks.length / 5)) === 0 || _ === max).map(t => (
						<span key={t} className='text-[9px] text-slate-300 font-bold select-none'>{format ? format(t) : t}</span>
					))}
				</div>
			</div>
		</div>
	);
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const AdvancedSidebar = ({ filters, setFilters, onSearch }) => {
	const { genres } = useGenres(filters.mediaType, filters.language);
	const { languages } = useLanguages();
	const { countries } = useCountries();

	const update = (patch) => setFilters((p) => ({ ...p, ...patch }));

	const toggleGenre = (id) => {
		const cur = (filters.with_genres || '').split('|').filter(Boolean);
		const s = String(id);
		update({ with_genres: (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]).join('|') });
	};

	const selectedGenreCount = (filters.with_genres || '').split('|').filter(Boolean).length;
	const years = Array.from({ length: 132 }, (_, i) => (2031 - i).toString()); // 1900 to 2031

	return (
		<div className='flex flex-col gap-3'>

			{/* ── Media Type Toggle ────────────────────────────────────────── */}
			<div className='relative p-1 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/70 shadow-sm'>
				<div className='flex gap-1'>
					{[
						{ key: 'movie', label: 'Movies', icon: <Film size={15} /> },
						{ key: 'tv', label: 'TV Series', icon: <Tv size={15} /> },
					].map(({ key, label, icon }) => (
						<button
							key={key}
							className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${
								filters.mediaType === key
									? 'bg-white shadow-lg text-blue-600 ring-1 ring-blue-100'
									: 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
							}`}
							onClick={() => update({ mediaType: key, with_genres: '' })}
						>
							{icon} {label}
						</button>
					))}
				</div>
			</div>

			{/* ── Accordion Sections ──────────────────────────────────────── */}
			<Accordion type='multiple' defaultValue={['sort', 'filters']} className='w-full space-y-2.5'>


				{/* WHERE TO WATCH ───────────────────────────────────────────── */}
				<AccordionItem value='watch' className='border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden'>
					<AccordionTrigger className='font-bold hover:no-underline px-5 py-3 text-sm data-[state=open]:border-b border-slate-100'>
						<div className='flex w-full items-center justify-between pr-3'>
							<span>Where To Watch</span>
							<span className='text-[10px] font-extrabold bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100'>41</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className='px-5 pb-5 pt-4 space-y-5'>
						{/* My Services */}
						<div className='space-y-3'>
							<SectionLabel>My Services</SectionLabel>
							<label className='flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 rounded-lg py-1.5 px-2 -mx-2 transition-colors'>
								<Checkbox id='restrict-services' />
								<span className='text-[12px] text-slate-600 leading-tight'>Restrict searches to my subscribed services?</span>
							</label>
						</div>

						{/* Country */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-4'>
							<SectionLabel>Country</SectionLabel>
							<Select value={filters.with_origin_country} onValueChange={(v) => update({ with_origin_country: v })}>
								<SelectTrigger className='w-full bg-slate-50/80 border-slate-200 rounded-xl text-[13px]'>
									<SelectValue placeholder='Select Country' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='US'>🇺🇸 United States</SelectItem>
									<SelectItem value='GB'>🇬🇧 United Kingdom</SelectItem>
									<SelectItem value='DE'>🇩🇪 Germany</SelectItem>
									<SelectItem value='FR'>🇫🇷 France</SelectItem>
									<SelectItem value='TR'>🇹🇷 Turkey</SelectItem>
									<SelectItem value='EG'>🇪🇬 Egypt</SelectItem>
									<SelectItem value='SA'>🇸🇦 Saudi Arabia</SelectItem>
									<SelectItem value='IN'>🇮🇳 India</SelectItem>
									<SelectItem value='JP'>🇯🇵 Japan</SelectItem>
									<SelectItem value='KR'>🇰🇷 South Korea</SelectItem>
									{countries.filter(c => !['US','GB','DE','FR','TR','EG','SA','IN','JP','KR'].includes(c.iso_3166_1)).map(c => (
										<SelectItem key={c.iso_3166_1} value={c.iso_3166_1}>{c.english_name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Streaming Platforms */}
						<div className='space-y-4 border-t border-dashed border-slate-100 pt-5 bg-slate-50/30 -mx-5 px-5 pb-2'>
							<SectionLabel>Available Platforms</SectionLabel>
							<div className='grid grid-cols-3 gap-3'>
								{[
									{ name: 'Netflix', icon: 'https://www.themoviedb.org/t/p/original/pTpxMq1S1vCqbDuZOKQ6fsTSR1f.jpg' },
									{ name: 'Disney+', icon: 'https://www.themoviedb.org/t/p/original/97vSjCF9Zaoq7p36W0pFiPBqh29.jpg' },
									{ name: 'Amazon', icon: 'https://www.themoviedb.org/t/p/original/dgPueyEdOisELs98EX6Gz6kH7u3.jpg' },
									{ name: 'HBO Max', icon: 'https://www.themoviedb.org/t/p/original/68vAnUiqHjfiFdG9Zpt39PZZ9jO.jpg' },
									{ name: 'Apple TV+', icon: 'https://www.themoviedb.org/t/p/original/68vAnUiqHjfiFdG9Zpt39PZZ9jO.jpg' }, // Generic placeholder if needed
									{ name: 'Hulu', icon: 'https://www.themoviedb.org/t/p/original/giLR06v9SVPWfyY7YppF968lxZ9.jpg' },
									{ name: 'Paramount+', icon: 'https://www.themoviedb.org/t/p/original/pk8vTz1fUpCq7m4X3RjD3ZfC8k4.jpg' },
									{ name: 'Peacock', icon: 'https://www.themoviedb.org/t/p/original/87vUfF8f6Z7Y9W7h9h8h8h8h8h8.jpg' }, 
									{ name: 'Crunchyroll', icon: 'https://www.themoviedb.org/t/p/original/m99F2e6q5p4nN1zR6z5p4nN1zR6.jpg' },
								].map(({ name, icon }) => (
									<button
										key={name}
										className='flex flex-col items-center gap-1.5 p-1 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all group'
										title={name}
									>
										<div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-slate-100 bg-white">
											<img src={icon} alt={name} className="w-full h-full object-cover" />
										</div>
										<span className='text-[10px] text-slate-400 font-bold truncate w-full text-center'>{name}</span>
									</button>
								))}
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* FILTERS MAIN ─────────────────────────────────────────────── */}
				<AccordionItem value='filters' className='border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden'>
					<AccordionTrigger className='font-bold hover:no-underline px-5 py-3 text-sm data-[state=open]:border-b border-slate-100'>
						<div className='flex items-center gap-2'>
							<SlidersHorizontal size={14} className='text-slate-400' />
							Filters
						</div>
					</AccordionTrigger>
					<AccordionContent className='px-5 pb-6 pt-5 space-y-5'>

						{/* Show Me ────────────────────── */}
						<div className='space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50'>
							<SectionLabel>Show Me</SectionLabel>
							<RadioGroup defaultValue='everything' className='grid grid-cols-1 gap-1.5'>
								{[
									{ val: 'everything', label: 'Everything', enabled: true },
									{ val: 'unseen', label: "New To Me", enabled: false },
									{ val: 'seen', label: 'Already Seen', enabled: false },
								].map(({ val, label, enabled }) => (
									<label key={val} className={`flex items-center justify-between gap-2.5 py-2.5 px-3.5 cursor-pointer rounded-xl border transition-all ${
										!enabled 
										  ? 'opacity-40 grayscale pointer-events-none border-slate-100' 
										  : 'hover:bg-white hover:border-blue-200 group'
									} bg-white shadow-sm`}>
										<div className="flex items-center gap-3">
											<RadioGroupItem value={val} disabled={!enabled} className="border-slate-300" />
											<span className='text-[13px] font-bold text-slate-700'>{label}</span>
										</div>
										{enabled && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
									</label>
								))}
							</RadioGroup>
						</div>

						{/* Availabilities ─────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<SectionLabel>Availabilities</SectionLabel>
							<label className='flex items-center justify-between gap-2.5 cursor-pointer hover:bg-blue-50/50 bg-white border border-slate-100 rounded-xl py-3 px-4 shadow-sm transition-all group'>
								<span className='text-[13px] font-bold text-slate-700'>Search all availabilities?</span>
								<Checkbox id='avail' defaultChecked className="rounded-md border-slate-300 data-[state=checked]:bg-blue-500" />
							</label>
						</div>

						{/* Release Dates ──────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 dark:border-slate-800 pt-5'>
							<SectionLabel>Release Dates</SectionLabel>

							<label 
								className='flex items-center justify-between gap-2.5 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-500/10 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-4 shadow-sm transition-all group'
							>
								<span className='text-[13px] font-bold text-slate-700 dark:text-slate-200'>Search all dates?</span>
								<Checkbox 
									id='releases' 
									checked={!filters.release_date_gte && !filters.release_date_lte}
									onCheckedChange={(checked) => {
										if (checked) update({ release_date_gte: '', release_date_lte: '' });
									}}
									className="rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-600" 
								/>
							</label>
							
							<div className='grid grid-cols-2 gap-3 pt-1'>
								<div className="space-y-1.5 flex flex-col">
									<Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1 mb-1">From Year</Label>
									<Select value={filters.release_date_gte || ' '} onValueChange={(v) => update({ release_date_gte: v === ' ' ? '' : v })}>
										<SelectTrigger className='h-10 bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl text-[13px] font-semibold dark:text-slate-100'>
											<SelectValue placeholder='Any' />
										</SelectTrigger>
										<SelectContent className="max-h-[300px] rounded-2xl dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 shadow-2xl">
											<SelectItem value=" ">Any Year</SelectItem>
											{years.map(y => <SelectItem key={`from-${y}`} value={y}>{y}</SelectItem>)}
										</SelectContent>
									</Select>
								</div>
								
								<div className="space-y-1.5 flex flex-col">
									<Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1 mb-1">To Year</Label>
									<Select value={filters.release_date_lte || ' '} onValueChange={(v) => update({ release_date_lte: v === ' ' ? '' : v })}>
										<SelectTrigger className='h-10 bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl text-[13px] font-semibold dark:text-slate-100'>
											<SelectValue placeholder='Any' />
										</SelectTrigger>
										<SelectContent className="max-h-[300px] rounded-2xl dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 shadow-2xl">
											<SelectItem value=" ">Any Year</SelectItem>
											{years.map(y => <SelectItem key={`to-${y}`} value={y}>{y}</SelectItem>)}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Genres ─────────────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 dark:border-slate-800 pt-5'>
							<div className='flex items-center justify-between'>
								<SectionLabel>Genres</SectionLabel>
								{selectedGenreCount > 0 && (
									<span className='text-[10px] font-extrabold bg-blue-50 dark:bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-500/20'>
										{selectedGenreCount} selected
									</span>
								)}
							</div>
							<div className='flex flex-wrap gap-1.5'>
								{genres.map((g) => {
									const on = (filters.with_genres || '').split('|').includes(String(g.id));
									return (
										<button
											key={g.id}
											className={`px-3 py-[6px] rounded-full text-[11px] font-semibold border transition-all duration-150 select-none ${
												on
													? 'bg-blue-600 border-blue-600 text-white shadow-sm'
													: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 hover:shadow-sm'
											}`}
											onClick={() => toggleGenre(g.id)}
										>
											{g.name}
										</button>
									);
								})}
							</div>
						</div>


						{/* Language ────────────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<SectionLabel>Language</SectionLabel>
							<div className='pt-1 space-y-3'>
								<Select onValueChange={(v) => {
									const cur = filters.with_original_language?.split('|').filter(Boolean) || [];
									if (!cur.includes(v)) {
										update({ with_original_language: [...cur, v].join('|') });
									}
								}}>
									<SelectTrigger className='w-full bg-slate-50/80 border-slate-200 rounded-xl text-[13px]'>
										<SelectValue placeholder='Select Language' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='en'>English</SelectItem>
										<SelectItem value='tr'>Turkish</SelectItem>
										<SelectItem value='ar'>Arabic</SelectItem>
										<SelectItem value='ko'>Korean</SelectItem>
										<SelectItem value='fr'>French</SelectItem>
										<SelectItem value='de'>German</SelectItem>
										<SelectItem value='es'>Spanish</SelectItem>
										<SelectItem value='ja'>Japanese</SelectItem>
										{languages.filter(l => !['en', 'tr', 'ar', 'ko', 'fr', 'de', 'es', 'ja'].includes(l.iso_639_1)).map(l => (
											<SelectItem key={l.iso_639_1} value={l.iso_639_1}>{l.english_name}</SelectItem>
										))}
									</SelectContent>
								</Select>

								{/* Selected Language Pills */}
								<div className='flex flex-wrap gap-1.5'>
									{filters.with_original_language?.split('|').filter(Boolean).map(langCode => {
										const lang = languages.find(l => l.iso_639_1 === langCode);
										return (
											<div key={langCode} className='flex items-center gap-1.5 pl-2 pr-1 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[11px] font-bold animate-in fade-in zoom-in duration-200'>
												{lang ? lang.english_name : langCode}
												<button 
													onClick={() => {
														const cur = filters.with_original_language.split('|').filter(x => x !== langCode);
														update({ with_original_language: cur.join('|') });
													}}
													className='p-0.5 hover:bg-blue-100 rounded-md transition-colors'
												>
													<X size={12} />
												</button>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						{/* User Score ─────────────────── */}
						<SliderWithTicks
							label='User Score'
							max={10} step={1}
							value={filters.vote_average_gte || 0}
							onChange={(v) => update({ vote_average_gte: v[0].toString() })}
						/>

						{/* Minimum User Votes ────────── */}
						<SliderWithTicks
							label='Minimum User Votes'
							max={500} step={50}
							value={filters.vote_count_gte || 0}
							onChange={(v) => update({ vote_count_gte: v[0].toString() })}
						/>

						{/* Runtime ────────────────────── */}
						<SliderWithTicks
							label='Runtime'
							max={360} step={15}
							value={[filters.with_runtime_gte || 0, filters.with_runtime_lte || 360]}
							onChange={(v) => update({ with_runtime_gte: v[0].toString(), with_runtime_lte: v[1].toString() })}
							format={(v) => `${v}m`}
						/>

						{/* Keywords ───────────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<SectionLabel>Keywords</SectionLabel>
							<Input
								placeholder='Filter by keywords...'
								value={filters.with_keywords}
								onChange={(e) => update({ with_keywords: e.target.value })}
								className='text-[13px] h-9 bg-slate-50/80 border-slate-200 rounded-xl placeholder:text-slate-300'
							/>
						</div>

						{/* Translated To ──────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<SectionLabel>Translated To</SectionLabel>
							<Select value={filters.language} onValueChange={(v) => update({ language: v })}>
								<SelectTrigger className='w-full bg-blue-50/60 border-blue-100 text-blue-600 rounded-xl text-[13px] font-semibold'>
									<SelectValue placeholder='Select Translation' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='en-US'>English (US)</SelectItem>
									<SelectItem value='tr-TR'>Turkish (TR)</SelectItem>
									<SelectItem value='ar-SA'>Arabic (SA)</SelectItem>
									<SelectItem value='fr-FR'>French (FR)</SelectItem>
								</SelectContent>
							</Select>
						</div>

					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* ── Search Button (sticky) ──────────────────────────────────── */}
			<div className='sticky bottom-0 pt-3 pb-1 bg-gradient-to-t from-white via-white'>
				<Button
					onClick={onSearch}
					className='w-full h-12 rounded-2xl font-bold text-[15px] bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-2'
				>
					<Search size={18} /> Search
				</Button>
			</div>
		</div>
	);
};

export default AdvancedSidebar;
