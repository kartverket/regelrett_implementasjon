import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { useIsAuthenticated } from './hooks/useIsAuthenticated';

function App() {
  useIsAuthenticated();

  return <RouterProvider router={router} />;
}

export default App;
