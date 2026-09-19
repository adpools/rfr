import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioAmbienceToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  const toggleAudio = () => {
    if (isPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          setIsPlaying(false);
        }, 500);
      }
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }

        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.setTargetAtTime(0.06, ctx.currentTime, 1.2); // Very gentle, warm ambient volume
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Warm sub-bass atmospheric drone (55Hz / A1)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);
        osc1.connect(masterGain);
        osc1.start();
        osc1Ref.current = osc1;

        // Subtle shimmering harmonic (165Hz / E3)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(165, ctx.currentTime);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(0.02, ctx.currentTime);
        osc2.connect(osc2Gain);
        osc2Gain.connect(masterGain);
        osc2.start();
        osc2Ref.current = osc2;

        setIsPlaying(true);
      } catch {
        // graceful fallback if browser blocks audio
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      try {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        audioCtxRef.current?.close();
      } catch {
        // cleanup safe
      }
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      data-cursor="SOUND"
      aria-label="Toggle Luxury Ambience Audio"
      className="fixed bottom-6 left-6 z-[9000] p-3 rounded-full bg-[#111111]/80 backdrop-blur-xl border border-[#C7A46A]/30 hover:border-[#C7A46A] text-[#FAF9F6] transition-all duration-300 shadow-xl flex items-center gap-2.5 group"
    >
      {isPlaying ? (
        <>
          <Volume2 size={16} className="text-[#C7A46A] animate-pulse" />
          <span className="text-[10px] tracking-widest font-mono uppercase text-[#C7A46A] pr-1 hidden group-hover:inline">
            AMBIENCE ON
          </span>
        </>
      ) : (
        <>
          <VolumeX size={16} className="text-neutral-400 group-hover:text-[#C7A46A]" />
          <span className="text-[10px] tracking-widest font-mono uppercase text-neutral-400 group-hover:text-[#C7A46A] pr-1 hidden group-hover:inline">
            SOUND OFF
          </span>
        </>
      )}
    </button>
  );
};
