import { useState, useEffect } from 'react';
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
import { ChevronRight, Search, SlidersHorizontal, Tv, Film, X, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// ── Reusable sub-heading ────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
	<h4 className='text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-3'>{children}</h4>
);

// ── Slider with ticks ───────────────────────────────────────────────────────
const SliderWithTicks = ({ label, min = 0, max, step, value, onChange, format }) => {
	const ticks = [];
	for (let i = min; i <= max; i += step) ticks.push(i);

	const [localValue, setLocalValue] = useState(Array.isArray(value) ? value : [value]);
	
	useEffect(() => {
		setLocalValue(Array.isArray(value) ? value : [value]);
	}, [value]);

	return (
		<div className='space-y-4 pt-2'>
			<SectionLabel>{label}</SectionLabel>
			<div className='px-1'>
				<Slider
					value={localValue}
					min={min}
					max={max}
					step={step}
					onValueChange={setLocalValue}
					onValueCommit={onChange}
					className='cursor-pointer'
				/>
				<div className='flex justify-between mt-3 px-1'>
					<span className='text-[10px] font-bold text-slate-400'>{format ? format(min) : min}</span>
					<span className='text-[10px] font-bold text-slate-400'>{format ? format(max) : max}</span>
				</div>
			</div>
		</div>
	);
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const AdvancedSidebar = ({ filters, setFilters }) => {
	const { t, language } = useLanguage();
	const { genres } = useGenres(filters.mediaType, language);
	const { languages } = useLanguages();
	const { countries } = useCountries();

	const update = (patch) => setFilters((p) => ({ ...p, ...patch }));

	const [localKeywords, setLocalKeywords] = useState(filters.with_keywords || '');

	useEffect(() => {
		setLocalKeywords(filters.with_keywords || '');
	}, [filters.with_keywords]);

	const toggleGenre = (id) => {
		const cur = (filters.with_genres || '').split('|').filter(Boolean);
		const s = String(id);
		update({ with_genres: (cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]).join('|') });
	};

	const setDecade = (range) => {
		if (range === 'any') {
			update({ release_date_gte: '', release_date_lte: '' });
			return;
		}
		const [start, end] = range.split('-');
		update({ release_date_gte: `${start}-01-01`, release_date_lte: `${end}-12-31` });
	};

	const getCurrentDecadeRange = () => {
		if (!filters.release_date_gte || !filters.release_date_lte) return 'any';
		const start = filters.release_date_gte.substring(0, 4);
		const end = filters.release_date_lte.substring(0, 4);
		return `${start}-${end}`;
	};

	const toggleMood = (keyword) => {
		const cur = (filters.with_keywords || '').split(',').filter(Boolean);
		if (cur.includes(keyword)) {
			update({ with_keywords: cur.filter(k => k !== keyword).join(',') });
		} else {
			update({ with_keywords: [...cur, keyword].join(',') });
		}
	};

	const setContentRating = (rating) => {
		update({ certification: rating, certification_country: 'US' });
	};

	const selectedGenreCount = (filters.with_genres || '').split('|').filter(Boolean).length;

	return (
		<div className='flex flex-col gap-8'>

			{/* ── Media Type Toggle ────────────────────────────────────────── */}
			<div className='flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl gap-1'>
				{[
					{ key: 'movie', label: t('movies') },
					{ key: 'tv', label: t('tvSeries') },
				].map(({ key, label }) => (
					<button
						key={key}
						className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
							filters.mediaType === key
								? 'bg-blue-600 text-white shadow-lg'
								: 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
						}`}
						onClick={() => update({ mediaType: key, with_genres: '' })}
					>
						{label}
					</button>
				))}
			</div>

			{/* ── Sort By ─────────────────────────────────────────────────── */}
			<div className='space-y-3'>
				<SectionLabel>{t('sortBy')}</SectionLabel>
				<div className='grid grid-cols-2 gap-2'>
					{[
						{ label: t('popularity'), val: 'popularity.desc' },
						{ label: t('rating'), val: 'vote_average.desc' },
						{ label: t('latest'), val: 'primary_release_date.desc' },
						{ label: t('revenue') || 'Revenue', val: 'revenue.desc' },
					].map(({ label, val }) => (
						<button
							key={val}
							onClick={() => update({ sort_by: val })}
							className={`px-3 py-2.5 rounded-xl text-[10px] font-bold border transition-all truncate text-center ${
								filters.sort_by === val
									? 'bg-blue-600 border-blue-600 text-white shadow-lg'
									: 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* ── Decade ──────────────────────────────────────────────────── */}
			<div className='space-y-3'>
				<SectionLabel>{t('decade')}</SectionLabel>
				<div className='flex flex-wrap gap-2'>
					{[
						{ label: '80s', val: '1980-1989' },
						{ label: '90s', val: '1990-1999' },
						{ label: '2000s', val: '2000-2009' },
						{ label: '2010s', val: '2010-2019' },
						{ label: '2020s', val: '2020-2029' },
					].map(({ label, val }) => (
						<button
							key={label}
							onClick={() => setDecade(val)}
							className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
								getCurrentDecadeRange() === val
									? 'bg-blue-600 border-blue-600 text-white'
									: 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* ── Genre ───────────────────────────────────────────────────── */}
			<div className='space-y-3'>
				<SectionLabel>{t('genre')}</SectionLabel>
				<div className='flex flex-wrap gap-2'>
					{genres.slice(0, 10).map((g) => {
						const active = (filters.with_genres || '').split('|').includes(String(g.id));
						return (
							<button
								key={g.id}
								onClick={() => toggleGenre(g.id)}
								className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
									active
										? 'bg-white text-slate-900 border-white shadow-xl'
										: 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
								}`}
							>
								{g.name}
							</button>
						);
					})}
				</div>
			</div>

			{/* ── Language ────────────────────────────────────────────────── */}
			<div className='space-y-3'>
				<SectionLabel>{t('languageLabel')}</SectionLabel>
				<div className='flex flex-wrap gap-2'>
					{[
						{ label: t('english'), id: 'en' },
						{ label: t('arabic'), id: 'ar' },
						{ label: t('turkish'), id: 'tr' },
						{ label: t('spanish'), id: 'es' },
						{ label: t('french'), id: 'fr' },
						{ label: t('korean'), id: 'ko' },
						{ label: t('japanese'), id: 'ja' },
					].map(({ label, id }) => {
						const active = (filters.with_original_language || '').split('|').includes(id);
						return (
							<button
								key={id}
								onClick={() => {
									const cur = (filters.with_original_language || '').split('|').filter(Boolean);
									const next = cur.includes(id) ? cur.filter(l => l !== id) : [...cur, id];
									update({ with_original_language: next.join('|') });
								}}
								className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
									active
										? 'bg-blue-600 border-blue-600 text-white'
										: 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
								}`}
							>
								{label}
							</button>
						);
					})}
				</div>
			</div>

			{/* ── Mood ────────────────────────────────────────────────────── */}
			<div className='space-y-3'>
				<SectionLabel>{t('mood')}</SectionLabel>
				<div className='flex flex-wrap gap-2'>
					{[
						{ label: t('feelGood'), id: 'feel-good' },
						{ label: t('dark') || 'Dark', id: 'dark' },
						{ label: t('funny'), id: 'funny' },
						{ label: t('emotional'), id: 'emotional' },
						{ label: t('mindBending'), id: 'mind-bending' },
					].map(({ label, id }) => {
						const active = (filters.with_keywords || '').split(',').includes(id);
						return (
							<button
								key={id}
								onClick={() => toggleMood(id)}
								className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
									active
										? 'bg-white text-slate-900 border-white'
										: 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
								}`}
							>
								{label}
							</button>
						);
					})}
				</div>
			</div>

			{/* ── Runtime ─────────────────────────────────────────────────── */}
			<SliderWithTicks
				label={t('runtimeMax')}
				min={30}
				max={180}
				step={5}
				value={filters.with_runtime_lte || 180}
				onChange={(v) => update({ with_runtime_lte: v[0].toString() })}
				format={(v) => `${v} min`}
			/>

			{/* ── Min User Score ────────────────────────────────────────── */}
			<SliderWithTicks
				label={t('minUserScore')}
				min={0}
				max={10}
				step={0.5}
				value={filters.vote_average_gte || 0}
				onChange={(v) => update({ vote_average_gte: v[0].toString() })}
			/>

			{/* ── Content Rating ─────────────────────────────────────────── */}
			<div className='space-y-3'>
				<SectionLabel>{t('contentRating')}</SectionLabel>
				<div className='flex flex-wrap gap-3'>
					{['G', 'PG', 'PG-13', 'R', 'TV-MA'].map((r) => (
						<button
							key={r}
							onClick={() => setContentRating(filters.certification === r ? '' : r)}
							className={`text-[11px] font-black transition-colors ${
								filters.certification === r
									? 'text-blue-500'
									: 'text-slate-500 hover:text-slate-300'
							}`}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			{/* ── Footer Link ─────────────────────────────────────────────── */}
			<div className='pt-4'>
				<button 
					onClick={() => setFilters({
						mediaType: 'movie',
						with_genres: '',
						with_original_language: '',
						with_origin_country: '',
						language: 'en-US',
						release_date_gte: '',
						release_date_lte: '',
						episode_count_gte: '',
						episode_count_lte: '',
						vote_average_gte: '',
						vote_count_gte: '',
						with_runtime_gte: '',
						with_runtime_lte: '',
						with_keywords: '',
						certification: '',
						sort_by: 'popularity.desc',
						page: 1
					})}
					className='text-[11px] font-black text-blue-500 hover:underline uppercase tracking-widest transition-all'
				>
					{t('clearAllFilters')}
				</button>
			</div>
		</div>
	);
};

export default AdvancedSidebar;
