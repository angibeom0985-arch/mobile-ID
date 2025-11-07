import React, { useEffect } from 'react';

// ==================== 메인 뷰 ====================
const MainView: React.FC = () => {
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
