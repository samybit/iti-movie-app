import { createContext, useContext, useEffect, useState } from 'react';

const initialState = {
	theme: 'system',
	setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'vite-ui-theme',
	...props
}) {
	const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;

		// 0. Prevent transition lag by temporarily disabling all CSS transitions globally
		const css = document.createElement('style');
		css.appendChild(
			document.createTextNode(`* { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }`)
		);
		document.head.appendChild(css);

		// 1. Clean up Tailwind classes
		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';

			// 2. Apply Tailwind class AND Bootstrap attribute for System preference
			root.classList.add(systemTheme);
			root.setAttribute('data-bs-theme', systemTheme);
			root.setAttribute('data-theme', systemTheme);
		} else {
			// 3. Apply Tailwind class AND Bootstrap attribute for Manual preference
			root.classList.add(theme);
			root.setAttribute('data-bs-theme', theme);
			root.setAttribute('data-theme', theme);
		}

		// 4. Force browser to repaint, then remove the style tag to re-enable transitions
		const _ = document.documentElement.offsetHeight; // Force a synchronous layout reflow

		let frameId;
		frameId = requestAnimationFrame(() => {
			frameId = requestAnimationFrame(() => {
				document.head.removeChild(css);
			});
		});

		return () => cancelAnimationFrame(frameId);
	}, [theme]);

	useEffect(() => {
		if (theme !== 'system') return;

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			const root = window.document.documentElement;
			const systemTheme = media.matches ? 'dark' : 'light';
			root.classList.remove('light', 'dark');
			root.classList.add(systemTheme);
			root.setAttribute('data-bs-theme', systemTheme);
			root.setAttribute('data-theme', systemTheme);
		};

		media.addEventListener('change', handleChange);
		return () => media.removeEventListener('change', handleChange);
	}, [theme]);

	const value = {
		theme,
		setTheme: (newTheme) => {
			localStorage.setItem(storageKey, newTheme);
			setTheme(newTheme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};