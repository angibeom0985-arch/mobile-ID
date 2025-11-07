import React, { useEffect, useState } from 'react';

// ==================== 메인 뷰 ====================
const MainView: React.FC = () => {
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const loadAds = () => {
      try {
        if (typeof window !== 'undefined') {
          const ads = document.querySelectorAll('.adsbygoogle');
          if (ads.length > 0 && (window as any).adsbygoogle) {
            ads.forEach((ad) => {
              if (!ad.hasAttribute('data-adsbygoogle-status')) {
                try {
                  ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                } catch (err) {
                  // AdSense 로드 실패는 무시
                }
              }
            });
          }
        }
      } catch (e) {
        // 광고 로드 실패는 조용히 처리
      }
    };
    
    const timer = setTimeout(loadAds, 500);
    return () => clearTimeout(timer);
  }, []);

  // 뒤로가기 감지 및 확인 대화상자
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowExitModal(true);
    };

    // 초기 히스토리 상태 추가
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleExit = () => {
    window.history.back();
  };

  const handleCancel = () => {
    setShowExitModal(false);
  };

  // 모달이 열릴 때 광고 로드
  useEffect(() => {
    if (showExitModal) {
      const timer = setTimeout(() => {
        try {
          if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
            const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
            ads.forEach((ad) => {
              try {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              } catch (err) {
                // 광고 로드 실패는 무시
              }
            });
          }
        } catch (e) {
          // 광고 로드 실패는 조용히 처리
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showExitModal]);

  const issuanceCards = [
    {
      type: 'link',
      label: '발급 바로가기',
      backLabel: '모바일 주민등록증',
      href: 'https://mobile-id2.car-hotissue.com/%eb%aa%a8%eb%b0%94%ec%9d%bc-%ec%a3%bc%eb%af%bc%eb%93%b1%eb%a1%9d%ec%a6%9d-%eb%b0%9c%ea%b8%89/',
      icon: 'fa-solid fa-id-card',
      theme: 'blue'
    },
    {
      type: 'link',
      label: '발급 바로가기',
      backLabel: '모바일 운전면허증',
      href: 'https://mobile-id2.car-hotissue.com/%eb%aa%a8%eb%b0%94%ec%9d%bc-%ec%9a%b4%ec%a0%84%eb%a9%b4%ed%97%88%ec%a6%9d-%eb%b0%9c%ea%b8%89/',
      icon: 'fa-solid fa-car',
      theme: 'green'
    },
    {
      type: 'link',
      label: '발급 바로가기',
      backLabel: '모바일 건강보험증',
      href: 'https://mobile-id2.car-hotissue.com/%eb%aa%a8%eb%b0%94%ec%9d%bc-%ea%b1%b4%ea%b0%95%eb%b3%b4%ed%97%98%ec%a6%9d-%eb%b0%9c%ea%b8%89/',
      icon: 'fa-solid fa-book-medical',
      theme: 'red'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 발급 방법 섹션 */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <i className="fa-solid fa-id-badge mr-3"></i>
            모바일 신분증 종류
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-6 justify-items-center max-w-4xl mx-auto">
          {issuanceCards.map((card, index) => (
            <a key={index} href={card.href}>
              <div className={`card ${card.theme}`}>
                <div className="content">
                  <div className="back">
                    <div className="back-content">
                      <i className={`text-5xl ${card.icon}`}></i>
                      <strong>{card.backLabel}</strong>
                    </div>
                  </div>
                  <div className="front">
                    <div className="img">
                      <div className="circle"></div>
                      <div className="circle" id="right"></div>
                      <div className="circle" id="bottom"></div>
                    </div>
                    <div className="front-content">
                      <div className="description">
                        <div className="title">
                          <p className="title">
                            <strong>{card.label}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
          
          {/* 4번째 위치에 광고 추가 */}
          <div className="flex items-center justify-center" style={{ width: '190px', height: '254px' }}>
            <ins className="adsbygoogle"
                 style={{ display: 'block', width: '190px', height: '254px' }}
                 data-ad-client="ca-pub-2686975437928535"
                 data-ad-slot="1992799632"
                 data-ad-format="auto"
                 data-full-width-responsive="false"></ins>
          </div>
        </div>
      </section>

      {/* 종료 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fa-solid fa-door-open text-red-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                앱을 종료하시겠습니까?
              </h3>
              <p className="text-sm text-gray-500">
                종료하시면 처음 화면으로 돌아갑니다
              </p>
            </div>

            {/* 광고 영역 */}
            <div className="flex justify-center bg-gray-50 rounded-lg p-4">
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '300px', height: '250px' }}
                   data-ad-client="ca-pub-2686975437928535"
                   data-ad-slot="1992799632"
                   data-ad-format="auto"
                   data-full-width-responsive="false"></ins>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleExit}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                종료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 메인 앱 컴포넌트 ====================
const App: React.FC = () => {
  useEffect(() => {
    const loadAds = () => {
      try {
        if (typeof window !== 'undefined') {
          const ads = document.querySelectorAll('.adsbygoogle');
          if (ads.length > 0 && (window as any).adsbygoogle) {
            ads.forEach((ad) => {
              if (!ad.hasAttribute('data-adsbygoogle-status')) {
                try {
                  ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                } catch (err) {
                  // AdSense 로드 실패는 무시
                }
              }
            });
          }
        }
      } catch (e) {
        // 광고 로드 실패는 조용히 처리
      }
    };
    
    const timer = setTimeout(loadAds, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <MainView />
    </div>
  );
};

export default App;
