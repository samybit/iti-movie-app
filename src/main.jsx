import './index.css';
import './App.css';
import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from "./components/ProtectedRoute";
import { TMDBAuthProvider } from '@/contexts/TMDBAuthContext';

const App = lazy(() => import('./App'));
const Search = lazy(() => import('./pages/Search'));
const Browse = lazy(() => import('./pages/Browse'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const MediaDetail = lazy(() => import('./pages/MediaDetail'));
const NotFound404 = lazy(() => import('./pages/NotFound404'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const History = lazy(() => import('./pages/History'));
const TMDBCallback = lazy(() => import('./pages/TMDBCallback'));

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
				path: 'tmdb-callback',
				element: <TMDBCallback />,
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
		<TMDBAuthProvider>
			<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
				<LanguageProvider>
					<RouterProvider router={router} />
					<Toaster position="top-center" richColors />
				</LanguageProvider>
			</ThemeProvider>
		</TMDBAuthProvider>
	</StrictMode>
);