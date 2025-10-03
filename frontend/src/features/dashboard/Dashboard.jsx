import { useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Wrench,
  Star
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { state, loading, tick, pause, setSpeed, fetchState } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (state && !state.paused) {
        tick(1);
      }
    }, 1000 / (state?.speed || 1));

    return () => clearInterval(interval);
  }, [state?.paused, state?.speed, tick]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchState();
    }, 2000);

    return () => clearInterval(refreshInterval);
  }, [fetchState]);

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const { kpis, day, month, year, speed, paused, cash } = state;

  return (
    <div className="space-y-6">
      {/* Date and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {month}/{day}/{year}
          </h2>
          <p className="text-slate-400">Day {day} of Month {month}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={paused ? 'default' : 'outline'}
            size="sm"
            onClick={() => pause(!paused)}
          >
            {paused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {paused ? 'Play' : 'Pause'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => tick(1)}
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Step Day
          </Button>

          <div className="flex gap-1">
            {[1, 5, 30].map((s) => (
              <Button
                key={s}
                variant={speed === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSpeed(s)}
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Cash"
          value={`$${cash.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="In Stock"
          value={kpis.unitsInStock}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Pending"
          value={kpis.unitsPending}
          icon={Package}
          color="yellow"
        />
        <KPICard
          title="Sold MTD"
          value={kpis.unitsSoldMTD}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Gross MTD"
          value={`$${kpis.grossMTD.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="CSI"
          value={kpis.csiMTD}
          icon={Star}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Cash Flow (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Sales Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentDeals deals={state.recentDeals} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Recent Service ROs</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentROs ros={state.recentROs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    green: 'text-green-400 bg-green-400/10',
    blue: 'text-blue-400 bg-blue-400/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CashFlowChart() {
  const { state } = useGameStore();
  if (!state) return null;

  const data = state.dailyReports?.slice(-30).map((report) => ({
    date: report.date.slice(5),
    cash: report.financials.cashDelta,
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
        />
        <Line type="monotone" dataKey="cash" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function SalesChart() {
  const { state } = useGameStore();
  if (!state) return null;

  const data = state.dailyReports?.slice(-7).map((report) => ({
    date: report.date.slice(5),
    units: report.sales.unitsSold,
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
        />
        <Bar dataKey="units" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecentDeals({ deals }) {
  if (!deals || deals.length === 0) {
    return <p className="text-slate-400 text-sm">No recent deals</p>;
  }

  return (
    <div className="space-y-2">
      {deals.slice(0, 5).map((deal) => (
        <div key={deal.id} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
          <div>
            <p className="text-sm font-medium">${deal.soldPrice.toLocaleString()}</p>
            <p className="text-xs text-slate-400">{deal.date}</p>
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400">
            +${deal.totalGross.toLocaleString()}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function RecentROs({ ros }) {
  if (!ros || ros.length === 0) {
    return <p className="text-slate-400 text-sm">No recent ROs</p>;
  }

  return (
    <div className="space-y-2">
      {ros.slice(0, 5).map((ro) => (
        <div key={ro.id} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
          <div>
            <p className="text-sm font-medium">{ro.laborHours}h labor</p>
            <p className="text-xs text-slate-400">{ro.date}</p>
          </div>
          <Badge 
            variant="outline" 
            className={ro.comeback ? 'text-red-400 border-red-400' : 'text-blue-400 border-blue-400'}
          >
            ${ro.partsRevenue.toLocaleString()}
          </Badge>
        </div>
      ))}
    </div>
  );
}
