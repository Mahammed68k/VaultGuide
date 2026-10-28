import React from 'react';
import serverMeshNodeImg from '../assets/images/server_mesh_node_1791216991425.jpg';
import { ActiveTab } from '../types';
import { TopologyInspector } from './TopologyInspector';
import { 
  FolderSync,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ArchitectureViewProps {
  onSelectTab: (tab: ActiveTab) => void;
  onSelectOnboarding?: (engine: 'sftp' | 'nextcloud') => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectTab, onSelectOnboarding }) => {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero Showcase with Engineering Asset */}
      <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-6 lg:gap-8 w-full">
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[29px] xl:text-[36px] 2xl:text-[40px] font-bold tracking-tight text-white leading-tight lg:whitespace-nowrap">
              Self-Hosted Private Cloud & Direct Storage Stack
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-none">
              Transform your home PC or laptop into an enterprise-grade private cloud server accessible worldwide over 5G. 
              Bypass fragile dynamic DNS, avoid risky router port forwarding, and preserve complete data ownership on your local hard drives.
            </p>
          </div>

          <div className="flex flex-col items-stretch w-full max-w-md gap-2.5 pt-2 pb-0 mb-0">
            <button
              onClick={() => onSelectOnboarding ? onSelectOnboarding('sftp') : onSelectTab('onboarding')}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct SFTP Getting Started (5 Min)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onSelectOnboarding ? onSelectOnboarding('nextcloud') : onSelectTab('onboarding')}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nextcloud AIO Getting Started</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onSelectTab('backup')}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <FolderSync className="w-3.5 h-3.5" />
                <span>3-2-1 Resilience & Recovery Playbook</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Hero Visual Showcase Graphic with zero-broken-image fallback */}
        <div className="w-full sm:w-[380px] md:w-[420px] lg:w-[460px] xl:w-[500px] shrink-0 relative group min-w-0 flex flex-col justify-end items-center lg:items-end self-center lg:self-stretch">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9] w-full transition-all duration-300">
            <img
              src={serverMeshNodeImg}
              alt="VaultGuide mesh server node illustration"
              loading="eager"
              decoding="async"
              className="w-full h-full max-w-full object-cover group-hover:scale-105 transition-transform duration-500 block"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallbackTried) {
                  target.dataset.fallbackTried = 'true';
                  target.src = '/server_mesh_node_1791216991425.jpg';
                }
              }}
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-mono text-cyan-300 font-semibold">100.64.0.0/10 WireGuard Mesh</span>
              <span className="font-mono text-slate-400">Zero Open Ports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Architecture & Security Model */}
      <section className="p-6 bg-[#f5ece1]/50 rounded-xl border border-[#dfcebd] space-y-6 shadow-xs">
        <div className="border-b border-[#ebdcc9] pb-4">
          <h2 className="text-lg font-bold text-[#2d1c10]">Network Architecture & Security Model</h2>
          <p className="text-xs text-[#6b4c35] mt-0.5">
            Simulate how traffic flows from your mobile device through the encrypted WireGuard mesh vs direct exposure.
          </p>
        </div>

        {/* The interactive component selector: the six-node pipeline bar & detail panel */}
        <TopologyInspector />

        {/* Real-time Architecture Pathway Ribbon */}
        <div className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all bg-emerald-50/70 border-emerald-300/80 text-emerald-950">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-mono font-bold uppercase text-[11px] tracking-wide">
              Active Route:
            </span>
            <span className="font-mono text-[11px]">
              Phone (5G) ──► WireGuard Tunnel (100.64.0.0/10) ──► Laptop Host (Port 22/8080 Private) ──► D:\PersonalCloud
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold shrink-0 self-start sm:self-auto bg-emerald-200/80 text-emerald-900 border border-emerald-400/60">
            Zero Port Forwarding
          </span>
        </div>
      </section>
    </div>
  );
};
