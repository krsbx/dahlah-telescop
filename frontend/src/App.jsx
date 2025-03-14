import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Accounts from './pages/admin/accounts';
import AddAccount from './pages/admin/accounts/add';
import EditAccount from './pages/admin/accounts/edit';
import Borrows from './pages/admin/borrows';
import AddBorrow from './pages/admin/borrows/add';
import EditBorrow from './pages/admin/borrows/edit';
import BorrowTelescope from './pages/borrow';
import BorrowTelescopeSchedule from './pages/borrow/schedule';
import Home from './pages/home';

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
    element: <AddAccount />,
  },
  {
    path: 'admin/accounts/edit/:userId',
    element: <EditAccount />,
  },

  {
    path: 'admin/borrows',
    element: <Borrows />,
  },
  {
    path: 'admin/borrows/add',
    element: <AddBorrow />,
  },
  {
    path: 'admin/borrows/edit/:borrowingId',
    element: <EditBorrow />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
