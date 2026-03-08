import { ComponentType } from '../types';
import { 
  Battery, Zap, Lightbulb, Activity, ToggleLeft, Gauge, Search, Sliders, ZapOff, Sun, Type, 
  ArrowDownToLine, CircleDot, GitBranch, Radio, Cpu, ArrowRightToLine, Waves, Share2, Triangle
} from 'lucide-react';

export interface ComponentDoc {
  type: ComponentType;
  title: string;
  icon: any;
  description: string;
  principle: string;
  formula?: string;
  usage: string;
  price?: number;
}

export const COMPONENT_DOCS: ComponentDoc[] = [
  {
    type: 'battery',
    title: 'Nguồn điện (Pin/Battery)',
    icon: Battery,
    description: 'Thiết bị cung cấp năng lượng điện cho toàn bộ mạch, tạo ra sự chênh lệch điện thế (hiệu điện thế) giữa hai cực.',
    principle: 'Biến đổi hóa năng thành điện năng. Dòng điện (theo quy ước) đi ra từ cực dương (+) và đi vào cực âm (-).',
    formula: 'V = I * R_total (Định luật Ohm cho toàn mạch)',
    usage: 'Cung cấp năng lượng cho các thiết bị điện tử hoạt động.',
    price: 20000
  },
  {
    type: 'resistor',
    title: 'Điện trở (Resistor)',
    icon: Activity,
    description: 'Linh kiện thụ động có tác dụng cản trở dòng điện chạy qua nó.',
    principle: 'Khi dòng điện chạy qua vật dẫn, các electron va chạm với các ion trong mạng tinh thể, gây ra sự cản trở và sinh nhiệt.',
    formula: 'V = I * R (Định luật Ohm)',
    usage: 'Hạn chế cường độ dòng điện, phân chia điện áp, bảo vệ các linh kiện khác (như LED).',
    price: 1000
  },
  {
    type: 'lamp',
    title: 'Bóng đèn (Lamp)',
    icon: Lightbulb,
    description: 'Thiết bị chuyển đổi điện năng thành quang năng (ánh sáng) và nhiệt năng.',
    principle: 'Dòng điện chạy qua dây tóc (thường bằng Vonfram) làm nó nóng lên đến mức phát sáng (hiện tượng phát nhiệt Joule-Lenz).',
    formula: 'P = U * I = I² * R (Công suất tiêu thụ)',
    usage: 'Chiếu sáng, báo hiệu trạng thái hoạt động.',
    price: 5000
  },
  {
    type: 'led',
    title: 'Đèn LED (Light Emitting Diode)',
    icon: Sun,
    description: 'Đi-ốt phát quang, là linh kiện bán dẫn phát ra ánh sáng khi có dòng điện chạy qua.',
    principle: 'Chỉ cho dòng điện đi qua theo một chiều (từ Anode sang Cathode). Khi các electron tái hợp với lỗ trống trong chất bán dẫn, năng lượng được giải phóng dưới dạng photon ánh sáng.',
    formula: 'V_f (Điện áp thuận) ≈ 2V - 3V (tùy màu)',
    usage: 'Đèn báo, màn hình hiển thị, chiếu sáng tiết kiệm năng lượng. Cần mắc nối tiếp với điện trở để hạn chế dòng điện.',
    price: 2000
  },
  {
    type: 'switch',
    title: 'Công tắc đơn (Switch)',
    icon: ToggleLeft,
    description: 'Thiết bị cơ khí dùng để đóng hoặc ngắt dòng điện trong mạch.',
    principle: 'Khi đóng (ON), hai cực tiếp xúc nhau tạo thành mạch kín. Khi ngắt (OFF), hai cực tách rời tạo thành mạch hở.',
    usage: 'Điều khiển bật/tắt các thiết bị điện.',
    price: 3000
  },
  {
    type: 'push_button',
    title: 'Nút nhấn (Push Button)',
    icon: CircleDot,
    description: 'Loại công tắc chỉ đóng mạch khi có lực tác động (nhấn giữ) và tự ngắt khi thả ra.',
    principle: 'Sử dụng lò xo để đàn hồi, đưa tiếp điểm về trạng thái ban đầu (thường là mở) ngay khi ngừng tác động lực.',
    usage: 'Chuông cửa, bàn phím máy tính, nút reset.',
    price: 3000
  },
  {
    type: 'spdt_switch',
    title: 'Công tắc 3 cực (SPDT)',
    icon: GitBranch,
    description: 'Single Pole Double Throw - Công tắc một cực hai ngả. Có 1 cực chung (Common) và 2 cực ra (NO, NC).',
    principle: 'Cho phép chuyển đổi dòng điện từ cực chung sang một trong hai cực còn lại. Luôn có một nhánh được kết nối.',
    usage: 'Mạch cầu thang (điều khiển 1 đèn từ 2 vị trí), đảo chiều động cơ.',
    price: 5000
  },
  {
    type: 'potentiometer',
    title: 'Biến trở (Potentiometer)',
    icon: Sliders,
    description: 'Điện trở có thể thay đổi giá trị bằng cách điều chỉnh con chạy hoặc núm vặn.',
    principle: 'Thay đổi chiều dài của dây dẫn hoặc vị trí tiếp xúc trên dải điện trở để thay đổi giá trị điện trở tham gia vào mạch.',
    usage: 'Điều chỉnh âm lượng (volume), độ sáng đèn (dimmer), chỉnh tốc độ quạt.',
    price: 5000
  },
  {
    type: 'fuse',
    title: 'Cầu chì (Fuse)',
    icon: ZapOff,
    description: 'Thiết bị bảo vệ mạch điện khỏi quá tải hoặc ngắn mạch.',
    principle: 'Chứa một dây kim loại dễ nóng chảy. Khi dòng điện vượt quá giới hạn cho phép, dây chì sẽ nóng chảy và đứt, ngắt mạch điện để bảo vệ các thiết bị khác.',
    usage: 'Bảo vệ an toàn cho mạch điện gia đình, thiết bị điện tử.',
    price: 2000
  },
  {
    type: 'voltmeter',
    title: 'Vôn kế (Voltmeter)',
    icon: Gauge,
    description: 'Dụng cụ đo hiệu điện thế (điện áp) giữa hai điểm trong mạch.',
    principle: 'Mắc SONG SONG với đoạn mạch cần đo. Có điện trở trong rất lớn để không làm ảnh hưởng đến dòng điện trong mạch chính.',
    usage: 'Kiểm tra điện áp pin, đo sụt áp trên các linh kiện.',
    price: 150000
  },
  {
    type: 'ammeter',
    title: 'Ampe kế (Ammeter)',
    icon: Search,
    description: 'Dụng cụ đo cường độ dòng điện chạy qua mạch.',
    principle: 'Mắc NỐI TIẾP với đoạn mạch cần đo. Có điện trở trong rất nhỏ (lý tưởng là 0) để không làm sụt áp đáng kể.',
    usage: 'Đo dòng tiêu thụ của tải, kiểm tra quá tải.',
    price: 150000
  },
  {
    type: 'ground',
    title: 'Nối đất (Ground/GND)',
    icon: ArrowDownToLine,
    description: 'Điểm tham chiếu điện áp 0V của mạch điện.',
    principle: 'Là điểm chung để so sánh điện áp. Trong thực tế, nó thường được nối với đất để đảm bảo an toàn (chống giật).',
    usage: 'Định nghĩa mức 0V, chống nhiễu, bảo vệ an toàn điện.',
    price: 0
  },
  {
    type: 'capacitor',
    title: 'Tụ điện (Capacitor)',
    icon: Radio,
    description: 'Linh kiện thụ động có khả năng tích trữ năng lượng dưới dạng điện trường.',
    principle: 'Gồm hai bản dẫn điện đặt song song, ngăn cách bởi lớp điện môi. Khi có điện áp, các điện tích trái dấu tích tụ trên hai bản cực.',
    formula: 'Q = C * V (Điện tích = Điện dung * Điện áp)',
    usage: 'Lọc nhiễu, san phẳng điện áp, mạch tạo dao động, lưu trữ năng lượng tạm thời.',
    price: 1500
  },
  {
    type: 'inductor',
    title: 'Cuộn cảm (Inductor)',
    icon: Cpu,
    description: 'Linh kiện thụ động có khả năng tích trữ năng lượng dưới dạng từ trường khi có dòng điện chạy qua.',
    principle: 'Gồm một cuộn dây dẫn quấn quanh lõi (không khí hoặc vật liệu từ). Chống lại sự thay đổi của dòng điện chạy qua nó.',
    formula: 'V = L * (di/dt) (Điện áp = Độ tự cảm * Tốc độ thay đổi dòng điện)',
    usage: 'Lọc nhiễu cao tần, mạch cộng hưởng, biến áp, chặn dòng điện xoay chiều.',
    price: 2000
  },
  {
    type: 'diode',
    title: 'Đi-ốt (Diode)',
    icon: ArrowRightToLine,
    description: 'Linh kiện bán dẫn chỉ cho phép dòng điện đi qua theo một chiều duy nhất.',
    principle: 'Cấu tạo từ tiếp giáp P-N. Khi phân cực thuận (Anode dương hơn Cathode), đi-ốt dẫn điện. Khi phân cực nghịch, đi-ốt chặn dòng điện.',
    formula: 'V_d ≈ 0.7V (Điện áp rơi trên đi-ốt Silic)',
    usage: 'Chỉnh lưu dòng điện xoay chiều thành một chiều, bảo vệ ngược cực, tách sóng.',
    price: 1000
  },
  {
    type: 'ac_source',
    title: 'Nguồn xoay chiều (AC Source)',
    icon: Waves,
    description: 'Nguồn cung cấp điện áp và dòng điện thay đổi chiều và độ lớn theo thời gian (thường là hình sin).',
    principle: 'Tạo ra sức điện động xoay chiều dựa trên hiện tượng cảm ứng điện từ (máy phát điện).',
    formula: 'v(t) = V_peak * sin(ωt + φ)',
    usage: 'Mạng lưới điện gia đình, truyền tải điện năng đi xa, cấp nguồn cho động cơ xoay chiều.',
    price: 150000
  },
  {
    type: 'npn_transistor',
    title: 'Transistor NPN',
    icon: Share2,
    description: 'Linh kiện bán dẫn 3 cực (B, C, E) dùng để khuếch đại hoặc đóng ngắt mạch.',
    principle: 'Dòng điện nhỏ cực B (Base) điều khiển dòng điện lớn từ C (Collector) sang E (Emitter). Kích hoạt khi V_BE > 0.7V.',
    formula: 'I_C = β * I_B (Vùng khuếch đại)',
    usage: 'Khuếch đại tín hiệu, làm công tắc điện tử.',
    price: 3000
  },
  {
    type: 'pnp_transistor',
    title: 'Transistor PNP',
    icon: Share2,
    description: 'Tương tự NPN nhưng dòng điện điều khiển và dòng chính ngược chiều.',
    principle: 'Dòng điện nhỏ ra khỏi cực B điều khiển dòng điện lớn từ E sang C. Kích hoạt khi V_EB > 0.7V (V_B < V_E).',
    formula: 'I_C = β * I_B',
    usage: 'Khuếch đại, công tắc (thường dùng ở phía nguồn dương).',
    price: 3000
  },
  {
    type: 'opamp',
    title: 'Op-Amp (Khuếch đại thuật toán)',
    icon: Triangle,
    description: 'Mạch tích hợp có hệ số khuếch đại rất lớn, dùng để thực hiện các phép toán trên tín hiệu điện áp.',
    principle: 'Khuếch đại hiệu điện thế giữa hai đầu vào: V_out = A * (V_+ - V_-).',
    formula: 'V_out = A * (V_+ - V_-)',
    usage: 'Khuếch đại, so sánh, tích phân, vi phân, lọc tích cực.',
    price: 5000
  },
  {
    type: 'solar_panel',
    title: 'Pin mặt trời (Solar Panel)',
    icon: Sun,
    description: 'Thiết bị chuyển đổi quang năng thành điện năng.',
    principle: 'Hiệu ứng quang điện: Các photon ánh sáng đập vào bề mặt bán dẫn, giải phóng electron tạo ra dòng điện. Hiệu suất phụ thuộc vào cường độ ánh sáng (thời gian trong ngày và thời tiết).',
    formula: 'P = I * V (Phụ thuộc vào cường độ sáng)',
    usage: 'Cung cấp năng lượng sạch từ ánh sáng mặt trời.',
    price: 50000
  },
  {
    type: 'wind_turbine',
    title: 'Tuabin gió (Wind Turbine)',
    icon: Waves,
    description: 'Thiết bị chuyển đổi động năng của gió thành điện năng.',
    principle: 'Gió làm quay cánh quạt, truyền động năng cho máy phát điện để tạo ra dòng điện. Điện áp đầu ra phụ thuộc vào tốc độ gió.',
    formula: 'P = 1/2 * ρ * A * v³ (Công suất tỷ lệ với lập phương tốc độ gió)',
    usage: 'Sản xuất điện từ năng lượng gió.',
    price: 100000
  },
  {
    type: 'thermoelectric_generator',
    title: 'Máy phát nhiệt điện (TEG)',
    icon: Activity,
    description: 'Thiết bị chuyển đổi sự chênh lệch nhiệt độ thành điện năng.',
    principle: 'Hiệu ứng Seebeck: Sự chênh lệch nhiệt độ giữa hai mặt của vật liệu bán dẫn tạo ra một hiệu điện thế.',
    formula: 'V = α * ΔT (Điện áp tỷ lệ với chênh lệch nhiệt độ)',
    usage: 'Tận dụng nhiệt thừa để phát điện, cấp nguồn cho cảm biến ở môi trường khắc nghiệt.',
    price: 40000
  }
];
