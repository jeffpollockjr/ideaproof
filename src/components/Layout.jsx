import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => (
  <div className="flex h-screen bg-slate-950">
    <Sidebar />
    <main className="ml-60 flex-1 overflow-y-auto">
      <div className="page-enter">
        <Outlet />
      </div>
    </main>
  </div>
);

export default Layout;
