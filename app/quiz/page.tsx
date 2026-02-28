'use client';
import { useEffect, useState } from 'react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string | null;
}

type Phase = 'start' | 'playing' | 'result';

export default function QuizPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [phase, setPhase] = useState<Phase>('start');
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/quiz')
            .then(r => r.json())
            .then(d => { setQuestions(d); setLoading(false); });
    }, []);

    const q = questions[current];
    const progress = questions.length > 0 ? ((current) / questions.length) * 100 : 0;

    function selectAnswer(idx: number) {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === q.correct) setScore(s => s + 1);
    }

    function next() {
        if (current + 1 >= questions.length) {
            setPhase('result');
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswered(false);
        }
    }

    function restart() {
        setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setPhase('start');
    }

    const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const resultMsg = scorePct >= 80 ? '🎉 Luar Biasa! Kamu ahli mangrove!' : scorePct >= 60 ? '👏 Bagus! Terus belajar!' : '📚 Terus semangat belajar ya!';

    if (loading) return <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>⏳ Memuat soal...</div>;

    const cardStyle = {
        background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.75))',
        backdropFilter: 'blur(20px)', borderRadius: 24, padding: '40px',
        boxShadow: 'var(--shadow-intense)', border: '1px solid rgba(255,255,255,0.3)',
    };

    return (
        <div className="container" style={{ maxWidth: 900 }}>
            {/* Quiz Header / Progress */}
            <div style={{ ...cardStyle, textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{
                    fontSize: '2.4rem', fontWeight: 800, marginBottom: 12,
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Quiz Mangrove</h1>
                <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Uji pengetahuanmu tentang ekosistem mangrove Indonesia!</p>
                {phase === 'playing' && (
                    <>
                        <div style={{ height: 12, borderRadius: 50, background: 'rgba(255,255,255,0.5)', overflow: 'hidden', marginBottom: 8, boxShadow: 'inset 0 2px 8px rgba(22,163,74,0.1)' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', transition: 'width 0.5s ease', borderRadius: 50 }} />
                        </div>
                        <span style={{ color: 'var(--accent-dark)', fontWeight: 600, fontSize: '0.9rem' }}>
                            Soal {current + 1} dari {questions.length}
                        </span>
                    </>
                )}
            </div>

            {/* START SCREEN */}
            {phase === 'start' && (
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 24 }}>🌿</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, color: 'var(--dark)' }}>Siap Mulai Quiz?</h2>
                    <p style={{ color: 'var(--muted)', marginBottom: 32, lineHeight: 1.7 }}>
                        Terdapat <strong>{questions.length} soal</strong> seputar ekosistem mangrove Indonesia. Pilih jawaban yang benar!
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32, textAlign: 'left' }}>
                        {[
                            { icon: '📝', title: `${questions.length} Pertanyaan`, desc: 'Pilihan ganda' },
                            { icon: '✅', title: 'Feedback Langsung', desc: 'Jawaban benar/salah ditampilkan' },
                            { icon: '🏆', title: 'Skor Akhir', desc: 'Nilai dan peringkat ditampilkan' },
                        ].map(f => (
                            <div key={f.title} style={{
                                background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.1)',
                                borderRadius: 12, padding: 20,
                            }}>
                                <span style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'block', marginBottom: 8 }}>{f.icon}</span>
                                <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setPhase('playing')} style={{
                        padding: '18px 40px', background: 'var(--gradient-primary)', color: 'white',
                        border: 'none', borderRadius: 50, fontSize: '1.1rem', fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.3)', transition: 'all var(--transition)',
                    }}>
                        Mulai Quiz 🌿
                    </button>
                </div>
            )}

            {/* PLAYING */}
            {phase === 'playing' && q && (
                <div style={cardStyle}>
                    <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>
                        Pertanyaan {current + 1}
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--dark)', marginBottom: 28, lineHeight: 1.6 }}>
                        {q.question}
                    </h2>
                    <div style={{ display: 'grid', gap: 16, marginBottom: 28 }}>
                        {(q.options as string[]).map((opt, idx) => {
                            let bg = 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))';
                            let border = '2px solid rgba(22,163,74,0.1)';
                            if (answered) {
                                if (idx === q.correct) { bg = 'linear-gradient(145deg, rgba(34,197,94,0.15), rgba(34,197,94,0.1))'; border = '2px solid #22c55e'; }
                                else if (idx === selected) { bg = 'linear-gradient(145deg, rgba(239,68,68,0.15), rgba(239,68,68,0.1))'; border = '2px solid #ef4444'; }
                            } else if (idx === selected) {
                                bg = 'linear-gradient(145deg, rgba(22,163,74,0.1), rgba(22,163,74,0.05))'; border = '2px solid var(--accent)';
                            }
                            return (
                                <button key={idx} onClick={() => selectAnswer(idx)} disabled={answered} style={{
                                    background: bg, border, borderRadius: 16, padding: 20,
                                    cursor: answered ? 'default' : 'pointer', textAlign: 'left',
                                    fontSize: '1.05rem', fontWeight: 500, color: 'var(--dark)',
                                    transition: 'all 0.3s ease', fontFamily: 'inherit',
                                    animation: answered && idx === selected && idx !== q.correct ? 'shake 0.4s ease' : undefined,
                                }}>
                                    <span style={{ marginRight: 12, fontWeight: 700, color: 'var(--accent)' }}>
                                        {String.fromCharCode(65 + idx)}.
                                    </span>
                                    {opt}
                                    {answered && idx === q.correct && ' ✓'}
                                    {answered && idx === selected && idx !== q.correct && ' ✗'}
                                </button>
                            );
                        })}
                    </div>

                    {answered && q.explanation && (
                        <div style={{
                            background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)',
                            borderRadius: 16, padding: '20px', marginBottom: 24,
                        }}>
                            <p style={{ color: 'var(--dark)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                <strong style={{ color: 'var(--accent)' }}>Penjelasan:</strong> {q.explanation}
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={next} disabled={!answered} style={{
                            padding: '14px 32px', background: answered ? 'var(--gradient-primary)' : 'rgba(200,200,200,0.5)',
                            color: answered ? 'white' : '#aaa', border: 'none', borderRadius: 50,
                            fontWeight: 700, fontSize: '1rem', cursor: answered ? 'pointer' : 'not-allowed',
                            fontFamily: 'inherit', transition: 'all var(--transition)',
                        }}>
                            {current + 1 === questions.length ? 'Lihat Hasil →' : 'Soal Berikutnya →'}
                        </button>
                    </div>
                </div>
            )}

            {/* RESULT */}
            {phase === 'result' && (
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                    <div style={{
                        width: 180, height: 180, borderRadius: '50%',
                        background: `conic-gradient(#22c55e 0deg, #22c55e ${scorePct * 3.6}deg, rgba(22,163,74,0.1) ${scorePct * 3.6}deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px', position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute', inset: 20, borderRadius: '50%',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{
                                fontSize: '3rem', fontWeight: 800,
                                background: 'var(--gradient-primary)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>{scorePct}%</span>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12, color: 'var(--dark)' }}>{resultMsg}</h2>
                    <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '1.05rem' }}>
                        Kamu menjawab <strong>{score}</strong> dari <strong>{questions.length}</strong> soal dengan benar.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
                        {[
                            { label: 'Benar', val: score, color: '#22c55e' },
                            { label: 'Salah', val: questions.length - score, color: '#ef4444' },
                            { label: 'Skor', val: `${scorePct}%`, color: 'var(--accent)' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'rgba(255,255,255,0.6)', padding: 24,
                                borderRadius: 16, border: '1px solid rgba(22,163,74,0.1)',
                            }}>
                                <span style={{ fontSize: '2rem', fontWeight: 800, color: s.color, display: 'block', marginBottom: 4 }}>{s.val}</span>
                                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={restart} style={{
                        padding: '16px 36px', background: 'var(--gradient-primary)', color: 'white',
                        border: 'none', borderRadius: 50, fontSize: '1rem', fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.3)', fontFamily: 'inherit',
                    }}>
                        Coba Lagi 🔄
                    </button>
                </div>
            )}
        </div>
    );
}
