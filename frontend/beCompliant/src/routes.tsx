import { createBrowserRouter } from 'react-router';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convert(m: any) {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  };
}

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/context/:contextId',
        lazy: () => import('./pages/ActivityPage').then(convert),
      },
      {
        path: '/context/:contextId/:recordId',
        lazy: () => import('./pages/QuestionPage').then(convert),
      },
      {
        path: '/ny',
        lazy: () => import('./pages/CreateContextPage').then(convert),
      },
      {
        path: '/',
        lazy: () => import('./pages/FrontPage').then(convert),
      },
    ],
  },
]);

export default router;
