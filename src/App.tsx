import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Trophy, Award } from 'lucide-react';

const PLAYERS = ['吉伶', '心羚', '亭羽'];

// The Q&A Data
const QA_LIST = [
  {
    q: 'Q1：請問哪兩張照片是我們的照片合成出的寶寶照？（從五張照片中選出）',
    a: '解答：照片 2 與 照片 4',
    images: [
      '/wrong1.jpg',
      '/correct1.png',
      '/wrong2.png',
      '/correct2.png',
      '/wrong3.png'
    ]
  },
  {
    q: 'Q2：請猜出以下三種物品的金額加總。',
    a: '解答：7,008 元\n\n推車 4,990 元\n奶嘴 119 元\n尿布 1,899 元',
    images2: [
      { src: '/stroller.png', label: '推車', price: '4,990 元' },
      { src: '/pacifier.png', label: '奶嘴', price: '119 元' },
      { src: '/diaper.png', label: '尿布', price: '1,899 元' }
    ]
  },
  {
    q: 'Q3：寶寶最喜歡的食物是？\n\n(A) 蒜味麵包\n(B) 蔥花麵包\n(C) 蛋塔',
    a: '解答：(A) 蒜味麵包',
  },
  {
    q: 'Q4：請猜出以下哪個狀況是寶寶不會反胃的情境？\n\n(A) 吃韭菜水餃\n(B) 早起上班\n(C) 聽李龍傑碎碎念',
    a: '解答：(C) 聽李龍傑碎碎念',
  },
  {
    q: 'Q5：每當寶寶造反時，以下哪個「不是」李龍傑會有的行為？\n\n(A) 威脅要煮胡蘿蔔給他吃\n(B) 對他碎碎念\n(C) 威脅要咬他腿庫肉',
    a: '解答：(C) 威脅要咬他腿庫肉',
  },
  {
    q: 'Q6：請猜寶寶上一次第 12 周產檢的頭臀長是多少公分？\n\n(A) 4.85公分\n(B) 5.92公分\n(C) 6.31公分',
    a: '解答：(B) 5.92公分',
  },
  {
    q: 'Q7：請問茶茶假日一天最多可以睡幾個小時？\n\n(A) 11小時\n(B) 12小時\n(C) 13小時',
    a: '解答：(B) 12小時',
  },
];

const EVENTS = [
  { id: 'game1', title: '關卡一：終極巨嬰爭霸戰' },
  { id: 'game2', title: '關卡二：舌尖上的米其林' },
  ...QA_LIST.map((qa, i) => ({ id: `q${i + 1}`, title: `關卡三 - ${qa.q.split('\n')[0]}` }))
];

type StepInfo = {
  bg: string;
  isQA?: boolean;
  qaIndex?: number;
  showAnswer?: boolean;
  isScoreInput?: boolean;
  eventId?: string;
  eventTitle?: string;
  isScoreboard?: boolean;
};

// Generate steps dynamically
const steps: StepInfo[] = [
  { bg: '/活動主頁.png' },
  { bg: '/活動一.png' },
  { bg: '/活動一.png', isScoreInput: true, eventId: 'game1', eventTitle: '關卡一：終極巨嬰爭霸戰' },
  { bg: '/活動二.png' },
  { bg: '/活動二.png', isScoreInput: true, eventId: 'game2', eventTitle: '關卡二：舌尖上的米其林' },
  { bg: '/活動三.png' }, // Base Game 3 background
];

QA_LIST.forEach((qa, index) => {
  steps.push({ bg: '/活動三.png', isQA: true, qaIndex: index, showAnswer: false });
  steps.push({ bg: '/活動三.png', isQA: true, qaIndex: index, showAnswer: true, isScoreInput: true, eventId: `q${index + 1}`, eventTitle: `關卡三 - ${qa.q.split('\n')[0]}` });
});

