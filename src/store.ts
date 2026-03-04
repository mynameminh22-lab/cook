import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { CircuitState, Component, ComponentType, Node, Point, EvaluationResult, LevelProgress } from './types';
import { solveCircuit } from './engine/solver'; // Import the solver
import { distToSegment } from './lib/utils';
import { analyzeCircuit } from './utils/circuitAnalyzer';

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

  const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
  const solved = solveCircuit(state);
  return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
};

export const useCircuitStore = create<CircuitStore>((set, get) => ({
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
             0, 
      nodes: [],
      current: 0,
      voltageDrop: 0,
      text: type === 'text' ? 'Label' : undefined,
      rating: type === 'fuse' ? 0.5 : undefined, // 0.5A fuse
      color: type === 'led' ? '#ff0000' : undefined, // Red LED
      isOpen: type === 'switch' || type === 'push_button' || type === 'spdt_switch' ? true : undefined, // Default open (off)
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
      } else if (type === 'opamp') {
         n1Pos = { x: finalPosition.x + 15, y: finalPosition.y - 30 }; // Inverting
         n2Pos = { x: finalPosition.x - 15, y: finalPosition.y - 30 }; // Non-inverting
         n3Pos = { x: finalPosition.x, y: finalPosition.y + 30 }; // Output
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

    if (type === 'spdt_switch' || type === 'npn_transistor' || type === 'pnp_transistor' || type === 'opamp') {
      const node3: Node = {
        id: node3Id,
        position: n3Pos,
        connections: [id],
        voltage: 0,
      };
      newNodes.push(node3);
      newComponent.nodes.push(node3Id);
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
      const newTime = state.time + dt;
      const solved = solveCircuit(state, dt, newTime);
      return {
        ...state,
        time: newTime,
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
    set((state) => ({
      ...state,
      ...circuitState,
      selectedId: null,
      // Ensure simulation keeps running or stops based on preference, 
      // but usually we want to keep the loaded state's simulation setting or default to true
      simulationRunning: true, 
    }));
  },

  autoArrange: () => {
    get().saveCheckpoint();
    set((state) => {
      const components = state.components.map(c => ({ ...c }));
      const nodes = state.nodes.map(n => ({ ...n }));
      
      // Force Directed Layout Parameters
      const iterations = 100;
      const center = { x: 400, y: 300 };
      const repulsion = 500000;
      const attraction = 0.05;
      const damping = 0.9;
      
      // Map component ID to velocity
      const velocities: Record<string, { x: number, y: number }> = {};
      components.forEach(c => velocities[c.id] = { x: 0, y: 0 });

      for (let iter = 0; iter < iterations; iter++) {
        // 1. Repulsion (Component-Component)
        for (let i = 0; i < components.length; i++) {
            for (let j = i + 1; j < components.length; j++) {
                const c1 = components[i];
                const c2 = components[j];
                const dx = c1.position.x - c2.position.x;
                const dy = c1.position.y - c2.position.y;
                const distSq = dx*dx + dy*dy;
                const dist = Math.sqrt(distSq) || 0.1;
                
                const force = repulsion / distSq;
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
                        
                        const force = dist * attraction;
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
            velocities[c.id].x -= dx * 0.01;
            velocities[c.id].y -= dy * 0.01;
        });

        // 4. Update Positions
        components.forEach(c => {
            const v = velocities[c.id];
            const maxV = 50;
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
          } else if (c.type === 'opamp') {
             n1Pos = { x: c.position.x - 30, y: c.position.y - 15 };
             n2Pos = { x: c.position.x - 30, y: c.position.y + 15 };
             n3Pos = { x: c.position.x + 30, y: c.position.y };
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

  setScale: (scale) => set({ scale }),
  setOffset: (offset) => set({ offset }),
}));
