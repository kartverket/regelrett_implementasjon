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
        {/* TODO Fix margin left on header*/}
        <Header logoLinkProps={{ as: ReactRouterLink }} />
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
