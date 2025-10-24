
import React, { useState, useEffect } from 'react';

type View = 'main' | 'community' | 'report';

const CommunityView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="text-white w-full max-w-4xl mx-auto p-4 md:p-8">
    <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
    </button>
    <h2 className="text-3xl font-bold mb-6 text-center">사용처 공유</h2>
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-teal-400">OO은행에서 사용해보신 분 계신가요?</h3>
        <p className="text-gray-400 text-sm">작성자: 사용자123 | 2024-05-20</p>
        <p className="mt-2">모바일 신분증으로 OO은행에서 계좌 개설 성공했습니다! 직원분도 별 문제 없이 처리해주셨어요.</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-teal-400">XX편의점에서 담배 살 때 되나요?</h3>
        <p className="text-gray-400 text-sm">작성자: 궁금이 | 2024-05-19</p>
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

const SuggestionView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="text-white w-full max-w-2xl mx-auto p-4 md:p-8">
    <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      <i className="fa-solid fa-arrow-left mr-2"></i> 뒤로가기
    </button>
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">새로운 기능 제안</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="suggestion-type" className="block text-lg font-medium mb-2">건의 종류</label>
          <select id="suggestion-type" className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none">
            <option>UI/UX 개선</option>
            <option>신규 기능 추가</option>
            <option>오류 신고</option>
            <option>기타</option>
          </select>
        </div>
        <div>
          <label htmlFor="suggestion-details" className="block text-lg font-medium mb-2">상세 내용</label>
          <textarea id="suggestion-details" className="w-full bg-gray-700 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none" rows={5} placeholder="앱을 더 발전시킬 수 있는 아이디어를 자유롭게 작성해주세요."></textarea>
        </div>
        <button type="button" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          제안 제출하기
        </button>
      </form>
    </div>
  </div>
);


const MainView: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
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
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 justify-items-center">
      {cards.map((card, index) => {
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