import { v4 as uuidv4 } from 'uuid';
import { CircuitState, Component, Node } from './types';
import { solveCircuit } from './engine/solver';

export interface CircuitExample {
  name: string;
  description?: string;
  principle?: string;
  application?: string;
  create: () => CircuitState;
}

export const BASIC_EXAMPLES: CircuitExample[] = [
  {
    name: 'Mạch nối tiếp cơ bản',
    description: 'Mạch điện đơn giản nhất gồm nguồn điện, điện trở và bóng đèn mắc nối tiếp.',
    principle: 'Trong mạch nối tiếp, dòng điện chạy qua các linh kiện là như nhau. Tổng điện áp trên các linh kiện bằng điện áp nguồn.',
    application: 'Đèn trang trí, đèn pin cũ, các mạch cầu chì bảo vệ.',
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
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 9, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: resistorId, type: 'resistor', position: resPos, rotation: 0, value: 330, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0 },
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Mạch nối tiếp cơ bản","description":"Mạch điện đơn giản nhất gồm nguồn điện, điện trở và bóng đèn mắc nối tiếp.","principle":"Trong mạch nối tiếp, dòng điện chạy qua các linh kiện là như nhau. Tổng điện áp trên các linh kiện bằng điện áp nguồn.","application":"Đèn trang trí, đèn pin cũ, các mạch cầu chì bảo vệ."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch song song (2 Đèn)',
    description: 'Hai bóng đèn được mắc song song với nguồn điện.',
    principle: 'Trong mạch song song, điện áp trên các nhánh là như nhau. Dòng điện tổng bằng tổng dòng điện các nhánh.',
    application: 'Hệ thống điện trong nhà, đèn pha xe hơi.',
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
        { id: lamp1Id, type: 'lamp', position: lamp1Pos, rotation: 90, value: 100, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: lamp2Id, type: 'lamp', position: lamp2Pos, rotation: 90, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0 },
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Mạch song song (2 Đèn)","description":"Hai bóng đèn được mắc song song với nguồn điện.","principle":"Trong mạch song song, điện áp trên các nhánh là như nhau. Dòng điện tổng bằng tổng dòng điện các nhánh.","application":"Hệ thống điện trong nhà, đèn pha xe hơi."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch đèn LED',
    description: 'Mạch điều khiển đèn LED với điện trở hạn dòng.',
    principle: 'LED cần điện trở hạn dòng để tránh bị cháy do dòng điện quá lớn. Điện trở giúp giảm áp và giới hạn dòng điện.',
    application: 'Đèn báo hiệu, màn hình LED, đèn chiếu sáng.',
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
        { id: resistorId, type: 'resistor', position: resPos, rotation: 0, value: 330, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: ledId, type: 'led', position: ledPos, rotation: 0, value: 10, nodes: [n5, n6], current: 0, voltageDrop: 0, color: '#ef4444' },
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Mạch đèn LED","description":"Mạch điều khiển đèn LED với điện trở hạn dòng.","principle":"LED cần điện trở hạn dòng để tránh bị cháy do dòng điện quá lớn. Điện trở giúp giảm áp và giới hạn dòng điện.","application":"Đèn báo hiệu, màn hình LED, đèn chiếu sáng."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Chuông cửa (Nút nhấn)',
    description: 'Mạch chuông cửa đơn giản sử dụng nút nhấn nhả.',
    principle: 'Nút nhấn (Push Button) chỉ đóng mạch khi được giữ. Khi thả ra, mạch ngắt, chuông ngừng kêu.',
    application: 'Chuông cửa, còi xe, bàn phím.',
    create: () => {
      const batteryId = uuidv4();
      const pushButtonId = uuidv4();
      const lampId = uuidv4(); // Using lamp to simulate bell
      
      const batPos = { x: 100, y: 300 };
      const pbPos = { x: 300, y: 300 };
      const lampPos = { x: 500, y: 300 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: pushButtonId, type: 'push_button', position: pbPos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0, text: 'Chuông' },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: pbPos.x - 30, y: pbPos.y }, connections: [pushButtonId], voltage: 0 },
        { id: n4, position: { x: pbPos.x + 30, y: pbPos.y }, connections: [pushButtonId], voltage: 0 },
        { id: n5, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n6, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n6, to: n2, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Chuông cửa (Nút nhấn)","description":"Mạch chuông cửa đơn giản sử dụng nút nhấn nhả.","principle":"Nút nhấn (Push Button) chỉ đóng mạch khi được giữ. Khi thả ra, mạch ngắt, chuông ngừng kêu.","application":"Chuông cửa, còi xe, bàn phím."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Cầu chì bảo vệ',
    description: 'Mạch minh họa chức năng bảo vệ của cầu chì khi dòng điện quá tải.',
    principle: 'Khi dòng điện vượt quá định mức của cầu chì, dây chì sẽ nóng chảy và ngắt mạch, bảo vệ các thiết bị khác.',
    application: 'Bảo vệ mạch điện gia đình, thiết bị điện tử.',
    create: () => {
      const batteryId = uuidv4();
      const fuseId = uuidv4();
      const lampId = uuidv4();
      const switchId = uuidv4(); // Short circuit switch
      
      const batPos = { x: 100, y: 300 };
      const fusePos = { x: 300, y: 300 };
      const lampPos = { x: 500, y: 300 };
      const swPos = { x: 500, y: 150 }; // Parallel to lamp to short it

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: fuseId, type: 'fuse', position: fusePos, rotation: 0, value: 0.1, rating: 0.5, nodes: [n3, n4], current: 0, voltageDrop: 0 }, // 0.5A Fuse
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: switchId, type: 'switch', position: swPos, rotation: 0, value: 0, nodes: [n7, n8], current: 0, voltageDrop: 0, isOpen: true, text: 'Gây ngắn mạch' },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: fusePos.x - 30, y: fusePos.y }, connections: [fuseId], voltage: 0 },
        { id: n4, position: { x: fusePos.x + 30, y: fusePos.y }, connections: [fuseId], voltage: 0 },
        { id: n5, position: { x: lampPos.x - 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n6, position: { x: lampPos.x + 30, y: lampPos.y }, connections: [lampId], voltage: 0 },
        { id: n7, position: { x: swPos.x - 30, y: swPos.y }, connections: [switchId], voltage: 0 },
        { id: n8, position: { x: swPos.x + 30, y: swPos.y }, connections: [switchId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n5, to: n7, current: 0 }, // Connect switch parallel to lamp
        { from: n6, to: n8, current: 0 },
        { from: n6, to: n2, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Cầu chì bảo vệ","description":"Mạch minh họa chức năng bảo vệ của cầu chì khi dòng điện quá tải.","principle":"Khi dòng điện vượt quá định mức của cầu chì, dây chì sẽ nóng chảy và ngắt mạch, bảo vệ các thiết bị khác.","application":"Bảo vệ mạch điện gia đình, thiết bị điện tử."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Đo dòng điện và điện áp',
    description: 'Cách mắc Ampe kế (nối tiếp) và Vôn kế (song song) để đo thông số mạch.',
    principle: 'Ampe kế có điện trở rất nhỏ, mắc nối tiếp để đo dòng. Vôn kế có điện trở rất lớn, mắc song song để đo áp.',
    application: 'Đồng hồ vạn năng (VOM), giám sát hệ thống điện.',
    create: () => {
      const batteryId = uuidv4();
      const resistorId = uuidv4();
      const ammeterId = uuidv4();
      const voltmeterId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const amPos = { x: 250, y: 200 };
      const resPos = { x: 400, y: 300 };
      const volPos = { x: 400, y: 150 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: ammeterId, type: 'ammeter', position: amPos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: resistorId, type: 'resistor', position: resPos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: voltmeterId, type: 'voltmeter', position: volPos, rotation: 0, value: 0, nodes: [n7, n8], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: amPos.x - 30, y: amPos.y }, connections: [ammeterId], voltage: 0 },
        { id: n4, position: { x: amPos.x + 30, y: amPos.y }, connections: [ammeterId], voltage: 0 },
        { id: n5, position: { x: resPos.x - 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
        { id: n6, position: { x: resPos.x + 30, y: resPos.y }, connections: [resistorId], voltage: 0 },
        { id: n7, position: { x: volPos.x - 30, y: volPos.y }, connections: [voltmeterId], voltage: 0 },
        { id: n8, position: { x: volPos.x + 30, y: volPos.y }, connections: [voltmeterId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 },
        { from: n5, to: n7, current: 0 }, // Voltmeter parallel start
        { from: n6, to: n8, current: 0 }, // Voltmeter parallel end
        { from: n6, to: n2, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Đo dòng điện và điện áp","description":"Cách mắc Ampe kế (nối tiếp) và Vôn kế (song song) để đo thông số mạch.","principle":"Ampe kế có điện trở rất nhỏ, mắc nối tiếp để đo dòng. Vôn kế có điện trở rất lớn, mắc song song để đo áp.","application":"Đồng hồ vạn năng (VOM), giám sát hệ thống điện."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch phân áp (Voltage Divider)',
    description: 'Mạch chia điện áp nguồn thành điện áp nhỏ hơn bằng hai điện trở nối tiếp.',
    principle: 'Điện áp đầu ra Vout = Vin * (R2 / (R1 + R2)).',
    application: 'Cảm biến (quang trở, nhiệt điện trở), điều chỉnh bias cho transistor.',
    create: () => {
      const batteryId = uuidv4();
      const r1Id = uuidv4();
      const r2Id = uuidv4();
      const voltmeterId = uuidv4();
      
      const batPos = { x: 100, y: 300 };
      const r1Pos = { x: 300, y: 200 };
      const r2Pos = { x: 300, y: 400 };
      const volPos = { x: 500, y: 400 };

      const n1 = uuidv4(); const n2 = uuidv4();
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: r1Id, type: 'resistor', position: r1Pos, rotation: 90, value: 1000, nodes: [n3, n4], current: 0, voltageDrop: 0 },
        { id: r2Id, type: 'resistor', position: r2Pos, rotation: 90, value: 1000, nodes: [n5, n6], current: 0, voltageDrop: 0 },
        { id: voltmeterId, type: 'voltmeter', position: volPos, rotation: 90, value: 0, nodes: [n7, n8], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: n1, position: { x: batPos.x - 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n2, position: { x: batPos.x + 30, y: batPos.y }, connections: [batteryId], voltage: 0 },
        { id: n3, position: { x: r1Pos.x, y: r1Pos.y - 30 }, connections: [r1Id], voltage: 0 },
        { id: n4, position: { x: r1Pos.x, y: r1Pos.y + 30 }, connections: [r1Id], voltage: 0 },
        { id: n5, position: { x: r2Pos.x, y: r2Pos.y - 30 }, connections: [r2Id], voltage: 0 },
        { id: n6, position: { x: r2Pos.x, y: r2Pos.y + 30 }, connections: [r2Id], voltage: 0 },
        { id: n7, position: { x: volPos.x, y: volPos.y - 30 }, connections: [voltmeterId], voltage: 0 },
        { id: n8, position: { x: volPos.x, y: volPos.y + 30 }, connections: [voltmeterId], voltage: 0 },
      ];

      const wires = [
        { from: n1, to: n3, current: 0 },
        { from: n4, to: n5, current: 0 }, // Midpoint
        { from: n5, to: n7, current: 0 }, // To Voltmeter +
        { from: n6, to: n8, current: 0 }, // To Voltmeter -
        { from: n6, to: n2, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Mạch phân áp (Voltage Divider)","description":"Mạch chia điện áp nguồn thành điện áp nhỏ hơn bằng hai điện trở nối tiếp.","principle":"Điện áp đầu ra Vout = Vin * (R2 / (R1 + R2)).","application":"Cảm biến (quang trở, nhiệt điện trở), điều chỉnh bias cho transistor."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Điều chỉnh độ sáng (Dimmer)',
    description: 'Mạch sử dụng biến trở để điều chỉnh độ sáng bóng đèn.',
    principle: 'Biến trở thay đổi điện trở của mạch, từ đó thay đổi dòng điện chạy qua đèn, làm thay đổi độ sáng.',
    application: 'Đèn ngủ, điều chỉnh tốc độ quạt, volume âm thanh.',
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
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n5, n6], current: 0, voltageDrop: 0 },
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Điều chỉnh độ sáng (Dimmer)","description":"Mạch sử dụng biến trở để điều chỉnh độ sáng bóng đèn.","principle":"Biến trở thay đổi điện trở của mạch, từ đó thay đổi dòng điện chạy qua đèn, làm thay đổi độ sáng.","application":"Đèn ngủ, điều chỉnh tốc độ quạt, volume âm thanh."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
];

export const COMPLEX_EXAMPLES: CircuitExample[] = [
  {
    name: 'Cổng Logic OR (Dùng công tắc)',
    description: 'Mạch thực hiện chức năng logic OR: Đèn sáng khi ít nhất một công tắc đóng.',
    principle: 'Hai công tắc mắc song song. Dòng điện có thể đi qua nhánh này hoặc nhánh kia để đến đèn.',
    application: 'Hệ thống báo động, đèn cầu thang đơn giản.',
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
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n7, n8], current: 0, voltageDrop: 0 },
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
        { from: n3, to: n5, current: 0 },
        { from: n4, to: n7, current: 0 },
        { from: n6, to: n7, current: 0 },
        { from: n8, to: n2, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Cổng Logic OR (Dùng công tắc)","description":"Mạch thực hiện chức năng logic OR: Đèn sáng khi ít nhất một công tắc đóng.","principle":"Hai công tắc mắc song song. Dòng điện có thể đi qua nhánh này hoặc nhánh kia để đến đèn.","application":"Hệ thống báo động, đèn cầu thang đơn giản."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Cổng Logic AND (Dùng công tắc)',
    description: 'Mạch thực hiện chức năng logic AND: Đèn chỉ sáng khi cả hai công tắc đều đóng.',
    principle: 'Hai công tắc mắc nối tiếp. Dòng điện chỉ chạy qua khi cả hai cầu nối đều liền mạch.',
    application: 'Hệ thống an toàn (cần nhấn 2 nút để kích hoạt), máy cắt công nghiệp.',
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
      const n3 = uuidv4(); const n4 = uuidv4();
      const n5 = uuidv4(); const n6 = uuidv4();
      const n7 = uuidv4(); const n8 = uuidv4();

      const components: Component[] = [
        { id: batteryId, type: 'battery', position: batPos, rotation: 0, value: 12, nodes: [n1, n2], current: 0, voltageDrop: 0 },
        { id: sw1Id, type: 'switch', position: sw1Pos, rotation: 0, value: 0, nodes: [n3, n4], current: 0, voltageDrop: 0, isOpen: true },
        { id: sw2Id, type: 'switch', position: sw2Pos, rotation: 0, value: 0, nodes: [n5, n6], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n7, n8], current: 0, voltageDrop: 0 },
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Cổng Logic AND (Dùng công tắc)","description":"Mạch thực hiện chức năng logic AND: Đèn chỉ sáng khi cả hai công tắc đều đóng.","principle":"Hai công tắc mắc nối tiếp. Dòng điện chỉ chạy qua khi cả hai cầu nối đều liền mạch.","application":"Hệ thống an toàn (cần nhấn 2 nút để kích hoạt), máy cắt công nghiệp."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Cầu Wheatstone',
    description: 'Mạch cầu dùng để đo chính xác giá trị điện trở chưa biết.',
    principle: 'Khi cầu cân bằng (dòng qua Ampe kế = 0), tỉ số các điện trở đối diện bằng nhau: R1/R3 = R2/Rx.',
    application: 'Cân điện tử, cảm biến áp suất (load cell), đo nhiệt độ chính xác.',
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Cầu Wheatstone","description":"Mạch cầu dùng để đo chính xác giá trị điện trở chưa biết.","principle":"Khi cầu cân bằng (dòng qua Ampe kế = 0), tỉ số các điện trở đối diện bằng nhau: R1/R3 = R2/Rx.","application":"Cân điện tử, cảm biến áp suất (load cell), đo nhiệt độ chính xác."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Cầu thang (2 công tắc 3 cực)',
    description: 'Mạch điều khiển một đèn từ hai vị trí khác nhau.',
    principle: 'Sử dụng hai công tắc 3 cực (SPDT) nối với nhau. Thay đổi trạng thái bất kỳ công tắc nào cũng sẽ đảo trạng thái đèn.',
    application: 'Đèn cầu thang, đèn hành lang dài.',
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
        { id: lampId, type: 'lamp', position: lampPos, rotation: 0, value: 100, nodes: [n9, n10], current: 0, voltageDrop: 0 },
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Cầu thang (2 công tắc 3 cực)","description":"Mạch điều khiển một đèn từ hai vị trí khác nhau.","principle":"Sử dụng hai công tắc 3 cực (SPDT) nối với nhau. Thay đổi trạng thái bất kỳ công tắc nào cũng sẽ đảo trạng thái đèn.","application":"Đèn cầu thang, đèn hành lang dài."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Transistor làm công tắc',
    description: 'Sử dụng Transistor NPN như một công tắc điện tử để điều khiển đèn LED.',
    principle: 'Dòng điện nhỏ vào cực B (Base) điều khiển dòng điện lớn đi qua cực C (Collector) và E (Emitter).',
    application: 'Mạch khuếch đại, mạch logic số, điều khiển động cơ.',
    create: () => {
      const batId = uuidv4();
      const swId = uuidv4();
      const rBaseId = uuidv4();
      const npnId = uuidv4();
      const ledId = uuidv4();
      const rLedId = uuidv4();
      const gndId = uuidv4();

      const batPos = { x: 100, y: 300 };
      const swPos = { x: 250, y: 300 };
      const rBasePos = { x: 350, y: 300 };
      const npnPos = { x: 500, y: 300 };
      const ledPos = { x: 500, y: 150 };
      const rLedPos = { x: 500, y: 100 };
      const gndPos = { x: 500, y: 450 };

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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Transistor làm công tắc","description":"Sử dụng Transistor NPN như một công tắc điện tử để điều khiển đèn LED.","principle":"Dòng điện nhỏ vào cực B (Base) điều khiển dòng điện lớn đi qua cực C (Collector) và E (Emitter).","application":"Mạch khuếch đại, mạch logic số, điều khiển động cơ."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Op-Amp Buffer (Voltage Follower)',
    description: 'Mạch khuếch đại thuật toán mắc theo kiểu lặp lại điện áp (Buffer).',
    principle: 'Điện áp đầu ra bằng điện áp đầu vào (Vout = Vin). Trở kháng đầu vào rất lớn, trở kháng đầu ra rất nhỏ.',
    application: 'Cách ly trở kháng giữa các tầng mạch, tránh sụt áp khi tải thay đổi.',
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

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Op-Amp Buffer (Voltage Follower)","description":"Mạch khuếch đại thuật toán mắc theo kiểu lặp lại điện áp (Buffer).","principle":"Điện áp đầu ra bằng điện áp đầu vào (Vout = Vin). Trở kháng đầu vào rất lớn, trở kháng đầu ra rất nhỏ.","application":"Cách ly trở kháng giữa các tầng mạch, tránh sụt áp khi tải thay đổi."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch nạp xả tụ điện (RC Circuit)',
    description: 'Mạch minh họa quá trình nạp và xả điện của tụ điện qua điện trở.',
    principle: 'Tụ điện tích trữ năng lượng dưới dạng điện trường. Thời gian nạp/xả phụ thuộc vào hằng số thời gian τ = R*C.',
    application: 'Mạch định thời, mạch lọc nhiễu, đèn nháy.',
    create: () => {
      const batId = uuidv4();
      const swId = uuidv4(); // SPDT Switch
      const rId = uuidv4();
      const cId = uuidv4();
      const ledId = uuidv4();
      const gndId = uuidv4();

      const batPos = { x: 100, y: 300 };
      const swPos = { x: 250, y: 300 };
      const rPos = { x: 400, y: 300 };
      const cPos = { x: 550, y: 300 };
      const ledPos = { x: 550, y: 450 };
      const gndPos = { x: 400, y: 550 };

      // Nodes
      const nBatP = uuidv4(); const nBatN = uuidv4();
      const nSwCom = uuidv4(); const nSwNO = uuidv4(); const nSwNC = uuidv4();
      const nR1 = uuidv4(); const nR2 = uuidv4();
      const nC1 = uuidv4(); const nC2 = uuidv4();
      const nLedA = uuidv4(); const nLedK = uuidv4();
      const nGnd = uuidv4();

      const components: Component[] = [
        { id: batId, type: 'battery', position: batPos, rotation: 0, value: 9, nodes: [nBatP, nBatN], current: 0, voltageDrop: 0 },
        { id: swId, type: 'spdt_switch', position: swPos, rotation: 0, value: 0, nodes: [nSwCom, nSwNO, nSwNC], current: 0, voltageDrop: 0, isOpen: false }, // Closed to NO (Charge)
        { id: rId, type: 'resistor', position: rPos, rotation: 0, value: 1000, nodes: [nR1, nR2], current: 0, voltageDrop: 0 },
        { id: cId, type: 'capacitor', position: cPos, rotation: 90, value: 0.001, nodes: [nC1, nC2], current: 0, voltageDrop: 0 }, // 1000uF
        { id: ledId, type: 'led', position: ledPos, rotation: 90, value: 10, nodes: [nLedA, nLedK], current: 0, voltageDrop: 0, color: '#00ff00' },
        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [nGnd], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: nBatP, position: { x: batPos.x - 30, y: batPos.y }, connections: [batId], voltage: 0 },
        { id: nBatN, position: { x: batPos.x + 30, y: batPos.y }, connections: [batId], voltage: 0 },
        
        { id: nSwCom, position: { x: swPos.x - 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: nSwNO, position: { x: swPos.x + 30, y: swPos.y - 20 }, connections: [swId], voltage: 0 },
        { id: nSwNC, position: { x: swPos.x + 30, y: swPos.y + 20 }, connections: [swId], voltage: 0 },
        
        { id: nR1, position: { x: rPos.x - 30, y: rPos.y }, connections: [rId], voltage: 0 },
        { id: nR2, position: { x: rPos.x + 30, y: rPos.y }, connections: [rId], voltage: 0 },
        
        { id: nC1, position: { x: cPos.x, y: cPos.y - 30 }, connections: [cId], voltage: 0 },
        { id: nC2, position: { x: cPos.x, y: cPos.y + 30 }, connections: [cId], voltage: 0 },
        
        { id: nLedA, position: { x: ledPos.x, y: ledPos.y - 30 }, connections: [ledId], voltage: 0 },
        { id: nLedK, position: { x: ledPos.x, y: ledPos.y + 30 }, connections: [ledId], voltage: 0 },
        
        { id: nGnd, position: { x: gndPos.x - 20, y: gndPos.y }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        { from: nBatP, to: nSwNO, current: 0 }, // Battery + to Switch NO (Charge)
        { from: nSwCom, to: nR1, current: 0 }, // Switch Common to Resistor
        { from: nR2, to: nC1, current: 0 }, // Resistor to Capacitor +
        { from: nC1, to: nLedA, current: 0 }, // Capacitor + to LED Anode
        { from: nC2, to: nLedK, current: 0 }, // Capacitor - to LED Cathode
        { from: nLedK, to: nGnd, current: 0 }, // LED Cathode to GND
        { from: nBatN, to: nGnd, current: 0 }, // Battery - to GND
        { from: nSwNC, to: nGnd, current: 0 }, // Switch NC to GND (Discharge path)
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Mạch nạp xả tụ điện (RC Circuit)","description":"Mạch minh họa quá trình nạp và xả điện của tụ điện qua điện trở.","principle":"Tụ điện tích trữ năng lượng dưới dạng điện trường. Thời gian nạp/xả phụ thuộc vào hằng số thời gian τ = R*C.","application":"Mạch định thời, mạch lọc nhiễu, đèn nháy."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Mạch tạo xung (Clock Blinky)',
    description: 'Sử dụng nguồn xung (Clock) để làm đèn LED nhấp nháy theo tần số.',
    principle: 'Nguồn xung tạo ra tín hiệu vuông (0V - 5V) thay đổi liên tục theo thời gian, làm LED bật tắt.',
    application: 'Đèn báo trạng thái, mạch đếm thời gian.',
    create: () => {
      const clkId = uuidv4();
      const resId = uuidv4();
      const ledId = uuidv4();
      const gndId = uuidv4();

      const clkPos = { x: 200, y: 300 };
      const resPos = { x: 400, y: 300 };
      const ledPos = { x: 600, y: 300 };
      const gndPos = { x: 400, y: 450 };

      const nClk1 = uuidv4(); const nClk2 = uuidv4();
      const nR1 = uuidv4(); const nR2 = uuidv4();
      const nLedA = uuidv4(); const nLedK = uuidv4();
      const nGnd = uuidv4();

      const components: Component[] = [
        { id: clkId, type: 'clock', position: clkPos, rotation: 0, value: 2, nodes: [nClk1, nClk2], current: 0, voltageDrop: 0 }, // 2Hz
        { id: resId, type: 'resistor', position: resPos, rotation: 0, value: 220, nodes: [nR1, nR2], current: 0, voltageDrop: 0 },
        { id: ledId, type: 'led', position: ledPos, rotation: 0, value: 10, nodes: [nLedA, nLedK], current: 0, voltageDrop: 0, color: '#00ff00' },
        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [nGnd], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: nClk1, position: { x: clkPos.x - 30, y: clkPos.y }, connections: [clkId], voltage: 0 },
        { id: nClk2, position: { x: clkPos.x + 30, y: clkPos.y }, connections: [clkId], voltage: 0 },
        { id: nR1, position: { x: resPos.x - 30, y: resPos.y }, connections: [resId], voltage: 0 },
        { id: nR2, position: { x: resPos.x + 30, y: resPos.y }, connections: [resId], voltage: 0 },
        { id: nLedA, position: { x: ledPos.x - 30, y: ledPos.y }, connections: [ledId], voltage: 0 },
        { id: nLedK, position: { x: ledPos.x + 30, y: ledPos.y }, connections: [ledId], voltage: 0 },
        { id: nGnd, position: { x: gndPos.x - 20, y: gndPos.y }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        { from: nClk1, to: nR1, current: 0 },
        { from: nR2, to: nLedA, current: 0 },
        { from: nLedK, to: nGnd, current: 0 },
        { from: nClk2, to: nGnd, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Mạch tạo xung (Clock Blinky)","description":"Sử dụng nguồn xung (Clock) để làm đèn LED nhấp nháy theo tần số.","principle":"Nguồn xung tạo ra tín hiệu vuông (0V - 5V) thay đổi liên tục theo thời gian, làm LED bật tắt.","application":"Đèn báo trạng thái, mạch đếm thời gian."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  }
];

export const EXTREMELY_COMPLEX_EXAMPLES: CircuitExample[] = [
  {
    name: 'Giải mã BCD sang LED 7 đoạn',
    description: 'Sử dụng 4 công tắc để tạo mã BCD (Binary Coded Decimal) và hiển thị số tương ứng trên LED 7 đoạn.',
    principle: 'LED 7 đoạn nhận tín hiệu 4 bit (A, B, C, D) và giải mã để hiển thị các số từ 0 đến F (Hex).',
    application: 'Đồng hồ số, bảng hiển thị, máy tính bỏ túi.',
    create: () => {
      const batId = uuidv4();
      const swAId = uuidv4();
      const swBId = uuidv4();
      const swCId = uuidv4();
      const swDId = uuidv4();
      const dispId = uuidv4();
      const gndId = uuidv4();

      const batPos = { x: 100, y: 300 };
      const swAPos = { x: 300, y: 150 };
      const swBPos = { x: 300, y: 250 };
      const swCPos = { x: 300, y: 350 };
      const swDPos = { x: 300, y: 450 };
      const dispPos = { x: 600, y: 300 };
      const gndPos = { x: 600, y: 450 };

      const nBatP = uuidv4(); const nBatN = uuidv4();
      const nSwA1 = uuidv4(); const nSwA2 = uuidv4();
      const nSwB1 = uuidv4(); const nSwB2 = uuidv4();
      const nSwC1 = uuidv4(); const nSwC2 = uuidv4();
      const nSwD1 = uuidv4(); const nSwD2 = uuidv4();
      const nDispA = uuidv4(); const nDispB = uuidv4(); const nDispC = uuidv4(); const nDispD = uuidv4(); const nDispCom = uuidv4();
      const nGnd = uuidv4();

      const components: Component[] = [
        { id: batId, type: 'battery', position: batPos, rotation: 0, value: 5, nodes: [nBatP, nBatN], current: 0, voltageDrop: 0 },
        { id: swAId, type: 'switch', position: swAPos, rotation: 0, value: 0, nodes: [nSwA1, nSwA2], current: 0, voltageDrop: 0, isOpen: true, text: 'Bit A (1)' },
        { id: swBId, type: 'switch', position: swBPos, rotation: 0, value: 0, nodes: [nSwB1, nSwB2], current: 0, voltageDrop: 0, isOpen: true, text: 'Bit B (2)' },
        { id: swCId, type: 'switch', position: swCPos, rotation: 0, value: 0, nodes: [nSwC1, nSwC2], current: 0, voltageDrop: 0, isOpen: true, text: 'Bit C (4)' },
        { id: swDId, type: 'switch', position: swDPos, rotation: 0, value: 0, nodes: [nSwD1, nSwD2], current: 0, voltageDrop: 0, isOpen: true, text: 'Bit D (8)' },
        { id: dispId, type: 'seven_segment', position: dispPos, rotation: 0, value: 0, nodes: [nDispA, nDispB, nDispC, nDispD, nDispCom], current: 0, voltageDrop: 0 },
        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [nGnd], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: nBatP, position: { x: batPos.x - 30, y: batPos.y }, connections: [batId], voltage: 0 },
        { id: nBatN, position: { x: batPos.x + 30, y: batPos.y }, connections: [batId], voltage: 0 },
        
        { id: nSwA1, position: { x: swAPos.x - 30, y: swAPos.y }, connections: [swAId], voltage: 0 },
        { id: nSwA2, position: { x: swAPos.x + 30, y: swAPos.y }, connections: [swAId], voltage: 0 },
        
        { id: nSwB1, position: { x: swBPos.x - 30, y: swBPos.y }, connections: [swBId], voltage: 0 },
        { id: nSwB2, position: { x: swBPos.x + 30, y: swBPos.y }, connections: [swBId], voltage: 0 },
        
        { id: nSwC1, position: { x: swCPos.x - 30, y: swCPos.y }, connections: [swCId], voltage: 0 },
        { id: nSwC2, position: { x: swCPos.x + 30, y: swCPos.y }, connections: [swCId], voltage: 0 },
        
        { id: nSwD1, position: { x: swDPos.x - 30, y: swDPos.y }, connections: [swDId], voltage: 0 },
        { id: nSwD2, position: { x: swDPos.x + 30, y: swDPos.y }, connections: [swDId], voltage: 0 },
        
        // Display Nodes (manually positioned based on addComponent logic)
        { id: nDispA, position: { x: dispPos.x - 30, y: dispPos.y - 15 }, connections: [dispId], voltage: 0 },
        { id: nDispB, position: { x: dispPos.x - 30, y: dispPos.y - 5 }, connections: [dispId], voltage: 0 },
        { id: nDispC, position: { x: dispPos.x - 30, y: dispPos.y + 5 }, connections: [dispId], voltage: 0 },
        { id: nDispD, position: { x: dispPos.x - 30, y: dispPos.y + 15 }, connections: [dispId], voltage: 0 },
        { id: nDispCom, position: { x: dispPos.x, y: dispPos.y + 30 }, connections: [dispId], voltage: 0 },
        
        { id: nGnd, position: { x: gndPos.x - 20, y: gndPos.y }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        // Power to Switches
        { from: nBatP, to: nSwA1, current: 0 },
        { from: nSwA1, to: nSwB1, current: 0 },
        { from: nSwB1, to: nSwC1, current: 0 },
        { from: nSwC1, to: nSwD1, current: 0 },
        
        // Switches to Display Inputs
        { from: nSwA2, to: nDispA, current: 0 },
        { from: nSwB2, to: nDispB, current: 0 },
        { from: nSwC2, to: nDispC, current: 0 },
        { from: nSwD2, to: nDispD, current: 0 },
        
        // Display Common to GND
        { from: nDispCom, to: nGnd, current: 0 },
        
        // Battery Return to GND
        { from: nBatN, to: nGnd, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: false, timeSpeed: 1 }, currentExample: {"name":"Giải mã BCD sang LED 7 đoạn","description":"Sử dụng 4 công tắc để tạo mã BCD (Binary Coded Decimal) và hiển thị số tương ứng trên LED 7 đoạn.","principle":"LED 7 đoạn nhận tín hiệu 4 bit (A, B, C, D) và giải mã để hiển thị các số từ 0 đến F (Hex).","application":"Đồng hồ số, bảng hiển thị, máy tính bỏ túi."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  },
  {
    name: 'Hệ thống Năng lượng Xanh',
    description: 'Mạch kết hợp Pin mặt trời và Tuabin gió để sạc pin và cấp điện cho tải.',
    principle: 'Nhiều nguồn năng lượng tái tạo có thể mắc song song (qua diode bảo vệ) để cùng cung cấp điện cho hệ thống.',
    application: 'Hệ thống điện độc lập (Off-grid), trạm sạc năng lượng mặt trời/gió.',
    create: () => {
      const solarId = uuidv4();
      const windId = uuidv4();
      const diode1Id = uuidv4();
      const diode2Id = uuidv4();
      const batId = uuidv4();
      const swId = uuidv4();
      const lampId = uuidv4();
      const gndId = uuidv4();

      const solarPos = { x: 100, y: 150 };
      const windPos = { x: 100, y: 350 };
      const d1Pos = { x: 250, y: 150 };
      const d2Pos = { x: 250, y: 350 };
      const batPos = { x: 400, y: 250 };
      const swPos = { x: 550, y: 150 };
      const lampPos = { x: 700, y: 250 };
      const gndPos = { x: 400, y: 450 };

      const nSolP = uuidv4(); const nSolN = uuidv4();
      const nWinP = uuidv4(); const nWinN = uuidv4();
      const nD1A = uuidv4(); const nD1K = uuidv4();
      const nD2A = uuidv4(); const nD2K = uuidv4();
      const nBatP = uuidv4(); const nBatN = uuidv4();
      const nSw1 = uuidv4(); const nSw2 = uuidv4();
      const nLamp1 = uuidv4(); const nLamp2 = uuidv4();
      const nGnd = uuidv4();

      const components: Component[] = [
        { id: solarId, type: 'solar_panel', position: solarPos, rotation: 0, value: 12, nodes: [nSolP, nSolN], current: 0, voltageDrop: 0 },
        { id: windId, type: 'wind_turbine', position: windPos, rotation: 0, value: 12, nodes: [nWinP, nWinN], current: 0, voltageDrop: 0 },
        { id: diode1Id, type: 'diode', position: d1Pos, rotation: 0, value: 0.7, nodes: [nD1A, nD1K], current: 0, voltageDrop: 0 },
        { id: diode2Id, type: 'diode', position: d2Pos, rotation: 0, value: 0.7, nodes: [nD2A, nD2K], current: 0, voltageDrop: 0 },
        { id: batId, type: 'battery', position: batPos, rotation: 90, value: 12, nodes: [nBatP, nBatN], current: 0, voltageDrop: 0 },
        { id: swId, type: 'switch', position: swPos, rotation: 0, value: 0, nodes: [nSw1, nSw2], current: 0, voltageDrop: 0, isOpen: true },
        { id: lampId, type: 'lamp', position: lampPos, rotation: 90, value: 100, nodes: [nLamp1, nLamp2], current: 0, voltageDrop: 0 },
        { id: gndId, type: 'ground', position: gndPos, rotation: 0, value: 0, nodes: [nGnd], current: 0, voltageDrop: 0 },
      ];

      const nodes: Node[] = [
        { id: nSolP, position: { x: solarPos.x + 30, y: solarPos.y - 10 }, connections: [solarId], voltage: 0 },
        { id: nSolN, position: { x: solarPos.x + 30, y: solarPos.y + 10 }, connections: [solarId], voltage: 0 },
        { id: nWinP, position: { x: windPos.x + 30, y: windPos.y - 10 }, connections: [windId], voltage: 0 },
        { id: nWinN, position: { x: windPos.x + 30, y: windPos.y + 10 }, connections: [windId], voltage: 0 },
        { id: nD1A, position: { x: d1Pos.x - 30, y: d1Pos.y }, connections: [diode1Id], voltage: 0 },
        { id: nD1K, position: { x: d1Pos.x + 30, y: d1Pos.y }, connections: [diode1Id], voltage: 0 },
        { id: nD2A, position: { x: d2Pos.x - 30, y: d2Pos.y }, connections: [diode2Id], voltage: 0 },
        { id: nD2K, position: { x: d2Pos.x + 30, y: d2Pos.y }, connections: [diode2Id], voltage: 0 },
        { id: nBatP, position: { x: batPos.x, y: batPos.y - 30 }, connections: [batId], voltage: 0 },
        { id: nBatN, position: { x: batPos.x, y: batPos.y + 30 }, connections: [batId], voltage: 0 },
        { id: nSw1, position: { x: swPos.x - 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: nSw2, position: { x: swPos.x + 30, y: swPos.y }, connections: [swId], voltage: 0 },
        { id: nLamp1, position: { x: lampPos.x, y: lampPos.y - 30 }, connections: [lampId], voltage: 0 },
        { id: nLamp2, position: { x: lampPos.x, y: lampPos.y + 30 }, connections: [lampId], voltage: 0 },
        { id: nGnd, position: { x: gndPos.x - 20, y: gndPos.y }, connections: [gndId], voltage: 0 },
      ];

      const wires = [
        { from: nSolP, to: nD1A, current: 0 },
        { from: nWinP, to: nD2A, current: 0 },
        { from: nD1K, to: nBatP, current: 0 },
        { from: nD2K, to: nBatP, current: 0 },
        { from: nBatP, to: nSw1, current: 0 },
        { from: nSw2, to: nLamp1, current: 0 },
        { from: nLamp2, to: nGnd, current: 0 },
        { from: nBatN, to: nGnd, current: 0 },
        { from: nSolN, to: nGnd, current: 0 },
        { from: nWinN, to: nGnd, current: 0 },
      ];

      const state: CircuitState = { components, nodes, wires, simulationRunning: true, time: 0, scale: 1, offset: { x: 0, y: 0 }, evaluationResult: null, levelProgress: {}, environment: { timeOfDay: 12, weather: 'sunny', temperature: 25, windSpeed: 5, isSimulationEnabled: true, timeSpeed: 1 }, currentExample: {"name":"Hệ thống Năng lượng Xanh","description":"Mạch kết hợp Pin mặt trời và Tuabin gió để sạc pin và cấp điện cho tải.","principle":"Nhiều nguồn năng lượng tái tạo có thể mắc song song (qua diode bảo vệ) để cùng cung cấp điện cho hệ thống.","application":"Hệ thống điện độc lập (Off-grid), trạm sạc năng lượng mặt trời/gió."} };
      const solved = solveCircuit(state);
      return { ...state, nodes: solved.nodes, components: solved.components, wires: solved.wires };
    }
  }
];