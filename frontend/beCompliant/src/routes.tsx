import { createBrowserRouter, Navigate } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import { QuestionPage } from './pages/QuestionPage';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/team/:teamId',
        element: <ActivityPage />,
      },
      {
        path: '/function/:functionId',
        element: <ActivityPage />,
      },
      {
        path: '/context/:contextId',
        element: <ActivityPage />,
      },
      {
        path: '/team/:teamId/:tableId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/function/:functionId/:tableId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/context/:contextId/:tableId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
      {
        path: '/new',
        element: <Navigate to={`/context/${crypto.randomUUID()}`} />,
      },
      {
        path: '/ny',
        element: <Navigate to={`/context/${crypto.randomUUID()}`} />,
      },
    ],
  },
]);

export default router;
