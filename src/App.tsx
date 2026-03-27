import React, { useState } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const TOTAL = 20;

const players = [
  { id: 1, label: 'Spieler 1', color: '#1E3A8A', light: '#93C5FD', startX: 90,  endX: 200 },
  { id: 2, label: 'Spieler 2', color: '#84CC16', light: '#D9F99D', startX: 310, endX: 200 },
  { id: 3, label: 'Spieler 3', color: '#DC2626', light: '#FCA5A5', startX: 200, endX: 200 },
];

// Spieler 3 läuft mittig, aber etwas versetzt
const getXY = (playerId, pos) => {
  const i = pos - 1;
  const progress = i / 19;
  if (playerId === 1) {
    return { x: 90 + 110 * progress, y: 365 - i * 15 };
  } else if (playerId === 2) {
    return { x: 310 - 110 * progress, y: 365 - i * 15 };
  } else {
    // Spieler 3: mittige Route, leicht nach rechts versetzt
    return { x: 210, y: 365 - i * 15 };
  }
};

const questionBank = {
  leicht: [
    {
      q: "Was ist die nächste Zahl in der arithmetischen Folge: 3, 7, 11, 15, ...?",
      type: "mc", opts: ["17", "19", "20", "21"], ans: "19",
      exp: "Die Differenz beträgt d = 4, also 15 + 4 = 19"
    },
    {
      q: "Eine arithmetische Folge beginnt mit a₁ = 5 und hat die Differenz d = 3. Was ist das 4. Glied?",
      type: "input", ans: "14",
      exp: "a₄ = 5 + (4−1)·3 = 5 + 9 = 14"
    },
    {
      q: "Was ist die Differenz d in der Folge: 10, 14, 18, 22, ...?",
      type: "mc", opts: ["2", "3", "4", "6"], ans: "4",
      exp: "14 − 10 = 4, die konstante Differenz ist d = 4"
    },
    {
      q: "Ist 2, 4, 8, 16 eine arithmetische Folge?",
      type: "mc", opts: ["Ja", "Nein"], ans: "Nein",
      exp: "Die Differenzen sind nicht konstant (2, 4, 8). Es handelt sich um eine geometrische Folge."
    },
    {
      q: "Was ist das 1. Glied einer arithmetischen Folge mit a₃ = 11 und d = 3?",
      type: "input", ans: "5",
      exp: "a₁ = a₃ − 2·d = 11 − 6 = 5"
    },
    {
      q: "Berechne: a₁ = 2, d = 5 → a₃ = ?",
      type: "input", ans: "12",
      exp: "a₃ = 2 + 2·5 = 12"
    },
  ],
  mittel: [
    {
      q: "Berechne das 10. Glied der arithmetischen Folge mit a₁ = 7 und d = 5",
      type: "input", ans: "52",
      exp: "a₁₀ = 7 + (10−1)·5 = 7 + 45 = 52"
    },
    {
      q: "Summenformel: S = n/2·(a₁ + aₙ). Berechne S₅ für: 3, 7, 11, 15, 19",
      type: "input", ans: "55",
      exp: "S₅ = 5/2·(3 + 19) = 2,5·22 = 55"
    },
    {
      q: "Welche Formel beschreibt das n-te Glied einer arithmetischen Folge?",
      type: "mc", opts: ["aₙ = a₁·n", "aₙ = a₁ + (n−1)·d", "aₙ = a₁ + n·d", "aₙ = d·n"],
      ans: "aₙ = a₁ + (n−1)·d",
      exp: "Die allgemeine Formel lautet aₙ = a₁ + (n−1)·d"
    },
    {
      q: "Eine arithmetische Folge hat a₃ = 14 und a₇ = 30. Bestimme d.",
      type: "input", ans: "4",
      exp: "a₇ − a₃ = 4d → 30 − 14 = 4d → d = 4"
    },
    {
      q: "Was bedeutet das Symbol Σ (Summenzeichen)?",
      type: "mc", opts: ["Produkt aller Glieder", "Summe aller Glieder", "Differenz der Glieder", "Anzahl der Glieder"],
      ans: "Summe aller Glieder",
      exp: "Σ (Sigma) steht für die Summe einer Folge von Termen"
    },
    {
      q: "Berechne: Σᵢ₌₁⁵ (2i + 1) = ?",
      type: "input", ans: "35",
      exp: "3+5+7+9+11 = 35"
    },
  ],
  schwer: [
    {
      q: "Berechne die Summe der ersten 20 Glieder: a₁ = 5, d = 3",
      type: "input", ans: "670",
      exp: "a₂₀ = 5 + 19·3 = 62, S₂₀ = 20/2·(5 + 62) = 10·67 = 670"
    },
    {
      q: "Berechne: Σₖ₌₁¹⁰ (3k − 1) = ?",
      type: "input", ans: "155",
      exp: "= Σ3k − Σ1 = 3·(55) − 10 = 165 − 10 = 155"
    },
    {
      q: "Eine arithmetische Reihe hat S₁₀ = 175 und a₁ = 7. Berechne d.",
      type: "input", ans: "3",
      exp: "175 = 10/2·(2·7 + 9d) → 35 = 14 + 9d → 9d = 21 → d = 7/3 ... Nein: 35 = 14+9d → d=21/9... Korrekt: S₁₀=10/2·(7+a₁₀)=175 → a₁₀=28 → 28=7+9d → d=21/9... Hint: 175=5·(14+9d) → 35=14+9d → d=21/9 ≈ 2,33"
    },
    {
      q: "Für welchen Wert gilt: Σᵢ₌₁ⁿ i = 55 ?",
      type: "input", ans: "10",
      exp: "n(n+1)/2 = 55 → n(n+1) = 110 → n = 10"
    },
    {
      q: "a₁ = 4, aₙ = 40, Sₙ = 176. Wie viele Glieder hat die Reihe?",
      type: "input", ans: "8",
      exp: "Sₙ = n/2·(4+40) = 22n = 176 → n = 8"
    },
    {
      q: "Berechne Σₖ₌₃⁸ (2k + 1)",
      type: "input", ans: "66",
      exp: "k=3: 7, k=4: 9, k=5: 11, k=6: 13, k=7: 15, k=8: 17 → Summe = 72... Korrekt: 7+9+11+13+15+17 = 72"
    },
  ]
};

