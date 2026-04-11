import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UnitCategory, Unit } from '@/src/types';
import { ArrowRightLeft, Scale, Ruler, Thermometer, Square, Box } from 'lucide-react';

const UNITS: Record<UnitCategory, Unit[]> = {
  length: [
    { label: 'Meters (m)', value: 'm', ratio: 1 },
    { label: 'Kilometers (km)', value: 'km', ratio: 1000 },
    { label: 'Centimeters (cm)', value: 'cm', ratio: 0.01 },
    { label: 'Millimeters (mm)', value: 'mm', ratio: 0.001 },
    { label: 'Miles (mi)', value: 'mi', ratio: 1609.34 },
    { label: 'Yards (yd)', value: 'yd', ratio: 0.9144 },
    { label: 'Feet (ft)', value: 'ft', ratio: 0.3048 },
    { label: 'Inches (in)', value: 'in', ratio: 0.0254 },
  ],
  weight: [
    { label: 'Kilograms (kg)', value: 'kg', ratio: 1 },
    { label: 'Grams (g)', value: 'g', ratio: 0.001 },
    { label: 'Milligrams (mg)', value: 'mg', ratio: 0.000001 },
    { label: 'Pounds (lb)', value: 'lb', ratio: 0.453592 },
    { label: 'Ounces (oz)', value: 'oz', ratio: 0.0283495 },
  ],
  temperature: [
    { label: 'Celsius (°C)', value: 'c' },
    { label: 'Fahrenheit (°F)', value: 'f' },
    { label: 'Kelvin (K)', value: 'k' },
  ],
  area: [
    { label: 'Square Meters (m²)', value: 'm2', ratio: 1 },
    { label: 'Square Kilometers (km²)', value: 'km2', ratio: 1000000 },
    { label: 'Square Feet (ft²)', value: 'ft2', ratio: 0.092903 },
    { label: 'Acres (ac)', value: 'ac', ratio: 4046.86 },
    { label: 'Hectares (ha)', value: 'ha', ratio: 10000 },
  ],
  volume: [
    { label: 'Liters (L)', value: 'l', ratio: 1 },
    { label: 'Milliliters (mL)', value: 'ml', ratio: 0.001 },
    { label: 'Cubic Meters (m³)', value: 'm3', ratio: 1000 },
    { label: 'Gallons (gal)', value: 'gal', ratio: 3.78541 },
    { label: 'Cups (cup)', value: 'cup', ratio: 0.236588 },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = React.useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = React.useState('');
  const [toUnit, setToUnit] = React.useState('');
  const [inputValue, setInputValue] = React.useState('1');
  const [result, setResult] = React.useState<number | null>(null);

  React.useEffect(() => {
    setFromUnit(UNITS[category][0].value);
    setToUnit(UNITS[category][1].value);
  }, [category]);

  const convert = React.useCallback(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    if (category === 'temperature') {
      let celsius = 0;
      if (fromUnit === 'c') celsius = val;
      else if (fromUnit === 'f') celsius = (val - 32) * 5 / 9;
      else if (fromUnit === 'k') celsius = val - 273.15;

      let final = 0;
      if (toUnit === 'c') final = celsius;
      else if (toUnit === 'f') final = (celsius * 9 / 5) + 32;
      else if (toUnit === 'k') final = celsius + 273.15;
      
      setResult(final);
    } else {
      const fromRatio = UNITS[category].find(u => u.value === fromUnit)?.ratio || 1;
      const toRatio = UNITS[category].find(u => u.value === toUnit)?.ratio || 1;
      setResult((val * fromRatio) / toRatio);
    }
  }, [category, fromUnit, toUnit, inputValue]);

  React.useEffect(() => {
    convert();
  }, [convert]);

  const categories = [
    { id: 'length', label: 'Length', icon: Ruler },
    { id: 'weight', label: 'Weight', icon: Scale },
    { id: 'temperature', label: 'Temp', icon: Thermometer },
    { id: 'area', label: 'Area', icon: Square },
    { id: 'volume', label: 'Volume', icon: Box },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id as UnitCategory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            {categories.find(c => c.id === category)?.label} Converter
          </CardTitle>
          <CardDescription>Convert between different units instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS[category].map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label.split(' (')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex gap-2">
                <div className="flex-1 h-10 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center font-medium">
                  {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '---'}
                </div>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS[category].map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label.split(' (')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {result !== null && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-sm text-muted-foreground mb-1">Result</p>
              <p className="text-2xl font-bold text-primary">
                {inputValue} {UNITS[category].find(u => u.value === fromUnit)?.label.split(' (')[1]?.replace(')', '') || fromUnit} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {UNITS[category].find(u => u.value === toUnit)?.label.split(' (')[1]?.replace(')', '') || toUnit}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
