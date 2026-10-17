import React, { useState } from 'react';
import serverMeshNodeImg from '../assets/images/server_mesh_node_1791216991425.jpg';
import { ActiveTab } from '../types';
import { TopologyInspector } from './TopologyInspector';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  HardDrive, 
  Lock, 
  Server, 
  FolderSync,
  HelpCircle,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
  ArrowRight,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface ArchitectureViewProps {
  onSelectTab: (tab: ActiveTab) => void;
  onSelectOnboarding?: (engine: 'sftp' | 'nextcloud') => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectTab, onSelectOnboarding }) => {
  const networkMode: 'tailscale' | 'portForward' = 'tailscale';

  const handleLaunchTab = (tab: ActiveTab) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onSelectTab(tab);
  };

  return (
    <div className="space-y-12">
      {/* Hero Showcase with Engineering Asset */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-wide">
            <span>ZERO PORT FORWARDING</span>
            <span aria-hidden="true">·</span>
            <span>WIREGUARD ENCRYPTED MESH</span>
            <span aria-hidden="true">·</span>
            <span>WINDOWS 10/11 HOST</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Self-Hosted Private Cloud & Direct Storage Stack
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Transform your home PC or laptop into an enterprise-grade private cloud server accessible worldwide over 5G and Wi-Fi. 
            Bypass fragile dynamic DNS, avoid risky router port forwarding, and preserve complete data ownership on your local hard drives.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectOnboarding ? onSelectOnboarding('sftp') : onSelectTab('onboarding')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct SFTP Getting Started (5 Min)</span>
            </button>
            <button
              onClick={() => onSelectOnboarding ? onSelectOnboarding('nextcloud') : onSelectTab('onboarding')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nextcloud AIO Getting Started</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Showcase Graphic with zero-broken-image fallback */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9]">
            <img
              src={serverMeshNodeImg}
              alt="VaultGuide mesh server node illustration"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallbackTried) {
                  target.dataset.fallbackTried = 'true';
                  target.src = '/assets/images/server_mesh_node_1791216991425.jpg';
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
      </section>

      {/* Interactive Topology Node Inspector */}
      <TopologyInspector />

      {/* Interactive Network Security Simulator */}
      <section className="p-6 bg-[#f5ece1]/50 rounded-xl border border-[#dfcebd] space-y-6 shadow-xs">
        <div className="border-b border-[#ebdcc9] pb-4">
          <h2 className="text-lg font-bold text-[#2d1c10]">Network Architecture & Security Model</h2>
          <p className="text-xs text-[#6b4c35] mt-0.5">
            Simulate how traffic flows from your mobile device through the encrypted WireGuard mesh vs direct exposure.
          </p>
        </div>

        {/* Visual Diagram */}
        <div className="space-y-4 py-2">
          {/* 4 Interactive Connected Architecture Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            {/* Node 1: Mobile Phone */}
            <div className="p-5 bg-white rounded-xl border border-[#dfcebd] shadow-xs flex flex-col justify-between text-center space-y-3 transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-800 shadow-2xs">
                  <Smartphone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2d1c10]">Mobile Device</div>
                  <div className="text-xs text-[#7d5b3f] mt-0.5">5G Cellular / Remote Wi-Fi</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ebdcc9] space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Assigned IP:</span>
                  <span className="font-semibold text-amber-900">
                    {networkMode === 'tailscale' ? '100.x.y.z (CGNAT)' : 'Dynamic Cell IP'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Security:</span>
                  <span className={`font-semibold ${networkMode === 'tailscale' ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {networkMode === 'tailscale' ? 'WireGuard Peer' : 'Direct Insecure'}
                  </span>
                </div>
              </div>
            </div>

            {/* Node 2: Network Gateway / Security Tunnel */}
            <div className={`p-5 rounded-xl border-2 shadow-xs flex flex-col justify-between text-center space-y-3 transition-all ${
              networkMode === 'tailscale'
                ? 'bg-white border-emerald-500/70 ring-2 ring-emerald-500/20'
                : 'bg-white border-rose-500/70 ring-2 ring-rose-500/20'
            }`}>
              <div className="space-y-2">
                <div className={`w-12 h-12 mx-auto rounded-xl border flex items-center justify-center shadow-2xs transition-all ${
                  networkMode === 'tailscale'
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-800'
                    : 'bg-rose-100/90 border-rose-300 text-rose-800 animate-pulse'
                }`}>
                  {networkMode === 'tailscale' ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-rose-700" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2d1c10]">
                    {networkMode === 'tailscale' ? 'Tailscale Mesh Gateway' : 'Public Router Gateway'}
                  </div>
                  <div className="text-xs text-[#7d5b3f] mt-0.5">
                    {networkMode === 'tailscale' ? 'Encrypted Mesh Overlay' : 'Port Forwarding (Exposed)'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ebdcc9] space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Router Ports:</span>
                  <span className={`font-bold ${networkMode === 'tailscale' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {networkMode === 'tailscale' ? '0 Open Ports (Safe)' : '22, 8080 (Scannable)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Exposure:</span>
                  <span className={`font-bold ${networkMode === 'tailscale' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {networkMode === 'tailscale' ? 'Zero Trust Private' : 'Shodan Searchable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Node 3: Laptop Server */}
            <div className="p-5 bg-white rounded-xl border border-[#dfcebd] shadow-xs flex flex-col justify-between text-center space-y-3 transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-800 shadow-2xs">
                  <Laptop className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2d1c10]">Host Laptop Server</div>
                  <div className="text-xs text-[#7d5b3f] mt-0.5">Windows 10 / 11 Host</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ebdcc9] space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Power State:</span>
                  <span className="font-semibold text-amber-900">24/7 Always On</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Listening On:</span>
                  <span className={`font-semibold ${networkMode === 'tailscale' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {networkMode === 'tailscale' ? '100.x Interface' : '0.0.0.0 (All WAN)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Node 4: Target Storage */}
            <div className="p-5 bg-white rounded-xl border border-[#dfcebd] shadow-xs flex flex-col justify-between text-center space-y-3 transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-800 shadow-2xs">
                  <HardDrive className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2d1c10]">Local Storage Vault</div>
                  <div className="text-xs text-[#7d5b3f] mt-0.5">D:\PersonalCloud Partition</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ebdcc9] space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Capacity:</span>
                  <span className="font-semibold text-emerald-800">500 GB Native</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8c6b51]">Throughput:</span>
                  <span className="font-semibold text-amber-900">Direct Bus (No Throttle)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Architecture Pathway Ribbon */}
          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
            networkMode === 'tailscale'
              ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-950'
              : 'bg-rose-50/70 border-rose-300/80 text-rose-950'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${networkMode === 'tailscale' ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600 animate-ping'}`} />
              <span className="font-mono font-bold uppercase text-[11px] tracking-wide">
                {networkMode === 'tailscale' ? 'Active Route:' : 'Danger Route:'}
              </span>
              <span className="font-mono text-[11px]">
                {networkMode === 'tailscale'
                  ? 'Phone (5G) ──► WireGuard Tunnel (100.64.0.0/10) ──► Laptop Host (Port 22/8080 Private) ──► D:\\PersonalCloud'
                  : 'Phone (5G) ──► Public ISP IP ──► Open Router Port 22 & 8080 (Exposed to Internet Botnets) ──► Host Machine'
                }
              </span>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold shrink-0 self-start sm:self-auto ${
              networkMode === 'tailscale'
                ? 'bg-emerald-200/80 text-emerald-900 border border-emerald-400/60'
                : 'bg-rose-200/80 text-rose-900 border border-rose-400/60'
            }`}>
              {networkMode === 'tailscale' ? 'Zero Port Forwarding' : 'High Security Vulnerability'}
            </span>
          </div>
        </div>
      </section>

      {/* Operational Workbenches */}
      <section className="p-6 sm:p-8 bg-[#f5ece1]/50 rounded-xl border border-[#dfcebd] space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebdcc9] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-amber-900 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded">
                Operational Workbenches
              </span>
              <span className="text-xs text-[#8c6b51] font-mono">2 Workbenches</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2d1c10] tracking-tight">
              Operations, Resilience & Interactive Simulators
            </h2>
            <p className="text-xs sm:text-sm text-[#6b4c35]">
              Directly simulate backup disaster recovery pipelines or validate your Tailscale CGNAT mesh network.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action 1: Resilience & Recovery */}
          <div className="p-6 bg-white rounded-xl border border-[#dfcebd] hover:border-amber-400 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-800">
                  <FolderSync className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80 font-semibold">
                  3-2-1 Strategy
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#2d1c10] group-hover:text-amber-900 transition-colors">
                  Resilience & Recovery
                </h3>
                <p className="text-xs font-mono text-amber-800 mt-0.5">
                  3-2-1 Backup Simulator
                </p>
              </div>

              <p className="text-xs text-[#6b4c35] leading-relaxed">
                Test automated BorgBackup client-side encrypted repository deduplication, local disk mirroring, and offsite cloud sync with instant RPO/RTO calculation.
              </p>

              <ul className="space-y-1.5 text-xs text-[#7d5b3f] font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>3 Copies · 2 Media · 1 Cloud</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Borg + Rclone Pipeline</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchTab('backup')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>Launch Resilience & Recovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 2: Network & Diagnostics Workbench */}
          <div className="p-6 bg-white rounded-xl border border-[#dfcebd] hover:border-emerald-400 shadow-xs hover:shadow-md flex flex-col justify-between transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-100/80 border border-emerald-300/80 flex items-center justify-center text-emerald-800">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 font-semibold">
                  Diagnostics & Validation
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#2d1c10] group-hover:text-emerald-900 transition-colors">
                  Network & Diagnostics Workbench
                </h3>
                <p className="text-xs font-mono text-emerald-800 mt-0.5">
                  Diagnostics & Validation
                </p>
              </div>

              <p className="text-xs text-[#6b4c35] leading-relaxed">
                Inspect 100.64.0.0/10 CGNAT carrier address spaces, validate Tailscale peer handshake state, test Windows Firewall port binding, and fix untrusted domain errors.
              </p>

              <ul className="space-y-1.5 text-xs text-[#7d5b3f] font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>RFC 6598 CGNAT Verifier</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Port Binding & TLS Inspection</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchTab('diagnostics')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>Open Diagnostics Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
