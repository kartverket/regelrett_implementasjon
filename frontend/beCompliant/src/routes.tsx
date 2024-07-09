import {
  createBrowserRouter,
  Link as ReactRouterLink,
  Outlet,
} from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { MainTableComponent } from './pages/TablePage';
import { Header } from './components/Header';
import LoginPage from "./components/Login";

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header logoLinkProps={{ as: ReactRouterLink }} />
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
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

]);

export default router;
