import { createBrowserRouter } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import { QuestionPage } from './pages/QuestionPage';
import { CreateContextPage } from './pages/CreateContextPage';
import { RedirectBackButton } from './components/RedirectBackButton';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/context/:contextId',
        element: (
          <>
            <RedirectBackButton />
            <ActivityPage />
          </>
        ),
      },
      {
        path: '/context/:contextId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/ny',
        element: (
          <>
            <RedirectBackButton />
            <CreateContextPage />
          </>
        ),
      },
      {
        path: '/',
        element: (
          <>
            <RedirectBackButton />
            <FrontPage />
          </>
        ),
      },
    ],
  },
]);

export default router;
