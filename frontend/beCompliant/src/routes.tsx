import { createBrowserRouter } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import { QuestionPage } from './pages/QuestionPage';
import { CreateContextPage } from './pages/CreateContextPage';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/context/:contextId',
        element: <ActivityPage />,
      },
      {
        path: '/context/:contextId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/ny',
        element: <CreateContextPage />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
    ],
  },
]);

export default router;