// Fix wrong answers
questionBank.schwer[2] = {
  q: "Eine arithmetische Reihe hat S₈ = 120 und a₁ = 6. Berechne d.",
  type: "input", ans: "3",
  exp: "S₈ = 8/2·(2·6 + 7d) = 4·(12+7d) = 120 → 12+7d = 30 → 7d = 18 ... Korrekt: 4(12+7d)=120 → 12+7d=30 → 7d=18 → d=18/7 ... Nein: S₈=4(12+7d)=120 → 12+7d=30 → d=18/7. Hint: S₈=120, a₁=6 → 8/2·(12+7d)=120 → 12+7d=30 → d=18/7≈2,57"
};
questionBank.schwer[2] = {
  q: "Eine arithmetische Folge hat a₁ = 2 und a₉ = 26. Berechne S₉.",
  type: "input", ans: "126",
  exp: "S₉ = 9/2·(a₁ + a₉) = 9/2·(2 + 26) = 9/2·28 = 126"
};
questionBank.schwer[5] = {
  q: "Berechne Σₖ₌₃⁸ (2k + 1)",
  type: "input", ans: "72",
  exp: "k=3→7, k=4→9, k=5→11, k=6→13, k=7→15, k=8→17 → Summe: 7+9+11+13+15+17 = 72"
};

