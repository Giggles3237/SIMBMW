import { useGameStore } from '../../state/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp } from 'lucide-react';

export function Sales() {
  const { state } = useGameStore();

  if (!state) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const { advisors, leads, appointments, recentDeals } = state;
  const activeAdvisors = advisors.filter((a) => a.active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Sales Department</h2>
        <p className="text-slate-400">
          {activeAdvisors.length} advisors • {leads.length} leads • {appointments.length} appointments
        </p>
      </div>

      {/* Sales Advisors */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Sales Advisors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeAdvisors.map((advisor) => (
            <AdvisorCard key={advisor.id} advisor={advisor} />
          ))}
        </div>
      </div>

      {/* Recent Deals */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Recent Deals
        </h3>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {recentDeals.slice(0, 10).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded bg-slate-800/50">
                  <div>
                    <p className="font-medium">${deal.soldPrice.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{deal.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-400">+${deal.totalGross.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">
                      Front: ${deal.frontGross.toLocaleString()} | Back: ${deal.backGross.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentDeals.length === 0 && (
                <p className="text-slate-400 text-center py-8">No recent deals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdvisorCard({ advisor }) {
  const getMoraleColor = (morale) => {
    if (morale >= 70) return 'bg-green-500';
    if (morale >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{advisor.name}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {advisor.archetype}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Morale</span>
                <span>{advisor.morale}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getMoraleColor(advisor.morale)}`}
                  style={{ width: `${advisor.morale}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-400">Close</p>
                <p className="text-sm font-medium">{(advisor.skill.close * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Gross</p>
                <p className="text-sm font-medium">{(advisor.skill.gross * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">CSI</p>
                <p className="text-sm font-medium">{(advisor.skill.csi * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Speed</p>
                <p className="text-sm font-medium">{(advisor.skill.speed * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
