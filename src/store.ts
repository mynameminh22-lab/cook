import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CircuitState, Component, ComponentType, Node, Point, EvaluationResult, LevelProgress, EnvironmentState } from './types';
import { solveCircuit } from './engine/solver'; // Import the solver
import { distToSegment } from './lib/utils';
import { analyzeCircuit } from './utils/circuitAnalyzer';

const INITIAL_ENVIRONMENT: EnvironmentState = {
  timeOfDay: 12, // Noon
  weather: 'sunny',
  temperature: 25,
  windSpeed: 5,
  isSimulationEnabled: false,
  timeSpeed: 1,
};

// ... (Interface remains same)

interface HistoryState {
  components: Component[];
  nodes: Node[];
  wires: { from: string; to: string; current?: number }[];
}

interface CircuitStore extends CircuitState {
  selectedId: string | null;
  selectedWireIndex: number | null;
  wireMode: 'orthogonal' | 'straight' | 'curved';
  snapToGrid: boolean;
  setSelectedId: (id: string | null) => void;
  setSelectedWireIndex: (index: number | null) => void;
  setWireMode: (mode: 'orthogonal' | 'straight' | 'curved') => void;
  setSnapToGrid: (snap: boolean) => void;
  past: HistoryState[];
  future: HistoryState[];
  undo: () => void;
  redo: () => void;
  saveCheckpoint: () => void;
  addComponent: (type: ComponentType, position: Point) => void;
  removeComponent: (id: string) => void;
  removeWire: (index: number) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  moveComponent: (id: string, position: Point) => void;
  rotateComponent: (id: string) => void;
  toggleSwitch: (id: string) => void;
  connectNodes: (nodeId1: string, nodeId2: string) => void;
  toggleSimulation: () => void;
  stepSimulation: (dt: number) => void;
  resetCircuit: () => void;
  loadCircuit: (state: CircuitState) => void;
  autoArrange: () => void;
  autoOptimize: () => void;
  currentLevelId: number | null;
  setCurrentLevelId: (id: number | null) => void;
  completeLevel: (id: number, score: number, stars: number) => void;
  setScale: (scale: number) => void;
  setOffset: (offset: Point) => void;
  showOscilloscope: boolean;
  setShowOscilloscope: (show: boolean) => void;
  shortCircuitWarning: boolean;
  setShortCircuitWarning: (warning: boolean) => void;
  evaluationResult: EvaluationResult | null;
  evaluateCircuit: () => void;
  levelProgress: Record<number, LevelProgress>;
  showUI: boolean;
  setShowUI: (show: boolean) => void;
  showEnvironment: boolean;
  setShowEnvironment: (show: boolean) => void;
  controlMode: 'mouse' | 'touch';
  setControlMode: (mode: 'mouse' | 'touch') => void;
  laserMode: boolean;
  setLaserMode: (active: boolean) => void;
  setEnvironment: (env: Partial<EnvironmentState>) => void;
  hasCompletedTutorial: boolean;
  setHasCompletedTutorial: (completed: boolean) => void;
}

const INITIAL_STATE: CircuitState = {
  components: [],
  nodes: [],
  wires: [],
  simulationRunning: true, // Start running by default
  time: 0,
  scale: 1,
  offset: { x: 0, y: 0 },
  shortCircuitWarning: false,
  evaluationResult: null,
  levelProgress: {},
  currentExample: null,
  environment: INITIAL_ENVIRONMENT,
};

