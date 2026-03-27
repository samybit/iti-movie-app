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
	<h4 className='text-[13px] font-semibold text-slate-700 tracking-tight'>{children}</h4>
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
		const cur = (filters.with_genres || '').split(',').filter(Boolean);
		const s = String(id);
		update({ with_genres: (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]).join(',') });
	};

	const selectedGenreCount = (filters.with_genres || '').split(',').filter(Boolean).length;

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

				{/* SORT ─────────────────────────────────────────────────────── */}
				<AccordionItem value='sort' className='border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden'>
					
				</AccordionItem>

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
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-4'>
							<SectionLabel>Available Platforms</SectionLabel>
							<div className='grid grid-cols-3 gap-2'>
								{[
									{ name: 'Netflix', color: 'bg-red-600', text: 'N' },
									{ name: 'Disney+', color: 'bg-blue-700', text: 'D+' },
									{ name: 'Amazon', color: 'bg-sky-500', text: 'P' },
									{ name: 'HBO Max', color: 'bg-purple-700', text: 'H' },
									{ name: 'Apple TV+', color: 'bg-slate-800', text: '🍎' },
									{ name: 'Hulu', color: 'bg-green-500', text: 'h' },
									{ name: 'Paramount+', color: 'bg-blue-500', text: 'P+' },
									{ name: 'Peacock', color: 'bg-yellow-500', text: '🦚' },
									{ name: 'Crunchyroll', color: 'bg-orange-500', text: 'CR' },
								].map(({ name, color, text }) => (
									<button
										key={name}
										className='flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer'
										title={name}
									>
										<div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:scale-110 transition-transform`}>
											{text}
										</div>
										<span className='text-[9px] text-slate-400 font-semibold truncate w-full text-center'>{name}</span>
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
						<div className='space-y-3'>
							<SectionLabel>Show Me</SectionLabel>
							<RadioGroup defaultValue='everything' className='flex flex-col gap-1.5 pl-0.5'>
								{[
									{ val: 'everything', label: 'Everything', enabled: true },
									{ val: 'unseen', label: "Movies I Haven't Seen", enabled: false },
									{ val: 'seen', label: 'Movies I Have Seen', enabled: false },
								].map(({ val, label, enabled }) => (
									<label key={val} className={`flex items-center gap-2.5 py-1 cursor-pointer rounded-lg transition-colors hover:bg-slate-50 px-2 -mx-2 ${!enabled ? 'opacity-40 pointer-events-none' : ''}`}>
										<RadioGroupItem value={val} disabled={!enabled} />
										<span className='text-[13px]'>{label}</span>
									</label>
								))}
							</RadioGroup>
						</div>

						{/* Availabilities ─────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<SectionLabel>Availabilities</SectionLabel>
							<label className='flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 rounded-lg py-1.5 px-2 -mx-2 transition-colors'>
								<Checkbox id='avail' defaultChecked />
								<span className='text-[13px] text-slate-600'>Search all availabilities?</span>
							</label>
						</div>

						{/* Release Dates ──────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<SectionLabel>Release Dates</SectionLabel>
							<label className='flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 rounded-lg py-1.5 px-2 -mx-2 transition-colors'>
								<Checkbox id='releases' defaultChecked />
								<span className='text-[13px] text-slate-600'>Search all releases?</span>
							</label>
							<div className='grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 pt-1'>
								<span className='text-[11px] text-slate-400 font-medium whitespace-nowrap'>from</span>
								<Input
									type='number'
									placeholder='Year (e.g. 2020)'
									min={1900}
									max={2100}
									value={filters.release_date_gte}
									onChange={(e) => update({ release_date_gte: e.target.value })}
									className='h-8 text-xs rounded-lg bg-slate-50/80 border-slate-200 focus-visible:ring-blue-500'
								/>
								<span className='text-[11px] text-slate-400 font-medium whitespace-nowrap'>to</span>
								<Input
									type='number'
									placeholder='Year (e.g. 2024)'
									min={1900}
									max={2100}
									value={filters.release_date_lte}
									onChange={(e) => update({ release_date_lte: e.target.value })}
									className='h-8 text-xs rounded-lg bg-slate-50/80 border-slate-200 focus-visible:ring-blue-500'
								/>
							</div>
						</div>

						{/* Genres ─────────────────────── */}
						<div className='space-y-3 border-t border-dashed border-slate-100 pt-5'>
							<div className='flex items-center justify-between'>
								<SectionLabel>Genres</SectionLabel>
								{selectedGenreCount > 0 && (
									<span className='text-[10px] font-extrabold bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100'>
										{selectedGenreCount} selected
									</span>
								)}
							</div>
							<div className='flex flex-wrap gap-1.5'>
								{genres.map((g) => {
									const on = (filters.with_genres || '').split(',').includes(String(g.id));
									return (
										<button
											key={g.id}
											className={`px-3 py-[6px] rounded-full text-[11px] font-semibold border transition-all duration-150 select-none ${
												on
													? 'bg-blue-600 border-blue-600 text-white shadow-sm'
													: 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500 hover:shadow-sm'
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
									const cur = filters.with_original_language?.split(',').filter(Boolean) || [];
									if (!cur.includes(v)) {
										update({ with_original_language: [...cur, v].join(',') });
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
									{filters.with_original_language?.split(',').filter(Boolean).map(langCode => {
										const lang = languages.find(l => l.iso_639_1 === langCode);
										return (
											<div key={langCode} className='flex items-center gap-1.5 pl-2 pr-1 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[11px] font-bold animate-in fade-in zoom-in duration-200'>
												{lang ? lang.english_name : langCode}
												<button 
													onClick={() => {
														const cur = filters.with_original_language.split(',').filter(x => x !== langCode);
														update({ with_original_language: cur.join(',') });
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
