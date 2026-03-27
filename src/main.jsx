import './index.css';
import './App.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import App from './App';
import Search from './pages/Search';
import Browse from './pages/Browse';
import MainLayout from './layouts/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import MediaDetail from './pages/MediaDetail';
import NotFound404 from './pages/NotFound404';

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <App />,
			},
			{
				path: 'browse',
				element: <Browse />,
			},
			{
				path: 'search',
				element: <Search />,
			},
			{
				path: 'wishlist',
				element: <Wishlist />,
			},
			{
				path: 'register',
				element: <Register />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'movie/:id',
				element: <MediaDetail type='movie' />,
			},
			{
				path: 'tv/:id',
				element: <MediaDetail type='tv' />,
			},
		],
	},
	{
		path: '*',
		element: <NotFound404 />,
	},
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
			<RouterProvider router={router} />
			<Toaster position="top-center" richColors />
		</ThemeProvider>
	</StrictMode>
);
