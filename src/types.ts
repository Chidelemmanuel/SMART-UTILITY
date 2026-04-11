export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume';

export interface Unit {
  label: string;
  value: string;
  ratio?: number; // Ratio to base unit
  offset?: number; // For temperature
}

export interface UnitData {
  [key: string]: Unit[];
}
