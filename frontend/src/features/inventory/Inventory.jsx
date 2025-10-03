import { useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, ShoppingCart } from 'lucide-react';

export function Inventory() {
  const { state, acquireInventory } = useGameStore();
  const [qty, setQty] = useState(10);
  const [acquiring, setAcquiring] = useState(false);

  if (!state) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const handleAcquire = async (pack) => {
    setAcquiring(true);
    try {
      await acquireInventory(pack, qty);
    } catch (error) {
      console.error('Failed to acquire inventory:', error);
    } finally {
      setAcquiring(false);
    }
  };

  const inStock = state.inventory.filter((v) => v.status === 'inStock');
  const pending = state.inventory.filter((v) => v.status === 'pending');
  const sold = state.inventory.filter((v) => v.status === 'sold');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Inventory Management</h2>
          <p className="text-slate-400">
            {inStock.length} in stock • {pending.length} pending • {sold.length} sold
          </p>
        </div>
      </div>

      {/* Acquire Inventory */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Acquire Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Quantity</label>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                min={1}
                max={50}
                className="w-24 bg-slate-800 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleAcquire('desirable')}
                disabled={acquiring}
                className="border-green-600 text-green-400 hover:bg-green-600/10"
              >
                Desirable Pack
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAcquire('neutral')}
                disabled={acquiring}
                className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
              >
                Neutral Pack
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAcquire('undesirable')}
                disabled={acquiring}
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
              >
                Undesirable Pack
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {inStock.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {inStock.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No vehicles in stock</p>
        </div>
      )}
    </div>
  );
}

function VehicleCard({ vehicle }) {
  const getDesirabilityColor = (desirability) => {
    if (desirability >= 70) return 'text-green-400 border-green-400';
    if (desirability >= 50) return 'text-blue-400 border-blue-400';
    return 'text-yellow-400 border-yellow-400';
  };

  const getAgeColor = (age) => {
    if (age >= 90) return 'text-red-400 border-red-400';
    if (age >= 60) return 'text-orange-400 border-orange-400';
    return 'text-slate-400 border-slate-600';
  };

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{vehicle.year} {vehicle.make}</p>
              <p className="text-sm text-slate-400">{vehicle.model}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {vehicle.stockNumber}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${getDesirabilityColor(vehicle.desirability)}`}>
              {vehicle.desirability} desirability
            </Badge>
            <Badge variant="outline" className={`text-xs ${getAgeColor(vehicle.ageDays)}`}>
              {vehicle.ageDays}d
            </Badge>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Cost:</span>
              <span className="font-medium">${vehicle.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Asking:</span>
              <span className="font-medium text-green-400">${vehicle.asking.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
