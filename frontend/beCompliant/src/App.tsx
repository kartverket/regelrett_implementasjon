import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { useIsLoggedIn } from './hooks/useIsLoggedIn';

function App() {
  useIsLoggedIn();

  return <RouterProvider router={router} />;
}

export default App;
