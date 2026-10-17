import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Terminal, 
  Copy, 
  Check, 
  Wifi, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export const DiagnosticsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testIp, setTestIp] = useState<string>('100.115.42.88');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const validateTailscaleIp = (ip: string) => {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return { valid: false, message: 'Invalid IPv4 format. Expected 4 decimal octets.' };
    
    const [o1, o2, o3, o4] = parts.map(Number);
    if ([o1, o2, o3, o4].some(isNaN) || [o1, o2, o3, o4].some(n => n < 0 || n > 255)) {
      return { valid: false, message: 'Octets must be integers between 0 and 255.' };
    }

    if (o1 === 100 && o2 >= 64 && o2 <= 127) {
      return { 
        valid: true, 
        message: 'Valid Tailscale IPv4 Address within RFC 6598 Carrier-Grade NAT (CGNAT) space (100.64.0.0/10).' 
      };
    }

    if (o1 === 192 && o2 === 168) {
      return { 
        valid: false, 
        message: 'This is a local LAN IP (192.168.x.x). It will not work when away from home on 5G. Use your 100.x.y.z Tailscale IP.' 
      };
    }

    if (o1 === 10 || (o1 === 172 && o2 >= 16 && o2 <= 31)) {
      return { 
        valid: false, 
        message: 'This is a standard private LAN IP. Connect to Tailscale to get your global 100.x.y.z WireGuard mesh address.' 
      };
    }

    return { 
      valid: false, 
      message: 'Not within the standard Tailscale CGNAT IP range (100.64.0.0 - 100.127.255.255).' 
    };
  };

  const validationResult = validateTailscaleIp(testIp);

  const faqs = [
    {
      id: 'faq-1',
      question: 'Mobile client says "Connection Timed Out" when connecting over 5G',
      answer: 'Ensure both your mobile device and host laptop have Tailscale toggled ON and are logged into the same Tailnet account. Also check that your Windows Defender Firewall has an Inbound rule allowing TCP Port 22 (for SFTP) or Port 443 (for Tailscale Serve).',
      command: 'Get-NetFirewallRule -DisplayName "*FileZilla*"'
    },
    {
      id: 'faq-2',
      question: 'Nextcloud Web shows "Access through untrusted domain"',
      answer: 'This happens when accessing Nextcloud using a domain not yet listed in the trusted_domains array in config.php. When using Tailscale Serve, requests arrive via localhost or your MagicDNS domain name.',
      command: 'docker exec -it nextcloud-aio-nextcloud php occ config:system:set trusted_domains 2 --value="your-laptop.your-tailnet.ts.net"'
    },
    {
      id: 'faq-3',
      question: 'External files copied directly to Drive D: do not appear in Nextcloud',
      answer: 'Nextcloud indexes files inside an internal PostgreSQL database catalog for high performance. If you add or edit files externally (e.g. through FileZilla SFTP or Windows Explorer), run the OCC files scan command to sync the database.',
      command: 'docker exec -it nextcloud-aio-nextcloud php occ files:scan --all'
    },
    {
      id: 'faq-4',
      question: 'Docker Desktop / WSL2 uses too much RAM on the host laptop',
      answer: 'By default, WSL2 can consume up to 50% of total host RAM. You can cap WSL2 memory to 3GB or 4GB by creating a .wslconfig file in your Windows user directory (C:\\Users\\<Username>\\.wslconfig).',
      command: '[wsl2]\nmemory=3GB\nprocessors=2'
    },
    {
      id: 'faq-5',
      question: 'Laptop goes to sleep after 30 minutes even though lid is closed',
      answer: 'Windows Modern Standby (S0) can trigger sleep even when plugged in. Run the powercfg standby disable command and verify "Choose what closing the lid does" is set to "Do Nothing".',
      command: 'powercfg /change standby-timeout-ac 0'
    }
  ];

  return (
    <div className="space-y-10 text-[#2d1c10]">
      {/* Header */}
      <section className="space-y-2 border-b border-[#dfcebd] pb-4">
        <div className="text-xs font-mono text-amber-900 uppercase tracking-wider font-semibold">
          Diagnostics & Validation
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d1c10]">
          Network & Diagnostics Workbench
        </h1>

        <p className="text-sm text-[#6b4c35] max-w-2xl leading-relaxed">
          Verify Tailscale IPv4 routing parameters, inspect active port listeners, and reference troubleshooting steps for common edge cases.
        </p>
      </section>

      {/* Tailscale IP Validator Card */}
      <section className="p-6 bg-[#f5ece1]/50 rounded-xl border border-[#dfcebd] space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-amber-700" />
          <h2 className="text-base font-bold text-[#2d1c10]">
            Tailscale CGNAT IPv4 Address Validator
          </h2>
        </div>

        <p className="text-xs text-[#6b4c35] leading-relaxed">
          Tailscale assigns addresses exclusively from the RFC 6598 Carrier-Grade NAT block (100.64.0.0/10). Test your host or mobile IP below to ensure you have not accidentally configured a local home LAN IP.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={testIp}
              onChange={(e) => setTestIp(e.target.value)}
              placeholder="e.g. 100.115.42.88"
              className="px-3.5 py-2 text-xs font-mono bg-white border border-[#dfcebd] rounded-lg text-[#2d1c10] focus:outline-none focus:border-amber-500 shadow-2xs w-full sm:w-64"
            />
          </div>

          <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 flex-1 shadow-2xs ${
            validationResult.valid
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/80 border-amber-300 text-amber-950'
          }`}>
            {validationResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="font-medium">{validationResult.message}</span>
          </div>
        </div>
      </section>

      {/* Listening Port Verification Guide */}
      <section className="p-6 bg-[#f5ece1]/50 rounded-xl border border-[#dfcebd] space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-700" />
          <h2 className="text-base font-bold text-[#2d1c10]">
            Port Listening Verification Commands
          </h2>
        </div>

        <p className="text-xs text-[#6b4c35]">
          Run these verification commands in Command Prompt or PowerShell to confirm that your background services are actively accepting connections:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-[#2d1c10] flex items-center justify-between">
              <span>FileZilla SFTP (Port 22)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">TCP</span>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto">
              netstat -an | findstr 22
            </pre>
            <button
              onClick={() => copyToClipboard('netstat -an | findstr 22', 'chk-22')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-amber-100/80 hover:bg-amber-200 text-amber-950 rounded-lg border border-amber-300 transition-colors cursor-pointer"
            >
              {copiedId === 'chk-22' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
              <span>{copiedId === 'chk-22' ? 'Copied netstat!' : 'Copy netstat'}</span>
            </button>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-[#2d1c10] flex items-center justify-between">
              <span>Nextcloud Master (8080)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 font-semibold">CONTAINER</span>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto">
              docker ps --filter "name=nextcloud"
            </pre>
            <button
              onClick={() => copyToClipboard('docker ps --filter "name=nextcloud"', 'chk-docker')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-cyan-100/80 hover:bg-cyan-200 text-cyan-950 rounded-lg border border-cyan-300 transition-colors cursor-pointer"
            >
              {copiedId === 'chk-docker' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-cyan-800" />}
              <span>{copiedId === 'chk-docker' ? 'Copied docker ps!' : 'Copy docker ps'}</span>
            </button>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-[#2d1c10] flex items-center justify-between">
              <span>Tailscale Serve (Port 443)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">PROXY</span>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto">
              tailscale serve status
            </pre>
            <button
              onClick={() => copyToClipboard('tailscale serve status', 'chk-ts')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
            >
              {copiedId === 'chk-ts' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-800" />}
              <span>{copiedId === 'chk-ts' ? 'Copied serve status!' : 'Copy serve status'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Troubleshooting Knowledgebase Accordion */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#2d1c10] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Troubleshooting & Reference</span>
          </h2>
          <p className="text-xs text-[#6b4c35] mt-0.5">
            Solutions to common configuration edge cases.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-xl border border-[#dfcebd] shadow-2xs overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f5ece1]/40 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#2d1c10] pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8c6b51] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 text-xs border-t border-[#ebdcc9] pt-3">
                    <p className="text-[#6b4c35] leading-relaxed">{faq.answer}</p>
                    
                    {faq.command && (
                      <div className="relative group">
                        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                          {faq.command}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(faq.command, faq.id)}
                          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                          title="Copy command"
                        >
                          {copiedId === faq.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
