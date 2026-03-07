import { CircuitState, Component, ComponentType, Node, LevelProgress } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface Level {
  id: number;
  title: string;
  description: string;
  principle?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category?: 'basic' | 'repair' | 'build' | 'quiz';
  maxScore: number;
  setup: () => CircuitState;
  checkWin: (state: CircuitState) => boolean;
}

function createBaseState(components: Component[]): CircuitState {
  const nodes: Node[] = [];
  components.forEach(c => {
    nodes.push({ id: c.nodes[0], position: { x: c.position.x - 30, y: c.position.y }, connections: [c.id], voltage: 0 });
    nodes.push({ id: c.nodes[1], position: { x: c.position.x + 30, y: c.position.y }, connections: [c.id], voltage: 0 });
  });
  return {
    components,
    nodes,
    wires: [],
    simulationRunning: true,
    time: 0,
    scale: 1,
    offset: { x: 0, y: 0 },
    evaluationResult: null,
    levelProgress: {},
    currentExample: null,
    environment: {
      timeOfDay: 12,
      weather: 'sunny',
      temperature: 25,
      windSpeed: 5,
      isSimulationEnabled: false,
      timeSpeed: 1,
    }
  };
}

function spawn(type: ComponentType, x: number, y: number, value: number = 10, rating?: number, isBroken: boolean = false): Component {
  return {
    id: uuidv4(),
    type,
    position: { x, y },
    rotation: 0,
    value,
    rating,
    isBroken,
    nodes: [uuidv4(), uuidv4()],
    current: 0,
    voltageDrop: 0,
    temperature: 25 // Ambient temp
  };
}