const difficulties = {
  leicht: { steps: 2, label: 'Leicht', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
  mittel:  { steps: 3, label: 'Mittel',  bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  schwer:  { steps: 5, label: 'Schwer',  bg: 'bg-red-500', hover: 'hover:bg-red-600' },
};

export default function MountainRaceGame() {
  const [numPlayers, setNumPlayers] = useState(null);
  const [positions, setPositions] = useState({ 1: 0, 2: 0, 3: 0 });
  const [current, setCurrent] = useState(1);
  const [phase, setPhase] = useState('choose');
  const [diff, setDiff] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [used, setUsed] = useState([]);

  const getRandom = (difficulty) => {
    const pool = questionBank[difficulty].filter(q => !used.includes(q));
    const src = pool.length > 0 ? pool : questionBank[difficulty];
    const q = src[Math.floor(Math.random() * src.length)];
    setUsed(u => [...u, q]);
    return q;
  };

  const chooseDiff = (d) => {
    const q = getRandom(d);
    setDiff(d);
    setQuestion(q);
    setAnswer('');
    setPhase('answer');
  };

  const submitAnswer = () => {
    const correct = answer.trim() === question.ans;
    const steps = difficulties[diff].steps;
    setPositions(pos => {
      const newPos = correct ? Math.min(pos[current] + steps, TOTAL) : 0;
      const updated = { ...pos, [current]: newPos };
      if (newPos >= TOTAL) {
        setWinner(current);
        setGameOver(true);
      }
      return updated;
    });
    setFeedback({ correct, explanation: question.exp, correct_ans: question.ans });
    setPhase('feedback');
  };

  const nextTurn = () => {
    setCurrent(c => c === numPlayers ? 1 : c + 1);
    setPhase('choose');
    setDiff(null);
    setQuestion(null);
    setFeedback(null);
  };

  const reset = () => {
    setNumPlayers(null);
    setPositions({ 1: 0, 2: 0, 3: 0 });
    setCurrent(1);
    setPhase('choose');
    setDiff(null);
    setQuestion(null);
    setAnswer('');
    setFeedback(null);
    setGameOver(false);
    setWinner(null);
    setUsed([]);
  };

  const activePlayers = players.filter(p => p.id <= (numPlayers || 3));
  const curP = activePlayers.find(p => p.id === current);

  // Spielerauswahl-Bildschirm
  if (!numPlayers) return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center">
        <div className="text-5xl mb-4">⛰️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Berggipfel-Rennen</h1>
        <p className="text-gray-500 text-sm mb-6">Arithmetische Folgen & Reihen</p>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Wie viele Spieler?</h2>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setNumPlayers(n)}
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition transform hover:scale-105"
              style={{ backgroundColor: n === 1 ? '#1E3A8A' : n === 2 ? '#15803D' : '#DC2626' }}>
              {n === 1 ? '👤' : n === 2 ? '👥' : '👥👤'} {n} {n === 1 ? 'Spieler' : 'Spieler'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-1 text-gray-800">⛰️ Berggipfel-Rennen</h1>
        <p className="text-center text-gray-600 mb-4 text-sm">Arithmetische Folgen, Reihen & Summenzeichen</p>

        {/* Spieler Info */}
        <div className="flex justify-around mb-4 gap-2">
          {activePlayers.map(p => (
            <div key={p.id}
              className="flex-1 p-3 rounded-lg text-center"
              style={{
                backgroundColor: p.color,
                outline: current === p.id && !gameOver ? `4px solid white` : 'none',
                opacity: gameOver ? 1 : 1
              }}>
              <div className="text-white font-bold text-sm">{p.label}</div>
              <div className="text-2xl text-white font-bold">{positions[p.id]}</div>
              <div className="text-white text-xs">/ 20</div>
            </div>
          ))}
        </div>

        {/* Berg SVG */}
        <div className="relative mb-4" style={{height: '380px'}}>
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#E0F6FF" />
              </linearGradient>
              <linearGradient id="mtn" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#DDDDDD" />
                <stop offset="60%" stopColor="#8B7355" />
                <stop offset="100%" stopColor="#5C3D1E" />
              </linearGradient>
            </defs>

            {/* Himmel */}
            <rect width="400" height="400" fill="url(#sky)" />
            {/* Sonne */}
            <circle cx="355" cy="45" r="22" fill="#FFD700" opacity="0.85" />
            {/* Wolken */}
            <ellipse cx="75"  cy="60" rx="32" ry="15" fill="white" opacity="0.7" />
            <ellipse cx="98"  cy="54" rx="38" ry="18" fill="white" opacity="0.7" />
            <ellipse cx="255" cy="75" rx="26" ry="12" fill="white" opacity="0.6" />
            <ellipse cx="278" cy="70" rx="32" ry="15" fill="white" opacity="0.6" />

            {/* Berg */}
            <path d="M 30 382 L 200 48 L 370 382 Z" fill="url(#mtn)" />
            {/* Schneekappe */}
            <path d="M 200 48 L 178 102 L 222 102 Z" fill="white" opacity="0.92" />
            {/* Boden */}
            <rect x="0" y="380" width="400" height="20" fill="#2D5016" />
            <rect x="0" y="378" width="400" height="4" fill="#4A7C2C" />

            {/* Routen */}
            {activePlayers.map(pid => {
              const p = players.find(x => x.id === pid.id);
              return Array.from({ length: 19 }, (_, i) => {
                const a = getXY(pid.id, i + 1);
                const b = getXY(pid.id, i + 2);
                return (
                  <line key={`route-${pid}-${i}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={p.color} strokeWidth="2" strokeDasharray="4,3" opacity="0.35"
                  />
                );
              });
            })}

            {/* Wegpunkte */}
            {activePlayers.map(pid => {
              const p = players.find(x => x.id === pid.id);
              return Array.from({ length: 20 }, (_, i) => {
                const level = i + 1;
                const { x, y } = getXY(pid.id, level);
                return (
                  <g key={`wp-${pid}-${i}`}>
                    <circle cx={x} cy={y} r="3" fill={p.color} stroke="white" strokeWidth="1" opacity="0.45" />
                    {level % 5 === 0 && pid.id === 1 && (
                      <text x={x - 22} y={y + 4} fontSize="11" fill={p.color} fontWeight="bold" opacity="0.8">{level}</text>
                    )}
                    {level % 5 === 0 && pid.id === 2 && (
                      <text x={x + 9} y={y + 4} fontSize="11" fill={p.color} fontWeight="bold" opacity="0.8">{level}</text>
                    )}
                    {level % 5 === 0 && pid.id === 3 && (
                      <text x={x + 9} y={y + 4} fontSize="11" fill={p.color} fontWeight="bold" opacity="0.8">{level}</text>
                    )}
                  </g>
                );
              });
            })}

            {/* Positions-Marker */}
            {activePlayers.map(p => {
              const pos = positions[p.id];
              if (pos === 0) return null;
              const { x, y } = getXY(p.id, pos);
              return (
                <g key={`marker-${p.id}`}>
                  <circle cx={x} cy={y} r="14" fill={p.color} opacity="0.25">
                    <animate attributeName="r" values="14;19;14" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.08;0.25" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r="10" fill={p.color} stroke="white" strokeWidth="3" />
                  <circle cx={x} cy={y} r="4" fill="white" />
                </g>
              );
            })}

            {/* Flagge am Gipfel */}
            <g transform="translate(200, 58)">
              <line x1="0" y1="0" x2="0" y2="-18" stroke="#6B3A1F" strokeWidth="2.5" />
              <path d="M 0 -18 L 16 -13 L 0 -8 Z" fill="#DC2626" />
            </g>
          </svg>
        </div>

        {/* Game Over */}
        {gameOver && (
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center mb-4">
            <Trophy className="w-16 h-16 mx-auto mb-3 text-yellow-500" />
            <h2 className="text-3xl font-bold mb-2" style={{ color: players.find(p => p.id === winner)?.color }}>
              {players.find(p => p.id === winner)?.label} gewinnt! 🎉
            </h2>
            <p className="text-gray-500 mb-4">Gipfel erreicht!</p>
            <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
              <RotateCcw className="w-5 h-5" /> Neues Spiel
            </button>
          </div>
        )}

        {/* Schwierigkeit wählen */}
        {!gameOver && phase === 'choose' && (
          <div className="bg-white rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-1 text-center" style={{ color: curP.color }}>
              {curP.label} ist dran
            </h2>
            <p className="text-center text-gray-500 text-sm mb-4">Wähle deinen Schwierigkeitsgrad:</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(difficulties).map(([key, d]) => (
                <button key={key} onClick={() => chooseDiff(key)}
                  className={`p-4 ${d.bg} ${d.hover} text-white rounded-xl transform hover:scale-105 transition`}>
                  <div className="font-bold">{d.label}</div>
                  <div className="text-2xl font-bold">+{d.steps}</div>
                  <div className="text-xs opacity-80">Schritte</div>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-red-500 mt-3">⚠️ Falsche Antwort = Zurück auf Start!</p>
          </div>
        )}

        {/* Frage */}
        {!gameOver && phase === 'answer' && question && (
          <div className="bg-white rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 ${difficulties[diff].bg} text-white text-sm rounded-full font-bold`}>
                {difficulties[diff].label} · +{difficulties[diff].steps} Schritte
              </span>
              <span className="text-sm text-gray-400" style={{ color: curP.color }}>● {curP.label}</span>
            </div>
            <h3 className="text-lg font-semibold mb-4">{question.q}</h3>
            {question.type === 'mc' ? (
              <div className="space-y-2">
                {question.opts.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition ${answer === opt ? 'border-blue-600 bg-blue-50 font-semibold' : 'border-gray-200 hover:border-blue-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && answer && submitAnswer()}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                placeholder="Deine Antwort..." autoFocus />
            )}
            <button onClick={submitAnswer} disabled={!answer}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition">
              Antwort prüfen ✓
            </button>
          </div>
        )}

        {/* Feedback */}
        {!gameOver && phase === 'feedback' && feedback && (
          <div className="bg-white rounded-xl p-5 shadow-lg">
            <div className={`text-center p-5 rounded-xl mb-4 ${feedback.correct ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
              <div className={`text-4xl mb-2`}>{feedback.correct ? '✅' : '❌'}</div>
              <div className={`text-2xl font-bold ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                {feedback.correct ? 'Richtig!' : 'Falsch!'}
              </div>
              <div className={`text-sm mt-1 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.correct ? `+${difficulties[diff].steps} Schritte vorwärts!` : 'Zurück auf Start!'}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <div className="font-bold text-blue-800 mb-1">📘 Erklärung:</div>
              <div className="text-blue-900 text-sm">{feedback.explanation}</div>
              <div className="mt-2 text-sm text-gray-600">Richtige Antwort: <span className="font-bold text-blue-700">{feedback.correct_ans}</span></div>
            </div>
            <button onClick={nextTurn}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
              Weiter → {activePlayers.find(p => p.id === (current === numPlayers ? 1 : current + 1))?.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
