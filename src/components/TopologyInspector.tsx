import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, Laptop, Server, Cloud, Layers } from 'lucide-react';

const nodes = [
  {
    id: 'mobile',
    label: 'Mobile Client',
    sub: '5G WireGuard',
    icon: Smartphone,
    details: {
      title: 'Mobile Client Device (Remote Node)',
      description: 'Connects over cellular 5G or foreign Wi-Fi with Tailscale active. WireGuard tunnel routes directly to your host machine.',
      protocol: 'WireGuard / ChaCha20-Poly1305 (256-bit)',
      mtu: '1280 bytes (MSS clamped)',
      portExposure: 'Zero inbound listening ports on phone',
      apps: 'CX File Explorer, Nextcloud Android/iOS'
    }
  },
  {
    id: 'tailscale',
    label: 'Tailscale Mesh',
    sub: 'Encrypted VPN',
    icon: Shield,
    details: {
      title: 'Tailscale Encrypted Mesh Overlay',
      description: 'Traverses NAT and dynamic ISP home IPs via STUN/DERP. Router firewall keeps all public inbound ports completely closed.',
      protocol: 'WireGuard UDP (Point-to-point mesh)',
      ipRange: '100.64.0.0/10 (RFC 6598 CGNAT Space)',
      security: 'Zero Trust Network Architecture (ZTNA), MagicDNS TLS',
      portExposure: 'All public router ports remain 100% closed'
    }
  },
  {
    id: 'host',
    label: 'Host Laptop',
    sub: 'Windows Server',
    icon: Laptop,
    details: {
      title: 'Host Machine & Windows OS Environment',
      description: 'Runs native Windows services and Docker virtualization with power settings configured for 24/7 continuous operation without sleeping.',
      powerState: 'AC Standby: NEVER / Lid Action: DO NOTHING',
      osServices: 'FileZilla Server Service + Docker Desktop (WSL2)',
      firewall: 'Windows Defender Inbound Rule (TCP 22 / 8080 / 443)',
      ramAllocation: '15 MB (SFTP only) to ~2 GB (Nextcloud Docker)'
    }
  },
  {
    id: 'sftpService',
    label: 'Direct SFTP',
    sub: 'Port 22 Native',
    icon: Server,
    details: {
      title: 'FileZilla Server (SSH / SFTP Protocol)',
      description: 'High performance native daemon mapping virtual root "/" to physical partitions (e.g. D:\\) with zero intermediate database overhead.',
      port: 'TCP 22 (SSH File Transfer Protocol)',
      resourceProfile: 'Extremely lightweight (~12–20 MB RAM)',
      scopeGuard: 'Safeguards C:\\Windows by restricting mount point to D:\\',
      bestFor: 'High-speed 4K media streaming and direct raw disk transfers'
    }
  },
  {
    id: 'dockerAio',
    label: 'Nextcloud AIO',
    sub: 'Docker Cloud',
    icon: Layers,
    details: {
      title: 'Nextcloud All-in-One Containerized Stack',
      description: 'Orchestrated container group: Apache web server, PostgreSQL database, Redis caching, Imaginary preview generation, and Notify-Push websockets.',
      ports: '80 (HTTP), 8080 (Master Setup), 443 (Tailscale HTTPS Serve)',
      features: 'Automated background mobile photo upload, web office, public shares',
      fileIndexing: 'Transactional PostgreSQL catalog (synced with occ files:scan)'
    }
  },
  {
    id: 'backupStorage',
    label: '3-2-1 Backup',
    sub: 'Borg + Rclone',
    icon: Cloud,
    details: {
      title: 'Automated 3-2-1 Backup Pipeline',
      description: 'Local deduplicated Borg snapshots written nightly to USB Drive E:\\, then synchronized offsite to Backblaze B2 / AWS S3 via Rclone PowerShell task at 4:00 AM.',
      localEngine: 'BorgBackup (Client-side AES-256 deduplicated chunking)',
      offsiteEngine: 'Rclone multi-thread sync with transcript logging',
      resilience: 'Immune to host drive failure, accidental deletion, and ransomware'
    }
  }
];

export const TopologyInspector: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('mobile');

  // Automatically move every 3 seconds in a continuous loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedNode((current) => {
        const currentIndex = nodes.findIndex((n) => n.id === current);
        const nextIndex = (currentIndex + 1) % nodes.length;
        return nodes[nextIndex].id;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedNode]);

  const activeNode = nodes.find(n => n.id === selectedNode) || nodes[0];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="space-y-4">
      {/* Sleek Connected Pipeline Bar (No Black Shades) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 p-1.5 bg-[#f5ece1]/90 rounded-xl border border-[#dfcebd] shadow-2xs">
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const NodeIcon = node.icon;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`relative overflow-hidden flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                isSelected
                  ? 'bg-white text-amber-950 font-bold border border-amber-400 shadow-xs ring-1 ring-amber-400/30'
                  : 'bg-transparent text-[#6b4c35] hover:text-[#2d1c10] hover:bg-amber-100/70 active:bg-amber-200/50 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                isSelected 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-amber-100/90 text-amber-800'
              }`}>
                <NodeIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-xs leading-tight ${isSelected ? 'font-bold text-amber-950' : 'font-semibold text-[#2d1c10]'}`}>
                  {node.label}
                </div>
                <div className={`text-[10px] leading-tight font-mono mt-0.5 ${isSelected ? 'text-amber-800 font-medium' : 'text-[#8c6b51]'}`}>
                  {node.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box - Borderless Structure with Theme Colors */}
      <div 
        key={activeNode.id}
        style={{ animation: 'fade-node-in 0.25s ease-out' }}
        className="p-6 bg-white/95 rounded-2xl shadow-sm space-y-5 transition-all"
      >
        <div className="flex items-start justify-between gap-4 pb-1">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-100/90 rounded-xl text-amber-800 shadow-2xs">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2d1c10]">{activeNode.details.title}</h4>
              <p className="text-xs text-[#6b4c35] mt-0.5 max-w-xl leading-relaxed">{activeNode.details.description}</p>
            </div>
          </div>

          <div className="px-3 py-1 bg-amber-100/90 rounded-full text-[11px] font-mono text-amber-900 font-bold shrink-0">
            {activeNode.id}
          </div>
        </div>

        {/* Technical Specs List - Clean Borderless Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(activeNode.details)
            .filter(([k]) => k !== 'title' && k !== 'description')
            .map(([key, val], idx) => (
              <div key={idx} className="p-3.5 bg-[#f5ece1]/70 hover:bg-[#f5ece1] rounded-xl space-y-1.5 transition-colors">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8c6b51] font-semibold block">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="font-bold text-[#2d1c10] block text-xs leading-snug">
                  {val}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