// Final scoreboard page
steps.push({ bg: '/活動主頁.png', isScoreboard: true });

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() => {
    const saved = localStorage.getItem('reveal_party_scores_v4');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('reveal_party_scores_v4', JSON.stringify(scores));
  }, [scores]);

  const handleAddScore = (eventId: string, player: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScores(prev => {
      const currentEventScores = prev[eventId] || { '吉伶': 0, '心羚': 0, '亭羽': 0 };
      return {
        ...prev,
        [eventId]: { ...currentEventScores, [player]: (currentEventScores[player] || 0) + 1 }
      };
    });
  };

  const handleMinusScore = (eventId: string, player: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScores(prev => {
      const currentEventScores = prev[eventId] || { '吉伶': 0, '心羚': 0, '亭羽': 0 };
      return {
        ...prev,
        [eventId]: { ...currentEventScores, [player]: Math.max(0, (currentEventScores[player] || 0) - 1) }
      };
    });
  };

  const getScore = (eventId: string, player: string) => {
    return scores[eventId]?.[player] || 0;
  };

  const getTotalScore = (player: string) => {
    let total = 0;
    Object.values(scores).forEach(eventScores => {
      total += (eventScores[player] || 0);
    });
    return total;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const step = steps[currentStep];
  const currentQA = step.isQA && step.qaIndex !== undefined ? QA_LIST[step.qaIndex] : null;

  const renderScoreInput = (eventId: string, eventTitle: string, hideTitle = false) => (
    <div className="mt-8 border-t-2 border-slate-100 pt-8 w-full">
      {!hideTitle && <h3 className="text-xl font-bold text-slate-500 mb-6 text-center">👇 點擊人名為【{eventTitle}】加分 👇</h3>}
      {hideTitle && <h3 className="text-xl font-bold text-slate-500 mb-6 text-center">👇 點擊人名加分 👇</h3>}
      <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
        {PLAYERS.map(player => (
          <div key={player} className="flex flex-col items-center gap-2">
            <button
              onClick={(e) => handleAddScore(eventId, player, e)}
              className="px-6 py-4 bg-slate-100 hover:bg-pink-100 hover:text-pink-600 border border-slate-200 hover:border-pink-300 rounded-2xl font-black text-2xl text-slate-700 transition-colors shadow-sm active:scale-95"
            >
              {player}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-pink-500 w-12 text-center">{getScore(eventId, player)} 分</span>
              <button 
                onClick={(e) => handleMinusScore(eventId, player, e)}
                className="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-lg hover:bg-slate-300"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className="w-full h-screen relative bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none"
      onClick={goNext}
    >
      {/* Background Image with crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={step.bg}
          src={encodeURI(step.bg)}
          alt="Background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover md:object-contain" // Keep aspect ratio but fill screen
        />
      </AnimatePresence>

      {/* Dark overlay when Lightbox is active */}
      <AnimatePresence>
        {(step.isQA || step.isScoreInput) && !step.isScoreboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 overflow-y-auto"
          >
            {step.isQA && currentQA ? (
              <motion.div
                key={`${step.qaIndex}-${step.showAnswer}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
                className="bg-white/95 rounded-[3rem] p-8 md:p-16 max-w-7xl w-full shadow-2xl border-4 border-rose-200 my-auto"
                onClick={(e) => e.stopPropagation()} // Prevent clicking modal from instantly skipping next
              >
                <div className="flex flex-col items-center text-center space-y-8">
                  <span className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full font-black tracking-widest uppercase text-sm md:text-base border border-pink-200">
                    {step.showAnswer ? '解答揭曉' : '寶寶知識快問快答'}
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight whitespace-pre-wrap">
                    {step.showAnswer ? currentQA.a : currentQA.q}
                  </h2>

                  {currentQA.images && (
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full mt-6">
                      {currentQA.images.map((img, idx) => {
                        const isCorrectAnswer = step.showAnswer && (idx === 1 || idx === 3);
                        return (
                          <div key={idx} className="relative flex flex-col items-center w-[28%] md:w-[18%]">
                            <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold absolute -top-4 shadow-lg z-10 border-2 border-white">
                              {idx + 1}
                            </span>
                            <div className={`relative w-full rounded-2xl overflow-hidden shadow-md aspect-[3/4] ${isCorrectAnswer ? 'ring-8 ring-pink-500 scale-105 z-10' : ''}`}>
                              <img src={encodeURI(img)} alt={`選項 ${idx + 1}`} className="w-full h-full object-cover" />
                              {isCorrectAnswer && (
                                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                  <span className="text-pink-600 bg-white/90 px-4 py-2 rounded-full font-black text-sm md:text-lg whitespace-nowrap shadow-xl">
                                    正確!
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {currentQA.images2 && (
                    <div className="flex justify-center gap-8 md:gap-12 w-full mt-6">
                      {currentQA.images2.map((item, idx) => (
                        <div key={idx} className="relative flex flex-col items-center max-w-[250px]">
                          <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 p-2">
                            <img src={encodeURI(item.src)} alt={item.label} className="w-full h-auto object-contain aspect-square" />
                          </div>
                          <div className="mt-4 text-center">
                            <span className="block text-xl font-black text-slate-700">{item.label}</span>
                            {step.showAnswer && (
                              <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="block text-2xl font-black text-rose-500 mt-2"
                              >
                                {item.price}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.showAnswer && step.isScoreInput && step.eventId && renderScoreInput(step.eventId, step.eventTitle || '', true)}
                  
                  <div className="pt-8">
                    <button 
                      onClick={goNext}
                      className="px-10 py-5 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                      {step.showAnswer ? (step.qaIndex === QA_LIST.length - 1 ? '完成問答！' : '下一題') : '顯示答案'}
                      <ChevronRight size={28} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : step.isScoreInput && !step.isQA ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
                className="bg-white/95 rounded-[3rem] p-8 md:p-16 max-w-4xl w-full shadow-2xl border-4 border-rose-200 my-auto text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Award size={64} className="text-pink-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-8">
                  {step.eventTitle} 結算
                </h2>
                
                {step.eventId && renderScoreInput(step.eventId, step.eventTitle || '')}
                
                <div className="pt-8">
                  <button 
                    onClick={goNext}
                    className="mx-auto px-10 py-5 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    結算完成，前往下一關卡
                    <ChevronRight size={28} />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Scoreboard Modal */}
      <AnimatePresence>
        {step.isScoreboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-[3rem] p-8 md:p-12 w-full max-w-5xl shadow-2xl flex flex-col items-center my-auto">
              <div className="flex items-center gap-4 mb-8">
                <Trophy size={48} className="text-amber-400" />
                <h2 className="text-4xl md:text-5xl font-black text-slate-800">最終成績統計表</h2>
                <Trophy size={48} className="text-amber-400" />
              </div>

              {/* Table Scoreboard */}
              <div className="w-full overflow-x-auto mb-10">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 border-b-2 border-slate-200 text-slate-400 font-bold text-left">關卡 / 題目</th>
                      {PLAYERS.map(player => (
                        <th key={player} className="p-4 border-b-2 border-slate-200 text-slate-700 font-black text-xl">
                          {player}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EVENTS.map(event => (
                      <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 border-b border-slate-100 text-slate-600 font-bold text-left">
                          {event.title}
                        </td>
                        {PLAYERS.map(player => (
                          <td key={`${event.id}-${player}`} className="p-4 border-b border-slate-100 text-slate-700 font-bold text-lg">
                            {getScore(event.id, player) > 0 ? (
                              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg">
                                {getScore(event.id, player)}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-amber-50/50">
                      <td className="p-4 border-t-4 border-amber-200 text-amber-600 font-black text-xl text-left">
                        總分加總
                      </td>
                      {PLAYERS.map(player => (
                        <td key={`total-${player}`} className="p-4 border-t-4 border-amber-200 text-pink-500 font-black text-3xl">
                          {getTotalScore(player)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center gap-8 md:gap-16 w-full flex-wrap">
                {PLAYERS.map(player => (
                  <div key={player} className="flex flex-col items-center bg-white px-8 py-6 rounded-3xl border-4 border-slate-100 shadow-xl transform transition-transform hover:scale-105">
                    <span className="text-2xl md:text-3xl font-black text-slate-700 mb-4">{player}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl md:text-7xl font-black text-pink-500">{getTotalScore(player)}</span>
                      <span className="text-xl font-bold text-slate-400">分</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls (Hover to show or always subtle) */}
      <div 
        className="fixed bottom-6 right-6 flex gap-3 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={goPrev}
          disabled={currentStep === 0}
          className="w-14 h-14 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/20"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
          className="w-14 h-14 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/20"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-bold border border-white/20 pointer-events-none z-50">
        {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
}