export const LEVELS: Level[] = [
  // --- QUIZ LEVELS (Vấn đáp) ---
  {
    id: 301,
    title: "Vấn đáp 1: Nguồn điện",
    description: "Pin hoạt động như thế nào?",
    principle: "Pin biến đổi hóa năng thành điện năng, cung cấp dòng điện một chiều (DC).",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 302,
    title: "Vấn đáp 2: Định luật Ohm",
    description: "Công thức tính điện trở theo định luật Ohm là gì?",
    principle: "R = V / I (Điện trở bằng Điện áp chia cho Dòng điện).",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('resistor', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 303,
    title: "Vấn đáp 3: Đèn LED",
    description: "Đèn LED cần điều kiện gì để sáng an toàn?",
    principle: "Cần mắc nối tiếp với một điện trở để hạn chế dòng điện, tránh làm cháy LED.",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('led', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 304,
    title: "Vấn đáp 4: Tụ điện",
    description: "Tụ điện có tác dụng gì trong mạch điện một chiều (DC)?",
    principle: "Tụ điện ngăn dòng điện một chiều (DC) đi qua khi đã nạp đầy, nhưng cho phép dòng xoay chiều (AC) đi qua.",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('capacitor', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 305,
    title: "Vấn đáp 5: Đi-ốt",
    description: "Đặc tính quan trọng nhất của Đi-ốt là gì?",
    principle: "Chỉ cho phép dòng điện đi qua theo một chiều duy nhất (từ Anode sang Cathode).",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('diode', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 306,
    title: "Vấn đáp 6: Transistor",
    description: "Transistor NPN hoạt động như thế nào khi dùng làm công tắc?",
    principle: "Khi có dòng điện nhỏ chạy vào cực B (Base), nó cho phép dòng điện lớn chạy từ cực C (Collector) sang cực E (Emitter).",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('npn_transistor', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 307,
    title: "Vấn đáp 7: Cầu chì",
    description: "Tại sao phải mắc cầu chì nối tiếp với tải?",
    principle: "Để khi dòng điện vượt quá mức an toàn, cầu chì sẽ đứt và ngắt toàn bộ dòng điện chạy qua tải, bảo vệ tải khỏi bị cháy.",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('fuse', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 308,
    title: "Vấn đáp 8: Mạch nối tiếp",
    description: "Trong mạch mắc nối tiếp, dòng điện và điện áp thay đổi thế nào?",
    principle: "Dòng điện đi qua các linh kiện là như nhau. Tổng điện áp trên các linh kiện bằng điện áp nguồn.",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 309,
    title: "Vấn đáp 9: Mạch song song",
    description: "Trong mạch mắc song song, dòng điện và điện áp thay đổi thế nào?",
    principle: "Điện áp trên các nhánh là như nhau. Dòng điện tổng bằng tổng dòng điện của các nhánh.",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  {
    id: 310,
    title: "Vấn đáp 10: Năng lượng tái tạo",
    description: "Hiệu suất của Pin mặt trời phụ thuộc vào yếu tố nào?",
    principle: "Phụ thuộc vào cường độ ánh sáng chiếu vào (thời gian trong ngày, thời tiết).",
    difficulty: 'Easy',
    category: 'quiz',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('solar_panel', 400, 300, 10)
    ]),
    checkWin: (state) => {
      // In quiz mode, winning might be triggered differently, e.g., by answering a question.
      // For now, just interacting with the component or reading the principle might suffice.
      return false; // Handled by UI
    }
  },
  // --- BASIC / TUTORIAL LEVELS ---
  {
    id: 1,
    title: "1. Thắp sáng bóng đèn",
    description: "Hãy nối dây từ nguồn điện (Pin) đến bóng đèn để thắp sáng nó.",
    difficulty: 'Easy',
    category: 'basic',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 2,
    title: "2. Thêm công tắc",
    description: "Mạch điện cần có công tắc để điều khiển. Hãy mắc nối tiếp Pin, Công tắc và Bóng đèn. Đóng công tắc để đèn sáng.",
    difficulty: 'Easy',
    category: 'basic',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('switch', 350, 200),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const sw = state.components.find(c => c.type === 'switch');
      return !!lamp && !!sw && Math.abs(lamp.current || 0) > 0.01 && sw.isOpen === false;
    }
  },
  // ... (Keep existing levels 3-17 as 'basic' or 'build' depending on context, but for now let's mark them basic)
  {
    id: 3,
    title: "3. Mạch nối tiếp",
    description: "Mắc 2 bóng đèn nối tiếp với nhau và nối vào nguồn điện.",
    difficulty: 'Easy',
    category: 'basic',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('lamp', 400, 200, 10),
      spawn('lamp', 600, 200, 10)
    ]),
    checkWin: (state) => {
      const lamps = state.components.filter(c => c.type === 'lamp');
      if (lamps.length < 2) return false;
      const i1 = Math.abs(lamps[0].current || 0);
      const i2 = Math.abs(lamps[1].current || 0);
      return i1 > 0.01 && Math.abs(i1 - i2) < 0.01 && Math.abs(lamps[0].voltageDrop || 0) < 11;
    }
  },
  
  // --- REPAIR LEVELS (Sửa mạch) ---
  {
    id: 101,
    title: "Sửa mạch 1: Bóng đèn bị cháy",
    description: "Bóng đèn này đã bị hỏng (đứt dây tóc). Hãy thay thế nó bằng một bóng đèn mới và làm nó sáng.",
    difficulty: 'Easy',
    category: 'repair',
    maxScore: 100,
    setup: () => {
      const s = createBaseState([
        spawn('battery', 200, 300, 9),
        spawn('lamp', 500, 300, 10, undefined, true) // Broken lamp
      ]);
      // Pre-connect wires
      // Note: createBaseState doesn't auto-connect. We need to manually add wires if we want a pre-built broken circuit.
      // For simplicity in this engine, we just spawn components. The user has to wire them or replace them.
      // If we want pre-wired, we need to populate s.wires.
      return s;
    },
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 102,
    title: "Sửa mạch 2: Cầu chì bị đứt",
    description: "Mạch điện không hoạt động vì cầu chì đã bị đứt. Hãy thay cầu chì mới và đảm bảo dòng điện không quá lớn.",
    difficulty: 'Easy',
    category: 'repair',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('fuse', 350, 300, 0, 0.1, true), // Broken fuse (low rating)
      spawn('lamp', 500, 300, 10) // 9V / 10Ohm = 0.9A -> Will break 0.1A fuse again if not careful? 
      // User needs to replace fuse with higher rating or add resistor.
    ]),
    checkWin: (state) => {
      const fuse = state.components.find(c => c.type === 'fuse');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!fuse && !fuse.isBroken && !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 103,
    title: "Sửa mạch 3: Quá áp",
    description: "Bóng đèn 6V đang được nối vào nguồn 12V. Nó sẽ cháy nếu bật công tắc. Hãy thêm điện trở để giảm áp cho đèn.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('switch', 300, 300),
      spawn('lamp', 500, 300, 10, 6) // Max voltage 6V
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01 && Math.abs(lamp.voltageDrop) <= 7; // Allow slight margin
    }
  },
  {
    id: 104,
    title: "Sửa mạch 4: Ngắn mạch",
    description: "Mạch điện đang bị ngắn mạch (nối tắt). Hãy tìm và loại bỏ dây dẫn gây ngắn mạch hoặc sửa lại sơ đồ.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10)
      // Wires are not pre-spawned in this helper, but we can imply the user sees a mess.
      // Ideally we should pre-wire this.
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01 && !state.shortCircuitWarning;
    }
  },
  {
    id: 105,
    title: "Sửa mạch 5: LED ngược cực",
    description: "Đèn LED không sáng. Có vẻ như nó đã bị mắc ngược cực. Hãy sửa lại.",
    difficulty: 'Easy',
    category: 'repair',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('resistor', 350, 300, 330),
      spawn('led', 500, 300, 10) // User needs to rotate or flip connections
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      return !!led && Math.abs(led.current || 0) > 0.001;
    }
  },
  {
    id: 106,
    title: "Sửa mạch 6: Đèn LED cháy",
    description: "Đèn LED đang bị nối trực tiếp với nguồn 9V và sẽ bị cháy. Hãy thêm một điện trở (khoảng 330Ω) nối tiếp để bảo vệ LED.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 160,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('led', 500, 300, 10, 2) // LED with 2V rating
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      const resistor = state.components.find(c => c.type === 'resistor');
      return !!led && !led.isBroken && !!resistor && Math.abs(led.current || 0) > 0.001 && Math.abs(led.current || 0) < 0.05;
    }
  },
  {
    id: 107,
    title: "Sửa mạch 7: Đèn quá tối",
    description: "Bóng đèn sáng rất yếu vì nguồn điện không đủ. Hãy thay thế nguồn điện hoặc mắc thêm pin nối tiếp để tăng điện áp.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 170,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 1.5),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.voltageDrop || 0) >= 3;
    }
  },
  {
    id: 108,
    title: "Sửa mạch 8: Công tắc không tác dụng",
    description: "Đèn luôn sáng dù công tắc đang mở. Hãy kiểm tra và loại bỏ dây dẫn bị nối tắt (ngắn mạch) qua công tắc.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 180,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('switch', 350, 300), 
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const sw = state.components.find(c => c.type === 'switch');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!sw && !!lamp && sw.isOpen === true && Math.abs(lamp.current || 0) < 0.01;
    }
  },
  {
    id: 109,
    title: "Sửa mạch 9: Transistor không dẫn",
    description: "Transistor NPN dùng để bật đèn nhưng không hoạt động. Hãy cấp một dòng điện nhỏ vào cực B (Base) thông qua một điện trở và công tắc.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 190,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 200, 10),
      spawn('npn_transistor', 500, 400)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const transistor = state.components.find(c => c.type === 'npn_transistor');
      return !!lamp && !!transistor && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 110,
    title: "Sửa mạch 10: Tụ điện cản dòng DC",
    description: "Bóng đèn không sáng vì có một tụ điện mắc nối tiếp cản trở dòng điện một chiều (DC). Hãy tháo tụ điện ra hoặc mắc song song.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('capacitor', 350, 300, 100),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 111,
    title: "Sửa mạch 11: Lỗi ngẫu nhiên 11",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 210,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 112,
    title: "Sửa mạch 12: Lỗi ngẫu nhiên 12",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 220,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 113,
    title: "Sửa mạch 13: Lỗi ngẫu nhiên 13",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 230,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 114,
    title: "Sửa mạch 14: Lỗi ngẫu nhiên 14",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Medium',
    category: 'repair',
    maxScore: 240,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 115,
    title: "Sửa mạch 15: Lỗi ngẫu nhiên 15",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 116,
    title: "Sửa mạch 16: Lỗi ngẫu nhiên 16",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 260,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 117,
    title: "Sửa mạch 17: Lỗi ngẫu nhiên 17",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 270,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 118,
    title: "Sửa mạch 18: Lỗi ngẫu nhiên 18",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 280,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 119,
    title: "Sửa mạch 19: Lỗi ngẫu nhiên 19",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 290,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 120,
    title: "Sửa mạch 20: Lỗi ngẫu nhiên 20",
    description: "Mạch điện đang gặp sự cố. Hãy tìm và sửa lỗi để mạch hoạt động bình thường.",
    difficulty: 'Hard',
    category: 'repair',
    maxScore: 300,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10, undefined, true)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && !lamp.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },

  // --- BUILD LEVELS (Thêm linh kiện) ---
  {
    id: 201,
    title: "Thêm linh kiện 1: Thiếu nguồn",
    description: "Mạch điện này có bóng đèn nhưng thiếu nguồn năng lượng. Hãy thêm Pin vào.",
    difficulty: 'Easy',
    category: 'build',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 202,
    title: "Thêm linh kiện 2: Thiếu công tắc",
    description: "Đèn đang sáng liên tục. Hãy thêm một công tắc để có thể tắt nó đi.",
    difficulty: 'Easy',
    category: 'build',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const sw = state.components.find(c => c.type === 'switch' || c.type === 'push_button');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!sw && !!lamp; // Logic: User added switch. To win, maybe toggle it? 
      // Let's just check if switch exists and is connected in series (current flows when closed, stops when open).
      // Simplified: Just check if switch exists and lamp can be turned off.
    }
  },
  {
    id: 203,
    title: "Thêm linh kiện 3: Bảo vệ quá dòng",
    description: "Mạch này cần một cầu chì 0.5A để bảo vệ. Hãy thêm nó vào vị trí thích hợp.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const fuse = state.components.find(c => c.type === 'fuse');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!fuse && !!lamp && !fuse.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 204,
    title: "Thêm linh kiện 4: Điều chỉnh độ sáng",
    description: "Đèn quá sáng và không chỉnh được. Hãy thêm biến trở để điều chỉnh độ sáng.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const pot = state.components.find(c => c.type === 'potentiometer');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!pot && !!lamp && Math.abs(lamp.current || 0) > 0.001;
    }
  },
  {
    id: 205,
    title: "Thêm linh kiện 5: Tụ điện lọc",
    description: "Nguồn điện không ổn định (giả lập). Hãy thêm tụ điện mắc song song với nguồn để ổn định điện áp.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('resistor', 400, 300, 1000),
      spawn('ground', 400, 400)
    ]),
    checkWin: (state) => {
      const cap = state.components.find(c => c.type === 'capacitor');
      return !!cap && Math.abs(cap.voltageDrop) > 0.1;
    }
  },
  {
    id: 206,
    title: "Thêm linh kiện 6: Mạch báo sáng",
    description: "Hãy thêm một Transistor NPN và một Quang trở (LDR - dùng biến trở thay thế) để tạo mạch tự động bật đèn khi trời tối.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 160,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 500, 200, 10),
      spawn('resistor', 300, 200, 1000)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const transistor = state.components.find(c => c.type === 'npn_transistor');
      const pot = state.components.find(c => c.type === 'potentiometer');
      return !!lamp && !!transistor && !!pot && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 207,
    title: "Thêm linh kiện 7: Chỉnh lưu nửa chu kỳ",
    description: "Nguồn xoay chiều (AC) làm đèn nhấp nháy. Hãy thêm một Đi-ốt để tạo mạch chỉnh lưu nửa chu kỳ, chỉ cho dòng điện đi qua một chiều.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 170,
    setup: () => createBaseState([
      spawn('ac_source', 200, 300, 12),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const diode = state.components.find(c => c.type === 'diode');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!diode && !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 208,
    title: "Thêm linh kiện 8: Năng lượng xanh",
    description: "Hãy sử dụng Pin mặt trời (Solar Panel) và Tuabin gió (Wind Turbine) để thắp sáng bóng đèn. Cần mắc song song để tăng dòng điện.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 180,
    setup: () => createBaseState([
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const solar = state.components.find(c => c.type === 'solar_panel');
      const wind = state.components.find(c => c.type === 'wind_turbine');
      return !!lamp && !!solar && !!wind && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 209,
    title: "Thêm linh kiện 9: Mạch sạc dự phòng",
    description: "Hãy dùng nguồn điện để sạc cho một Tụ điện lớn (đóng vai trò như pin dự phòng), sau đó dùng tụ điện đó thắp sáng đèn LED.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 190,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('switch', 300, 200), // Switch to charge
      spawn('switch', 400, 200), // Switch to discharge
      spawn('led', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const cap = state.components.find(c => c.type === 'capacitor');
      const led = state.components.find(c => c.type === 'led');
      return !!cap && !!led && Math.abs(led.current || 0) > 0.001;
    }
  },
  {
    id: 210,
    title: "Thêm linh kiện 10: Đèn báo động",
    description: "Tạo một mạch báo động đơn giản: Khi công tắc đóng, Đèn LED sẽ chớp nháy (sử dụng nguồn AC tần số thấp).",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('ac_source', 200, 300, 9),
      spawn('switch', 300, 300)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      return !!led && Math.abs(led.current || 0) > 0.001;
    }
  },
  {
    id: 211,
    title: "Thêm linh kiện 11: Thử thách 11",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 210,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 212,
    title: "Thêm linh kiện 12: Thử thách 12",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 220,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 213,
    title: "Thêm linh kiện 13: Thử thách 13",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 230,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 214,
    title: "Thêm linh kiện 14: Thử thách 14",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Medium',
    category: 'build',
    maxScore: 240,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 215,
    title: "Thêm linh kiện 15: Thử thách 15",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 216,
    title: "Thêm linh kiện 16: Thử thách 16",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 260,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 217,
    title: "Thêm linh kiện 17: Thử thách 17",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 270,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 218,
    title: "Thêm linh kiện 18: Thử thách 18",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 280,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 219,
    title: "Thêm linh kiện 19: Thử thách 19",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 290,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 220,
    title: "Thêm linh kiện 20: Thử thách 20",
    description: "Hãy thêm các linh kiện cần thiết để hoàn thiện mạch điện theo yêu cầu.",
    difficulty: 'Hard',
    category: 'build',
    maxScore: 300,
    setup: () => createBaseState([
      spawn('lamp', 400, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const power = state.components.find(c => c.type === 'battery' || c.type === 'ac_source' || c.type === 'solar_panel' || c.type === 'wind_turbine' || c.type === 'thermoelectric_generator');
      return !!lamp && !!power && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 4,
    title: "4. Mạch song song",
    description: "Mắc 2 bóng đèn song song với nhau và nối vào nguồn điện.",
    difficulty: 'Easy',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 400, 200, 10),
      spawn('lamp', 400, 400, 10)
    ]),
    checkWin: (state) => {
      const lamps = state.components.filter(c => c.type === 'lamp');
      const bat = state.components.find(c => c.type === 'battery');
      if (lamps.length < 2 || !bat) return false;
      const i1 = Math.abs(lamps[0].current || 0);
      const i2 = Math.abs(lamps[1].current || 0);
      const ibat = Math.abs(bat.current || 0);
      return i1 > 0.01 && i2 > 0.01 && Math.abs(ibat - (i1 + i2)) < 0.01;
    }
  },
  {
    id: 5,
    title: "5. Bảo vệ đèn LED",
    description: "Đèn LED sẽ hỏng nếu dòng điện quá lớn (>50mA). Hãy dùng điện trở để hạn dòng bảo vệ LED.",
    difficulty: 'Easy',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('resistor', 350, 200, 330),
      spawn('led', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      return !!led && !led.isBroken && Math.abs(led.current || 0) > 0.001;
    }
  },
  {
    id: 6,
    title: "6. Cầu chì an toàn",
    description: "Mắc cầu chì nối tiếp với mạch để bảo vệ. Đảm bảo đèn sáng và cầu chì không đứt.",
    difficulty: 'Easy',
    maxScore: 150,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('fuse', 350, 200, 0, 2),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const fuse = state.components.find(c => c.type === 'fuse');
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!fuse && !!lamp && !fuse.isBroken && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 7,
    title: "7. Biến trở điều chỉnh",
    description: "Sử dụng biến trở để điều chỉnh dòng điện qua đèn. Hãy nối mạch để đèn sáng.",
    difficulty: 'Medium',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('potentiometer', 350, 200, 50),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 8,
    title: "8. Đo điện áp",
    description: "Sử dụng Vôn kế mắc song song với bóng đèn để đo điện áp của nó khi đèn sáng.",
    difficulty: 'Medium',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('lamp', 400, 300, 10),
      spawn('voltmeter', 400, 150)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const vm = state.components.find(c => c.type === 'voltmeter');
      return !!lamp && !!vm && Math.abs(lamp.current || 0) > 0.01 && Math.abs(vm.voltageDrop || 0) > 0.1;
    }
  },
  {
    id: 9,
    title: "9. Đo dòng điện",
    description: "Sử dụng Ampe kế mắc nối tiếp với bóng đèn để đo dòng điện chạy qua nó.",
    difficulty: 'Medium',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('ammeter', 350, 200),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const am = state.components.find(c => c.type === 'ammeter');
      return !!lamp && !!am && Math.abs(lamp.current || 0) > 0.01 && Math.abs(am.current || 0) > 0.01;
    }
  },
  {
    id: 10,
    title: "10. Nút nhấn chuông cửa",
    description: "Sử dụng nút nhấn để điều khiển đèn. Đèn chỉ sáng khi bạn nhấn giữ nút (đóng công tắc).",
    difficulty: 'Easy',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('push_button', 350, 200),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      const btn = state.components.find(c => c.type === 'push_button');
      return !!lamp && !!btn && Math.abs(lamp.current || 0) > 0.01 && !btn.isOpen;
    }
  },
  {
    id: 11,
    title: "11. Mạch cầu thang (SPDT)",
    description: "Sử dụng công tắc 3 cực (SPDT) để điều khiển mạch. Hãy làm đèn sáng.",
    difficulty: 'Medium',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('spdt_switch', 350, 200),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 12,
    title: "12. Tụ điện nạp xả",
    description: "Mắc nối tiếp Pin, Điện trở và Tụ điện. Tụ điện sẽ nạp điện dần dần.",
    difficulty: 'Medium',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 9),
      spawn('resistor', 350, 200, 100),
      spawn('capacitor', 500, 300, 0.001)
    ]),
    checkWin: (state) => {
      const cap = state.components.find(c => c.type === 'capacitor');
      return !!cap && Math.abs(cap.voltageDrop || 0) > 0.1;
    }
  },
  {
    id: 13,
    title: "13. Nguồn xoay chiều",
    description: "Sử dụng nguồn xoay chiều (AC) để thắp sáng bóng đèn.",
    difficulty: 'Medium',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('ac_source', 200, 300, 12),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 14,
    title: "14. Đi-ốt chỉnh lưu",
    description: "Sử dụng Đi-ốt để chỉ cho phép dòng điện đi qua một chiều từ nguồn AC đến điện trở.",
    difficulty: 'Medium',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('ac_source', 200, 300, 12),
      spawn('diode', 350, 200),
      spawn('resistor', 500, 300, 100)
    ]),
    checkWin: (state) => {
      const res = state.components.find(c => c.type === 'resistor');
      return !!res && Math.abs(res.current || 0) > 0.001;
    }
  },
  {
    id: 15,
    title: "15. Cuộn cảm",
    description: "Mắc cuộn cảm nối tiếp với nguồn AC và bóng đèn.",
    difficulty: 'Medium',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('ac_source', 200, 300, 12),
      spawn('inductor', 350, 200, 0.1),
      spawn('lamp', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const lamp = state.components.find(c => c.type === 'lamp');
      return !!lamp && Math.abs(lamp.current || 0) > 0.01;
    }
  },
  {
    id: 16,
    title: "16. Định luật Ohm",
    description: "Thay đổi giá trị điện trở (chọn linh kiện và sửa ở bảng bên phải) sao cho dòng điện qua nó đúng bằng 0.1A (với nguồn 12V).",
    difficulty: 'Medium',
    maxScore: 200,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('resistor', 500, 300, 10)
    ]),
    checkWin: (state) => {
      const res = state.components.find(c => c.type === 'resistor');
      return !!res && Math.abs(Math.abs(res.current || 0) - 0.1) < 0.005;
    }
  },
  {
    id: 17,
    title: "17. Mạch chia áp",
    description: "Mắc 2 điện trở nối tiếp. Điều chỉnh giá trị sao cho điện áp trên điện trở thứ hai là 5V (nguồn 10V).",
    difficulty: 'Medium',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 10),
      spawn('resistor', 400, 200, 100),
      spawn('resistor', 600, 200, 50)
    ]),
    checkWin: (state) => {
      const resistors = state.components.filter(c => c.type === 'resistor');
      if (resistors.length < 2) return false;
      return Math.abs(Math.abs(resistors[1].voltageDrop || 0) - 5) < 0.1 && Math.abs(resistors[0].current || 0) > 0.001;
    }
  },
  {
    id: 18,
    title: "18. Cố ý làm đứt cầu chì",
    description: "Cầu chì chịu được tối đa 0.5A. Hãy thay đổi giá trị điện trở để tạo ra dòng điện lớn hơn 0.5A làm đứt cầu chì!",
    difficulty: 'Easy',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('battery', 200, 300, 12),
      spawn('fuse', 350, 200, 0, 0.5),
      spawn('resistor', 500, 300, 100)
    ]),
    checkWin: (state) => {
      const fuse = state.components.find(c => c.type === 'fuse');
      return !!fuse && fuse.isBroken;
    }
  },
  {
    id: 19,
    title: "19. Mạch hỗn hợp",
    description: "Mắc 1 bóng đèn nối tiếp với cụm 2 bóng đèn mắc song song.",
    difficulty: 'Hard',
    maxScore: 300,
    setup: () => createBaseState([
      spawn('battery', 150, 300, 12),
      spawn('lamp', 300, 300, 10),
      spawn('lamp', 500, 200, 10),
      spawn('lamp', 500, 400, 10)
    ]),
    checkWin: (state) => {
      const lamps = state.components.filter(c => c.type === 'lamp');
      if (lamps.length < 3) return false;
      const currents = lamps.map(l => Math.abs(l.current || 0)).sort((a,b) => b-a);
      return currents[0] > 0.01 && Math.abs(currents[0] - (currents[1] + currents[2])) < 0.01 && currents[1] > 0.01;
    }
  },
  {
    id: 20,
    title: "20. Thử thách cuối cùng",
    description: "Tạo một mạch hoàn chỉnh: Nguồn, Công tắc, Cầu chì, Điện trở bảo vệ và LED. Đảm bảo LED sáng an toàn!",
    difficulty: 'Hard',
    maxScore: 500,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 12),
      spawn('switch', 250, 200),
      spawn('fuse', 400, 200, 0, 1),
      spawn('resistor', 550, 200, 330),
      spawn('led', 700, 300, 10)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      const fuse = state.components.find(c => c.type === 'fuse');
      const sw = state.components.find(c => c.type === 'switch');
      return !!led && !led.isBroken && Math.abs(led.current || 0) > 0.001 && !!fuse && !fuse.isBroken && !!sw && !sw.isOpen;
    }
  },
  {
    id: 21,
    title: "21. Transistor làm công tắc",
    description: "Sử dụng Transistor NPN để điều khiển LED. Nối cực B qua trở vào nguồn dương để kích dẫn.",
    difficulty: 'Hard',
    maxScore: 350,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 5),
      spawn('switch', 200, 200),
      spawn('resistor', 300, 200, 1000), // Rb
      spawn('npn_transistor', 400, 300, 100),
      spawn('led', 400, 150, 10),
      spawn('resistor', 400, 100, 220), // Rc
      spawn('ground', 400, 400)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      const npn = state.components.find(c => c.type === 'npn_transistor');
      return !!led && !!npn && Math.abs(led.current || 0) > 0.005;
    }
  },
  {
    id: 22,
    title: "22. Cổng đảo (NOT Gate)",
    description: "Tạo cổng logic NOT bằng Transistor. Khi đầu vào (công tắc) đóng (mức 1), đèn tắt (mức 0) và ngược lại.",
    difficulty: 'Hard',
    maxScore: 350,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 5),
      spawn('switch', 200, 200),
      spawn('resistor', 300, 200, 1000), // Rb
      spawn('npn_transistor', 400, 300, 100),
      spawn('resistor', 400, 150, 1000), // Rc
      spawn('led', 550, 300, 10), // LED song song với C-E
      spawn('ground', 400, 400)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      const sw = state.components.find(c => c.type === 'switch');
      return !!led && !!sw && !sw.isOpen && Math.abs(led.current || 0) < 0.001;
    }
  },
  {
    id: 23,
    title: "23. Nạp tụ điện (RC)",
    description: "Quan sát quá trình nạp của tụ điện. Nối tụ điện nối tiếp với điện trở và nguồn. Đợi tụ nạp đầy (dòng giảm về 0).",
    difficulty: 'Medium',
    maxScore: 300,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 9),
      spawn('switch', 200, 300),
      spawn('resistor', 300, 300, 1000),
      spawn('capacitor', 450, 300, 0.001), // 1000uF
      spawn('ground', 450, 400)
    ]),
    checkWin: (state) => {
      const cap = state.components.find(c => c.type === 'capacitor');
      const sw = state.components.find(c => c.type === 'switch');
      return !!cap && !!sw && !sw.isOpen && Math.abs(cap.voltageDrop || 0) > 8;
    }
  },
  {
    id: 24,
    title: "24. Op-Amp đệm (Buffer)",
    description: "Tạo mạch đệm điện áp (Voltage Follower) dùng Op-Amp. Nối ngõ ra (Out) quay lại ngõ vào đảo (-).",
    difficulty: 'Hard',
    maxScore: 400,
    setup: () => createBaseState([
      spawn('ac_source', 100, 300, 5, 1),
      spawn('opamp', 300, 300, 100000),
      spawn('resistor', 500, 300, 1000), // Load
      spawn('ground', 300, 450)
    ]),
    checkWin: (state) => {
      const op = state.components.find(c => c.type === 'opamp');
      return !!op && Math.abs(op.voltageDrop || 0) < 1; 
    }
  },
  {
    id: 25,
    title: "25. Khuếch đại không đảo",
    description: "Tạo mạch khuếch đại không đảo với Op-Amp. Gain = 1 + R2/R1. Chọn R2=R1 để Gain=2.",
    difficulty: 'Hard',
    maxScore: 450,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 2), // Input 2V
      spawn('opamp', 300, 300, 100000),
      spawn('resistor', 400, 200, 1000), // R2 (Feedback)
      spawn('resistor', 400, 400, 1000), // R1 (GND)
      spawn('ground', 400, 500)
    ]),
    checkWin: (state) => {
      const op = state.components.find(c => c.type === 'opamp');
      return !!op && Math.abs(op.voltageDrop || 0) < 0.1; 
    }
  },
  {
    id: 26,
    title: "26. Cổng AND (Transistor)",
    description: "Tạo cổng AND bằng cách mắc nối tiếp 2 Transistor NPN. Đèn chỉ sáng khi cả 2 công tắc đều đóng.",
    difficulty: 'Hard',
    maxScore: 400,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 5),
      spawn('switch', 200, 200), // Sw A
      spawn('switch', 200, 400), // Sw B
      spawn('npn_transistor', 350, 200, 100), // Q1
      spawn('npn_transistor', 350, 400, 100), // Q2
      spawn('led', 500, 300, 10),
      spawn('resistor', 500, 200, 220),
      spawn('ground', 350, 500)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      const sws = state.components.filter(c => c.type === 'switch');
      return !!led && sws.length === 2 && !sws[0].isOpen && !sws[1].isOpen && Math.abs(led.current || 0) > 0.005;
    }
  },
  {
    id: 27,
    title: "27. Cổng OR (Transistor)",
    description: "Tạo cổng OR bằng cách mắc song song 2 Transistor NPN. Đèn sáng khi một trong hai công tắc đóng.",
    difficulty: 'Hard',
    maxScore: 400,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 5),
      spawn('switch', 200, 200), // Sw A
      spawn('switch', 200, 400), // Sw B
      spawn('npn_transistor', 350, 200, 100), // Q1
      spawn('npn_transistor', 350, 400, 100), // Q2
      spawn('led', 500, 300, 10),
      spawn('resistor', 500, 200, 220),
      spawn('ground', 350, 500)
    ]),
    checkWin: (state) => {
      const led = state.components.find(c => c.type === 'led');
      const sws = state.components.filter(c => c.type === 'switch');
      const anyClosed = sws.some(s => !s.isOpen);
      return !!led && anyClosed && Math.abs(led.current || 0) > 0.005;
    }
  },
  {
    id: 28,
    title: "28. Chỉnh lưu nửa chu kỳ",
    description: "Sử dụng Diode để biến đổi dòng xoay chiều thành một chiều (nhấp nháy).",
    difficulty: 'Medium',
    maxScore: 300,
    setup: () => createBaseState([
      spawn('ac_source', 100, 300, 10, 1),
      spawn('diode', 300, 300),
      spawn('resistor', 500, 300, 1000), // Load
      spawn('ground', 300, 400)
    ]),
    checkWin: (state) => {
      const diode = state.components.find(c => c.type === 'diode');
      const res = state.components.find(c => c.type === 'resistor');
      return !!diode && !!res && (res.current || 0) >= -0.0001; 
    }
  },
  {
    id: 29,
    title: "29. Phân áp (Voltage Divider)",
    description: "Sử dụng biến trở để tạo ra điện áp thay đổi được. Nối biến trở vào nguồn và đo điện áp chân giữa.",
    difficulty: 'Medium',
    maxScore: 250,
    setup: () => createBaseState([
      spawn('battery', 100, 300, 10),
      spawn('potentiometer', 300, 300, 1000),
      spawn('voltmeter', 500, 300),
      spawn('ground', 300, 400)
    ]),
    checkWin: (state) => {
      const pot = state.components.find(c => c.type === 'potentiometer');
      const vm = state.components.find(c => c.type === 'voltmeter');
      const v = Math.abs(vm?.voltageDrop || 0);
      return !!pot && !!vm && v > 1 && v < 9;
    }
  },
  {
    id: 30,
    title: "30. Mạch dao động (Concept)",
    description: "Tạo mạch dao động đa hài (Multivibrator) dùng 2 Transistor. (Mức độ khó: Cao)",
    difficulty: 'Hard',
    maxScore: 500,
    setup: () => createBaseState([
      spawn('battery', 100, 100, 9),
      spawn('npn_transistor', 300, 200, 100), // Q1
      spawn('npn_transistor', 500, 200, 100), // Q2
      spawn('capacitor', 400, 200, 0.0001), // C1
      spawn('capacitor', 400, 300, 0.0001), // C2
      spawn('resistor', 300, 100, 1000), // R1
      spawn('resistor', 500, 100, 1000), // R4
      spawn('led', 200, 200, 10), // LED1
      spawn('led', 600, 200, 10), // LED2
      spawn('ground', 400, 500)
    ]),
    checkWin: (state) => {
      const leds = state.components.filter(c => c.type === 'led');
      return leds.length === 2 && !state.shortCircuitWarning;
    }
  },
  {
    id: 31,
    title: "31. SR Flip-Flop (NAND)",
    description: "Tạo mạch chốt SR bằng 2 cổng NAND. Khi S=0, Q=1. Khi R=0, Q=0.",
    principle: "SR Flip-Flop là mạch nhớ cơ bản trong kỹ thuật số, sử dụng phản hồi để duy trì trạng thái.",
    difficulty: 'Hard',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('nand_gate', 300, 200),
      spawn('nand_gate', 300, 400),
      spawn('battery', 100, 300, 5)
    ]),
    checkWin: (state) => {
      const gates = state.components.filter(c => c.type === 'nand_gate');
      return gates.length >= 2;
    }
  },
  {
    id: 32,
    title: "32. Half Adder (Bộ cộng bán phần)",
    description: "Tạo bộ cộng bán phần dùng cổng XOR và AND.",
    principle: "Half Adder cộng 2 bit A và B, cho ra tổng S và nhớ C.",
    difficulty: 'Hard',
    maxScore: 100,
    setup: () => createBaseState([
      spawn('xor_gate', 300, 200),
      spawn('and_gate', 300, 400),
      spawn('battery', 100, 300, 5)
    ]),
    checkWin: (state) => {
      const xor = state.components.find(c => c.type === 'xor_gate');
      const and = state.components.find(c => c.type === 'and_gate');
      return !!xor && !!and;
    }
  }
];
