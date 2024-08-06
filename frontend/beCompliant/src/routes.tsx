import { Box, Header } from '@kvib/react';
import {
  Outlet,
  Link as ReactRouterLink,
  createBrowserRouter,
} from 'react-router-dom';
import { ActivityPage } from './pages/ActivityPage';
import FrontPage from './pages/FrontPage';
import { MainTableComponent } from './pages/TablePage';

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
        path: '/:teamName/:schemaid',
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
