import { Zap, ShieldAlert, BookOpen, Activity, AlertTriangle, BatteryCharging, Lightbulb } from 'lucide-react';

export const ELECTRICAL_LAWS = [
  {
    title: "Định luật Ohm",
    description: "Mối quan hệ cơ bản giữa điện áp, dòng điện và điện trở trong một mạch điện.",
    principle: "Cường độ dòng điện chạy qua một vật dẫn điện tỉ lệ thuận với hiệu điện thế giữa hai đầu vật dẫn đó và tỉ lệ nghịch với điện trở của vật.",
    formula: "I = V / R",
    usage: "Dùng để tính toán các thông số cơ bản của mạch điện, chọn điện trở phù hợp để bảo vệ linh kiện (như LED).",
    icon: Zap
  },
  {
    title: "Định luật Kirchhoff 1 (KCL)",
    description: "Định luật về dòng điện tại một nút.",
    principle: "Tổng các dòng điện đi vào một nút bằng tổng các dòng điện đi ra khỏi nút đó. Nói cách khác, tổng đại số của các dòng điện tại một nút bằng không.",
    formula: "ΣI_in = ΣI_out",
    usage: "Phân tích mạch điện phức tạp, tính toán dòng điện trong các nhánh mắc song song.",
    icon: Activity
  },
  {
    title: "Định luật Kirchhoff 2 (KVL)",
    description: "Định luật về điện áp trong một vòng kín.",
    principle: "Tổng đại số các độ giảm điện thế (điện áp) dọc theo một vòng kín bất kỳ trong mạch điện luôn bằng không.",
    formula: "ΣV = 0",
    usage: "Tính toán điện áp rơi trên các linh kiện mắc nối tiếp, phân tích mạch vòng.",
    icon: Activity
  },
  {
    title: "Định luật Joule-Lenz",
    description: "Định luật về tác dụng nhiệt của dòng điện.",
    principle: "Nhiệt lượng tỏa ra ở một vật dẫn tỉ lệ thuận với điện trở của vật, với bình phương cường độ dòng điện và với thời gian dòng điện chạy qua.",
    formula: "Q = I² * R * t",
    usage: "Tính toán công suất tỏa nhiệt của điện trở, thiết kế cầu chì, bếp điện, bàn là.",
    icon: Lightbulb
  },
  {
    title: "Công suất điện",
    description: "Tốc độ tiêu thụ điện năng của một mạch điện.",
    principle: "Công suất điện của một đoạn mạch bằng tích của hiệu điện thế giữa hai đầu đoạn mạch và cường độ dòng điện chạy qua nó.",
    formula: "P = V * I = I² * R = V² / R",
    usage: "Tính toán mức độ tiêu thụ năng lượng, chọn nguồn điện phù hợp, tránh quá tải linh kiện.",
    icon: BatteryCharging
  }
];

export const SAFETY_PRINCIPLES = [
  {
    title: "Nguyên tắc Ngắn mạch (Chập mạch)",
    description: "Hiện tượng dòng điện không đi qua tải mà đi qua một đường dẫn có điện trở rất nhỏ.",
    principle: "Khi ngắn mạch, dòng điện tăng lên rất cao (I = V / R, với R tiến tới 0). Điều này sinh ra nhiệt lượng khổng lồ, có thể gây cháy nổ nguồn điện và dây dẫn.",
    formula: "Luôn đảm bảo dòng điện phải đi qua một tải (điện trở, đèn...) trước khi về cực âm.",
    usage: "Sử dụng cầu chì hoặc aptomat để tự động ngắt mạch khi có dòng điện quá lớn.",
    icon: AlertTriangle
  },
  {
    title: "Bảo vệ Quá dòng",
    description: "Ngăn chặn dòng điện vượt quá mức chịu đựng của linh kiện.",
    principle: "Mỗi linh kiện có một giới hạn dòng điện tối đa. Nếu vượt qua, linh kiện sẽ bị hỏng (cháy LED, nổ tụ...).",
    formula: "Sử dụng điện trở hạn dòng: R = (V_nguồn - V_linh_kiện) / I_an_toàn",
    usage: "Luôn mắc nối tiếp điện trở với các linh kiện nhạy cảm như LED, Diode.",
    icon: ShieldAlert
  },
  {
    title: "An toàn Điện áp",
    description: "Nguy cơ giật điện và hỏng hóc do điện áp cao.",
    principle: "Điện áp cao có thể đánh thủng lớp cách điện và gây nguy hiểm cho con người (thường > 40V DC hoặc > 30V AC là bắt đầu nguy hiểm). Trong mô phỏng này, chúng ta dùng điện áp thấp (Pin 9V, 12V) nên an toàn cho người, nhưng vẫn có thể làm hỏng linh kiện.",
    formula: "Kiểm tra điện áp định mức của tụ điện, bóng đèn trước khi cấp nguồn.",
    usage: "Không nối trực tiếp linh kiện 3V vào nguồn 12V mà không có mạch giảm áp.",
    icon: Zap
  },
  {
    title: "Phân cực Linh kiện",
    description: "Lắp đúng chiều âm dương cho các linh kiện có phân cực.",
    principle: "Một số linh kiện như LED, Diode, Tụ hóa, Transistor chỉ hoạt động khi dòng điện đi qua theo một chiều nhất định. Lắp ngược cực có thể làm linh kiện không hoạt động hoặc bị hỏng (đặc biệt là tụ hóa có thể nổ).",
    formula: "Anode (+) nối với chiều dương, Cathode (-) nối với chiều âm.",
    usage: "Luôn kiểm tra ký hiệu cực trên linh kiện trước khi nối dây.",
    icon: AlertTriangle
  }
];
