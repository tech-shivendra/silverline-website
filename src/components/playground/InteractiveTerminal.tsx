'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { servicesData } from '@/data/services';
import { technologiesData } from '@/data/technologies';
import { projectsData } from '@/data/projects';
import { teamData } from '@/data/team';

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export const InteractiveTerminal: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      command: 'sys.init',
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-silver font-semibold">SilverLine Terminal Engine v2.0</p>
          <p className="text-muted">Type <span className="text-accent-blue font-bold">help</span> to view available system commands.</p>
        </div>
      )
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const availableCommands = [
    'help',
    'whoami',
    'services',
    'stack',
    'projects',
    'studio',
    'contact',
    'clear'
  ];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      const match = availableCommands.find((cmd) => cmd.startsWith(current));
      if (match) {
        setInput(match);
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.toLowerCase();
    if (!trimmed) return;

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');

    if (trimmed === 'clear') {
      setOutputs([]);
      return;
    }

    let result: React.ReactNode;

    switch (trimmed) {
      case 'help':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-white font-semibold">Allowlisted System Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1 text-muted">
              <div><span className="text-accent-blue font-bold">whoami</span> — Studio identity & statement</div>
              <div><span className="text-accent-blue font-bold">services</span> — Core engineering capabilities</div>
              <div><span className="text-accent-blue font-bold">stack</span> — Active production technologies</div>
              <div><span className="text-accent-blue font-bold">projects</span> — Deployed client case studies</div>
              <div><span className="text-accent-blue font-bold">studio</span> — Team engineering leadership</div>
              <div><span className="text-accent-blue font-bold">contact</span> — Open inquiry channel</div>
              <div><span className="text-accent-blue font-bold">clear</span> — Reset terminal buffer</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        result = (
          <div className="space-y-1.5 text-xs">
            <p className="text-white font-bold">SilverLine Studio</p>
            <p className="text-silver italic">&quot;We don&apos;t just build products. We build what comes next.&quot;</p>
            <p className="text-muted">Independent product development company focused on designing, engineering, and launching digital products.</p>
          </div>
        );
        break;

      case 'services':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-white font-semibold">Production Capabilities ({servicesData.length}):</p>
            <div className="space-y-0.5 text-silver pl-2">
              {servicesData.map((s, idx) => (
                <div key={s.id} className="flex gap-2">
                  <span className="text-accent-blue">0{idx + 1}.</span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'stack':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-white font-semibold">Battle-Tested Technologies:</p>
            <p className="text-muted">Next.js 15, React 19, TypeScript, Tailwind CSS, Node.js, Python, PostgreSQL, Supabase, Docker, React Native.</p>
          </div>
        );
        break;

      case 'projects':
        result = (
          <div className="space-y-1.5 text-xs">
            <p className="text-white font-semibold">Selected Case Studies:</p>
            <div className="space-y-1 text-silver pl-2">
              {projectsData.map((p) => (
                <div key={p.id}>
                  <span className="text-accent-blue font-bold">{p.title}</span>
                  <span className="text-muted"> — {p.category} [{p.project_status}]</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'studio':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-white font-semibold">Studio Team & Engineering Core:</p>
            {teamData.map((m) => (
              <p key={m.id} className="text-muted">
                <span className="text-silver font-medium">{m.name}</span> — {m.role}
              </p>
            ))}
          </div>
        );
        break;

      case 'contact':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-white font-semibold">Connecting to Lead Channel...</p>
            <p className="text-muted">Direct Email: <a href="mailto:studio@silverline.design" className="text-accent-blue underline">studio@silverline.design</a></p>
            <p className="text-silver">Redirecting to contact form...</p>
          </div>
        );
        setTimeout(() => {
          router.push('/contact');
        }, 1200);
        break;

      default:
        result = (
          <p className="text-xs text-status-error font-mono">
            command not found: {trimmed}. Type <span className="text-accent-blue font-bold">help</span> to view allowable commands.
          </p>
        );
        break;
    }

    setOutputs((prev) => [...prev, { command: cmd, output: result }]);
  };

  return (
    <div
      id="terminal"
      onClick={() => inputRef.current?.focus()}
      className="rounded-2xl bg-background-secondary border border-border overflow-hidden font-mono text-xs shadow-2xl cursor-text scroll-mt-24"
    >
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-status-error/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-status-success/80" />
          <span className="ml-2 font-mono text-[11px] text-muted font-medium">
            silverline@core: ~ (cli)
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted text-[11px]">
          <TerminalIcon className="h-3.5 w-3.5 text-accent-blue" />
          <span className="hidden sm:inline">TAB autocomplete</span>
        </div>
      </div>

      {/* Terminal Scroll Body */}
      <div className="p-5 min-h-[340px] max-h-[460px] overflow-y-auto space-y-4">
        {outputs.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center gap-2 text-silver">
              <span className="text-accent-blue font-bold">silverline$</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}

        {/* Input prompt line */}
        <div className="flex items-center gap-2 text-silver pt-1">
          <span className="text-accent-blue font-bold">silverline$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white focus:outline-none caret-accent-blue font-mono"
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal command prompt"
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
