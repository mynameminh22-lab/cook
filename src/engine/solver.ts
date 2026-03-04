import { CircuitState, Component, Node } from '../types';
import { zeros, inv, multiply, Matrix } from 'mathjs';

export function solveCircuit(state: CircuitState, dt: number = 0, time: number = 0): { nodes: Node[]; components: Component[]; wires: { from: string; to: string; current?: number }[]; hasShortCircuit?: boolean } {
  const { components, nodes, wires } = state;

  const nodeIndex = new Map<string, number>();
  nodes.forEach((n, index) => nodeIndex.set(n.id, index));

  const n = nodes.length;
  if (n === 0) return { nodes, components, wires };

  let hasShortCircuit = false;

  // 2. Build MNA Matrix
  const voltageSources = components.filter(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'opamp');
  const m = voltageSources.length;
  const matrixSize = n + m;

  const A = zeros(matrixSize, matrixSize) as Matrix;
  const Z = zeros(matrixSize, 1) as Matrix;

  // Add small leakage conductance to all nodes to prevent singular matrix for floating parts
  const G_LEAK = 1e-6; 
  for (let i = 0; i < n; i++) {
    A.set([i, i], G_LEAK);
  }

  const addConductance = (n1: string, n2: string, g: number) => {
    const i = nodeIndex.get(n1);
    const j = nodeIndex.get(n2);
    
    if (i !== undefined && j !== undefined) {
      if (i === j) return;
      
      A.set([i, i], A.get([i, i]) + g);
      A.set([j, j], A.get([j, j]) + g);
      A.set([i, j], A.get([i, j]) - g);
      A.set([j, i], A.get([j, i]) - g);
    }
  };

  const addCurrentSource = (n1: string, n2: string, i_src: number) => {
    // i_src flows from n1 to n2
    const i = nodeIndex.get(n1);
    const j = nodeIndex.get(n2);
    if (i !== undefined) Z.set([i, 0], Z.get([i, 0]) - i_src);
    if (j !== undefined) Z.set([j, 0], Z.get([j, 0]) + i_src);
  };

  const addVCCS = (ctrl_p: string, ctrl_n: string, out_p: string, out_n: string, gm: number) => {
    // Current I = gm * (V_ctrl_p - V_ctrl_n) flows from out_p to out_n
    const cp = nodeIndex.get(ctrl_p);
    const cn = nodeIndex.get(ctrl_n);
    const op = nodeIndex.get(out_p);
    const on = nodeIndex.get(out_n);

    // KCL at out_p: +I leaving => +gm*Vcp - gm*Vcn
    if (op !== undefined) {
      if (cp !== undefined) A.set([op, cp], A.get([op, cp]) + gm);
      if (cn !== undefined) A.set([op, cn], A.get([op, cn]) - gm);
    }
    // KCL at out_n: -I entering => -gm*Vcp + gm*Vcn
    if (on !== undefined) {
      if (cp !== undefined) A.set([on, cp], A.get([on, cp]) - gm);
      if (cn !== undefined) A.set([on, cn], A.get([on, cn]) + gm);
    }
  };

  // Components Conductance
  components.forEach(comp => {
    if (['resistor', 'lamp', 'voltmeter', 'ammeter', 'switch', 'push_button', 'potentiometer', 'fuse', 'led', 'spdt_switch', 'capacitor', 'inductor', 'diode', 'npn_transistor', 'pnp_transistor'].includes(comp.type)) {
      let resistance = comp.value;
      let g = 0;
      let i_src = 0;
      
      // Enforce minimum resistance for passive components
      if (['resistor', 'lamp', 'potentiometer'].includes(comp.type)) {
        resistance = Math.max(resistance, 0.1);
        g = 1 / resistance;
      } else if (comp.type === 'fuse') {
        resistance = comp.isBroken ? 1e9 : Math.max(comp.value, 0.01);
        g = 1 / resistance;
      } else if (comp.type === 'voltmeter') {
        resistance = 10e6;
        g = 1 / resistance;
      } else if (comp.type === 'ammeter') {
        resistance = 1e-3;
        g = 1 / resistance;
      } else if (comp.type === 'switch' || comp.type === 'push_button') {
        resistance = comp.isOpen ? 1e9 : 1e-3;
        g = 1 / resistance;
      } else if (comp.type === 'spdt_switch') {
        // SPDT Logic
        const g_closed = 1 / 1e-3; // Low resistance
        const g_open = 1 / 1e9;    // High resistance
        
        // Common to NO
        addConductance(comp.nodes[0], comp.nodes[1], comp.isOpen ? g_open : g_closed);
        
        // Common to NC
        addConductance(comp.nodes[0], comp.nodes[2], comp.isOpen ? g_closed : g_open);
        
        return; // Skip default 2-node handling
      } else if (comp.type === 'capacitor') {
        if (dt > 0) {
          // Backward Euler: I(t) = (C/dt)*V(t) - (C/dt)*V(t-dt)
          g = comp.value / dt;
          i_src = -g * (comp.voltageDrop || 0);
        } else {
          g = 1 / 1e9; // DC Open circuit
        }
      } else if (comp.type === 'inductor') {
        if (dt > 0) {
          // Backward Euler: I(t) = I(t-dt) + (dt/L)*V(t)
          g = dt / Math.max(comp.value, 1e-9);
          i_src = comp.current || 0;
        } else {
          g = 1 / 1e-3; // DC Short circuit
        }
      } else if (comp.type === 'diode' || comp.type === 'led') {
        // Piecewise linear model for Diode/LED
        const v_f = comp.type === 'led' ? 2.0 : 0.7; // Forward voltage
        const v_prev = comp.voltageDrop || 0;
        if (v_prev > v_f) {
          const r_on = 0.1;
          g = 1 / r_on;
          i_src = -v_f / r_on; // I = (V - Vf)/Ron = G*V - G*Vf
        } else {
          g = 1 / 1e6; // High resistance when off
          i_src = 0;
        }
      } else if (comp.type === 'npn_transistor') {
        // NPN: B(0), C(1), E(2)
        const beta = comp.value || 100;
        const r_be = 100; // Input resistance
        const v_f = 0.7;
        
        // Base-Emitter Diode Model
        addConductance(comp.nodes[0], comp.nodes[2], 1/r_be);
        addCurrentSource(comp.nodes[0], comp.nodes[2], -v_f/r_be);

        // Collector-Emitter VCCS: I_C = beta * I_B
        const gm = beta / r_be;
        const i_offset = -(beta * v_f) / r_be;
        
        addVCCS(comp.nodes[0], comp.nodes[2], comp.nodes[1], comp.nodes[2], gm);
        addCurrentSource(comp.nodes[1], comp.nodes[2], i_offset);
        return;
      } else if (comp.type === 'pnp_transistor') {
        // PNP: B(0), C(1), E(2)
        const beta = comp.value || 100;
        const r_eb = 100;
        const v_f = 0.7;
        
        // Emitter-Base Diode Model
        addConductance(comp.nodes[2], comp.nodes[0], 1/r_eb);
        addCurrentSource(comp.nodes[2], comp.nodes[0], -v_f/r_eb);

        // Emitter-Collector VCCS: I_C = beta * I_B
        const gm = beta / r_eb;
        const i_offset = -(beta * v_f) / r_eb;
        
        // Current flows from E to C
        addVCCS(comp.nodes[2], comp.nodes[0], comp.nodes[2], comp.nodes[1], gm);
        addCurrentSource(comp.nodes[2], comp.nodes[1], i_offset);
        return;
      }

      addConductance(comp.nodes[0], comp.nodes[1], g);
      if (i_src !== 0) {
        addCurrentSource(comp.nodes[0], comp.nodes[1], i_src);
      }
    }
  });

  // Wires Conductance (High conductance = Low resistance)
  const WIRE_CONDUCTANCE = 1000; // 0.001 Ohm
  wires.forEach(wire => {
    addConductance(wire.from, wire.to, WIRE_CONDUCTANCE);
  });

    // Voltage Sources
    voltageSources.forEach((source, k) => {
      const idx = n + k;
      
      if (source.type === 'opamp') {
        // Op-Amp: In-(0), In+(1), Out(2)
        // V_out - A(V_plus - V_minus) = 0
        const gain = source.value || 100000;
        const n_minus = nodeIndex.get(source.nodes[0]);
        const n_plus = nodeIndex.get(source.nodes[1]);
        const n_out = nodeIndex.get(source.nodes[2]);

        if (n_out !== undefined) A.set([idx, n_out], 1);
        if (n_plus !== undefined) A.set([idx, n_plus], -gain);
        if (n_minus !== undefined) A.set([idx, n_minus], gain);
        
        // Output current equation: Current flows out of output node
        if (n_out !== undefined) A.set([n_out, idx], 1);
        
      } else {
        // Battery / AC Source
        const n1 = source.nodes[0];
        const n2 = source.nodes[1];
        const i = nodeIndex.get(n1);
        const j = nodeIndex.get(n2);

        if (i !== undefined) {
          A.set([idx, i], 1);
          A.set([i, idx], 1);
        }
        if (j !== undefined) {
          A.set([idx, j], -1);
          A.set([j, idx], -1);
        }

      // Add internal resistance to battery (Realism + Stability for parallel sources)
      // Equation: V_n1 - V_n2 + I_src * R_int = V_val
      // We use a small internal resistance, e.g., 0.1 Ohm
      const R_int = 0.1;
      A.set([idx, idx], -R_int); 

      let v_val = source.value;
      if (source.type === 'ac_source') {
        // AC Source: V = V_peak * sin(2 * pi * f * t)
        const f = source.rating || 50; // Default 50Hz
        v_val = source.value * Math.sin(2 * Math.PI * f * time);
      }

      Z.set([idx, 0], v_val);
      }
    });

  // Ground Handling
  let groundNodeId = '';
  const groundComp = components.find(c => c.type === 'ground');
  if (groundComp) {
    groundNodeId = groundComp.nodes[0];
  } else if (voltageSources.length > 0) {
     groundNodeId = voltageSources[0].nodes[1];
  } else if (nodes.length > 0) {
     groundNodeId = nodes[0].id;
  }

  const groundIdx = nodeIndex.get(groundNodeId);
  if (groundIdx !== undefined) {
    // Add large conductance to ground (G_ground * V = 0)
    A.set([groundIdx, groundIdx], A.get([groundIdx, groundIdx]) + 1e9);
  }

  // 4. Solve
  let X;
  try {
    const A_inv = inv(A);
    X = multiply(A_inv, Z);
  } catch (e) {
    console.warn("Solver error", e);
    return { nodes, components, wires };
  }

  // 5. Update State
  let nodesChanged = false;
  const newNodes = nodes.map(node => {
    const idx = nodeIndex.get(node.id);
    // @ts-ignore
    const voltage = idx !== undefined ? X.get([idx, 0]) : 0;
    if (Math.abs((node.voltage || 0) - voltage) > 1e-6) {
      nodesChanged = true;
      return { ...node, voltage };
    }
    return node;
  });

  let componentsChanged = false;
  const newComponents = components.map(comp => {
    let temp = 25; // Default ambient temperature
    const n1 = newNodes.find(n => n.id === comp.nodes[0]);
    const n2 = newNodes.find(n => n.id === comp.nodes[1]);
    if (!n1 || !n2) return comp;

    let vDrop = n1.voltage - n2.voltage;
    let current = 0;
    let isBroken = comp.isBroken;

    if (['resistor', 'lamp', 'voltmeter', 'ammeter', 'switch', 'push_button', 'potentiometer', 'fuse', 'led', 'spdt_switch', 'capacitor', 'inductor', 'diode'].includes(comp.type)) {
      let resistance = comp.value;
      
      if (['resistor', 'lamp', 'potentiometer'].includes(comp.type)) {
        resistance = Math.max(resistance, 0.1);
      } else if (comp.type === 'fuse') {
        resistance = comp.isBroken ? 1e9 : Math.max(comp.value, 0.01);
      } else if (comp.type === 'voltmeter') {
        resistance = 10e6;
      } else if (comp.type === 'ammeter') {
        resistance = 1e-3;
      } else if (comp.type === 'switch' || comp.type === 'push_button') {
        resistance = comp.isOpen ? 1e9 : 1e-3;
      }
      
      if (comp.type === 'spdt_switch') {
        // Calculate current through the active path
        const nCommon = newNodes.find(n => n.id === comp.nodes[0]);
        const nNO = newNodes.find(n => n.id === comp.nodes[1]);
        const nNC = newNodes.find(n => n.id === comp.nodes[2]);
        
        if (nCommon && nNO && nNC) {
            if (comp.isOpen) {
                vDrop = nCommon.voltage - nNC.voltage;
                current = vDrop / 1e-3;
            } else {
                vDrop = nCommon.voltage - nNO.voltage;
                current = vDrop / 1e-3;
            }
        }
      } else if (comp.type === 'capacitor') {
        if (dt > 0) {
          const g = comp.value / dt;
          const i_src = -g * (comp.voltageDrop || 0);
          current = vDrop * g + i_src;
        } else {
          current = 0;
        }
      } else if (comp.type === 'inductor') {
        if (dt > 0) {
          const g = dt / Math.max(comp.value, 1e-9);
          const i_src = comp.current || 0;
          current = vDrop * g + i_src;
        } else {
          current = vDrop / 1e-3;
        }
      } else if (comp.type === 'diode' || comp.type === 'led') {
        const v_f = comp.type === 'led' ? 2.0 : 0.7;
        const v_prev = comp.voltageDrop || 0;
        if (v_prev > v_f) {
          const r_on = 0.1;
          const g = 1 / r_on;
          const i_src = -v_f / r_on;
          current = vDrop * g + i_src;
        } else {
          current = vDrop / 1e6;
        }
      } else if (comp.type === 'npn_transistor' || comp.type === 'pnp_transistor') {
        const nB = newNodes.find(n => n.id === comp.nodes[0]);
        const nC = newNodes.find(n => n.id === comp.nodes[1]);
        const nE = newNodes.find(n => n.id === comp.nodes[2]);
        if (nB && nC && nE) {
            const V_B = nB.voltage;
            const V_C = nC.voltage;
            const V_E = nE.voltage;
            const beta = comp.value || 100;
            
            if (comp.type === 'npn_transistor') {
                const V_BE = V_B - V_E;
                let I_B = 0;
                if (V_BE > 0.7) I_B = (V_BE - 0.7) / 1000;
                current = beta * I_B;
                vDrop = V_C - V_E;
            } else {
                const V_EB = V_E - V_B;
                let I_B = 0;
                if (V_EB > 0.7) I_B = (V_EB - 0.7) / 1000;
                current = beta * I_B;
                vDrop = V_E - V_C;
            }
        }
      } else if (comp.type === 'opamp') {
        const srcIdx = voltageSources.findIndex(v => v.id === comp.id);
        if (srcIdx !== -1) {
            const n = nodes.length;
            // @ts-ignore
            current = X.get([n + srcIdx, 0]);
            const nOut = newNodes.find(n => n.id === comp.nodes[2]);
            vDrop = nOut ? nOut.voltage : 0;
        }
      } else {
        // Calculate current for 2-terminal components
        current = vDrop / Math.max(resistance, 1e-9);
      }

      // --- Temperature Calculation ---
      const ambientTemp = 25;
      const power = Math.abs(current * vDrop);
      let thermalRes = 50; // Default °C/W
      
      if (comp.type === 'resistor') thermalRes = 50;
      else if (comp.type === 'led') thermalRes = 200;
      else if (comp.type === 'lamp') thermalRes = 10;
      else if (comp.type === 'fuse') thermalRes = 100;
      else if (comp.type === 'battery') thermalRes = 5;
      else if (comp.type === 'npn_transistor' || comp.type === 'pnp_transistor') thermalRes = 60;
      
      temp = ambientTemp + power * thermalRes;

      // --- Burnout Logic ---
      if (!comp.isBroken) {
          // Fuse Blow
          if (comp.type === 'fuse' && Math.abs(current) > (comp.rating || 0.5)) {
              isBroken = true;
          }
          // Resistor Burnout
          else if (comp.type === 'resistor') {
              if (power > (comp.maxPower || 0.5)) isBroken = true;
          }
          // LED Burnout
          else if (comp.type === 'led') {
              if (Math.abs(current) > (comp.maxCurrent || 0.05)) isBroken = true;
          }
          // Lamp Burnout
          else if (comp.type === 'lamp') {
              if (Math.abs(vDrop) > (comp.maxVoltage || 18)) isBroken = true;
          }
          
          // Thermal Runaway / Overheat
          if (temp > 150) isBroken = true; // General overheat limit
      }

    } else if (comp.type === 'battery') {
      // For battery, we need to find the current variable in the solution vector X
      // The voltage sources are appended after the nodes in the matrix
      // We need to find the index of this battery in the voltageSources array
      const k = voltageSources.findIndex(c => c.id === comp.id);
      if (k !== -1) {
        // The index in X is n (number of nodes) + k
        // @ts-ignore
        // X is a matrix, get(row, col)
        // Note: The current direction in MNA for voltage sources is usually defined as flowing *into* the positive terminal?
        // Or out? Standard MNA: I_source flows from + to -.
        // Let's check the sign. If we get negative current, it means it's supplying power.
        const idx = nodes.length + k;
        // @ts-ignore
        const val = X ? X.get([idx, 0]) : 0;
        current = val;
      }
    }

    // Check for short circuit (high current)
    if (Math.abs(current) > 20) { // 20A threshold
        hasShortCircuit = true;
    }

    // Recalculate temp for battery/source if needed, but for now just default
    let finalTemp = typeof temp !== 'undefined' ? temp : 25;
    if (comp.type === 'battery' || comp.type === 'ac_source') {
         const ambientTemp = 25;
         const power = Math.abs(current * vDrop); // Power delivered/absorbed
         const thermalRes = 5;
         finalTemp = ambientTemp + power * thermalRes;
    }

    if (
      Math.abs((comp.current || 0) - current) > 1e-6 ||
      Math.abs((comp.voltageDrop || 0) - vDrop) > 1e-6 ||
      comp.isBroken !== isBroken ||
      Math.abs((comp.temperature || 25) - finalTemp) > 1e-6
    ) {
      componentsChanged = true;
      return { ...comp, current, voltageDrop: vDrop, isBroken, temperature: finalTemp };
    }
    return comp;
  });

  let wiresChanged = false;
  const newWires = wires.map(wire => {
    const n1 = newNodes.find(n => n.id === wire.from);
    const n2 = newNodes.find(n => n.id === wire.to);
    if (!n1 || !n2) return wire;
    
    const vDrop = n1.voltage - n2.voltage;
    const current = vDrop * WIRE_CONDUCTANCE;
    
    if (Math.abs((wire.current || 0) - current) > 1e-6) {
      wiresChanged = true;
      return { ...wire, current };
    }
    return wire;
  });

  return { 
    nodes: nodesChanged ? newNodes : nodes, 
    components: componentsChanged ? newComponents : components, 
    wires: wiresChanged ? newWires : wires,
    hasShortCircuit
  };
}
