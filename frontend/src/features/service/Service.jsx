import { useGameStore } from '../../state/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, AlertTriangle } from 'lucide-react';

export function Service() {
  const { state } = useGameStore();

  if (!state) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const { techs, recentROs } = state;
  const activeTechs = techs.filter((t) => t.active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Service Department</h2>
        <p className="text-slate-400">{activeTechs.length} technicians active</p>
      </div>

      {/* Technicians */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Technicians
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTechs.map((tech) => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>

      {/* Recent ROs */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Repair Orders</h3>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {recentROs.slice(0, 10).map((ro) => (
                <div key={ro.id} className="flex items-center justify-between p-3 rounded bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    {ro.comeback && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <p className="font-medium">{ro.laborHours}h labor</p>
                      <p className="text-xs text-slate-400">{ro.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-400">${ro.partsRevenue.toLocaleString()}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${ro.comeback ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'}`}
                    >
                      {ro.comeback ? 'Comeback' : 'Complete'}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentROs.length === 0 && (
                <p className="text-slate-400 text-center py-8">No recent ROs</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TechCard({ tech }) {
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
              <p className="font-semibold">{tech.name}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {tech.archetype}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Morale</span>
                <span>{tech.morale}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getMoraleColor(tech.morale)}`}
                  style={{ width: `${tech.morale}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-400">Efficiency</p>
                <p className="text-sm font-medium">{tech.efficiency.toFixed(2)}x</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Comeback Rate</p>
                <p className="text-sm font-medium">{(tech.comebackRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
