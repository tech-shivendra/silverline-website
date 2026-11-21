'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Gamepad2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  type: 'energy' | 'obstacle';
}

export const PixelRushGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Audio Context (Synthesizer for retro sounds)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted yet
    }
  };

  // Restore high score from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('silverline_pixelrush_highscore');
      if (stored) setHighScore(parseInt(stored, 10));
    } catch {
      // Storage unavailable
    }
  }, []);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('silverline_pixelrush_highscore', score.toString());
      } catch {
        // Storage unavailable
      }
    }
  }, [score, highScore]);

  // Game Engine State Refs
  const playerRef = useRef({ x: 250, y: 350, width: 26, height: 26, vx: 0, vy: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const particlesRef = useRef<Particle[]>([]);
  const frameIdRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);

  const startGame = () => {
    scoreRef.current = 0;
    setScore(0);
    playerRef.current = { x: 250, y: 320, width: 26, height: 26, vx: 0, vy: 0 };
    particlesRef.current = [];
    setGameState('playing');
    playTone(440, 'triangle', 0.15);
  };

  const pauseGame = () => {
    if (gameState === 'playing') setGameState('paused');
    else if (gameState === 'paused') setGameState('playing');
  };

  const triggerMobileMove = (direction: 'left' | 'right' | 'up' | 'down') => {
    const step = 28;
    if (direction === 'left') playerRef.current.x = Math.max(20, playerRef.current.x - step);
    if (direction === 'right') playerRef.current.x = Math.min(480, playerRef.current.x + step);
    if (direction === 'up') playerRef.current.y = Math.max(20, playerRef.current.y - step);
    if (direction === 'down') playerRef.current.y = Math.min(380, playerRef.current.y + step);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'p' || e.key === 'P') {
        pauseGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      cancelAnimationFrame(frameIdRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let spawnTimer = 0;

    const loop = () => {
      // 1. Clear Frame
      ctx.fillStyle = '#08090B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = '#171A20';
      for (let i = 0; i < 20; i++) {
        const sx = (Math.sin(i * 99 + scoreRef.current * 0.05) * 0.5 + 0.5) * canvas.width;
        const sy = (Math.cos(i * 33 + scoreRef.current * 0.05) * 0.5 + 0.5) * canvas.height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // 2. Update Player Position from Keyboard
      const speed = 4.5;
      const p = playerRef.current;
      if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) p.x -= speed;
      if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) p.x += speed;
      if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) p.y -= speed;
      if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) p.y += speed;

      // Bound within canvas
      p.x = Math.max(14, Math.min(canvas.width - 14, p.x));
      p.y = Math.max(14, Math.min(canvas.height - 14, p.y));

      // 3. Spawn Particles
      spawnTimer++;
      if (spawnTimer % 24 === 0) {
        const isObstacle = Math.random() > 0.45;
        particlesRef.current.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -10,
          radius: isObstacle ? 9 : 6,
          speed: Math.random() * 2 + 2.5 + Math.min(scoreRef.current * 0.05, 3),
          type: isObstacle ? 'obstacle' : 'energy'
        });
      }

      // 4. Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const part = particlesRef.current[i];
        part.y += part.speed;

        // Draw particle
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        if (part.type === 'energy') {
          ctx.fillStyle = '#C6C9CE';
          ctx.shadowColor = '#8DA8FF';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = '#E58B8B';
          ctx.shadowColor = '#E58B8B';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collision Check with Player
        const dx = part.x - p.x;
        const dy = part.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < part.radius + 12) {
          if (part.type === 'energy') {
            // Collected Silver Energy
            scoreRef.current += 10;
            setScore(scoreRef.current);
            playTone(880, 'sine', 0.08);
            particlesRef.current.splice(i, 1);
          } else {
            // Hit Obstacle -> Game Over
            playTone(180, 'sawtooth', 0.3);
            setGameState('gameover');
            return;
          }
        } else if (part.y > canvas.height + 20) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 5. Draw Player Spaceship (Minimal Geometric Silver Arrowhead)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(12, 12);
      ctx.lineTo(0, 7);
      ctx.lineTo(-12, 12);
      ctx.closePath();
      ctx.fillStyle = '#F5F5F5';
      ctx.strokeStyle = '#8DA8FF';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Thruster Flame
      ctx.beginPath();
      ctx.moveTo(-4, 9);
      ctx.lineTo(0, 16 + Math.random() * 4);
      ctx.lineTo(4, 9);
      ctx.fillStyle = '#8DA8FF';
      ctx.fill();
      ctx.restore();

      frameIdRef.current = requestAnimationFrame(loop);
    };

    frameIdRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameIdRef.current);
  }, [gameState]);

  return (
    <div id="arcade" className="rounded-2xl bg-surface border border-border p-6 sm:p-8 scroll-mt-24 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-status-success mb-1 flex items-center gap-1.5">
            <Gamepad2 className="h-4 w-4" />
            <span>PIXEL RUSH // RETRO ARCADE</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-white">
            Orbital Energy Harvest
          </h3>
        </div>

        {/* Telemetry Scores */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
              SCORE
            </span>
            <span className="font-mono text-lg font-bold text-white">{score}</span>
          </div>
          <div className="text-right flex items-center gap-1.5 pl-4 border-l border-border">
            <Trophy className="h-4 w-4 text-amber-400" />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
                HIGH SCORE
              </span>
              <span className="font-mono text-lg font-bold text-amber-400">
                {highScore}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-surface-elevated border border-border text-muted hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Game Viewport Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-w-2xl mx-auto my-6 rounded-xl overflow-hidden bg-background-primary border border-border/80 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={540}
          height={380}
          className="w-full h-full block"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-background-primary/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
            <h4 className="font-heading text-2xl font-bold text-white mb-2">
              Ready for Pixel Rush?
            </h4>
            <p className="text-xs text-muted max-w-sm mb-6 leading-relaxed">
              Steer your ship to harvest glowing silver nodes (<span className="text-silver">+10 pts</span>) while dodging crimson hazards.
            </p>
            <Button onClick={startGame} variant="primary" size="md" className="gap-2">
              <Play className="h-4 w-4" />
              <span>Launch Starship</span>
            </Button>
            <span className="font-mono text-[11px] text-muted-dark mt-4">
              Controls: Arrow Keys or WASD
            </span>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
            <h4 className="font-heading text-2xl font-bold text-white mb-4">
              System Paused
            </h4>
            <Button onClick={pauseGame} variant="primary" size="md" className="gap-2">
              <Play className="h-4 w-4" />
              <span>Resume Flight</span>
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-background-primary/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
            <div className="h-12 w-12 rounded-full bg-status-error/10 border border-status-error/30 flex items-center justify-center text-status-error mb-3">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h4 className="font-heading text-2xl font-bold text-white mb-1">
              Collision Detected
            </h4>
            <p className="text-sm font-mono text-silver mb-4">
              Final Harvest Score: <span className="font-bold text-white">{score}</span>
            </p>
            <Button onClick={startGame} variant="primary" size="md" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Touch Directional Controls */}
      <div className="sm:hidden flex flex-col items-center gap-2 pt-2 pb-4">
        <button
          type="button"
          onClick={() => triggerMobileMove('up')}
          className="p-3 rounded-lg bg-surface-elevated border border-border text-white active:bg-silver/20"
          aria-label="Move Up"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => triggerMobileMove('left')}
            className="p-3 rounded-lg bg-surface-elevated border border-border text-white active:bg-silver/20"
            aria-label="Move Left"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => triggerMobileMove('down')}
            className="p-3 rounded-lg bg-surface-elevated border border-border text-white active:bg-silver/20"
            aria-label="Move Down"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => triggerMobileMove('right')}
            className="p-3 rounded-lg bg-surface-elevated border border-border text-white active:bg-silver/20"
            aria-label="Move Right"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
