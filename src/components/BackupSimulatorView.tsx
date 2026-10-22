import React, { useState } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Flame,
  FileX,
  AlertTriangle,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

export const BackupSimulatorView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'ssdFail' | 'accidental' | 'ransomware'>('ssdFail');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleStep = (idx: number) => {
    setExpandedStep(prev => (prev === idx ? null : idx));
  };

  const handleScenarioChange = (scenario: 'ssdFail' | 'accidental' | 'ransomware') => {
    setSelectedScenario(scenario);
    setExpandedStep(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scenarios = {
    ssdFail: {
      title: 'Host Laptop SSD / Hardware Failure',
      icon: Flame,
      severity: 'Complete Hardware Loss',
      description: 'Your host laptop internal SSD dies completely or the laptop is stolen or physically damaged.',
      restorationSteps: [
        {
          step: '1. Set up clean replacement PC or Laptop',
          detail: 'Install Windows 11 and Docker Desktop with WSL2 engine.',
          command: 'winget install Docker.DockerDesktop'
        },
        {
          step: '2. Connect External Backup Drive or Pull from Cloud',
          detail: 'Plug in external USB drive (E:\\NextcloudBorgBackup) containing Borg archives, OR pull latest chunks via Rclone from Backblaze B2/S3.',
          command: 'C:\\rclone\\rclone.exe sync b2-cloud:my-vault-borg-backups/NextcloudBorgBackup E:\\NextcloudBorgBackup --transfers 8'
        },
        {
          step: '3. Deploy clean Nextcloud AIO Mastercontainer',
          detail: 'Deploy docker-compose.yml on the new PC.',
          command: 'docker compose up -d'
        },
        {
          step: '4. Decrypt & Restore in AIO Web Panel',
          detail: 'Navigate to https://localhost:8080, point backup path to E:\\NextcloudBorgBackup, input your Borg Encryption Password, and click "Restore Selected Backup".',
          command: '# Done via AIO Web GUI: Automatically restores PostgreSQL database, Redis cache, and all user files.'
        }
      ]
    },
    accidental: {
      title: 'Accidental Folder Deletion on Host Drive',
      icon: FileX,
      severity: 'User Error',
      description: 'A 50GB photo directory on D:\\PersonalCloud was accidentally deleted or overwritten.',
      restorationSteps: [
        {
          step: '1. Check Nextcloud Deleted Files (Trashbin)',
          detail: 'Nextcloud preserves deleted files with original folder structures and version history for 30 days.',
          command: '# Open Web UI -> Deleted files tab -> Click "Restore" on the target folder'
        },
        {
          step: '2. Restore from Last Night\'s Borg Snapshot',
          detail: 'If emptied from trashbin, mount the read-only Borg archive snapshot directly to inspect historical files.',
          command: 'docker exec -it nextcloud-aio-borgbackup borg list /mnt/borgbackup'
        }
      ]
    },
    ransomware: {
      title: 'Ransomware Infection on Host Windows OS',
      icon: AlertTriangle,
      severity: 'System Compromise',
      description: 'Malware encrypts your C:\\ and D:\\ drives. However, Borg archives and cloud objects are append-only/versioned.',
      restorationSteps: [
        {
          step: '1. Wipe System Completely',
          detail: 'Reformat drives cleanly with a fresh Windows installation to purge malware.',
          command: '# Fresh Windows ISO installation'
        },
        {
          step: '2. Cloud Object Lock / Immutability',
          detail: 'Backblaze B2 / AWS S3 Object Lock prevents ransomware from modifying or deleting historical offsite backups.',
          command: 'C:\\rclone\\rclone.exe sync b2-cloud:my-vault-borg-backups E:\\CleanRecovery'
        },
        {
          step: '3. Decrypt Clean Snapshot',
          detail: 'Restore from the known uninfected timestamp in Borg.',
          command: '# Select snapshot from date preceding infection in Nextcloud AIO panel'
        }
      ]
    }
  };

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

  const activeScenarioData = scenarios[selectedScenario];

  return (
    <div className="space-y-10 text-[#2d1c10]">
      {/* Header */}
      <section className="space-y-2 border-b border-[#dfcebd] pb-4">
        <div className="text-xs font-mono text-amber-900 uppercase tracking-wider font-semibold">
          Resilience & Recovery
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d1c10]">
          3-2-1 Automated Backup Strategy & Recovery Playbook
        </h1>

        <p className="text-sm text-[#6b4c35] max-w-3xl leading-relaxed">
          Hosting on local hardware carries physical risks (drive wear, hardware failure). 
          By combining Nextcloud AIO's transactional BorgBackup engine with automated Rclone cloud object sync, 
          you ensure complete resilience against data loss.
        </p>
      </section>

      {/* Port Listening Verification Commands (Matching Image Reference with working Copy) */}
      <section className="p-6 sm:p-7 bg-[#fcf8f3] rounded-2xl border border-[#dfcebd] space-y-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#c2410c] font-mono font-bold text-lg leading-none select-none">&gt;_</span>
            <h2 className="text-base sm:text-lg font-bold text-[#2d1c10] tracking-tight">
              Port Listening Verification Commands
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7d5b3f] mt-1 leading-relaxed">
            Run these verification commands in Command Prompt or PowerShell to confirm that your background services are actively accepting connections:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1: FileZilla SFTP (Port 22) */}
          <div className="bg-white rounded-xl border border-[#dfcebd] p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#2d1c10]">
                  FileZilla SFTP (Port 22)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#fcd34d] bg-[#fef3c7] text-[#b45309] tracking-wider">
                  TCP
                </span>
              </div>

              <div className="my-5">
                <code className="no-box font-mono text-xs sm:text-sm text-[#92400e] block select-all !bg-transparent !border-0 !p-0 !shadow-none !rounded-none">
                  netstat -an | findstr 22
                </code>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard('netstat -an | findstr 22', 'verify-netstat')}
              className="w-full py-2.5 px-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] hover:bg-[#fef3c7] text-[#92400e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.99]"
              title="Copy netstat command"
            >
              {copiedId === 'verify-netstat' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>Copy netstat</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: Nextcloud Master (8080) */}
          <div className="bg-white rounded-xl border border-[#dfcebd] p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#2d1c10]">
                  Nextcloud Master (8080)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#a5f3fc] bg-[#cffafe] text-[#0e7490] tracking-wider">
                  CONTAINER
                </span>
              </div>

              <div className="my-5">
                <code className="no-box font-mono text-xs sm:text-sm text-[#0e7490] block select-all !bg-transparent !border-0 !p-0 !shadow-none !rounded-none">
                  docker ps --filter &quot;name=nextcloud&quot;
                </code>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard('docker ps --filter "name=nextcloud"', 'verify-docker')}
              className="w-full py-2.5 px-3 rounded-xl border border-[#a5f3fc] bg-[#ecfeff] hover:bg-[#cffafe] text-[#0e7490] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.99]"
              title="Copy docker ps command"
            >
              {copiedId === 'verify-docker' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#0e7490]" />
                  <span>Copy docker ps</span>
                </>
              )}
            </button>
          </div>

          {/* Card 3: Tailscale Serve (Port 443) */}
          <div className="bg-white rounded-xl border border-[#dfcebd] p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#2d1c10]">
                  Tailscale Serve (Port 443)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#a7f3d0] bg-[#d1fae5] text-[#047857] tracking-wider">
                  PROXY
                </span>
              </div>

              <div className="my-5">
                <code className="no-box font-mono text-xs sm:text-sm text-[#047857] block select-all !bg-transparent !border-0 !p-0 !shadow-none !rounded-none">
                  tailscale serve status
                </code>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard('tailscale serve status', 'verify-tailscale')}
              className="w-full py-2.5 px-3 rounded-xl border border-[#a7f3d0] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.99]"
              title="Copy serve status command"
            >
              {copiedId === 'verify-tailscale' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Copy serve status</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Disaster Recovery Simulator */}
      <section className="p-6 sm:p-7 bg-[#fcf8f3] rounded-2xl border border-[#dfcebd] space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2d1c10] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-700" />
              <span>Disaster Recovery Playbook</span>
            </h2>
            <p className="text-xs text-[#7d5b3f] mt-0.5">
              Select a failure scenario to view step-by-step restoration procedures:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f5ece1]/80 rounded-xl border border-[#dfcebd] text-xs">
            <button
              onClick={() => handleScenarioChange('ssdFail')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScenario === 'ssdFail'
                  ? 'bg-white text-[#2d1c10] border border-amber-400 shadow-xs'
                  : 'text-[#6b4c35] hover:text-[#2d1c10]'
              }`}
            >
              Laptop Drive Failure
            </button>
            <button
              onClick={() => handleScenarioChange('accidental')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScenario === 'accidental'
                  ? 'bg-white text-[#2d1c10] border border-amber-400 shadow-xs'
                  : 'text-[#6b4c35] hover:text-[#2d1c10]'
              }`}
            >
              Accidental Deletion
            </button>
            <button
              onClick={() => handleScenarioChange('ransomware')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScenario === 'ransomware'
                  ? 'bg-white text-[#2d1c10] border border-amber-400 shadow-xs'
                  : 'text-[#6b4c35] hover:text-[#2d1c10]'
              }`}
            >
              Ransomware Attack
            </button>
          </div>
        </div>

        {/* Selected Scenario Walkthrough */}
        <div className="space-y-4">
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#dfcebd] space-y-1.5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base font-bold text-[#2d1c10]">{activeScenarioData.title}</h3>
              <span className="text-[11px] font-mono text-amber-900 px-2.5 py-0.5 bg-amber-50/70 rounded-full border border-amber-400 font-medium">
                {activeScenarioData.severity}
              </span>
            </div>
            <p className="text-xs text-[#6b4c35] leading-relaxed">
              {activeScenarioData.description}
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {activeScenarioData.restorationSteps.map((s, idx) => {
              const isExpanded = expandedStep === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-[#dfcebd] shadow-2xs overflow-hidden transition-all hover:border-amber-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left transition-colors cursor-pointer select-none"
                    aria-expanded={isExpanded}
                    title={isExpanded ? 'Hide step details' : 'Show step details'}
                  >
                    <div className="flex items-center min-w-0 pr-4">
                      <h4 className="text-sm font-bold text-[#2d1c10] truncate">
                        {s.step}
                      </h4>
                    </div>

                    <div className="flex items-center shrink-0">
                      <ChevronDown 
                        className={`w-4 h-4 text-[#8c6b51] transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-amber-800' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-5 space-y-3 border-t border-[#ebdcc9] pt-3.5">
                      <p className="text-xs text-[#6b4c35] leading-relaxed">{s.detail}</p>

                      {s.command && (
                        <div className="relative group mt-2">
                          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                            {s.command}
                          </pre>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(s.command, `recov-step-${idx}`);
                            }}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                            title="Copy command"
                          >
                            {copiedId === `recov-step-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
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
        </div>
      </section>

      {/* Troubleshooting Knowledgebase Accordion (Matching Image Reference) */}
      <section className="space-y-4 pt-2">
        <div>
          <h2 className="text-base font-bold text-[#2d1c10] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Troubleshooting & Reference</span>
          </h2>
          <p className="text-xs text-[#7d5b3f] mt-0.5">
            Solutions to common configuration edge cases.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl border border-[#dfcebd] shadow-2xs overflow-hidden transition-all hover:border-amber-300"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-[#2d1c10] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-[#8c6b51] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-800' : ''
                    }`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 space-y-3 border-t border-[#ebdcc9] pt-3.5 text-xs">
                    <p className="text-[#6b4c35] leading-relaxed">{faq.answer}</p>
                    
                    {faq.command && (
                      <div className="relative group mt-2">
                        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                          {faq.command}
                        </pre>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(faq.command, faq.id)}
                          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                          title="Copy command"
                        >
                          {copiedId === faq.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
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
