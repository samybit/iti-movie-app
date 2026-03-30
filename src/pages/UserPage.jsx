// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function UserPage() {
	const { t } = useLanguage();
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 fade-in animate-in duration-500">
			<h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
				{t('welcomeMovieApp')}
			</h2>
			<p className="text-xl text-muted-foreground max-w-[600px]">
				{t('discoverNewReleases')}
			</p>
		</div>
	);
}

// Loading ...
// Error
// Data
