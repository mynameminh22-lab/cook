import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useCircuitStore } from '../store';
import { useShallow } from 'zustand/react/shallow';

export function Onboarding() {
  const { hasCompletedTutorial, setHasCompletedTutorial, showUI } = useCircuitStore(useShallow(state => ({
    hasCompletedTutorial: state.hasCompletedTutorial,
    setHasCompletedTutorial: state.setHasCompletedTutorial,
    showUI: state.showUI
  })));

  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run if not completed and UI is shown
    if (!hasCompletedTutorial && showUI) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTutorial, showUI]);

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Chào mừng bạn đến với CircuitSim! Hãy cùng tìm hiểu các tính năng cơ bản của ứng dụng mô phỏng mạch điện này nhé.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-sidebar',
      content: 'Đây là thanh công cụ chứa các linh kiện. Bạn có thể kéo thả hoặc nhấp vào linh kiện để thêm vào bảng mạch.',
      placement: 'right',
    },
    {
      target: '.tour-canvas',
      content: 'Đây là khu vực bảng mạch chính. Bạn có thể di chuyển linh kiện, nối dây giữa các điểm nối (chấm tròn) bằng cách kéo thả chuột.',
      placement: 'center',
    },
    {
      target: '.tour-tools',
      content: 'Thanh công cụ phía trên giúp bạn lưu/tải mạch, hoàn tác, thay đổi chế độ vẽ dây và nhiều tính năng khác.',
      placement: 'bottom',
    },
    {
      target: '.tour-play-pause',
      content: 'Nút này dùng để chạy hoặc dừng mô phỏng mạch điện. Khi mạch đang chạy, bạn sẽ thấy dòng điện di chuyển và các thông số được cập nhật.',
      placement: 'bottom',
    },
    {
      target: '.tour-inspector',
      content: 'Khi bạn chọn một linh kiện trên bảng mạch, bảng thông số này sẽ hiện ra để bạn có thể thay đổi giá trị (như điện trở, điện áp) hoặc xoay/xóa linh kiện.',
      placement: 'left',
    },
    {
      target: '.tour-examples',
      content: 'Bạn có thể xem các mạch mẫu hoặc tham gia giải đố để kiểm tra kiến thức của mình tại đây.',
      placement: 'bottom',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setHasCompletedTutorial(true);
    }
  };

  if (!run) return null;

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#2563eb', // blue-600
          textColor: '#1e293b', // slate-800
          backgroundColor: '#ffffff',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          borderRadius: '8px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#64748b', // slate-500
        },
        buttonSkip: {
          color: '#64748b',
        }
      }}
      locale={{
        back: 'Quay lại',
        close: 'Đóng',
        last: 'Hoàn thành',
        next: 'Tiếp theo',
        skip: 'Bỏ qua',
      }}
    />
  );
}
