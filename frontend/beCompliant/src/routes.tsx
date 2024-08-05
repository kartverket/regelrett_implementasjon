import {
  createBrowserRouter,
  Link as ReactRouterLink,
  Outlet,
} from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { Header } from '@kvib/react';
import { ActivityPage } from './pages/ActivityPage';

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header logoLinkProps={{ as: ReactRouterLink, marginLeft: '2' }} />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/team/:teamName',
        element: <ActivityPage />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
    ],
  },
]);

export default router;
