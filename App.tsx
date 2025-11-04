
import React, { useState, useEffect } from 'react';

type View = 'main' | 'community' | 'report';

// 간단한 장소 DB 샘플 (관리자가 입력하는 CPT 형태의 데이터 예시)
type Place = {
  id: string;
  name: string;
  accepts: {
    residentID?: boolean;
    driverLicense?: boolean;
    healthInsurance?: boolean;
  };
  reports?: Array<{ success: boolean; message: string; ts: string }>;
};

const PLACE_DB: Place[] = [
  {
    id: 'p1',
    name: '강남역 OO병원',
    accepts: { residentID: true, driverLicense: false, healthInsurance: true },
    reports: [
      { success: true, message: '모바일 건강보험증으로 접수 성공', ts: '2025-11-03' },
      { success: false, message: '운전면허는 확인 불가', ts: '2025-10-28' }
    ]
  },
  {
    id: 'p2',
    name: '역삼동 OO은행',
    accepts: { residentID: true, driverLicense: true, healthInsurance: false },
    reports: [
      { success: true, message: '모바일 주민등록증으로 계좌 개설 가능', ts: '2025-10-30' }
    ]
  },
  {
    id: 'p3',
    name: '수도권 OO약국',
    accepts: { residentID: false, driverLicense: false, healthInsurance: true },
    reports: [
      { success: true, message: '건강보험증 바코드 인식됨', ts: '2025-10-29' }
    ]
  }
];
const CommunityView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
    <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
    </button>
    <h2 className="text-3xl font-bold mb-6 text-center">사용처 공유</h2>
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-teal-400">OO은행에서 사용해보신 분 계신가요?</h3>
        <p className="text-gray-400 text-sm">작성자: 사용자 | 2025-05-20</p>
        <p className="mt-2">모바일 신분증으로 OO은행에서 계좌 개설 성공했습니다! 직원분도 별 문제 없이 처리해주셨어요.</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-teal-400">XX편의점에서 담배 살 때 되나요?</h3>
        <p className="text-gray-400 text-sm">작성자: 궁금이 | 2025-05-19</p>
        <p className="mt-2">얼마 전에 XX편의점에서 모바일 운전면허증으로 성인인증하고 담배 샀습니다. 바코드 찍으니까 바로 됐어요.</p>
      </div>
    </div>
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">새 글 작성하기</h3>
      <textarea className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none" rows={4} placeholder="여기에 내용을 입력하세요..."></textarea>
      <button className="mt-4 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
        작성 완료
      </button>
    </div>
  </div>
);

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
    // Google AdSense 광고 초기화
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
    
    // 광고 스크립트 로드 후 초기화
    const timer = setTimeout(loadAds, 100);
    return () => clearTimeout(timer);
  }, []);

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Place | null>(null);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSearchResult(null);
      return;
    }
    const found = PLACE_DB.find(p => p.name.toLowerCase().includes(q));
    setSearchResult(found || null);
  };

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
      label: '공유하러 가기',
      backLabel: '사용처 공유',
      view: 'community',
      icon: 'fa-solid fa-comments',
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
    <div className="w-full max-w-5xl mx-auto">
      {/* 초간단 검색 UI */}
      <div className="w-full max-w-4xl mx-auto mb-6 px-2">
        <label className="sr-only">방문지 검색</label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="flex-1 p-3 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-500"
            placeholder="예: 강남역 OO병원, 역삼동 OO은행"
            aria-label="방문지 검색"
          />
          <button onClick={handleSearch} className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md">검색</button>
        </div>
        <p className="text-sm text-gray-400 mt-2">검색하면 해당 장소의 신분증 사용 가능 여부를 즉시 보여줍니다.</p>

        {/* 검색 결과 */}
        {searchResult ? (
          <div className="mt-4 bg-gray-800 p-4 rounded-md text-white">
            <h3 className="text-lg font-bold mb-2">{searchResult.name}</h3>
            <div className="flex gap-4 items-center mb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-id-card text-xl"></i>
                <span>주민등록증: </span>
                {searchResult.accepts.residentID ? <span className="text-green-400 font-bold">사용 가능</span> : <span className="text-gray-400">확인 불가</span>}
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-car text-xl"></i>
                <span>운전면허증: </span>
                {searchResult.accepts.driverLicense ? <span className="text-green-400 font-bold">사용 가능</span> : <span className="text-gray-400">확인 불가</span>}
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-book-medical text-xl"></i>
                <span>건강보험증: </span>
                {searchResult.accepts.healthInsurance ? <span className="text-green-400 font-bold">사용 가능</span> : <span className="text-gray-400">확인 불가</span>}
              </div>
            </div>

            {/* 최신 리포트 */}
            {searchResult.reports && searchResult.reports.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold mb-2">최신 리포트</h4>
                <ul className="space-y-2">
                  {searchResult.reports.map((r, i) => (
                    <li key={i} className={`p-2 rounded-md ${r.success ? 'bg-green-900/40' : 'bg-red-900/30'}`}>
                      <div className="text-sm">{r.message}</div>
                      <div className="text-xs text-gray-400">{r.ts}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          query && <div className="mt-4 text-sm text-gray-400">검색 결과가 없습니다. 가까운 이름 또는 주소로 다시 시도하세요.</div>
        )}
      </div>

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
      
      {/* 카드 그리드 아래 디스플레이 광고 */}
      <div className="col-span-2 md:col-span-3 lg:col-span-5 w-full max-w-4xl mx-auto mt-8">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-2686975437928535"
             data-ad-slot="1992799632"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('main');

  const renderView = () => {
    switch (view) {
      case 'community':
        return <CommunityView onBack={() => setView('main')} />;
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