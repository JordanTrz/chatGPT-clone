import { createBrowserRouter } from 'react-router-dom';
import HomePage from './homePage/Homepage';
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/dashboardLayout/DashboardLayout';
import DashboardPage from './dashboardPage/DashboardPage';
import ChatPage from './chatPage/ChatPage';
import SignInPage from './signInPage/SignInPage';
import SignUpPage from './signUpPage/SignUpPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/dashboard/chats/:chatId', element: <ChatPage /> },
        ],
      },
    ],
  },
]);

export default router;
