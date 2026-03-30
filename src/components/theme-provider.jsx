import { createContext, useContext, useEffect, useState } from 'react';

const initialState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);
const getSystemTheme = () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light');

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'vite-ui-theme',
	...props
}) {
	const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
	const [systemTheme, setSystemTheme] = useState(getSystemTheme);
	const resolvedTheme = theme === 'system' ? systemTheme : theme;

	useEffect(() => {
		const root = window.document.documentElement;

		// 0. Prevent transition lag by temporarily disabling all CSS transitions globally
		const css = document.createElement('style');
		css.appendChild(
			document.createTextNode(
				`* { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }`
			)
		);
		document.head.appendChild(css);

		// 1. Clean up Tailwind classes
		root.classList.remove('light', 'dark');

		root.classList.add(resolvedTheme);
		root.setAttribute('data-bs-theme', resolvedTheme);
		root.setAttribute('data-theme', resolvedTheme);

		// 4. Force browser to repaint, then remove the style tag to re-enable transitions
		const _ = document.documentElement.offsetHeight; // Force a synchronous layout reflow

		const frameId = requestAnimationFrame(() => {
			document.head.removeChild(css);
		});

		return () => cancelAnimationFrame(frameId);
	}, [resolvedTheme]);

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			setSystemTheme(media.matches ? 'dark' : 'light');
		};

		media.addEventListener('change', handleChange);
		return () => media.removeEventListener('change', handleChange);
	}, []);

	const value = {
		theme,
		resolvedTheme,
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