import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function ControlPanel() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await api.getConfig();
      setConfig(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load config:', error);
      setLoading(false);
    }
  };

  const loadPreset = async (preset) => {
    try {
      const data = await api.loadPreset(preset);
      setConfig(data);
    } catch (error) {
      console.error('Failed to load preset:', error);
    }
  };

  if (loading || !config) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const { coefficients, health, presets } = config;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Control Panel</h2>
          <p className="text-slate-400">Adjust game coefficients and balancing</p>
        </div>
        
        <div className="flex gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => loadPreset(preset)}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      {/* Health Check */}
      {health && (
        <Card className={`border-2 ${health.healthy ? 'border-green-600' : 'border-yellow-600'} bg-slate-900`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {health.healthy ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-semibold mb-2">
                  {health.healthy ? 'Configuration Healthy' : 'Configuration Warnings'}
                </h3>
                {health.warnings.length > 0 && (
                  <ul className="space-y-1">
                    {health.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-slate-300">{warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coefficient Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoeffCard title="Lead Generation" coeffs={coefficients.lead} />
        <CoeffCard title="Sales" coeffs={coefficients.sales} />
        <CoeffCard title="Pricing" coeffs={coefficients.pricing} />
        <CoeffCard title="Inventory" coeffs={coefficients.inventory} />
        <CoeffCard title="Economy" coeffs={coefficients.economy} />
        <CoeffCard title="Service" coeffs={coefficients.service} />
        <CoeffCard title="Finance" coeffs={coefficients.finance} />
        <CoeffCard title="Morale" coeffs={coefficients.morale} />
      </div>
    </div>
  );
}

function CoeffCard({ title, coeffs }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(coeffs).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">{key}</label>
                <Badge variant="outline" className="text-xs">
                  {typeof value === 'number' ? value.toFixed(3) : value}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
