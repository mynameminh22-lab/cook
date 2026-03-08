export type ComponentType = 'resistor' | 'battery' | 'lamp' | 'wire' | 'ground' | 'switch' | 'push_button' | 'spdt_switch' | 'voltmeter' | 'ammeter' | 'multimeter' | 'wattmeter' | 'potentiometer' | 'fuse' | 'led' | 'text' | 'capacitor' | 'inductor' | 'diode' | 'ac_source' | 'npn_transistor' | 'pnp_transistor' | 'opamp' | 'and_gate' | 'or_gate' | 'not_gate' | 'nand_gate' | 'nor_gate' | 'xor_gate' | 'seven_segment' | 'clock' | 'solar_panel' | 'wind_turbine' | 'thermoelectric_generator' | 'motor';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy';

export interface EnvironmentState {
  timeOfDay: number; // 0 to 24 hours
  weather: WeatherType;
  temperature: number; // Celsius
  windSpeed: number; // m/s
  isSimulationEnabled: boolean;
  timeSpeed: number; // Multiplier
}

export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  position: Point;
  connections: string[]; // IDs of connected components
  voltage: number; // Calculated voltage
}

export interface Component {
  id: string;
  type: ComponentType;
  position: Point;
  rotation: number; // 0, 90, 180, 270
  value: number; // Resistance (Ohm), Voltage (V), etc.
  nodes: string[]; // IDs of nodes attached to this component
  current: number; // Calculated current
  voltageDrop: number; // Calculated voltage drop
  temperature?: number; // Calculated temperature in Celsius
  isBroken?: boolean; // e.g., burnt out lamp or blown fuse
  isOpen?: boolean; // For switches: true = open (off), false = closed (on)
  text?: string; // For text components
  color?: string; // For LED color or wire color
  rating?: number; // For fuse current rating
  mode?: 'voltage' | 'current' | 'resistance'; // For multimeter
  maxPower?: number; // Maximum power dissipation (W)
  maxVoltage?: number; // Maximum voltage rating (V)
  maxCurrent?: number; // Maximum current rating (A)
  price?: number; // Cost in VND
  charge?: number; // Current charge in mAh
  capacity?: number; // Max capacity in mAh
  internalResistance?: number; // Internal resistance in Ohms
  isRechargeable?: boolean; // Can be recharged
}

export interface EvaluationResult {
  score: number;
  safetyIssues: string[];
  connectionIssues: string[];
  performanceIssues: string[];
  efficiency: number; // Percentage or value
  totalPower: number;
  totalCost: number; // Total cost in VND
}

export interface LevelProgress {
  score: number;
  stars: number; // 1-3
  completed: boolean;
}

export interface CircuitExampleInfo {
  name: string;
  description?: string;
  principle?: string;
  application?: string;
}

export interface CircuitState {
  components: Component[];
  nodes: Node[];
  wires: { from: string; to: string; current?: number }[]; // Simplified wire representation (node ID to node ID)
  simulationRunning: boolean;
  time: number;
  scale: number;
  offset: Point;
  shortCircuitWarning?: boolean;
  evaluationResult: EvaluationResult | null;
  levelProgress: Record<number, LevelProgress>; // Level ID -> Progress
  currentExample: CircuitExampleInfo | null;
  environment: EnvironmentState;
  isMinigameMode?: boolean;
}
