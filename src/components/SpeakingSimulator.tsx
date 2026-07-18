import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Users, Square, Play, Pause, 
  Clock, Award, Sparkles, ChevronRight, UserCheck, 
  RefreshCw 
} from 'lucide-react';
import { ieltsMockData } from '../data/ieltsMockData';

interface SpeakingSimulatorProps {
  lang: 'UZ' | 'EN';
  candidateName?: string;
  onComplete: (speakingData: any) => void;
}

export const SpeakingSimulator: React.FC<SpeakingSimulatorProps> = ({ lang, candidateName, onComplete }) => {
  const parts = ieltsMockData.speaking;

  // Mode Selection: 'select' | 'candidate' | 'examiner'
  const [mode, setMode] = useState<'select' | 'candidate' | 'examiner'>('select');

  // Zoom Call Mock States
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  
  // Test navigation states
  const [activePartIdx, setActivePartIdx] = useState(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [prepTimerActive, setPrepTimerActive] = useState(false);

  // Subtitle/Simulated Speech state
  const [simulatedSubtitles, setSimulatedSubtitles] = useState<string>('');
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);

  // User recordings (Candidate Mode)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState<Record<string, string>>({});
  const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  // Examiner Scores (Examiner Mode)
  const [examinerScores, setExaminerScores] = useState({
    fc: 7.0,
    lr: 7.0,
    gra: 7.0,
    pr: 7.0,
    feedback: ''
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playbackRef = useRef<HTMLAudioElement | null>(null);

  const currentPart = parts[activePartIdx];
  const isPart2 = currentPart.part === 2;
  const currentQuestionText = isPart2 
    ? (currentPart.cueCard?.topic || '') 
    : (currentPart.questions[activeQuestionIdx] || '');

  // Subtitle simulation texts for Candidate (when User is Examiner)
  const candidateSimulations: Record<string, string> = {
    "Let's talk about where you live. Do you live in a house or an apartment?": 
      "Umm, actually, I live in a modern apartment situated in the heart of Tashkent. It's a three-room flat on the seventh floor of a high-rise building, which provides a beautiful view of the city, especially during the sunset.",
    "What do you like most about your hometown?":
      "What I cherish most about Tashkent is the unique blend of historic monuments and futuristic architectural marvels. The metro system is also marvelous, with distinct artistic motifs in each station, and the people are extremely hospitable.",
    "Do prefer studying in the morning or in the evening? Why?":
      "Personally, I find myself highly productive during the late hours of the evening. The surroundings are quiet, there are fewer distractions, and I can concentrate fully on my learning materials without interruptions.",
    "Describe a book you read recently that you found useful.":
      "I'd like to talk about Atomic Habits by James Clear. I read it three months ago. It explains how minor changes in our daily routine can compound into massive life-altering results. It was incredibly practical for my IELTS preparation.",
    "Do you think paper books will eventually be replaced by digital ebooks?":
      "In my perspective, while ebooks are growing in popularity due to their portability, physical books will never completely disappear. Many people, including myself, prefer the tactile feel and smell of paper.",
    "Why is it important for children to develop a habit of reading early in life?":
      "Cultivating a reading habit early on is paramount because it expands vocabulary, enhances cognitive skills, and sparks imagination. It lays a solid foundation for academic success later in life.",
    "How has the internet changed the way people consume information compared to the past?":
      "The internet has democratized information. In the past, people relied on physical newspapers or television, which were slow. Today, we get instantaneous global news, though it also creates issues with fake news."
  };

  // Trigger candidate speaking simulation in Examiner Mode
  useEffect(() => {
    if (mode === 'examiner' && currentQuestionText) {
      setSimulatedSubtitles(lang === 'UZ' ? "[Nomzod sizning savolingizni kutmoqda. 'Savol berish' tugmasini bosing]" : "[Candidate is waiting. Click 'Ask Question' to begin]");
      setIsCandidateSpeaking(false);
    }
  }, [currentQuestionText, mode]);

  // Preparation Timer Handler
  useEffect(() => {
    let interval: any;
    if (prepTimerActive && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft(prev => {
          if (prev <= 1) {
            setPrepTimerActive(false);
            if (mode === 'candidate') {
              startRecording();
            } else {
              simulateCandidateSpeech();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [prepTimerActive, prepTimeLeft]);

  const startPrepTimer = () => {
    setPrepTimeLeft(60);
    setPrepTimerActive(true);
  };

  const skipPrepTimer = () => {
    setPrepTimerActive(false);
    if (mode === 'candidate') {
      startRecording();
    } else {
      simulateCandidateSpeech();
    }
  };

  // Simulate speech for virtual candidate
  const simulateCandidateSpeech = () => {
    setIsCandidateSpeaking(true);
    setSimulatedSubtitles(lang === 'UZ' ? "[Nomzod javob bermoqda...]" : "[Candidate is thinking...]");
    
    setTimeout(() => {
      const response = candidateSimulations[currentQuestionText] || "That's an interesting question. I believe that it depends on various aspects, but overall it has a substantial impact on our daily activities.";
      setSimulatedSubtitles(response);
    }, 1500);
  };

  // Candidate Mode: Voice Recorder Actions
  const startRecording = async () => {
    audioChunksRef.current = [];
    setAudioPlaybackUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioPlaybackUrl(url);

        const key = `part${currentPart.part}_q${activeQuestionIdx}`;
        setRecordedBlobs(prev => ({
          ...prev,
          [key]: url
        }));

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setMicMuted(false);
    } catch (err) {
      console.error("Microphone error:", err);
      setIsRecording(true);
      // fallback simulation
      setTimeout(() => {
        setIsRecording(false);
        const dummyUrl = "dummy_recording_url";
        setAudioPlaybackUrl(dummyUrl);
        const key = `part${currentPart.part}_q${activeQuestionIdx}`;
        setRecordedBlobs(prev => ({
          ...prev,
          [key]: dummyUrl
        }));
      }, 4000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!playbackRef.current) return;
    if (isPlayingBack) {
      playbackRef.current.pause();
      setIsPlayingBack(false);
    } else {
      playbackRef.current.play().then(() => {
        setIsPlayingBack(true);
      }).catch(err => console.log(err));
    }
  };

  const handleNext = () => {
    setAudioPlaybackUrl(null);
    setIsPlayingBack(false);
    setIsCandidateSpeaking(false);
    setSimulatedSubtitles('');

    if (isPart2) {
      setActivePartIdx(prev => prev + 1);
      setActiveQuestionIdx(0);
    } else {
      if (activeQuestionIdx < currentPart.questions.length - 1) {
        setActiveQuestionIdx(prev => prev + 1);
      } else {
        if (activePartIdx < parts.length - 1) {
          setActivePartIdx(prev => prev + 1);
          setActiveQuestionIdx(0);
        } else {
          handleFinish();
        }
      }
    }
  };

  const handleFinish = () => {
    if (mode === 'examiner') {
      // Calculate overall candidate band
      const overall = parseFloat(((examinerScores.fc + examinerScores.lr + examinerScores.gra + examinerScores.pr) / 4).toFixed(2));
      onComplete({
        mode: 'examiner',
        overall,
        fc: examinerScores.fc,
        lr: examinerScores.lr,
        gra: examinerScores.gra,
        pr: examinerScores.pr,
        feedback: examinerScores.feedback
      });
    } else {
      onComplete({
        mode: 'candidate',
        recordings: recordedBlobs
      });
    }
  };

  const handleScoreChange = (criteria: keyof typeof examinerScores, val: number) => {
    setExaminerScores(prev => ({
      ...prev,
      [criteria]: val
    }));
  };

  if (mode === 'select') {
    return (
      <div className="animate-fade-in" style={{
        maxWidth: '700px',
        margin: '60px auto',
        padding: '30px',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <span style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'hsl(var(--primary))',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              ZOOM SIMULATOR
            </span>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {lang === 'UZ' ? "Zoom Speaking Rolini Tanlang" : "Choose Your Speaking Role"}
            </h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem' }}>
              {lang === 'UZ' 
                ? "Zoom muloqot formatida imtihon topshirish yoki imtihon olish rolini tanlang."
                : "Select whether you want to take the exam as a candidate or conduct it as an examiner."}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Candidate selection */}
            <div 
              onClick={() => setMode('candidate')}
              className="glass-card" 
              style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                color: 'hsl(var(--secondary))',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mic size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                  {lang === 'UZ' ? "Nomzod (Candidate)" : "Candidate"}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                  {lang === 'UZ' 
                    ? "Examiner savol beradi, siz mikrofonga javob yozasiz."
                    : "The examiner asks questions, and you record your speaking."}
                </p>
              </div>
            </div>

            {/* Examiner selection */}
            <div 
              onClick={() => setMode('examiner')}
              className="glass-card" 
              style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                color: 'hsl(var(--accent-purple))',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                  {lang === 'UZ' ? "Imtihon oluvchi (Examiner)" : "Examiner"}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                  {lang === 'UZ' 
                    ? "Siz Examiner bo'lasiz. Nomzod javob beradi va siz uni baholaysiz."
                    : "You act as the Examiner, interview a candidate, and grade them."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zoom-call-container animate-fade-in" style={{ height: 'calc(100vh - 70px)' }}>
      {/* Zoom Video Grid */}
      <div className="zoom-call-grid">
        
        {/* Examiner Screen (Left/Top) */}
        <div className={`zoom-screen ${mode === 'candidate' && !isCandidateSpeaking ? 'active-speaker' : ''}`}>
          {videoOff && mode === 'examiner' ? (
            <div className="zoom-avatar-container">EX</div>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', background: '#252525' }}>
              <div className="zoom-avatar-container">
                {mode === 'examiner' ? 'EX' : 'AM'}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>
                {mode === 'examiner' ? "You (Examiner)" : "Examiner (Abdurahmon Moydionov)"}
              </span>
            </div>
          )}

          {/* Mute indicator */}
          {micMuted && mode === 'examiner' && (
            <div className="zoom-audio-indicator" style={{ color: 'red' }}>
              <MicOff size={16} />
            </div>
          )}

          <div className="zoom-screen-name">
            {mode === 'examiner' ? (lang === 'UZ' ? "Imtihon oluvchi: Siz" : "Examiner: You") : "Examiner: Abdurahmon Moydionov"}
          </div>
        </div>

        {/* Candidate Screen (Right/Bottom) */}
        <div className={`zoom-screen ${isCandidateSpeaking || (mode === 'candidate' && isRecording) ? 'active-speaker' : ''}`}>
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', background: '#252525' }}>
            <div className="zoom-avatar-container zoom-candidate-avatar">
              {mode === 'examiner' ? 'DM' : (candidateName ? candidateName.trim().split(/\s+/).map(x => x[0]).join('').substring(0, 2).toUpperCase() : 'YO')}
            </div>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>
              {mode === 'examiner' ? (candidateName || "Candidate") : (candidateName || (lang === 'UZ' ? "Siz" : "You"))}
            </span>

            {/* Simulated candidate voice bars when candidate is speaking */}
            {isCandidateSpeaking && (
              <div className="audio-waves" style={{ width: '100px', marginTop: '10px' }}>
                <div className="audio-bar"></div>
                <div className="audio-bar"></div>
                <div className="audio-bar"></div>
                <div className="audio-bar"></div>
              </div>
            )}
          </div>

          <div className="zoom-screen-name">
            {mode === 'examiner' 
              ? `Candidate: ${candidateName || 'Candidate'}` 
              : `${lang === 'UZ' ? 'Nomzod' : 'Candidate'}: ${candidateName || (lang === 'UZ' ? 'Siz' : 'You')}`}
          </div>
        </div>

      </div>

      {/* Subtitle / Subtitles Overlay */}
      {simulatedSubtitles && (
        <div className="zoom-captions">
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(var(--secondary))', fontWeight: 700, marginBottom: '4px' }}>
            {mode === 'examiner' ? "Candidate Response Subtitles" : "Examiner Prompt"}
          </p>
          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
            {simulatedSubtitles}
          </span>
        </div>
      )}

      {/* Sidebar: Examiner Grading Panel (ONLY in Examiner Mode) */}
      {mode === 'examiner' && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '320px',
          maxHeight: 'calc(100% - 120px)',
          overflowY: 'auto',
          zIndex: 20,
          background: 'rgba(20,20,20,0.95)',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h4 style={{ fontSize: '1.1rem', color: 'hsl(var(--accent-purple))', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Award size={18} />
            <span>Examiner Grading Suite</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            {/* FC */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Fluency & Coherence</span>
                <span style={{ fontWeight: 700, color: 'hsl(var(--secondary))' }}>Band {examinerScores.fc}</span>
              </div>
              <input 
                type="range" min="1" max="9" step="0.5" 
                value={examinerScores.fc} 
                onChange={(e) => handleScoreChange('fc', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'hsl(var(--secondary))' }}
              />
            </div>

            {/* LR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Lexical Resource</span>
                <span style={{ fontWeight: 700, color: 'hsl(var(--secondary))' }}>Band {examinerScores.lr}</span>
              </div>
              <input 
                type="range" min="1" max="9" step="0.5" 
                value={examinerScores.lr} 
                onChange={(e) => handleScoreChange('lr', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'hsl(var(--secondary))' }}
              />
            </div>

            {/* GRA */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Grammatical Range</span>
                <span style={{ fontWeight: 700, color: 'hsl(var(--secondary))' }}>Band {examinerScores.gra}</span>
              </div>
              <input 
                type="range" min="1" max="9" step="0.5" 
                value={examinerScores.gra} 
                onChange={(e) => handleScoreChange('gra', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'hsl(var(--secondary))' }}
              />
            </div>

            {/* PR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Pronunciation</span>
                <span style={{ fontWeight: 700, color: 'hsl(var(--secondary))' }}>Band {examinerScores.pr}</span>
              </div>
              <input 
                type="range" min="1" max="9" step="0.5" 
                value={examinerScores.pr} 
                onChange={(e) => handleScoreChange('pr', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'hsl(var(--secondary))' }}
              />
            </div>

            {/* Feedback Notes */}
            <div style={{ marginTop: '10px' }}>
              <span style={{ display: 'block', marginBottom: '6px' }}>Feedback Notes (Uzbek/English)</span>
              <textarea 
                value={examinerScores.feedback}
                onChange={(e) => handleScoreChange('feedback', e.target.value as any)}
                placeholder="Grammatika va talaffuz bo'yicha tavsiyalaringizni kiriting..."
                style={{
                  width: '100%',
                  height: '60px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '8px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Zoom Bottom Control Bar */}
      <div className="zoom-controls-bar">
        {/* Left Control block: Mute and Stop Video buttons */}
        <div className="zoom-controls-group">
          <button 
            onClick={() => setMicMuted(!micMuted)}
            className={`zoom-control-btn ${micMuted ? 'active' : ''}`}
          >
            {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
            <span>{micMuted ? "Unmute" : "Mute"}</span>
          </button>

          <button 
            onClick={() => setVideoOff(!videoOff)}
            className={`zoom-control-btn ${videoOff ? 'active' : ''}`}
          >
            {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
            <span>{videoOff ? "Start Video" : "Stop Video"}</span>
          </button>
        </div>

        {/* Center Control block: Zoom interactive buttons */}
        <div className="zoom-controls-group">
          {/* Candidate Mode Recorder Buttons */}
          {mode === 'candidate' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              
              {/* Prepare timer */}
              {isPart2 && prepTimeLeft > 0 && (
                <div style={{ background: '#222', border: '1px solid orange', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Clock size={14} color="orange" />
                  <span>Prep: {prepTimeLeft}s</span>
                  {!prepTimerActive ? (
                    <button onClick={startPrepTimer} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', marginLeft: '6px' }}>Start</button>
                  ) : (
                    <button onClick={skipPrepTimer} style={{ background: 'transparent', border: 'none', color: '#06b6d4', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', marginLeft: '6px' }}>Skip</button>
                  )}
                </div>
              )}

              {!isRecording && !audioPlaybackUrl && (
                <button 
                  onClick={startRecording}
                  className="btn-primary"
                  style={{ background: '#ea4335', padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <Mic size={14} />
                  {lang === 'UZ' ? "Javob yozish" : "Record"}
                </button>
              )}

              {isRecording && (
                <button 
                  onClick={stopRecording}
                  className="btn-primary"
                  style={{ background: '#888', padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <Square size={14} />
                  {lang === 'UZ' ? "To'xtatish" : "Stop"}
                </button>
              )}

              {audioPlaybackUrl && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={togglePlayback} 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#06b6d4', color: '#06b6d4' }}
                  >
                    {isPlayingBack ? <Pause size={12} /> : <Play size={12} />}
                    {lang === 'UZ' ? "Eshitish" : "Listen"}
                  </button>
                  <button 
                    onClick={startRecording} 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    <RefreshCw size={12} />
                    {lang === 'UZ' ? "Qayta yozish" : "Retry"}
                  </button>
                </div>
              )}

              {audioPlaybackUrl && audioPlaybackUrl !== "dummy_recording_url" && (
                <audio ref={playbackRef} src={audioPlaybackUrl} onEnded={() => setIsPlayingBack(false)} style={{ display: 'none' }} />
              )}
            </div>
          )}

          {/* Examiner Mode Simulator Buttons */}
          {mode === 'examiner' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={simulateCandidateSpeech}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                disabled={isCandidateSpeaking}
              >
                <Sparkles size={14} />
                {lang === 'UZ' ? "Nomzoddan so'rash" : "Ask Candidate"}
              </button>
            </div>
          )}

          <button 
            onClick={() => setShowParticipants(!showParticipants)} 
            className="zoom-control-btn"
          >
            <Users size={20} />
            <span>Participants (2)</span>
          </button>
        </div>

        {/* Right block: End Meeting / Next Question */}
        <div className="zoom-controls-group">
          <button 
            onClick={handleNext}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'
            }}
          >
            <span>
              {activeQuestionIdx < currentPart.questions.length - 1 || activePartIdx < parts.length - 1
                ? (lang === 'UZ' ? "Keyingi Savol" : "Next Question")
                : (lang === 'UZ' ? "Muloqotni Yakunlash" : "End Meeting")}
            </span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Participants Popover panel */}
      {showParticipants && (
        <div className="glass-panel" style={{
          position: 'absolute',
          bottom: '90px',
          right: '24px',
          width: '250px',
          background: 'rgba(20,20,20,0.95)',
          padding: '16px',
          zIndex: 100,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h5 style={{ color: 'white', marginBottom: '10px', fontSize: '0.85rem' }}>Meeting Participants</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Abdurahmon Moydionov (Examiner)</span>
              <span style={{ color: '#06b6d4', fontSize: '0.7rem' }}>HOST</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{candidateName || (lang === 'UZ' ? "Siz (Nomzod)" : "You (Candidate)")}</span>
              <span style={{ color: '#888', fontSize: '0.7rem' }}>CANDIDATE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
