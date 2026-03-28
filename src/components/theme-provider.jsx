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

		// 1. Clean up Tailwind classes
		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';

			// 2. Apply Tailwind class AND Bootstrap attribute for System preference
			root.classList.add(systemTheme);
			root.setAttribute('data-bs-theme', systemTheme);
			return;
		}

		// 3. Apply Tailwind class AND Bootstrap attribute for Manual preference
		root.classList.add(theme);
		root.setAttribute('data-bs-theme', theme);
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