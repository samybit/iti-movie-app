import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Monitor, Languages, Bell, Shield, ArrowLeft, Paintbrush, Loader2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router';
import usePageTitle from '@/hooks/usePageTitle';
import toast from 'react-hot-toast';

const Settings = () => {
	usePageTitle('Settings');
	const { user, loading: authLoading } = useAuth();
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();

	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		setIsSaving(true);
		// Simulate API call
		setTimeout(() => {
			setIsSaving(false);
			toast.success('Settings updated successfully!', {
				style: {
					borderRadius: '1rem',
					background: '#1e293b',
					color: '#fff',
					fontWeight: 'bold',
				},
				icon: <CheckCircle2 className='text-emerald-500' size={20} />,
			});
		}, 1500);
	};

	if (authLoading) return null;

	return (
		<div className='max-w-4xl mx-auto space-y-10 py-10 px-4'>
			{/* Header Nav */}
			<div className='flex items-center gap-4'>
				<Button variant='ghost' onClick={() => navigate(-1)} className='rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'>
					<ArrowLeft size={18} /> Back
				</Button>
				<h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase'>Settings</h1>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				
				{/* Appearance Section */}
				<section className='space-y-6'>
					<div className='flex items-center gap-3 px-2'>
						<Paintbrush size={20} className='text-blue-500' />
						<h2 className='text-sm font-black text-slate-500 uppercase tracking-[0.2em]'>Appearance</h2>
					</div>
					<Card className='rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xl overflow-hidden'>
						<CardContent className='p-8 space-y-8'>
							<div className='space-y-4'>
								<Label className='text-sm font-bold opacity-70'>Interface Theme</Label>
								<div className='grid grid-cols-3 gap-3'>
									{[
										{ id: 'light', icon: <Sun size={16} />, label: 'Light' },
										{ id: 'dark', icon: <Moon size={16} />, label: 'Dark' },
										{ id: 'system', icon: <Monitor size={16} />, label: 'System' },
									].map((t) => (
										<button
											key={t.id}
											onClick={() => setTheme(t.id)}
											className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
												theme === t.id 
													? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
													: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-400'
											}`}
										>
											{t.icon}
											<span className='text-[10px] font-black uppercase tracking-widest'>{t.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800'>
								<div className='space-y-0.5'>
									<Label className='text-sm font-bold'>Glassmorphism Effects</Label>
									<p className='text-[10px] text-slate-400 font-medium'>Enable blurred backgrounds on UI elements.</p>
								</div>
								<Switch defaultChecked />
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Preferences Section */}
				<section className='space-y-6'>
					<div className='flex items-center gap-3 px-2'>
						<Languages size={20} className='text-purple-500' />
						<h2 className='text-sm font-black text-slate-500 uppercase tracking-[0.2em]'>Regional & Language</h2>
					</div>
					<Card className='rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xl overflow-hidden'>
						<CardContent className='p-8 space-y-6'>
							<div className='space-y-3'>
								<Label className='text-sm font-bold opacity-70'>Default Language</Label>
								<Select defaultValue='en-US'>
									<SelectTrigger className='h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold'>
										<SelectValue placeholder='Select Language' />
									</SelectTrigger>
									<SelectContent className='rounded-2xl border-slate-200 dark:border-slate-800'>
										<SelectItem value='en-US'>English (System)</SelectItem>
										<SelectItem value='tr-TR'>Turkish (Türkçe)</SelectItem>
										<SelectItem value='ar-SA'>Arabic (العربية)</SelectItem>
										<SelectItem value='es-ES'>Spanish (Español)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Notifications Section */}
				<section className='space-y-6'>
					<div className='flex items-center gap-3 px-2'>
						<Bell size={20} className='text-amber-500' />
						<h2 className='text-sm font-black text-slate-500 uppercase tracking-[0.2em]'>Notifications</h2>
					</div>
					<Card className='rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xl overflow-hidden'>
						<CardContent className='p-8 space-y-6'>
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label className='text-sm font-bold'>Email Alerts</Label>
									<p className='text-[10px] text-slate-400 font-medium'>Receive monthly movie recommendations.</p>
								</div>
								<Switch defaultChecked />
							</div>
							<div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800'>
								<div className='space-y-0.5'>
									<Label className='text-sm font-bold'>New Releases</Label>
									<p className='text-[10px] text-slate-400 font-medium'>Notify when movies in your watchlist release.</p>
								</div>
								<Switch defaultChecked />
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Security Section */}
				<section className='space-y-6'>
					<div className='flex items-center gap-3 px-2'>
						<Shield size={20} className='text-emerald-500' />
						<h2 className='text-sm font-black text-slate-500 uppercase tracking-[0.2em]'>Security</h2>
					</div>
					<Card className='rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xl overflow-hidden'>
						<CardContent className='p-8 space-y-6'>
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label className='text-sm font-bold'>Public Profile</Label>
									<p className='text-[10px] text-slate-400 font-medium'>Allow others to see your watchlist.</p>
								</div>
								<Switch />
							</div>
							<div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800'>
								<div className='space-y-0.5'>
									<Label className='text-sm font-bold'>Activity Logging</Label>
									<p className='text-[10px] text-slate-400 font-medium'>Keep record of your sign-ins.</p>
								</div>
								<Switch defaultChecked />
							</div>
						</CardContent>
					</Card>
				</section>
			</div>

			{/* Footer Action */}
			<div className='flex justify-end pt-10 border-t border-slate-200 dark:border-slate-800 shrink-0'>
				<Button 
					disabled={isSaving}
					onClick={handleSave}
					className='rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black px-10 h-14 shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70'
				>
					{isSaving ? (
						<div className='flex items-center gap-3'>
							<Loader2 className='animate-spin' size={20} />
							Saving Changes...
						</div>
					) : (
						'Save Changes'
					)}
				</Button>
			</div>
		</div>
	);
};

export default Settings;
