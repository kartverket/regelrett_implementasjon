import {
  createBrowserRouter,
  Link as ReactRouterLink,
  Outlet,
} from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { MainTableComponent } from './pages/TablePage';
import { Header } from '@kvib/react';
import { Header as Header2 } from './components/Header';

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header logoLinkProps={{ as: ReactRouterLink, isExternal: false }} />
        <Header2 logoLinkProps={{ as: ReactRouterLink }} />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/team/:teamName',
        element: <MainTableComponent />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
    ],
  },
]);

export default router;
