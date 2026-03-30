import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, ShieldCheck, ShieldX, Calendar, ArrowLeft, Camera, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import usePageTitle from '@/hooks/usePageTitle';

const Profile = () => {
	usePageTitle('My Profile');
	const { user, userName, loading } = useAuth();
	const navigate = useNavigate();

	if (loading) return null;

	const displayName = userName || user?.displayName || user?.email?.split('@')[0] || 'Friend';
	const initials = displayName !== 'Friend'
		? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
		: 'U';

	const creationDate = user?.metadata?.creationTime 
		? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
		: 'TBA';

	return (
		<div className='max-w-4xl mx-auto space-y-10 py-10 px-4'>
			{/* Header Nav */}
			<div className='flex items-center justify-between'>
				<Button variant='ghost' onClick={() => navigate(-1)} className='rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'>
					<ArrowLeft size={18} /> Back
				</Button>
				<Button variant='outline' className='rounded-xl gap-2 border-slate-200 dark:border-slate-800 font-bold'>
					<Settings size={18} /> Settings
				</Button>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Left Side: Avatar & Main Info */}
				<Card className='lg:col-span-1 rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-xl'>
					<CardContent className='pt-10 pb-10 flex flex-col items-center text-center space-y-6'>
						<div className='relative group'>
							<div className='w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/30 transition-transform group-hover:scale-105'>
								{initials}
							</div>
							<button className='absolute bottom-0 right-0 p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform'>
								<Camera size={16} />
							</button>
						</div>
						<div className='space-y-2'>
							<h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase'>{displayName}</h1>
							<p className='text-slate-500 dark:text-slate-400 font-medium'>{user?.email}</p>
						</div>
						<div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${user?.emailVerified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>
							{user?.emailVerified ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
							{user?.emailVerified ? 'Verified Account' : 'Pending Verification'}
						</div>
					</CardContent>
				</Card>

				{/* Right Side: Detailed Stats & Info */}
				<div className='lg:col-span-2 space-y-8'>
					{/* Personal Details Section */}
					<section className='space-y-4'>
						<h2 className='text-sm font-black text-slate-500 uppercase tracking-[0.2em] px-4'>Personal Details</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<DetailCard 
								icon={<User size={18} />} 
								label='Full Name' 
								value={displayName} 
								color='text-blue-500'
								bg='bg-blue-500/5'
							/>
							<DetailCard 
								icon={<Mail size={18} />} 
								label='Email Address' 
								value={user?.email || '—'} 
								color='text-purple-500'
								bg='bg-purple-500/5'
							/>
							<DetailCard 
								icon={<Calendar size={18} />} 
								label='Member Since' 
								value={creationDate} 
								color='text-emerald-500'
								bg='bg-emerald-500/5'
							/>
							<DetailCard 
								icon={<ShieldCheck size={18} />} 
								label='Account Rank' 
								value='Movie Enthusiast' 
								color='text-amber-500'
								bg='bg-amber-500/5'
							/>
						</div>
					</section>

					{/* Account Activity / Stats Summary */}
					<Card className='rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden p-8'>
						<div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
							<div className='space-y-1 text-center sm:text-left'>
								<h3 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>Ready for more?</h3>
								<p className='text-slate-500 dark:text-slate-400 font-medium'>Manage your watchlist and explore new collections tailored for you.</p>
							</div>
							<Button asChild size='lg' className='h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-8 shadow-xl transition-all hover:scale-105 active:scale-95'>
								<Link to='/wishlist'>Explore Watchlist</Link>
							</Button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

const DetailCard = ({ icon, label, value, color, bg }) => (
	<div className={`p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-5 group transition-all hover:shadow-lg hover:-translate-y-1`}>
		<div className={`p-3.5 rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform duration-500`}>
			{icon}
		</div>
		<div className='min-w-0'>
			<p className='text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5'>{label}</p>
			<p className='text-sm font-bold text-slate-900 dark:text-white truncate'>{value}</p>
		</div>
	</div>
);

export default Profile;
