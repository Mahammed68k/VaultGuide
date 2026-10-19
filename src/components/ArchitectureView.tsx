import React from 'react';
import serverMeshNodeImg from '../assets/images/server_mesh_node_1791216991425.jpg';
import { ActiveTab } from '../types';
import { TopologyInspector } from './TopologyInspector';
import { 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  HardDrive, 
  FolderSync,
  Sparkles,
  ArrowRight
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
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
        <div className="md:col-span-7 flex flex-col justify-center space-y-4 w-full min-w-0">
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
            <button
              onClick={() => handleLaunchTab('backup')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <FolderSync className="w-3.5 h-3.5" />
              <span>3-2-1 Resilience & Recovery Playbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Visual Showcase Graphic with zero-broken-image fallback */}
        <div className="md:col-span-5 relative group min-w-0 w-full flex justify-center md:justify-end">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-[16/9] w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[460px] xl:max-w-[500px] transition-all duration-300">
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

      {/* Network Architecture & Security Model (Placed above Interactive Component Inspector) */}
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
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
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
        </div>
      </section>

      {/* Interactive Topology Node Inspector */}
      <TopologyInspector />
    </div>
  );
};
