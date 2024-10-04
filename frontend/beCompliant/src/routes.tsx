import { createBrowserRouter } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { TeamActivityPage } from './pages/TeamActivityPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import { QuestionPage } from './pages/QuestionPage';
import { FunctionActivityPage } from './pages/FunctionActivityPage';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/team/:teamName',
        element: <TeamActivityPage />,
      },
      {
        path: '/function/:functionId',
        element: <FunctionActivityPage />,
      },
      {
        path: '/team/:teamName/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
    ],
  },
]);

export default router;
