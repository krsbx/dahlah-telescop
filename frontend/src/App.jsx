import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import BorrowTelescope from './pages/borrow';
import BorrowTelescopeSchedule from './pages/borrow/schedule';
import Accounts from './pages/admin/accounts';
import Borrows from './pages/admin/borrows';

const router = createBrowserRouter([
  // Missing
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'borrows',
    element: <BorrowTelescope />,
  },
  {
    path: 'borrows/schedule',
    element: <BorrowTelescopeSchedule />,
  },
  // Admin only
  {
    path: 'admin',
    element: <Accounts />,
  },
  {
    path: 'admin/accounts',
    element: <Accounts />,
  },
  {
    path: 'admin/accounts/add',
    element: null,
  },
  {
    path: 'admin/accounts/edit/:userId',
    element: null,
  },

  {
    path: 'admin/borrows',
    element: <Borrows />,
  },
  {
    path: 'admin/borrows/add',
    element: null,
  },
  {
    path: 'admin/borrows/edit/:borrowingId',
    element: null,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
