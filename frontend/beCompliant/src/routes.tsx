import {
  createBrowserRouter,
  Link as ReactRouterLink,
  Outlet,
} from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { Header, Box } from '@kvib/react';
import { ActivityPage } from './pages/ActivityPage';

const router = createBrowserRouter([
  {
    element: (
      <Box backgroundColor={'gray.50'} height={'100vh'}>
        <Header logoLinkProps={{ as: ReactRouterLink, marginLeft: '2' }} />
        <Outlet />
      </Box>
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