// Helper to create initial circuit
const createInitialCircuit = (): CircuitState => {
  const batteryId = uuidv4();
  const resistorId = uuidv4();
  const lampId = uuidv4();
  
  const batPos = { x: 100, y: 300 };
  const resPos = { x: 300, y: 100 };
  const lampPos = { x: 500, y: 300 };

  // Nodes
  const n1 = uuidv4(); const n2 = uuidv4(); // Battery
  const n3 = uuidv4(); const n4 = uuidv4(); // Resistor
  const n5 = uuidv4(); const n6 = uuidv4(); // Lamp

  const components: Component[] = [
    { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
    { id: resistorId, type: 'resistor', position: resPos, rotation: 0, value: 100, nodes: [n3, n4], current: 0, voltageDrop: 0 },
    { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n5, n6], current: 0, voltageDrop: 0 },
  ];

  const nodes: Node[] = [
    { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
    { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
    { id: n3, position: { x: resPos.x - 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
    { id: n4, position: { x: resPos.x + 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
    { id: n5, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
    { id: n6, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
  ];

  const wires = [
    { from: n1, to: n3, current: 0 },
    { from: n4, to: n5, current: 0 },
    { from: n6, to: n2, current: 0 },
  ];

  const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, currentExample: null, environment: INITIAL_ENVIRONMENT };
  const solved = solveCircuit(state);
  return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
};

export const useCircuitStore = create<CircuitStore>()(persist((set, get) => ({
  ...createInitialCircuit(),
  selectedId: null,
  selectedWireIndex: null,
  wireMode: 'orthogonal',
  snapToGrid: true,
  showOscilloscope: false,
  setShowOscilloscope: (show) => set({ showOscilloscope: show }),
  shortCircuitWarning: false,
  setShortCircuitWarning: (warning) => set({ shortCircuitWarning: warning }),
  evaluationResult: null,
  showUI: true,
  setShowUI: (show) => set({ showUI: show }),
  showEnvironment: false,
  setShowEnvironment: (show) => set({ showEnvironment: show }),
  controlMode: 'mouse', // Default to mouse, can detect later
  setControlMode: (mode) => set({ controlMode: mode }),
  laserMode: false,
  setLaserMode: (mode) => set({ laserMode: mode }),
  setEnvironment: (env) => set((state) => ({ environment: { ...state.environment, ...env } })),
  hasCompletedTutorial: false,
  setHasCompletedTutorial: (completed) => set({ hasCompletedTutorial: completed }),
  evaluateCircuit: () => {
    const state = get();
    const result = analyzeCircuit(state);
    set({ evaluationResult: result });
  },
  past: [],
  future: [],
  currentLevelId: null,
  setCurrentLevelId: (id) => set({ currentLevelId: id }),
  completeLevel: (id, score, stars) => set((state) => {
    const currentProgress = state.levelProgress[id];
    if (currentProgress && currentProgress.score >= score) return state;
    
    return {
        levelProgress: {
            ...state.levelProgress,
            [id]: {
                score,
                stars,
                completed: true
            }
        }
    };
  }),
  setSelectedId: (id) => set({ selectedId: id, selectedWireIndex: null }),
  setSelectedWireIndex: (index) => set({ selectedWireIndex: index, selectedId: null }),
  setWireMode: (mode) => set({ wireMode: mode }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  saveCheckpoint: () => {
    set((state) => {
      const currentHistory: HistoryState = {
        components: state.components,
        nodes: state.nodes,
        wires: state.wires,
      };
      // Limit history size if needed, e.g., 50
      const newPast = [...state.past, currentHistory].slice(-50);
      return { past: newPast, future: [] };
    });
  },

  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      const currentHistory: HistoryState = {
        components: state.components,
        nodes: state.nodes,
        wires: state.wires,
      };

      return {
        ...state,
        components: previous.components,
        nodes: previous.nodes,
        wires: previous.wires,
        past: newPast,
        future: [currentHistory, ...state.future],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);

      const currentHistory: HistoryState = {
        components: state.components,
        nodes: state.nodes,
        wires: state.wires,
      };

      return {
        ...state,
        components: next.components,
        nodes: next.nodes,
        wires: next.wires,
        past: [...state.past, currentHistory],
        future: newFuture,
      };
    });
  },

  addComponent: (type, position) => {
    get().saveCheckpoint();
    
    // Check for wire intersection
    const state = get();
    const threshold = 20;
    let splitWireIndex = -1;
    let splitOrientation = 'horizontal';
    let snappedPosition = { ...position };

    if (type !== 'text' && type !== 'voltmeter') { // Don't split wires for text or voltmeter
      for (let i = 0; i < state.wires.length; i++) {
        const wire = state.wires[i];
        const n1 = state.nodes.find(n => n.id === wire.from);
        const n2 = state.nodes.find(n => n.id === wire.to);
        if (!n1 || !n2) continue;

        // Determine segments (match Canvas logic)
        let segments = [];
        if (Math.abs(n1.position.x - n2.position.x) > Math.abs(n1.position.y - n2.position.y)) {
          // Horizontal first
          segments.push({ p1: n1.position, p2: { x: n2.position.x, y: n1.position.y }, orientation: 'horizontal' });
          segments.push({ p1: { x: n2.position.x, y: n1.position.y }, p2: n2.position, orientation: 'vertical' });
        } else {
          // Vertical first
          segments.push({ p1: n1.position, p2: { x: n1.position.x, y: n2.position.y }, orientation: 'vertical' });
          segments.push({ p1: { x: n1.position.x, y: n2.position.y }, p2: n2.position, orientation: 'horizontal' });
        }

        for (const seg of segments) {
          const d = distToSegment(position, seg.p1, seg.p2);
          if (d < threshold) {
            // Check segment length (must be > 40 for component to fit)
            const len = Math.sqrt((seg.p1.x - seg.p2.x)**2 + (seg.p1.y - seg.p2.y)**2);
            if (len > 40) {
              splitWireIndex = i;
              splitOrientation = seg.orientation;
              
              // Snap position
              if (seg.orientation === 'horizontal') {
                snappedPosition.y = seg.p1.y;
                // Clamp x to segment bounds
                const minX = Math.min(seg.p1.x, seg.p2.x);
                const maxX = Math.max(seg.p1.x, seg.p2.x);
                snappedPosition.x = Math.max(minX + 20, Math.min(maxX - 20, position.x));
              } else {
                snappedPosition.x = seg.p1.x;
                // Clamp y
                const minY = Math.min(seg.p1.y, seg.p2.y);
                const maxY = Math.max(seg.p1.y, seg.p2.y);
                snappedPosition.y = Math.max(minY + 20, Math.min(maxY - 20, position.y));
              }
              break;
            }
          }
        }
        if (splitWireIndex !== -1) break;
      }
    }

    // Use snapped position if splitting
    const finalPosition = splitWireIndex !== -1 ? snappedPosition : position;
    const rotation = splitWireIndex !== -1 && splitOrientation === 'vertical' ? 90 : 0;

    const id = uuidv4();
    const newComponent: Component = {
      id,
      type,
      position: finalPosition,
      rotation,
      value: type === 'resistor' ? 100 : 
             type === 'battery' ? 9 : 
             type === 'lamp' ? 10 : 
             type === 'potentiometer' ? 1000 : // 1k Pot
             type === 'fuse' ? 0.1 : // Low resistance
             type === 'led' ? 100 : // LED resistance approximation
             type === 'capacitor' ? 0.001 : // 1mF
             type === 'inductor' ? 0.01 : // 10mH
             type === 'diode' ? 0.7 : // 0.7V drop
             type === 'ac_source' ? 220 : // 220V AC
             type === 'clock' ? 1 : // 1Hz Clock
             type === 'solar_panel' ? 12 : // 12V max
             type === 'wind_turbine' ? 24 : // 24V max
             type === 'thermoelectric_generator' ? 5 : // 5V max
             0, 
      nodes: [],
      current: 0,
      voltageDrop: 0,
      text: type === 'text' ? 'Label' : undefined,
      rating: type === 'fuse' ? 0.5 : undefined, // 0.5A fuse
      color: type === 'led' ? '#ff0000' : undefined, // Red LED
      isOpen: type === 'switch' || type === 'push_button' || type === 'spdt_switch' ? true : undefined, // Default open (off)
      
      // New Properties
      price: type === 'resistor' ? 1000 :
             type === 'battery' ? 20000 :
             type === 'lamp' ? 5000 :
             type === 'led' ? 2000 :
             type === 'switch' ? 3000 :
             type === 'wire' ? 500 :
             type === 'fuse' ? 2000 :
             type === 'capacitor' ? 1500 :
             type === 'inductor' ? 2000 :
             (type === 'npn_transistor' || type === 'pnp_transistor') ? 3000 :
             type === 'ac_source' ? 150000 :
             1000,
      
      // Battery Specific
      charge: type === 'battery' ? 500 : undefined, // 500 mAh
      capacity: type === 'battery' ? 500 : undefined,
      maxVoltage: type === 'battery' ? 9 : undefined, // Nominal voltage
      isRechargeable: type === 'battery' ? false : undefined,
    };

    if (type === 'text') {
      // Text components don't have electrical nodes
      set((state) => ({
        ...state,
        components: [...state.components, newComponent],
      }));
      return;
    }

    const node1Id = uuidv4();
    const node2Id = uuidv4();
    const node3Id = uuidv4(); // For SPDT, Transistors, OpAmp

    // Calculate node positions based on rotation
    let n1Pos = { x: finalPosition.x - 30, y: finalPosition.y };
    let n2Pos = { x: finalPosition.x + 30, y: finalPosition.y };
    let n3Pos = { x: finalPosition.x + 30, y: finalPosition.y + 20 }; // Default for SPDT

    if (type === 'ground') {
      n1Pos = { x: finalPosition.x, y: finalPosition.y - 20 };
      // Ground only has 1 node
    } else if (type === 'spdt_switch') {
      n1Pos = { x: finalPosition.x - 30, y: finalPosition.y }; // Common
      n2Pos = { x: finalPosition.x + 30, y: finalPosition.y - 20 }; // NO (Top)
      n3Pos = { x: finalPosition.x + 30, y: finalPosition.y + 20 }; // NC (Bottom)
    } else if (type === 'npn_transistor' || type === 'pnp_transistor') {
      n1Pos = { x: finalPosition.x - 20, y: finalPosition.y }; // Base
      n2Pos = { x: finalPosition.x + 20, y: finalPosition.y - 20 }; // Collector
      n3Pos = { x: finalPosition.x + 20, y: finalPosition.y + 20 }; // Emitter
    } else if (type === 'opamp') {
      n1Pos = { x: finalPosition.x - 30, y: finalPosition.y - 15 }; // Inverting (-)
      n2Pos = { x: finalPosition.x - 30, y: finalPosition.y + 15 }; // Non-inverting (+)
      n3Pos = { x: finalPosition.x + 30, y: finalPosition.y }; // Output
    } else if (['and_gate', 'or_gate', 'nand_gate', 'nor_gate', 'xor_gate'].includes(type)) {
      n1Pos = { x: finalPosition.x - 30, y: finalPosition.y - 15 }; // Input 1
      n2Pos = { x: finalPosition.x - 30, y: finalPosition.y + 15 }; // Input 2
      n3Pos = { x: finalPosition.x + 30, y: finalPosition.y }; // Output
    } else if (type === 'not_gate') {
      n1Pos = { x: finalPosition.x - 30, y: finalPosition.y }; // Input
      n2Pos = { x: finalPosition.x + 30, y: finalPosition.y }; // Output
    }
    
    if (rotation === 90) {
      if (type === 'spdt_switch') {
         n1Pos = { x: finalPosition.x, y: finalPosition.y - 30 };
         n2Pos = { x: finalPosition.x + 20, y: finalPosition.y + 30 };
         n3Pos = { x: finalPosition.x - 20, y: finalPosition.y + 30 };
      } else if (type === 'ground') {
         n1Pos = { x: finalPosition.x - 20, y: finalPosition.y };
      } else if (type === 'npn_transistor' || type === 'pnp_transistor') {
         n1Pos = { x: finalPosition.x, y: finalPosition.y - 20 }; // Base
         n2Pos = { x: finalPosition.x + 20, y: finalPosition.y + 20 }; // Collector
         n3Pos = { x: finalPosition.x - 20, y: finalPosition.y + 20 }; // Emitter
      } else if (type === 'opamp' || ['and_gate', 'or_gate', 'nand_gate', 'nor_gate', 'xor_gate'].includes(type)) {
         n1Pos = { x: finalPosition.x + 15, y: finalPosition.y - 30 }; // Input 1
         n2Pos = { x: finalPosition.x - 15, y: finalPosition.y - 30 }; // Input 2
         n3Pos = { x: finalPosition.x, y: finalPosition.y + 30 }; // Output
      } else if (type === 'not_gate') {
         n1Pos = { x: finalPosition.x, y: finalPosition.y - 30 };
         n2Pos = { x: finalPosition.x, y: finalPosition.y + 30 };
      } else {
         n1Pos = { x: finalPosition.x, y: finalPosition.y - 30 };
         n2Pos = { x: finalPosition.x, y: finalPosition.y + 30 };
      }
    }

    const node1: Node = {
      id: node1Id,
      position: n1Pos,
      connections: [id],
      voltage: 0,
    };
    
    const newNodes = [node1];
    newComponent.nodes = [node1Id];

    if (type !== 'ground') {
        const node2: Node = {
          id: node2Id,
          position: n2Pos,
          connections: [id],
          voltage: 0,
        };
        newNodes.push(node2);
        newComponent.nodes.push(node2Id);
    }

    if (type === 'spdt_switch' || type === 'npn_transistor' || type === 'pnp_transistor' || type === 'opamp' || ['and_gate', 'or_gate', 'nand_gate', 'nor_gate', 'xor_gate'].includes(type)) {
      const node3: Node = {
        id: node3Id,
        position: n3Pos,
        connections: [id],
        voltage: 0,
      };
      newNodes.push(node3);
      newComponent.nodes.push(node3Id);
    }

    if (type === 'seven_segment') {
        // 5 Nodes: A, B, C, D, Common
        // We already added node1 and node2 (A, B)
        // We need to add C, D, Common
        const node3Id = uuidv4();
        const node4Id = uuidv4();
        const node5Id = uuidv4();

        // Recalculate positions for 5 nodes
        // Default (Rotation 0)
        // A: -30, -15
        // B: -30, -5
        // C: -30, 5
        // D: -30, 15
        // Com: 0, 30
        
        // Update node1 (A) and node2 (B) positions first
        newNodes[0].position = { x: finalPosition.x - 30, y: finalPosition.y - 15 };
        newNodes[1].position = { x: finalPosition.x - 30, y: finalPosition.y - 5 };

        const n3Pos = { x: finalPosition.x - 30, y: finalPosition.y + 5 };
        const n4Pos = { x: finalPosition.x - 30, y: finalPosition.y + 15 };
        const n5Pos = { x: finalPosition.x, y: finalPosition.y + 30 };

        const node3: Node = { id: node3Id, position: n3Pos, connections: [id], voltage: 0 };
        const node4: Node = { id: node4Id, position: n4Pos, connections: [id], voltage: 0 };
        const node5: Node = { id: node5Id, position: n5Pos, connections: [id], voltage: 0 };

        newNodes.push(node3, node4, node5);
        newComponent.nodes.push(node3Id, node4Id, node5Id);
    }

    set((state) => {
      let newWires = [...state.wires];
      
      if (splitWireIndex !== -1) {
        const oldWire = state.wires[splitWireIndex];
        // Remove old wire
        newWires = newWires.filter((_, i) => i !== splitWireIndex);
        
        // Determine connection order based on proximity
        const nFrom = state.nodes.find(n => n.id === oldWire.from);
        
        if (nFrom && type !== 'ground') {
            const d1 = (nFrom.position.x - node1.position.x)**2 + (nFrom.position.y - node1.position.y)**2;
            const d2 = (nFrom.position.x - n2Pos.x)**2 + (nFrom.position.y - n2Pos.y)**2;
            
            if (d1 < d2) {
                newWires.push({ from: oldWire.from, to: node1Id });
                newWires.push({ from: node2Id, to: oldWire.to });
            } else {
                newWires.push({ from: oldWire.from, to: node2Id });
                newWires.push({ from: node1Id, to: oldWire.to });
            }
        } else {
            // Fallback
            newWires.push({ from: oldWire.from, to: node1Id });
            newWires.push({ from: node2Id, to: oldWire.to });
        }
      }

      const newState = {
        ...state,
        components: [...state.components, newComponent],
        nodes: [...state.nodes, ...newNodes],
        wires: newWires,
      };
      // Recalculate immediately
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components };
    });
  },

  removeComponent: (id) => {
    get().saveCheckpoint();
    set((state) => {
      const newState = {
        ...state,
        selectedWireIndex: null, // Reset wire selection as indices might change
        components: state.components.filter((c) => c.id !== id),
        nodes: state.nodes.filter((n) => !n.connections.includes(id)),
        wires: state.wires.filter(w => {
           // Remove wires connected to removed nodes
           const removedNodes = state.nodes.filter(n => n.connections.includes(id)).map(n => n.id);
           return !removedNodes.includes(w.from) && !removedNodes.includes(w.to);
        })
      };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components };
    });
  },

  removeWire: (index) => {
    get().saveCheckpoint();
    set((state) => {
      const newWires = state.wires.filter((_, i) => i !== index);
      const newState = { ...state, wires: newWires, selectedWireIndex: null };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    });
  },

  toggleSwitch: (id) => {
    get().saveCheckpoint();
    set((state) => {
      const component = state.components.find(c => c.id === id);
      if (!component || component.type !== 'switch') return state;
      
      const newState = {
        ...state,
        components: state.components.map(c => 
          c.id === id ? { ...c, isOpen: !c.isOpen } : c
        )
      };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    });
  },

  updateComponent: (id, updates) => {
    get().saveCheckpoint();
    set((state) => {
      const newState = {
        ...state,
        components: state.components.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components };
    });
  },

  moveComponent: (id, position) => {
    set((state) => {
      const component = state.components.find((c) => c.id === id);
      if (!component) return state;

      const dx = position.x - component.position.x;
      const dy = position.y - component.position.y;

      const newNodes = state.nodes.map((n) => {
        if (component.nodes.includes(n.id)) {
          return { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } };
        }
        return n;
      });

      return {
        ...state,
        components: state.components.map((c) =>
          c.id === id ? { ...c, position } : c
        ),
        nodes: newNodes,
      };
    });
  },

  rotateComponent: (id) => {
    get().saveCheckpoint();
    set((state) => {
      const component = state.components.find((c) => c.id === id);
      if (!component) return state;

      const newRotation = (component.rotation + 90) % 360;
      const { x: cx, y: cy } = component.position;

      // Rotate nodes around component center
      const newNodes = state.nodes.map((n) => {
        if (component.nodes.includes(n.id)) {
          const rx = n.position.x - cx;
          const ry = n.position.y - cy;
          // Rotate 90 degrees clockwise: (x, y) -> (-y, x)
          // Wait, screen coordinates: y increases downwards.
          // 90 deg clockwise: (1, 0) -> (0, 1). x -> y, y -> -x?
          // Let's check: (10, 0) -> (0, 10).
          // (0, 10) -> (-10, 0).
          // (-10, 0) -> (0, -10).
          // (0, -10) -> (10, 0).
          // So (x, y) -> (-y, x) is correct for standard Cartesian.
          // For screen (y down):
          // (10, 0) -> (0, 10) [Right -> Down] Correct.
          // (0, 10) -> (-10, 0) [Down -> Left] Correct.
          // So: newX = -ry, newY = rx.
          return {
            ...n,
            position: { x: cx - ry, y: cy + rx }
          };
        }
        return n;
      });

      const newState = {
        ...state,
        components: state.components.map((c) =>
          c.id === id ? { ...c, rotation: newRotation } : c
        ),
        nodes: newNodes,
      };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    });
  },

  connectNodes: (nodeId1, nodeId2) => {
    // Prevent self-connection
    if (nodeId1 === nodeId2) return;

    // Prevent duplicate wires
    const exists = get().wires.some(
      w => (w.from === nodeId1 && w.to === nodeId2) || (w.from === nodeId2 && w.to === nodeId1)
    );
    if (exists) return;

    get().saveCheckpoint();
    set((state) => {
      const newState = {
        ...state,
        wires: [...state.wires, { from: nodeId1, to: nodeId2 }],
      };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    });
  },

  toggleSimulation: () => {
    set((state) => ({ simulationRunning: !state.simulationRunning }));
  },

  stepSimulation: (dt) => {
    set((state) => {
      if (!state.simulationRunning) return state;
      
      let newEnv = { ...state.environment };
      if (state.environment.isSimulationEnabled) {
        // timeSpeed is multiplier. Let's say 1 unit = 1 hour per 10 real seconds.
        // dt is usually ~0.016s.
        // timeIncrement = dt * timeSpeed * (1 hour / 10s) = dt * timeSpeed * 0.1
        const timeIncrement = dt * state.environment.timeSpeed * 0.1;
        let newTime = state.environment.timeOfDay + timeIncrement;
        if (newTime >= 24) newTime -= 24;
        
        // Randomly fluctuate wind speed slightly
        let newWind = state.environment.windSpeed + (Math.random() - 0.5) * 0.1;
        newWind = Math.max(0, Math.min(30, newWind)); // clamp 0-30 m/s
        
        newEnv = { ...newEnv, timeOfDay: newTime, windSpeed: newWind };
      }

      const newTime = state.time + dt;

      // Update Battery Charge
      const newComponents = state.components.map(c => {
        if (c.type === 'battery' && c.charge !== undefined && c.capacity !== undefined) {
          // Calculate discharge/charge
          // dt is in seconds. Current is in Amps.
          // Charge is in mAh.
          // 1 Ah = 3600 Coulombs.
          // dQ (mAh) = I (A) * dt (s) * (1000 / 3600)
          
          const current = c.current || 0;
          // Assuming current > 0 means discharging for a source.
          // If we want charging, we need to know if current is flowing INTO the positive terminal.
          // The solver usually returns current magnitude or direction relative to nodes.
          // For simplicity, let's assume any current drains the battery unless it's explicitly a rechargeable battery connected to a higher voltage source.
          // But wait, if we have two batteries in parallel, they might circulate current.
          // Let's stick to simple depletion for now: any current drains it.
          // Realism: If V_terminal > V_emf, it charges. But we don't have V_terminal easily here without checking nodes.
          
          const dischargeAmount = (Math.abs(current) * dt * 1000) / 3600;
          let newCharge = c.charge - dischargeAmount;
          
          if (newCharge < 0) newCharge = 0;
          
          // Update voltage based on charge
          // If empty, voltage is 0.
          // If not empty, voltage is nominal (maxVoltage).
          // We could add a discharge curve here.
          let newValue = c.value;
          const nominalVoltage = c.maxVoltage || 9; // Default to 9V if not set
          
          if (newCharge <= 0) {
            newValue = 0;
          } else {
            // Simple linear drop for last 10%? Or just constant?
            // Let's keep it constant until 0 for simplicity, or maybe drop slightly.
            // Let's do: V = V_nom * (0.8 + 0.2 * (charge/capacity)) to simulate some drop?
            // No, user wants "completely realistic". Real batteries drop voltage.
            // Li-ion: 4.2 -> 3.0. Alkaline: 1.5 -> 0.9.
            // Let's use a simple linear model from 100% to 0% charge mapping to 100% to 80% voltage, then drop to 0.
            // Actually, if it hits 0 charge, it's 0V.
            newValue = nominalVoltage; 
          }
          
          return { ...c, charge: newCharge, value: newValue };
        }
        return c;
      });

      const solved = solveCircuit({ ...state, components: newComponents, environment: newEnv }, dt, newTime);
      return {
        ...state,
        time: newTime,
        environment: newEnv,
        nodes: solved.nodes,
        components: solved.components,
        wires: solved.wires,
        shortCircuitWarning: !!solved.hasShortCircuit
      };
    });
  },

  resetCircuit: () => {
    set(INITIAL_STATE);
  },

  loadCircuit: (circuitState) => {
    get().saveCheckpoint();
    
    // Migrate components to include new properties if missing
    const migratedComponents = circuitState.components.map(c => ({
      ...c,
      price: c.price ?? (
             c.type === 'resistor' ? 1000 :
             c.type === 'battery' ? 20000 :
             c.type === 'lamp' ? 5000 :
             c.type === 'led' ? 2000 :
             c.type === 'switch' ? 3000 :
             c.type === 'wire' ? 500 :
             c.type === 'fuse' ? 2000 :
             c.type === 'capacitor' ? 1500 :
             c.type === 'inductor' ? 2000 :
             (c.type === 'npn_transistor' || c.type === 'pnp_transistor') ? 3000 :
             c.type === 'ac_source' ? 150000 :
             1000),
      charge: c.charge ?? (c.type === 'battery' ? 500 : undefined),
      capacity: c.capacity ?? (c.type === 'battery' ? 500 : undefined),
      maxVoltage: c.maxVoltage ?? (c.type === 'battery' ? 9 : undefined),
      isRechargeable: c.isRechargeable ?? (c.type === 'battery' ? false : undefined),
    }));

    set((state) => ({
      ...state,
      ...circuitState,
      components: migratedComponents,
      selectedId: null,
      // Ensure simulation keeps running or stops based on preference, 
      // but usually we want to keep the loaded state's simulation setting or default to true
      simulationRunning: true, 
      currentExample: circuitState.currentExample || null,
    }));
  },

  autoArrange: () => {
    if (get().currentLevelId !== null) return;
    get().saveCheckpoint();
    set((state) => {
      const components = state.components.map(c => ({ ...c }));
      const nodes = state.nodes.map(n => ({ ...n }));
      
      // Force Directed Layout Parameters
      const iterations = 150; // Increased iterations
      const center = { x: 400, y: 300 };
      const repulsion = 600000; // Increased repulsion
      const attraction = 0.08; // Increased attraction
      const damping = 0.85;
      
      // Map component ID to velocity
      const velocities: Record<string, { x: number, y: number }> = {};
      components.forEach(c => velocities[c.id] = { x: 0, y: 0 });

      for (let iter = 0; iter < iterations; iter++) {
        // Temperature cooling
        const temp = 1 - (iter / iterations);

        // 1. Repulsion (Component-Component)
        for (let i = 0; i < components.length; i++) {
            for (let j = i + 1; j < components.length; j++) {
                const c1 = components[i];
                const c2 = components[j];
                const dx = c1.position.x - c2.position.x;
                const dy = c1.position.y - c2.position.y;
                const distSq = dx*dx + dy*dy;
                const dist = Math.sqrt(distSq) || 0.1;
                
                const force = (repulsion / distSq) * temp;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                
                velocities[c1.id].x += fx;
                velocities[c1.id].y += fy;
                velocities[c2.id].x -= fx;
                velocities[c2.id].y -= fy;
            }
        }

        // 2. Attraction (Wires)
        state.wires.forEach(wire => {
            const n1 = nodes.find(n => n.id === wire.from);
            const n2 = nodes.find(n => n.id === wire.to);
            if (n1 && n2) {
                const c1Id = n1.connections[0];
                const c2Id = n2.connections[0];
                
                if (c1Id && c2Id && c1Id !== c2Id) {
                    const c1 = components.find(c => c.id === c1Id);
                    const c2 = components.find(c => c.id === c2Id);
                    
                    if (c1 && c2) {
                        const dx = c1.position.x - c2.position.x;
                        const dy = c1.position.y - c2.position.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        
                        const force = dist * attraction * temp;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;
                        
                        velocities[c1.id].x -= fx;
                        velocities[c1.id].y -= fy;
                        velocities[c2.id].x += fx;
                        velocities[c2.id].y += fy;
                    }
                }
            }
        });

        // 3. Center Gravity
        components.forEach(c => {
            const dx = c.position.x - center.x;
            const dy = c.position.y - center.y;
            velocities[c.id].x -= dx * 0.02 * temp;
            velocities[c.id].y -= dy * 0.02 * temp;
        });

        // 4. Update Positions
        components.forEach(c => {
            const v = velocities[c.id];
            const maxV = 50 * temp;
            const vMag = Math.sqrt(v.x*v.x + v.y*v.y);
            if (vMag > maxV) {
                v.x = (v.x / vMag) * maxV;
                v.y = (v.y / vMag) * maxV;
            }
            
            c.position.x += v.x;
            c.position.y += v.y;
            
            v.x *= damping;
            v.y *= damping;
        });
      }

      // Snap to grid and update nodes
      components.forEach(c => {
          c.position.x = Math.round(c.position.x / 20) * 20;
          c.position.y = Math.round(c.position.y / 20) * 20;
          c.rotation = 0; // Reset rotation for simplicity
          
          let n1Pos = { x: c.position.x - 30, y: c.position.y };
          let n2Pos = { x: c.position.x + 30, y: c.position.y };
          let n3Pos = { x: c.position.x + 30, y: c.position.y + 20 };

          if (c.type === 'ground') {
             n1Pos = { x: c.position.x, y: c.position.y - 20 };
          } else if (c.type === 'spdt_switch') {
             n1Pos = { x: c.position.x - 30, y: c.position.y };
             n2Pos = { x: c.position.x + 30, y: c.position.y - 20 };
             n3Pos = { x: c.position.x + 30, y: c.position.y + 20 };
          } else if (c.type === 'npn_transistor' || c.type === 'pnp_transistor') {
             n1Pos = { x: c.position.x - 20, y: c.position.y };
             n2Pos = { x: c.position.x + 20, y: c.position.y - 20 };
             n3Pos = { x: c.position.x + 20, y: c.position.y + 20 };
          } else if (c.type === 'opamp' || ['and_gate', 'or_gate', 'nand_gate', 'nor_gate', 'xor_gate'].includes(c.type)) {
             n1Pos = { x: c.position.x - 30, y: c.position.y - 15 };
             n2Pos = { x: c.position.x - 30, y: c.position.y + 15 };
             n3Pos = { x: c.position.x + 30, y: c.position.y };
          } else if (c.type === 'not_gate') {
             n1Pos = { x: c.position.x - 30, y: c.position.y };
             n2Pos = { x: c.position.x + 30, y: c.position.y };
          }

          const n1 = nodes.find(n => n.id === c.nodes[0]);
          if (n1) n1.position = n1Pos;
          
          if (c.nodes[1]) {
              const n2 = nodes.find(n => n.id === c.nodes[1]);
              if (n2) n2.position = n2Pos;
          }
          
          if (c.nodes[2]) {
              const n3 = nodes.find(n => n.id === c.nodes[2]);
              if (n3) n3.position = n3Pos;
          }
      });

      const newState = { ...state, components, nodes };
      const solved = solveCircuit(newState);
      return { ...newState, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    });
  },

  autoOptimize: () => {
    if (get().currentLevelId !== null) return;
    get().saveCheckpoint();
    set((state) => {
        const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
        const getNearestE12 = (val: number) => {
            if (val <= 0) return val;
            const exponent = Math.floor(Math.log10(val));
            const mantissa = val / Math.pow(10, exponent);
            let best = E12[0];
            let minDiff = Math.abs(mantissa - best);
            for (const e of E12) {
                const diff = Math.abs(mantissa - e);
                if (diff < minDiff) {
                    minDiff = diff;
                    best = e;
                }
            }
            return best * Math.pow(10, exponent);
        };

        const STD_VOLTAGES = [1.5, 3, 3.3, 5, 6, 9, 12, 24, 48, 110, 220];
        const getNearestVoltage = (val: number) => {
            if (val <= 0) return val;
            return STD_VOLTAGES.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
        };

        const newComponents = state.components.map(c => {
            let newValue = c.value;
            if (['resistor', 'capacitor', 'inductor', 'potentiometer'].includes(c.type)) {
                newValue = getNearestE12(c.value);
            } else if (['battery', 'ac_source', 'solar_panel', 'wind_turbine'].includes(c.type)) {
                newValue = getNearestVoltage(c.value);
            }
            return { ...c, value: newValue };
        });

        const newState = { ...state, components: newComponents };
        const solved = solveCircuit(newState);
        return { ...newState, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    });
  },

  setScale: (scale) => set({ scale }),
  setOffset: (offset) => set({ offset }),
}), {
  name: 'circuit-storage',
  partialize: (state) => ({
    hasCompletedTutorial: state.hasCompletedTutorial,
    levelProgress: state.levelProgress,
    environment: state.environment,
    snapToGrid: state.snapToGrid,
    wireMode: state.wireMode,
    showOscilloscope: state.showOscilloscope,
  }),
}));
