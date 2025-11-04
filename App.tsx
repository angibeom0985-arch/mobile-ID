import React, { useState, useEffect } from 'react';

type View = 'main' | 'oil' | 'report';

type OilPrice = {
  prodcd: string;
  prodnm: string;
  price: string;
  diff: string;
};

const OilPriceView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOilPrices();
  }, []);

  const fetchOilPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://www.opinet.co.kr/api/avgAllPrice.do?code=F251104981&out=json'
      );
      const data = await response.json();
      
      if (data.RESULT && data.RESULT.OIL) {
        setOilPrices(data.RESULT.OIL);
      } else {
        setError('데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('API 호출 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOilIcon = (name: string) => {
    if (name.includes('휘발유')) return 'fa-gas-pump';
    if (name.includes('경유')) return 'fa-truck';
    if (name.includes('LPG')) return 'fa-fire';
    return 'fa-droplet';
  };

  const getOilColor = (name: string) => {
    if (name.includes('휘발유')) return 'text-green-400';
    if (name.includes('경유')) return 'text-yellow-400';
    if (name.includes('LPG')) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <i className="fa-solid fa-gas-pump"></i>
        오늘의 전국 평균 기름값
      </h2>

      {loading && (
        <div className="text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-teal-400"></i>
          <p className="mt-4 text-gray-400">데이터를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg">
          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {oilPrices.map((oil, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <i className={`fa-solid ${getOilIcon(oil.prodnm)} text-3xl ${getOilColor(oil.prodnm)}`}></i>
                  <div>
                    <h3 className="text-2xl font-bold">{oil.prodnm}</h3>
                    <p className="text-sm text-gray-400">전국 평균 가격</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-teal-400">{oil.price}원</p>
                  <p className={`text-sm ${parseFloat(oil.diff) > 0 ? 'text-red-400' : parseFloat(oil.diff) < 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                    {parseFloat(oil.diff) > 0 ? '▲' : parseFloat(oil.diff) < 0 ? '▼' : '―'} {Math.abs(parseFloat(oil.diff))}원 (전주 대비)
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-500 mt-6">
            <i className="fa-solid fa-info-circle mr-2"></i>
            자료출처: 한국석유공사 오피넷 (OPINET)
          </div>
        </div>
      )}
    </div>
  );
};

const SuggestionView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [suggestionType, setSuggestionType] = useState('UI/UX 개선');
  const [suggestionDetails, setSuggestionDetails] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{type: string, details: string, timestamp: string}>>([]);

  const handleSubmit = () => {
    if (suggestionDetails.trim()) {
      const newSuggestion = {
        type: suggestionType,
        details: suggestionDetails,
        timestamp: new Date().toLocaleString('ko-KR')
      };
      setSuggestions([newSuggestion, ...suggestions]);
      setSuggestionDetails('');
    }
  };

  return (
    <div className="text-white w-full max-w-2xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
      </button>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">새로운 기능 제안</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="suggestion-type" className="block text-lg font-medium mb-2">건의 종류</label>
            <select 
              id="suggestion-type" 
              value={suggestionType}
              onChange={(e) => setSuggestionType(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            >
              <option>UI/UX 개선</option>
              <option>신규 기능 추가</option>
              <option>오류 신고</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label htmlFor="suggestion-details" className="block text-lg font-medium mb-2">상세 내용</label>
            <textarea 
              id="suggestion-details" 
              value={suggestionDetails}
              onChange={(e) => setSuggestionDetails(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none" 
              rows={5} 
              placeholder="앱을 더 발전시킬 수 있는 아이디어를 자유롭게 작성해주세요."
            ></textarea>
          </div>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            제안 제출하기
          </button>
        </form>
      </div>

      {/* 제안 목록 */}
      {suggestions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-2xl font-bold mb-4">제출된 제안</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-pink-600 text-white text-sm px-3 py-1 rounded-full">{suggestion.type}</span>
                <span className="text-gray-400 text-sm">{suggestion.timestamp}</span>
              </div>
              <p className="text-white mt-2">{suggestion.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



const MainView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  useEffect(() => {
    const loadAds = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          const ads = document.querySelectorAll('.adsbygoogle');
          ads.forEach(() => {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          });
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    };
    
    const timer = setTimeout(loadAds, 100);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
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
      theme: 'orange'
    },
    {
      type: 'nav',
      label: '확인하러 가기',
      backLabel: '오늘의 기름값',
      view: 'oil',
      icon: 'fa-solid fa-gas-pump',
      theme: 'teal'
    },
    {
      type: 'nav',
      label: '제안하러 가기',
      backLabel: '새로운 기능 제안',
      view: 'report',
      icon: 'fa-solid fa-lightbulb',
      theme: 'pink'
    },
    {
      type: 'ad',
      label: 'Ad',
      backLabel: 'Advertisement',
      icon: 'fa-solid fa-ad',
      theme: 'purple'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 justify-items-center">
      {cards.map((card, index) => {
        // 6번째 카드(index 5)일 때 광고 표시
        if (card.type === 'ad') {
          return (
            <div key={index} className={`card ${card.theme}`}>
              <div className="content">
                <div className="back">
                  <div className="back-content">
                    <ins className="adsbygoogle"
                         style={{ display: 'block', width: '100%', height: '100%' }}
                         data-ad-client="ca-pub-2686975437928535"
                         data-ad-slot="1992799632"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
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
                        <ins className="adsbygoogle"
                             style={{ display: 'block', width: '100%', height: '100%' }}
                             data-ad-client="ca-pub-2686975437928535"
                             data-ad-slot="1992799632"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const cardContent = (
          <div className={`card ${card.theme}`} onClick={card.type === 'nav' ? () => onNavigate(card.view as View) : undefined}>
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
                      <p className="title flex items-center gap-4">
                         <i className={`text-2xl ${card.icon}`}></i>
                        <strong>{card.label}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

        if (card.type === 'link') {
          return (
            <a key={index} href={card.href} target="_blank" rel="noopener noreferrer">
              {cardContent}
            </a>
          );
        }
        return <div key={index} className="cursor-pointer">{cardContent}</div>;
      })}
      
        <div className="col-span-2 md:grid-cols-3 lg:col-span-5 w-full max-w-4xl mx-auto mt-8">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-2686975437928535"
               data-ad-slot="1992799632"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('main');

  const renderView = () => {
    switch (view) {
      case 'oil':
        return <OilPriceView onBack={() => setView('main')} />;
      case 'report':
        return <SuggestionView onBack={() => setView('main')} />;
      case 'main':
      default:
        return <MainView onNavigate={setView} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      {renderView()}
    </div>
  );
};

export default App;