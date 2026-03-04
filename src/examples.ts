import { v4 as uuidv4 } from 'uuid';
import { CircuitState, Component, Node } from './types';
import { solveCircuit } from './engine/solver';

export const BASIC_EXAMPLES: { name: string; create: () => CircuitState }[] = [
  {
    name: 'Mạch nối tiếp cơ bản',
    create: () => {
      const batteryId = uuidv4();
      const resistorId = uuidv4();
      const lampId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const resPos = { x: 300, y: 100 };
      const lampPos = { x: 500, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();

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
    }
  },
  {
    name: 'Mạch song song (2 Đèn)',
    create: () => {
      const batteryId = uuidv4();
      const lamp1Id = uuidv4();
      const lamp2Id = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const lamp1Pos = { x: 400, y: 200 };
      const lamp2Pos = { x: 400, y: 400 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: lamp1Id, type: 'lamp', position: lamp1Pos, rotation: 90, value: 10, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: lamp2Id, type: 'lamp', position: lamp2Pos, rotation: 90, value: 10, nodes: [n5, n6], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: lamp1Pos.x, y: lamp1Pos.y - 30 }, connections: [lamp1Id], voltage: 0 },
        { id: n4, position: { x: lamp1Pos.x, y: lamp1Pos.y + 30 }, connections: [lamp1Id], voltage: 0 },
        { id: n5, position: { x: lamp2Pos.x, y: lamp2Pos.y - 30 }, connections: [lamp2Id], voltage: 0 },
        { id: n6, position: { x: lamp2Pos.x, y: lamp2Pos.y + 30 }, connections: [lamp2Id], voltage: 0 },
      ];

      const wires = [
        // Top rail
        { from: n1, to: n3, current: 0 },
        { from: n3, to: n5, current: 0 },
        // Bottom rail
        { from: n4, to: n6, current: 0 },
        { from: n6, to: n2, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch đèn LED',
    create: () => {
      const batteryId = uuidv4();
      const resistorId = uuidv4();
      const ledId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const resPos = { x: 300, y: 300 };
      const ledPos = { x: 500, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 9, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: resistorId, type: 'resistor', position: resPos, rotation: 0, value: 220, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: ledId, type: 'led', position: ledPos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0, color: '#ef4444' },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: resPos.x - 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
        { id: n4, position: { x: resPos.x + 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
        { id: n5, position: { x: ledPos.x - 30, y: ledPos.y }, connections: [ledId], voltage: 0 },
        { id: n6, position: { x: ledPos.x + 30, y: ledPos.y }, connections: [ledId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n2, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch Logic OR (2 Công tắc)',
    create: () => {
      const batteryId = uuidv4();
      const sw1Id = uuidv4();
      const sw2Id = uuidv4();
      const lampId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const sw1Pos = { x: 300, y: 200 };
      const sw2Pos = { x: 300, y: 400 };
      const lampPos = { x: 500, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: sw1Id, type: 'switch', position: sw1Pos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0, isOpen: true },
        { id: sw2Id, type: 'switch', position: sw2Pos, rotation: 0, value: 0, nodes: [n5, n6], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n7, n8], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: sw1Pos.x - 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n4, position: { x: sw1Pos.x + 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n5, position: { x: sw2Pos.x - 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 },
        { id: n6, position: { x: sw2Pos.x + 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 },
        { id: n7, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n8, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
      ];

      const wires = [
        // Battery + to Switches
        { from: n1, to: n3, current: 0 },
        { from: n3, to: n5, current: 0 },
        // Switches to Lamp
        { from: n4, to: n7, current: 0 },
        { from: n6, to: n7, current: 0 },
        // Lamp to Battery -
        { from: n8, to: n2, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch Logic AND (2 Công tắc)',
    create: () => {
      // ... (existing code)
      const batteryId = uuidv4();
      const sw1Id = uuidv4();
      const sw2Id = uuidv4();
      const lampId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const sw1Pos = { x: 250, y: 300 };
      const sw2Pos = { x: 400, y: 300 };
      const lampPos = { x: 550, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: sw1Id, type: 'switch', position: sw1Pos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0, isOpen: true },
        { id: sw2Id, type: 'switch', position: sw2Pos, rotation: 0, value: 0, nodes: [n5, n6], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n7, n8], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: sw1Pos.x - 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n4, position: { x: sw1Pos.x + 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n5, position: { x: sw2Pos.x - 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 },
        { id: n6, position: { x: sw2Pos.x + 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 },
        { id: n7, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n8, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n7, current: 0 },
        { from: n8, to: n2, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Chuông cửa (Nút nhấn)',
    create: () => {
      const batteryId = uuidv4();
      const btnId = uuidv4();
      const lampId = uuidv4(); // Representing bell
      
      const batPos = { x: 100, y: 300 };
      const btnPos = { x: 300, y: 200 };
      const lampPos = { x: 500, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: btnId, type: 'push_button', position: btnPos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n5, n6], current: 0, voltageDrop: 0, text: 'Bell' },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: btnPos.x - 30, y: btnPos.y }, connections: [btnId], voltage: 0 },
        { id: n4, position: { x: btnPos.x + 30, y: btnPos.y }, connections: [btnId], voltage: 0 },
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
    }
  }
];

export const COMPLEX_EXAMPLES: { name: string; create: () => CircuitState }[] = [
  {
    name: 'Bảo vệ quá tải (Cầu chì)',
    create: () => {
      const batteryId = uuidv4();
      const fuseId = uuidv4();
      const swId = uuidv4();
      const lampId = uuidv4();
      const shortSwId = uuidv4(); // Switch to create short circuit
      
      const batPos = { x: 100, y: 300 };
      const fusePos = { x: 250, y: 200 };
      const swPos = { x: 400, y: 200 };
      const lampPos = { x: 550, y: 300 };
      const shortSwPos = { x: 400, y: 400 }; // Parallel short

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();
      const n9 = uuidv4(); const n10 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: fuseId, type: 'fuse', position: fusePos, rotation: 0, value: 0.1, rating: 2, nodes: [n3, n4], current: 0, voltageDrop: 0 }, // 2A Fuse
        { id: swId, type: 'switch', position: swPos, rotation: 0, value: 0, nodes: [n5, n6], current: 0, voltageDrop: 0, isOpen: false }, // Main switch closed
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n7, n8], current: 0, voltageDrop: 0 },
        { id: shortSwId, type: 'switch', position: shortSwPos, rotation: 0, value: 0, nodes: [n9, n10], current: 0, voltageDrop: 0, isOpen: true, text: 'Short Circuit' }, // Short switch open
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: fusePos.x - 30, y: fusePos.y }, connections: [fuseId], voltage: 0 },
        { id: n4, position: { x: fusePos.x + 30, y: fusePos.y }, connections: [fuseId], voltage: 0 },
        { id: n5, position: { x: swPos.x - 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: n6, position: { x: swPos.x + 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: n7, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n8, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n9, position: { x: shortSwPos.x - 30, y: shortSwPos.y }, connections: [shortSwId], voltage: 0 },
        { id: n10, position: { x: shortSwPos.x + 30, y: shortSwPos.y }, connections: [shortSwId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n7, current: 0 },
        { from: n8, to: n2, current: 0 },
        
        // Short circuit path (parallel to lamp)
        { from: n6, to: n9, current: 0 }, // After switch
        { from: n10, to: n2, current: 0 }, // To ground
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Đo kiểm toàn diện (Ammeter & Voltmeter)',
    create: () => {
      const batteryId = uuidv4();
      const ammeterId = uuidv4();
      const resistorId = uuidv4();
      const ledId = uuidv4();
      const voltmeterId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const amPos = { x: 250, y: 200 };
      const resPos = { x: 400, y: 200 };
      const ledPos = { x: 550, y: 300 };
      const vmPos = { x: 400, y: 400 }; // Across resistor

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();
      const n9 = uuidv4(); const n10 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 9, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: ammeterId, type: 'ammeter', position: amPos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: resistorId, type: 'resistor', position: resPos, rotation: 0, value: 330, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: ledId, type: 'led', position: ledPos, rotation: 0, value: 100, nodes: [n7, n8], current: 0, voltageDrop: 0, color: '#22c55e' }, // Green LED
        { id: voltmeterId, type: 'voltmeter', position: vmPos, rotation: 0, value: 0, nodes: [n9, n10], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: amPos.x - 30, y: amPos.y }, connections: [ammeterId], voltage: 0 },
        { id: n4, position: { x: amPos.x + 30, y: amPos.y }, connections: [ammeterId], voltage: 0 },
        { id: n5, position: { x: resPos.x - 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
        { id: n6, position: { x: resPos.x + 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
        { id: n7, position: { x: ledPos.x - 30, y: ledPos.y }, connections: [ledId], voltage: 0 },
        { id: n8, position: { x: ledPos.x + 30, y: ledPos.y }, connections: [ledId], voltage: 0 },
        { id: n9, position: { x: vmPos.x - 30, y: vmPos.y }, connections: [voltmeterId], voltage: 0 },
        { id: n10, position: { x: vmPos.x + 30, y: vmPos.y }, connections: [voltmeterId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n7, current: 0 },
        { from: n8, to: n2, current: 0 },
        // Voltmeter across Resistor
        { from: n5, to: n9, current: 0 },
        { from: n6, to: n10, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Phân áp (Voltage Divider)',
    create: () => {
      const batteryId = uuidv4();
      const r1Id = uuidv4();
      const r2Id = uuidv4();
      const voltmeterId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const r1Pos = { x: 300, y: 200 };
      const r2Pos = { x: 300, y: 400 };
      const vmPos = { x: 500, y: 400 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: r1Id, type: 'resistor', position: r1Pos, rotation: 90, value: 1000, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: r2Id, type: 'resistor', position: r2Pos, rotation: 90, value: 1000, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: voltmeterId, type: 'voltmeter', position: vmPos, rotation: 0, value: 0, nodes: [n7, n8], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: r1Pos.x, y: r1Pos.y - 30 }, connections: [r1Id], voltage: 0 },
        { id: n4, position: { x: r1Pos.x, y: r1Pos.y + 30 }, connections: [r1Id], voltage: 0 },
        { id: n5, position: { x: r2Pos.x, y: r2Pos.y - 30 }, connections: [r2Id], voltage: 0 },
        { id: n6, position: { x: r2Pos.x, y: r2Pos.y + 30 }, connections: [r2Id], voltage: 0 },
        { id: n7, position: { x: vmPos.x - 30, y: vmPos.y }, connections: [voltmeterId], voltage: 0 },
        { id: n8, position: { x: vmPos.x + 30, y: vmPos.y }, connections: [voltmeterId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n2, current: 0 },
        // Voltmeter across R2
        { from: n5, to: n7, current: 0 },
        { from: n6, to: n8, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Điều chỉnh độ sáng (Dimmer)',
    create: () => {
      const batteryId = uuidv4();
      const potId = uuidv4();
      const lampId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const potPos = { x: 300, y: 200 };
      const lampPos = { x: 500, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: potId, type: 'potentiometer', position: potPos, rotation: 0, value: 500, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n5, n6], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: potPos.x - 30, y: potPos.y }, connections: [potId], voltage: 0 },
        { id: n4, position: { x: potPos.x + 30, y: potPos.y }, connections: [potId], voltage: 0 },
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
    }
  },
  {
    name: 'Cầu Wheatstone',
    create: () => {
      const batteryId = uuidv4();
      const r1Id = uuidv4();
      const r2Id = uuidv4();
      const r3Id = uuidv4();
      const rxId = uuidv4(); // Unknown resistor
      const ammeterId = uuidv4(); // Galvanometer
      
      const batPos = { x: 100, y: 300 };
      const r1Pos = { x: 300, y: 200 };
      const r2Pos = { x: 500, y: 200 };
      const r3Pos = { x: 300, y: 400 };
      const rxPos = { x: 500, y: 400 };
      const amPos = { x: 400, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4(); // Bat
      const n3 = uuidv4(); const n4 = uuidv4(); // R1
      const n5 = uuidv4(); const n6 = uuidv4(); // R2
      const n7 = uuidv4(); const n8 = uuidv4(); // R3
      const n9 = uuidv4(); const n10 = uuidv4(); // Rx
      const n11 = uuidv4(); const n12 = uuidv4(); // Ammeter

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: r1Id, type: 'resistor', position: r1Pos, rotation: 0, value: 100, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: r2Id, type: 'resistor', position: r2Pos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: r3Id, type: 'resistor', position: r3Pos, rotation: 0, value: 100, nodes: [n7, n8], current: 0, voltageDrop: 0 },
        { id: rxId, type: 'resistor', position: rxPos, rotation: 0, value: 120, nodes: [n9, n10], current: 0, voltageDrop: 0 }, // Unbalanced
        { id: ammeterId, type: 'ammeter', position: amPos, rotation: 90, value: 0, nodes: [n11, n12], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        
        { id: n3, position: { x: r1Pos.x - 30, y: r1Pos.y }, connections: [r1Id], voltage: 0 },
        { id: n4, position: { x: r1Pos.x + 30, y: r1Pos.y }, connections: [r1Id], voltage: 0 },
        
        { id: n5, position: { x: r2Pos.x - 30, y: r2Pos.y }, connections: [r2Id], voltage: 0 },
        { id: n6, position: { x: r2Pos.x + 30, y: r2Pos.y }, connections: [r2Id], voltage: 0 },
        
        { id: n7, position: { x: r3Pos.x - 30, y: r3Pos.y }, connections: [r3Id], voltage: 0 },
        { id: n8, position: { x: r3Pos.x + 30, y: r3Pos.y }, connections: [r3Id], voltage: 0 },
        
        { id: n9, position: { x: rxPos.x - 30, y: rxPos.y }, connections: [rxId], voltage: 0 },
        { id: n10, position: { x: rxPos.x + 30, y: rxPos.y }, connections: [rxId], voltage: 0 },
        
        { id: n11, position: { x: amPos.x, y: amPos.y - 30 }, connections: [ammeterId], voltage: 0 },
        { id: n12, position: { x: amPos.x, y: amPos.y + 30 }, connections: [ammeterId], voltage: 0 },
      ];

      const wires = [
        // Battery to Bridge Top
        { from: n1, to: n3, current: 0 },
        { from: n3, to: n7, current: 0 },
        
        // Bridge Top (R1-R2)
        { from: n4, to: n11, current: 0 },
        { from: n11, to: n5, current: 0 },
        
        // Bridge Bottom (R3-Rx)
        { from: n8, to: n12, current: 0 },
        { from: n12, to: n9, current: 0 },
        
        // Battery Return
        { from: n6, to: n10, current: 0 },
        { from: n10, to: n2, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Cầu thang (2 công tắc 3 cực)',
    create: () => {
      const batteryId = uuidv4();
      const sw1Id = uuidv4();
      const sw2Id = uuidv4();
      const lampId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const sw1Pos = { x: 300, y: 300 };
      const sw2Pos = { x: 500, y: 300 };
      const lampPos = { x: 700, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4(); const n5 = uuidv4();
      const n6 = uuidv4(); const n7 = uuidv4(); const n8 = uuidv4();
      const n9 = uuidv4(); const n10 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: sw1Id, type: 'spdt_switch', position: sw1Pos, rotation: 0, value: 0, nodes: [n3, n4, n5], current: 0, voltageDrop: 0, isOpen: true },
        { id: sw2Id, type: 'spdt_switch', position: sw2Pos, rotation: 180, value: 0, nodes: [n6, n7, n8], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 10, nodes: [n9, n10], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        
        // SW1
        { id: n3, position: { x: sw1Pos.x - 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n4, position: { x: sw1Pos.x + 30, y: sw1Pos.y - 20 }, connections: [sw1Id], voltage: 0 },
        { id: n5, position: { x: sw1Pos.x + 30, y: sw1Pos.y + 20 }, connections: [sw1Id], voltage: 0 },
        
        // SW2 (Rotated 180)
        { id: n6, position: { x: sw2Pos.x + 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 }, // Common
        { id: n7, position: { x: sw2Pos.x - 30, y: sw2Pos.y + 20 }, connections: [sw2Id], voltage: 0 }, // NO (Rotated)
        { id: n8, position: { x: sw2Pos.x - 30, y: sw2Pos.y - 20 }, connections: [sw2Id], voltage: 0 }, // NC (Rotated)
        
        // Lamp
        { id: n9, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n10, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 }, // Bat+ to SW1 Common
        
        { from: n4, to: n8, current: 0 }, // SW1 NO (Top) to SW2 NC (Top)
        { from: n5, to: n7, current: 0 }, // SW1 NC (Bottom) to SW2 NO (Bottom)
        
        { from: n6, to: n9, current: 0 }, // SW2 Common to Lamp
        { from: n10, to: n2, current: 0 }, // Lamp to Bat-
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch RLC Cơ bản',
    create: () => {
      const sourceId = uuidv4();
      const rId = uuidv4();
      const lId = uuidv4();
      const cId = uuidv4();
      
      const srcPos = { x: 100, y: 300 };
      const rPos = { x: 300, y: 200 };
      const lPos = { x: 500, y: 200 };
      const cPos = { x: 700, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: sourceId, type: 'ac_source', position: srcPos, rotation: 0, value: 220, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: rId, type: 'resistor', position: rPos, rotation: 0, value: 100, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: lId, type: 'inductor', position: lPos, rotation: 0, value: 0.1, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: cId, type: 'capacitor', position: cPos, rotation: 90, value: 0.001, nodes: [n7, n8], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: srcPos.x - 30, y: srcPos.y }, connections: [sourceId], voltage: 0 },
        { id: n2, position: { x: srcPos.x + 30, y: srcPos.y }, connections: [sourceId], voltage: 0 },
        { id: n3, position: { x: rPos.x - 30, y: rPos.y }, connections: [rId], voltage: 0 },
        { id: n4, position: { x: rPos.x + 30, y: rPos.y }, connections: [rId], voltage: 0 },
        { id: n5, position: { x: lPos.x - 30, y: lPos.y }, connections: [lId], voltage: 0 },
        { id: n6, position: { x: lPos.x + 30, y: lPos.y }, connections: [lId], voltage: 0 },
        { id: n7, position: { x: cPos.x, y: cPos.y - 30 }, connections: [cId], voltage: 0 },
        { id: n8, position: { x: cPos.x, y: cPos.y + 30 }, connections: [cId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n7, current: 0 },
        { from: n8, to: n2, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Sơ đồ mạch điện trong nhà (Cơ bản)',
    create: () => {
      const sourceId = uuidv4();
      const mainFuseId = uuidv4();
      
      const sw1Id = uuidv4();
      const lamp1Id = uuidv4(); // Phòng khách
      
      const sw2Id = uuidv4();
      const lamp2Id = uuidv4(); // Bếp
      
      const sw3Id = uuidv4();
      const lamp3Id = uuidv4(); // Phòng ngủ

      const gndId = uuidv4();
      
      const srcPos = { x: 100, y: 300 };
      const fusePos = { x: 250, y: 200 };
      
      const sw1Pos = { x: 400, y: 150 };
      const lamp1Pos = { x: 600, y: 150 };
      
      const sw2Pos = { x: 400, y: 300 };
      const lamp2Pos = { x: 600, y: 300 };
      
      const sw3Pos = { x: 400, y: 450 };
      const lamp3Pos = { x: 600, y: 450 };

      const gndPos = { x: 100, y: 450 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();
      const n9 = uuidv4(); const n10 = uuidv4();
      const n11 = uuidv4(); const n12 = uuidv4();
      const n13 = uuidv4(); const n14 = uuidv4();
      const n15 = uuidv4(); const n16 = uuidv4();
      const n17 = uuidv4(); const n18 = uuidv4();

      const components: Component[] = [
        { id: sourceId, type: 'ac_source', position: srcPos, rotation: 0, value: 220, nodes: [n1, n2], current: 0, voltageDrop: 0, text: '220V AC' },
        { id: mainFuseId, type: 'fuse', position: fusePos, rotation: 0, value: 0.1, rating: 15, nodes: [n3, n4], current: 0, voltageDrop: 0, text: 'CB Tổng' },
        
        { id: sw1Id, type: 'switch', position: sw1Pos, rotation: 0, value: 0, nodes: [n5, n6], current: 0, voltageDrop: 0, isOpen: false, text: 'CT P.Khách' },
        { id: lamp1Id, type: 'lamp', position: lamp1Pos, rotation: 0, value: 100, nodes: [n7, n8], current: 0, voltageDrop: 0, text: 'Đèn P.Khách' },
        
        { id: sw2Id, type: 'switch', position: sw2Pos, rotation: 0, value: 0, nodes: [n9, n10], current: 0, voltageDrop: 0, isOpen: true, text: 'CT Bếp' },
        { id: lamp2Id, type: 'lamp', position: lamp2Pos, rotation: 0, value: 60, nodes: [n11, n12], current: 0, voltageDrop: 0, text: 'Đèn Bếp' },
        
        { id: sw3Id, type: 'switch', position: sw3Pos, rotation: 0, value: 0, nodes: [n13, n14], current: 0, voltageDrop: 0, isOpen: true, text: 'CT P.Ngủ' },
        { id: lamp3Id, type: 'lamp', position: lamp3Pos, rotation: 0, value: 40, nodes: [n15, n16], current: 0, voltageDrop: 0, text: 'Đèn P.Ngủ' },

        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [n17, n18], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: srcPos.x - 30, y: srcPos.y }, connections: [sourceId], voltage: 0 }, // Pha L
        { id: n2, position: { x: srcPos.x + 30, y: srcPos.y }, connections: [sourceId], voltage: 0 }, // Trung tính N
        
        { id: n3, position: { x: fusePos.x - 30, y: fusePos.y }, connections: [mainFuseId], voltage: 0 },
        { id: n4, position: { x: fusePos.x + 30, y: fusePos.y }, connections: [mainFuseId], voltage: 0 },
        
        { id: n5, position: { x: sw1Pos.x - 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n6, position: { x: sw1Pos.x + 30, y: sw1Pos.y }, connections: [sw1Id], voltage: 0 },
        { id: n7, position: { x: lamp1Pos.x - 30, y: lamp1Pos.y }, connections: [lamp1Id], voltage: 0 },
        { id: n8, position: { x: lamp1Pos.x + 30, y: lamp1Pos.y }, connections: [lamp1Id], voltage: 0 },
        
        { id: n9, position: { x: sw2Pos.x - 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 },
        { id: n10, position: { x: sw2Pos.x + 30, y: sw2Pos.y }, connections: [sw2Id], voltage: 0 },
        { id: n11, position: { x: lamp2Pos.x - 30, y: lamp2Pos.y }, connections: [lamp2Id], voltage: 0 },
        { id: n12, position: { x: lamp2Pos.x + 30, y: lamp2Pos.y }, connections: [lamp2Id], voltage: 0 },
        
        { id: n13, position: { x: sw3Pos.x - 30, y: sw3Pos.y }, connections: [sw3Id], voltage: 0 },
        { id: n14, position: { x: sw3Pos.x + 30, y: sw3Pos.y }, connections: [sw3Id], voltage: 0 },
        { id: n15, position: { x: lamp3Pos.x - 30, y: lamp3Pos.y }, connections: [lamp3Id], voltage: 0 },
        { id: n16, position: { x: lamp3Pos.x + 30, y: lamp3Pos.y }, connections: [lamp3Id], voltage: 0 },

        { id: n17, position: { x: gndPos.x, y: gndPos.y - 30 }, connections: [gndId], voltage: 0 },
        { id: n18, position: { x: gndPos.x, y: gndPos.y + 30 }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        // Dây nóng (Pha L)
        { from: n1, to: n3, current: 0 }, // Từ nguồn đến CB
        { from: n4, to: n5, current: 0 }, // Từ CB đến CT1
        { from: n5, to: n9, current: 0 }, // Nhánh sang CT2
        { from: n9, to: n13, current: 0 }, // Nhánh sang CT3
        
        // Sau công tắc đến đèn
        { from: n6, to: n7, current: 0 },
        { from: n10, to: n11, current: 0 },
        { from: n14, to: n15, current: 0 },
        
        // Dây nguội (Trung tính N)
        { from: n8, to: n12, current: 0 }, // Nối chung các đèn
        { from: n12, to: n16, current: 0 },
        { from: n16, to: n2, current: 0 }, // Về nguồn
        
        // Nối đất an toàn
        { from: n2, to: n17, current: 0 },
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Transistor Switch (NPN)',
    create: () => {
      const batId = uuidv4();
      const swId = uuidv4();
      const rBaseId = uuidv4();
      const npnId = uuidv4();
      const ledId = uuidv4();
      const rLedId = uuidv4();
      const gndId = uuidv4();

      const batPos = { x: 100, y: 300 };
      const swPos = { x: 200, y: 200 };
      const rBasePos = { x: 300, y: 200 };
      const npnPos = { x: 400, y: 300 };
      const ledPos = { x: 400, y: 150 };
      const rLedPos = { x: 400, y: 100 };
      const gndPos = { x: 400, y: 400 };

      // Nodes
      const nBatP = uuidv4(); const nBatN = uuidv4();
      const nSw1 = uuidv4(); const nSw2 = uuidv4();
      const nRb1 = uuidv4(); const nRb2 = uuidv4();
      const nNpnB = uuidv4(); const nNpnC = uuidv4(); const nNpnE = uuidv4();
      const nLedA = uuidv4(); const nLedK = uuidv4();
      const nRl1 = uuidv4(); const nRl2 = uuidv4();
      const nGnd = uuidv4();

      const components: Component[] = [
        { id: batId, type: 'battery', position: batPos, rotation: 0, value: 5, nodes: [nBatP, nBatN], current: 0, voltageDrop: 0 },
        { id: swId, type: 'switch', position: swPos, rotation: 0, value: 0, nodes: [nSw1, nSw2], current: 0, voltageDrop: 0, isOpen: true },
        { id: rBaseId, type: 'resistor', position: rBasePos, rotation: 0, value: 1000, nodes: [nRb1, nRb2], current: 0, voltageDrop: 0 },
        { id: npnId, type: 'npn_transistor', position: npnPos, rotation: 0, value: 100, nodes: [nNpnB, nNpnC, nNpnE], current: 0, voltageDrop: 0 },
        { id: ledId, type: 'led', position: ledPos, rotation: 90, value: 10, nodes: [nLedA, nLedK], current: 0, voltageDrop: 0, color: '#ff0000' },
        { id: rLedId, type: 'resistor', position: rLedPos, rotation: 90, value: 220, nodes: [nRl1, nRl2], current: 0, voltageDrop: 0 },
        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [nGnd], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: nBatP, position: { x: batPos.x - 30, y: batPos.y }, connections: [batId], voltage: 0 },
        { id: nBatN, position: { x: batPos.x + 30, y: batPos.y }, connections: [batId], voltage: 0 },
        { id: nSw1, position: { x: swPos.x - 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: nSw2, position: { x: swPos.x + 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: nRb1, position: { x: rBasePos.x - 30, y: rBasePos.y }, connections: [rBaseId], voltage: 0 },
        { id: nRb2, position: { x: rBasePos.x + 30, y: rBasePos.y }, connections: [rBaseId], voltage: 0 },
        { id: nNpnB, position: { x: npnPos.x - 20, y: npnPos.y }, connections: [npnId], voltage: 0 }, // Base
        { id: nNpnC, position: { x: npnPos.x + 20, y: npnPos.y - 20 }, connections: [npnId], voltage: 0 }, // Collector
        { id: nNpnE, position: { x: npnPos.x + 20, y: npnPos.y + 20 }, connections: [npnId], voltage: 0 }, // Emitter
        { id: nLedA, position: { x: ledPos.x, y: ledPos.y - 30 }, connections: [ledId], voltage: 0 },
        { id: nLedK, position: { x: ledPos.x, y: ledPos.y + 30 }, connections: [ledId], voltage: 0 },
        { id: nRl1, position: { x: rLedPos.x, y: rLedPos.y - 30 }, connections: [rLedId], voltage: 0 },
        { id: nRl2, position: { x: rLedPos.x, y: rLedPos.y + 30 }, connections: [rLedId], voltage: 0 },
        { id: nGnd, position: { x: gndPos.x - 20, y: gndPos.y }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        { from: nBatP, to: nSw1, current: 0 },
        { from: nSw2, to: nRb1, current: 0 },
        { from: nRb2, to: nNpnB, current: 0 }, // Base drive
        { from: nBatP, to: nRl1, current: 0 }, // VCC to R_LED
        { from: nRl2, to: nLedA, current: 0 },
        { from: nLedK, to: nNpnC, current: 0 }, // LED to Collector
        { from: nNpnE, to: nGnd, current: 0 }, // Emitter to GND
        { from: nBatN, to: nGnd, current: 0 }, // Battery Neg to GND
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Op-Amp Buffer (Voltage Follower)',
    create: () => {
      const acId = uuidv4();
      const opId = uuidv4();
      const rLoadId = uuidv4();
      const gndId = uuidv4();

      const acPos = { x: 100, y: 300 };
      const opPos = { x: 300, y: 300 };
      const rLoadPos = { x: 500, y: 300 };
      const gndPos = { x: 300, y: 450 };

      // Nodes
      const nAc1 = uuidv4(); const nAc2 = uuidv4();
      const nOpInM = uuidv4(); const nOpInP = uuidv4(); const nOpOut = uuidv4();
      const nRl1 = uuidv4(); const nRl2 = uuidv4();
      const nGnd = uuidv4();

      const components: Component[] = [
        { id: acId, type: 'ac_source', position: acPos, rotation: 0, value: 5, rating: 1, nodes: [nAc1, nAc2], current: 0, voltageDrop: 0 },
        { id: opId, type: 'opamp', position: opPos, rotation: 0, value: 100000, nodes: [nOpInM, nOpInP, nOpOut], current: 0, voltageDrop: 0 },
        { id: rLoadId, type: 'resistor', position: rLoadPos, rotation: 90, value: 1000, nodes: [nRl1, nRl2], current: 0, voltageDrop: 0 },
        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [nGnd], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: nAc1, position: { x: acPos.x - 30, y: acPos.y }, connections: [acId], voltage: 0 },
        { id: nAc2, position: { x: acPos.x + 30, y: acPos.y }, connections: [acId], voltage: 0 },
        { id: nOpInM, position: { x: opPos.x - 30, y: opPos.y - 15 }, connections: [opId], voltage: 0 }, // In-
        { id: nOpInP, position: { x: opPos.x - 30, y: opPos.y + 15 }, connections: [opId], voltage: 0 }, // In+
        { id: nOpOut, position: { x: opPos.x + 30, y: opPos.y }, connections: [opId], voltage: 0 }, // Out
        { id: nRl1, position: { x: rLoadPos.x, y: rLoadPos.y - 30 }, connections: [rLoadId], voltage: 0 },
        { id: nRl2, position: { x: rLoadPos.x, y: rLoadPos.y + 30 }, connections: [rLoadId], voltage: 0 },
        { id: nGnd, position: { x: gndPos.x - 20, y: gndPos.y }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        { from: nAc1, to: nOpInP, current: 0 }, // AC to In+
        { from: nOpOut, to: nOpInM, current: 0 }, // Feedback: Out to In-
        { from: nOpOut, to: nRl1, current: 0 }, // Out to Load
        { from: nRl2, to: nGnd, current: 0 }, // Load to GND
        { from: nAc2, to: nGnd, current: 0 }, // AC Return to GND
      ];

      const state = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  }
];
