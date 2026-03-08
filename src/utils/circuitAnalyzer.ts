import { CircuitState, Component, EvaluationResult } from '../types';

export function analyzeCircuit(state: CircuitState): EvaluationResult {
  const { components, nodes, wires, shortCircuitWarning } = state;
  let score = 100;
  const safetyIssues: string[] = [];
  const connectionIssues: string[] = [];
  const performanceIssues: string[] = [];
  let totalPower = 0;
  let totalCost = 0;

  // Calculate total cost
  components.forEach(comp => {
    totalCost += comp.price || 0;
  });

  // 1. Safety Check
  if (shortCircuitWarning) {
    score -= 50;
    safetyIssues.push("Cảnh báo: Phát hiện ngắn mạch! Dòng điện quá lớn có thể gây cháy nổ.");
  }

  components.forEach(comp => {
    const power = Math.abs((comp.voltageDrop || 0) * (comp.current || 0));
    totalPower += power;

    // Check Battery Health
    if (comp.type === 'battery' && comp.charge !== undefined && comp.capacity !== undefined) {
      if (comp.charge <= 0) {
        score -= 5;
        performanceIssues.push(`Pin (${comp.id.slice(0, 4)}) đã hết điện.`);
      } else if (comp.charge < comp.capacity * 0.2) {
        performanceIssues.push(`Pin (${comp.id.slice(0, 4)}) sắp hết điện (${Math.round(comp.charge / comp.capacity * 100)}%).`);
      }
    }

    // Check Overpower
    const maxPower = comp.maxPower || (comp.type === 'resistor' || comp.type === 'potentiometer' ? 0.5 : Infinity);
    if (power > maxPower) {
      score -= 10;
      safetyIssues.push(`Linh kiện ${comp.type} (${comp.id.slice(0, 4)}) quá tải công suất: ${power.toFixed(2)}W > ${maxPower}W`);
    }

    // Check Overcurrent (Fuse, LED, etc.)
    const maxCurrent = comp.maxCurrent || (comp.type === 'led' ? 0.05 : Infinity);
    if (Math.abs(comp.current || 0) > maxCurrent) {
      score -= 10;
      safetyIssues.push(`Linh kiện ${comp.type} (${comp.id.slice(0, 4)}) quá dòng: ${Math.abs(comp.current || 0).toFixed(2)}A > ${maxCurrent}A`);
    }

    // Check Overvoltage (Capacitor, etc.)
    const maxVoltage = comp.maxVoltage || (comp.type === 'capacitor' ? 16 : comp.type === 'lamp' ? 18 : Infinity);
    if (Math.abs(comp.voltageDrop || 0) > maxVoltage) {
      score -= 5;
      safetyIssues.push(`Linh kiện ${comp.type} (${comp.id.slice(0, 4)}) quá áp: ${Math.abs(comp.voltageDrop || 0).toFixed(2)}V > ${maxVoltage}V`);
    }
  });

  // 2. Connection Check
  // Check for floating nodes (nodes with only 1 connection)
  const nodeConnections = new Map<string, number>();
  wires.forEach(w => {
    nodeConnections.set(w.from, (nodeConnections.get(w.from) || 0) + 1);
    nodeConnections.set(w.to, (nodeConnections.get(w.to) || 0) + 1);
  });
  
  // Also count component connections to nodes
  components.forEach(c => {
    c.nodes.forEach(nId => {
       // Nodes are internal to components usually, but wires connect them.
       // Wait, in this data model, nodes are distinct entities.
       // Components connect to nodes via `nodes` array.
       // Wires connect nodes via `from` and `to`.
       // So a node is "connected" if it has at least 1 component AND (at least 1 wire OR another component).
       // Actually, a node is just a point.
       // Let's check if any node has only 1 connection total (from component or wire).
       // But wait, `nodes` in state are the terminals of components.
       // So every node has at least 1 connection (to its component).
       // If a node has NO wires attached, it's an open circuit at that terminal.
       // Unless it's a special component like Ground (1 terminal).
    });
  });

  // Better approach: Check for open circuits
  // A simple heuristic: If a component has current ~ 0 but voltage drop != 0 (and it's not a switch/voltmeter), it might be disconnected.
  // Or simply check if there are wires.
  if (wires.length === 0 && components.length > 1) {
      score -= 20;
      connectionIssues.push("Chưa có dây nối nào được vẽ.");
  }

  const sources = components.filter(c => c.type === 'battery' || c.type === 'ac_source');
  if (sources.length === 0) {
      score -= 20;
      connectionIssues.push("Mạch thiếu nguồn điện (Pin/Nguồn AC).");
  }

  const loads = components.filter(c => ['resistor', 'lamp', 'led', 'motor', 'speaker'].includes(c.type));
  if (loads.length === 0 && sources.length > 0) {
      score -= 10;
      performanceIssues.push("Mạch chưa có tải tiêu thụ (Đèn, Điện trở...).");
  }

  // Check for loose wires (nodes with wires but not connected to anything else? No, wires connect nodes).
  // Check for components completely disconnected (no wires at any terminal).
  components.forEach(c => {
      if (c.type === 'text') return;
      const connectedWires = wires.filter(w => c.nodes.includes(w.from) || c.nodes.includes(w.to));
      if (connectedWires.length === 0) {
          score -= 5;
          connectionIssues.push(`Linh kiện ${c.type} (${c.id.slice(0, 4)}) chưa được nối dây.`);
      }
  });


  // 3. Efficiency/Performance
  // Simple efficiency metric: Power delivered to loads / Total power
  let loadPower = 0;
  loads.forEach(c => {
      loadPower += Math.abs((c.voltageDrop || 0) * (c.current || 0));
  });

  const efficiency = totalPower > 0 ? (loadPower / totalPower) * 100 : 0;
  
  if (efficiency < 10 && totalPower > 0) {
      performanceIssues.push("Hiệu suất thấp: Phần lớn năng lượng bị tiêu hao trên dây dẫn hoặc nguồn nội trở.");
  }

  // 4. Final Score Clamping
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    safetyIssues,
    connectionIssues,
    performanceIssues,
    efficiency,
    totalPower,
    totalCost
  };
}
