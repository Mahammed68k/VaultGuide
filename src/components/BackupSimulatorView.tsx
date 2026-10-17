import React, { useState } from 'react';
import { 
  HardDrive, 
  Cloud, 
  Database, 
  RefreshCw, 
  Copy, 
  Check, 
  Flame,
  FileX,
  AlertTriangle
} from 'lucide-react';

export const BackupSimulatorView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'ssdFail' | 'accidental' | 'ransomware'>('ssdFail');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

      {/* The 3-2-1 Rule Visual Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#dfcebd] shadow-xs space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-amber-900 font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-[10px]">COPY 1 OF 3</span>
            <Database className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2d1c10]">Primary Working Copy</h2>
            <div className="text-xs text-[#7d5b3f] mt-0.5 font-mono">Laptop NVMe SSD (Drive D:\)</div>
          </div>
          <p className="text-xs text-[#6b4c35] leading-relaxed">
            The live, active file system served to your devices. Fast read/write performance.
          </p>
          <div className="text-[11px] font-mono text-[#8c6b51] pt-1 border-t border-[#ebdcc9]">
            Media: Internal NVMe / SATA
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#dfcebd] shadow-xs space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-amber-900 font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-[10px]">COPY 2 OF 3</span>
            <HardDrive className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2d1c10]">Local Borg Snapshot Archive</h2>
            <div className="text-xs text-[#7d5b3f] mt-0.5 font-mono">External USB Drive (Drive E:\)</div>
          </div>
          <p className="text-xs text-[#6b4c35] leading-relaxed">
            Encrypted, deduplicated incremental snapshots generated nightly by Nextcloud AIO at 02:00 AM.
          </p>
          <div className="text-[11px] font-mono text-[#8c6b51] pt-1 border-t border-[#ebdcc9]">
            Media: External USB HDD / SSD
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#dfcebd] shadow-xs space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-900 font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-950 border border-emerald-300 text-[10px]">COPY 3 OF 3</span>
            <Cloud className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2d1c10]">Offsite Cloud Object Sync</h2>
            <div className="text-xs text-[#7d5b3f] mt-0.5 font-mono">Backblaze B2 / AWS S3 / Wasabi</div>
          </div>
          <p className="text-xs text-[#6b4c35] leading-relaxed">
            Pushed nightly at 04:00 AM via Rclone. Resilient against physical theft, house fire, or surge damage.
          </p>
          <div className="text-[11px] font-mono text-[#8c6b51] pt-1 border-t border-[#ebdcc9]">
            Media: Georeplicated Cloud Storage
          </div>
        </div>
      </section>

      {/* Interactive Disaster Recovery Simulator */}
      <section className="p-6 bg-[#f5ece1]/50 rounded-xl border border-[#dfcebd] space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcc9] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#2d1c10] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-700" />
              <span>Disaster Recovery Playbook</span>
            </h2>
            <p className="text-xs text-[#6b4c35] mt-0.5">
              Select a failure scenario to view step-by-step restoration procedures:
            </p>
          </div>

          <div className="flex flex-wrap gap-1 p-1 bg-[#f5ece1] rounded-xl border border-[#dfcebd] text-xs shadow-2xs">
            <button
              onClick={() => setSelectedScenario('ssdFail')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScenario === 'ssdFail'
                  ? 'bg-white text-amber-950 border border-amber-400 shadow-xs'
                  : 'text-[#6b4c35] hover:text-[#2d1c10] hover:bg-amber-100/50'
              }`}
            >
              Laptop Drive Failure
            </button>
            <button
              onClick={() => setSelectedScenario('accidental')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScenario === 'accidental'
                  ? 'bg-white text-amber-950 border border-amber-400 shadow-xs'
                  : 'text-[#6b4c35] hover:text-[#2d1c10] hover:bg-amber-100/50'
              }`}
            >
              Accidental Deletion
            </button>
            <button
              onClick={() => setSelectedScenario('ransomware')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScenario === 'ransomware'
                  ? 'bg-white text-amber-950 border border-amber-400 shadow-xs'
                  : 'text-[#6b4c35] hover:text-[#2d1c10] hover:bg-amber-100/50'
              }`}
            >
              Ransomware Attack
            </button>
          </div>
        </div>

        {/* Selected Scenario Walkthrough */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-[#dfcebd] space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#2d1c10]">{activeScenarioData.title}</h3>
              <span className="text-[11px] font-mono text-amber-900 px-2 py-0.5 bg-amber-100/80 rounded-full border border-amber-300 font-semibold">
                {activeScenarioData.severity}
              </span>
            </div>
            <p className="text-xs text-[#6b4c35] leading-relaxed">
              {activeScenarioData.description}
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {activeScenarioData.restorationSteps.map((s, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#2d1c10]">{s.step}</h4>
                  <span className="text-[11px] font-mono text-[#8c6b51] font-semibold">Step 0{idx + 1}</span>
                </div>

                <p className="text-xs text-[#6b4c35] leading-relaxed">{s.detail}</p>

                {s.command && (
                  <div className="relative group mt-2">
                    <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                      {s.command}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(s.command, `recov-step-${idx}`)}
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
            ))}
          </div>
        </div>
      </section>

      {/* Routine Verification Test Matrix */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#2d1c10]">
          Routine Verification & Integrity Checks
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#dfcebd] bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#ebdcc9] bg-[#f5ece1]/80 font-bold text-[#2d1c10]">
                <th className="py-3 px-4 w-1/4">Stage</th>
                <th className="py-3 px-4 w-1/3">Diagnostic Action</th>
                <th className="py-3 px-4 w-1/3">Expected Healthy Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc9]/60">
              <tr className="hover:bg-[#f5ece1]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#2d1c10]">Local Borg Snapshot</td>
                <td className="py-3 px-4 text-[#6b4c35]">
                  Inspect <code className="font-mono text-amber-900 bg-amber-100/60 px-1 py-0.5 rounded">E:\NextcloudBorgBackup</code> after 02:00 AM.
                </td>
                <td className="py-3 px-4 text-[#6b4c35]">
                  Directory contains non-zero Borg archive chunk data with recent timestamps.
                </td>
              </tr>
              <tr className="hover:bg-[#f5ece1]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#2d1c10]">Cloud Sync Run</td>
                <td className="py-3 px-4 text-[#6b4c35]">
                  Execute <code className="font-mono text-amber-900 bg-amber-100/60 px-1 py-0.5 rounded">C:\NextcloudAIO\sync-offsite.ps1</code> manually.
                </td>
                <td className="py-3 px-4 text-[#6b4c35]">
                  Check <code className="font-mono text-amber-900 bg-amber-100/60 px-1 py-0.5 rounded">C:\NextcloudAIO\rclone-sync.log</code> for "Cloud sync completed successfully".
                </td>
              </tr>
              <tr className="hover:bg-[#f5ece1]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#2d1c10]">Disaster Recovery Drill</td>
                <td className="py-3 px-4 text-[#6b4c35]">
                  On a secondary PC, install AIO, point to Borg repo, enter key, and click Restore.
                </td>
                <td className="py-3 px-4 text-[#6b4c35]">
                  All Nextcloud database rows, user accounts, and files are 100% restored.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
