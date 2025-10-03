import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useGameStore } from './state/gameStore';
import { Dashboard } from './features/dashboard/Dashboard';
import { ControlPanel } from './features/control-panel/ControlPanel';
import { Inventory } from './features/inventory/Inventory';
import { Sales } from './features/sales/Sales';
import { Service } from './features/service/Service';
import { Reports } from './features/reports/Reports';
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  TrendingUp, 
  Wrench, 
  FileText 
} from 'lucide-react';
import './App.css';

function App() {
  const { fetchState } = useGameStore();

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                🚗 Dealership Simulator
              </h1>
              <nav className="flex gap-1">
                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/control" icon={Settings} label="Control" />
                <NavItem to="/inventory" icon={Package} label="Inventory" />
                <NavItem to="/sales" icon={TrendingUp} label="Sales" />
                <NavItem to="/service" icon={Wrench} label="Service" />
                <NavItem to="/reports" icon={FileText} label="Reports" />
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/control" element={<ControlPanel />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/service" element={<Service />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }`
      }
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export default App;
