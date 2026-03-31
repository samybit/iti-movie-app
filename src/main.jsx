import './index.css';
import './App.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/LanguageContext';
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
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from './pages/VerifyEmail';
import HelpCenter from './pages/HelpCenter';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import History from './pages/History';

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
				element: (
					<ProtectedRoute>
						<Wishlist />
					</ProtectedRoute>
				),
			},
			{
				path: 'register',
				element: <Register />,
			},
			{
				path: "verify-email",
				element: <VerifyEmail />
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
			{
				path: 'help',
				element: <HelpCenter />,
			},
			{
				path: 'profile',
				element: (
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				),
			},
			{
				path: 'settings',
				element: (
					<ProtectedRoute>
						<Settings />
					</ProtectedRoute>
				),
			},
			{
				path: 'history',
				element: <History />,
			},
			{
				path: '*',
				element: <NotFound404 />,
			},
		],
	},
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
			<LanguageProvider>
				<RouterProvider router={router} />
				<Toaster position="top-center" richColors />
			</LanguageProvider>
		</ThemeProvider>
	</StrictMode>
);
