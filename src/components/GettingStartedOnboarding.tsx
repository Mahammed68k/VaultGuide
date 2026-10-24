import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Server, 
  Smartphone, 
  HardDrive, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Container, 
  Key, 
  PowerOff,
  RotateCcw,
  RefreshCw,
  Activity,
  Trash2,
  Play,
  X
} from 'lucide-react';

interface GettingStartedOnboardingProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenRunbookExport?: () => void;
  initialEngine?: 'sftp' | 'nextcloud';
}

export const GettingStartedOnboarding: React.FC<GettingStartedOnboardingProps> = ({
  onNavigate,
  onOpenRunbookExport,
  initialEngine = 'sftp'
}) => {
  // Engine switcher: 'sftp' or 'nextcloud'
  const [engine, setEngine] = useState<'sftp' | 'nextcloud'>(initialEngine);

  useEffect(() => {
    if (initialEngine) {
      setEngine(initialEngine);
    }
  }, [initialEngine]);

  // Step tracker (Minute 1 to 5)
  const [activeMinute, setActiveMinute] = useState<number>(1);
  const [completedMinutesSftp, setCompletedMinutesSftp] = useState<number[]>([]);
  const [completedMinutesNextcloud, setCompletedMinutesNextcloud] = useState<number[]>([]);

  // Configuration fields
  const [tailscaleIp, setTailscaleIp] = useState<string>('100.116.48.9');
  const [storagePath, setStoragePath] = useState<string>('D:\\PersonalCloud');
  const [username, setUsername] = useState<string>('vaultuser');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [controlProcessTab, setControlProcessTab] = useState<'shutdown' | 'retrieve' | 'restart' | 'status' | 'delete'>('shutdown');

  // Nextcloud specific states
  const [passphrase, setPassphrase] = useState<string>('aio-master-secret-vault-2026-safe-key');
  const [memoriesEnabled, setMemoriesEnabled] = useState<boolean>(true);
  const [borgBackupEnabled, setBorgBackupEnabled] = useState<boolean>(true);

  // Walkthrough video in-page player state
  const [isPlayingWalkthrough, setIsPlayingWalkthrough] = useState<boolean>(false);

  const completedMinutes = engine === 'sftp' ? completedMinutesSftp : completedMinutesNextcloud;
  const setCompletedMinutes = engine === 'sftp' ? setCompletedMinutesSftp : setCompletedMinutesNextcloud;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const markMinuteCompleted = (minute: number) => {
    if (!completedMinutes.includes(minute)) {
      setCompletedMinutes(prev => [...prev, minute]);
    }
  };

  // Switch engines & reset step index
  const handleEngineSwitch = (newEngine: 'sftp' | 'nextcloud') => {
    setEngine(newEngine);
    setActiveMinute(1);
    setIsPlayingWalkthrough(false);
  };

  // SFTP Steps definition
  const sftpMinuteSteps = [
    {
      minute: 1,
      timeEst: '01:00',
      title: 'Install Tailscale & FileZilla Server',
      shortTitle: 'Install Software',
      subtitle: 'WireGuard encrypted mesh + lightweight native server daemon'
    },
    {
      minute: 2,
      timeEst: '02:00',
      title: 'Configure User & Storage Mount',
      shortTitle: 'User & Storage',
      subtitle: 'Listeners, User credentials, and storage folder mount'
    },
    {
      minute: 3,
      timeEst: '03:00',
      title: 'Firewall Port 22 & 24/7 Power Plan',
      shortTitle: 'Firewall & Power',
      subtitle: 'Allow TCP Port 22 and prevent laptop from sleeping on AC'
    },
    {
      minute: 4,
      timeEst: '04:00',
      title: 'Connect Mobile Phone (5G)',
      shortTitle: 'Mobile Client 5G',
      subtitle: 'CX File Explorer remote streaming & access'
    },
    {
      minute: 5,
      timeEst: '00:00',
      title: 'Controls',
      shortTitle: 'Controls',
      subtitle: 'Shutdown code, Retrieve code & Permanent delete code'
    }
  ];

  // Nextcloud Steps definition
  const nextcloudMinuteSteps = [
    {
      minute: 1,
      timeEst: '01:00',
      title: 'Verify Docker Desktop + WSL2 & Tailscale',
      shortTitle: 'WSL2 & Tailscale',
      subtitle: 'Virtualization prerequisites & encrypted WireGuard mesh'
    },
    {
      minute: 2,
      timeEst: '02:00',
      title: 'Deploy Nextcloud AIO Mastercontainer',
      shortTitle: 'Deploy Docker AIO',
      subtitle: 'Single docker command to launch all-in-one container manager'
    },
    {
      minute: 3,
      timeEst: '03:00',
      title: 'Master Passphrase & Mount D:\\PersonalCloud',
      shortTitle: 'Passphrase & Disk',
      subtitle: 'Save disaster recovery key and bind native hard drive partition'
    },
    {
      minute: 4,
      timeEst: '04:00',
      title: 'Tailscale Serve HTTPS & 24/7 Power Plan',
      shortTitle: 'HTTPS & Power',
      subtitle: 'Private TLS domain without certbot + prevent host sleeping'
    },
    {
      minute: 5,
      timeEst: '05:00',
      title: 'Connect Mobile App (5G)',
      shortTitle: 'Mobile App 5G',
      subtitle: 'Nextcloud Mobile App automated background photo backup'
    }
  ];

  const currentSteps = engine === 'sftp' ? sftpMinuteSteps : nextcloudMinuteSteps;
  const totalProgress = Math.round((completedMinutes.length / currentSteps.length) * 100);

  // Script for SFTP Minute 4
  const sftpPowerShell = `# Run in PowerShell as Administrator:

# 1. Clean up existing firewall rule if previously created (prevents Error 183 'Cannot create a file when that file already exists')
Get-NetFirewallRule -Name "Allow_FileZilla_SFTP" -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction SilentlyContinue

# 2. Allow SFTP inbound traffic on Port 22
New-NetFirewallRule -Name "Allow_FileZilla_SFTP" \`
  -DisplayName "FileZilla SFTP Server (Port 22)" \`
  -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow

# 3. Configure 24/7 server power plan (Never sleep on AC, Lid Close = Do Nothing)
powercfg /change standby-timeout-ac 0
powercfg -setacvalueindex SCHEME_CURRENT 4f971e89-eebd-4455-a8de-9e59040e7347 5ca83367-6e45-459f-a27b-476b1d01c936 0
powercfg -setactive SCHEME_CURRENT

Write-Host "VaultGuide SFTP host firewall and power settings verified!" -ForegroundColor Green`;

  // Command for Nextcloud Minute 2
  const nextcloudDockerCmd = `docker run -d \`
  --sig-proxy=false \`
  --name nextcloud-aio-mastercontainer \`
  --restart always \`
  -p 80:80 \`
  -p 8080:8080 \`
  -p 8443:8443 \`
  -v nextcloud_aio_mastercontainer:/mnt/docker-aio-config \`
  -v /var/run/docker.sock:/var/run/docker.sock:ro \`
  nextcloud/all-in-one:latest`;

  // Script for Nextcloud Minute 4
  const nextcloudPowerShell = `# Run in PowerShell as Administrator:

# 1. Expose Nextcloud over private Tailscale HTTPS (Zero public cert hassle)
tailscale serve --bg https / http://localhost:11000

# 2. Allow incoming Tailscale traffic on AIO Admin (Port 8080)
New-NetFirewallRule -Name "Allow_Nextcloud_AIO" \`
  -DisplayName "Nextcloud AIO Admin Interface" \`
  -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow

# 3. Configure 24/7 server power plan (Never sleep on AC, Lid Close = Do Nothing)
powercfg /change standby-timeout-ac 0
powercfg -setacvalueindex SCHEME_CURRENT 4f971e89-eebd-4455-a8de-9e59040e7347 5ca83367-6e45-459f-a27b-476b1d01c936 0
powercfg -setactive SCHEME_CURRENT

Write-Host "Nextcloud AIO HTTPS serve & 24/7 host power plan activated!" -ForegroundColor Green`;

  // Process 1: Shutdown copy (Stop FileZilla, Disconnect Tailscale, Screen Time Normal 3 Min)
  const filezillaShutdownCmd = `Stop-Service -Name "filezilla-server" -Force -ErrorAction SilentlyContinue; taskkill /F /IM "FileZilla Server.exe" /T 2>$null`;
  const tailscaleShutdownCmd = `& "C:\\Program Files\\Tailscale\\tailscale.exe" down; taskkill /F /IM "tailscale-ipn.exe" /T 2>$null`;
  const screenTimeNormalCmd = `powercfg /change standby-timeout-ac 3; powercfg /change monitor-timeout-ac 3`;
  const shutdownCombinedCmd = `# 1. Stop FileZilla Server service
Stop-Service -Name "filezilla-server" -Force -ErrorAction SilentlyContinue

# 2. Disconnect Tailscale private mesh
& "C:\\Program Files\\Tailscale\\tailscale.exe" down

# 3. Restore Screen & Sleep Timeout to Normal Mode (3 Minutes)
powercfg /change standby-timeout-ac 3
powercfg /change monitor-timeout-ac 3

Write-Host "FileZilla stopped, Tailscale disconnected & Screen Timeout set to 3-minute normal mode!" -ForegroundColor Green`;

  // Process 2: Retrieve copy (Start FileZilla, Reconnect Tailscale, Host 24/7 Mode)
  const filezillaRetrieveCmd = `Start-Service -Name "filezilla-server" -ErrorAction SilentlyContinue; & "C:\\Program Files\\FileZilla Server\\filezilla-server.exe" 2>$null`;
  const tailscaleRetrieveCmd = `& "C:\\Program Files\\Tailscale\\tailscale.exe" up`;
  const screenTime247Cmd = `powercfg /change standby-timeout-ac 0; powercfg /change monitor-timeout-ac 0`;
  const retrieveCombinedCmd = `# 1. Start FileZilla Server service
Start-Service -Name "filezilla-server" -ErrorAction SilentlyContinue

# 2. Reconnect Tailscale private mesh
& "C:\\Program Files\\Tailscale\\tailscale.exe" up

# 3. Restore Host 24/7 Power Mode (Never Sleep on AC)
powercfg /change standby-timeout-ac 0
powercfg /change monitor-timeout-ac 0

Write-Host "FileZilla started, Tailscale reconnected & Host 24/7 mode retrieved!" -ForegroundColor Green`;

  // Process 3: Restart code (Restart FileZilla Server, Reset Tailscale Connection, Flush DNS Cache)
  const restartCombinedCmd = `# 1. Restart FileZilla Server
Restart-Service -Name "filezilla-server" -Force -ErrorAction SilentlyContinue

# 2. Reset Tailscale Connection
& "C:\\Program Files\\Tailscale\\tailscale.exe" down
& "C:\\Program Files\\Tailscale\\tailscale.exe" up --unattended

# 3. Flush DNS Cache
Clear-DnsClientCache
ipconfig /flushdns

Write-Host "FileZilla Server restarted, Tailscale connection reset & DNS cache flushed!" -ForegroundColor Yellow`;

  // Process 4: Status code (FileZilla Service Status, Tailscale Mesh Status & IP Check, Test TCP Port 22 SFTP Listener)
  const statusCombinedCmd = `# 1. FileZilla Service Status
Get-Service -Name "filezilla-server" -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType

# 2. Tailscale Mesh Status & IP Check
& "C:\\Program Files\\Tailscale\\tailscale.exe" status
& "C:\\Program Files\\Tailscale\\tailscale.exe" ip -4

# 3. Test TCP Port 22 SFTP Listener
Test-NetConnection -ComputerName 127.0.0.1 -Port 22 -InformationLevel Detailed`;

  // Process 5: Permanent Delete All copy (Tailscale, FileZilla Server, Screen Time Normal 3 Min)
  const tailscalePermanentDeleteCmd = `& "C:\\Program Files\\Tailscale\\tailscale.exe" logout 2>$null; Stop-Service -Name "Tailscale" -Force -ErrorAction SilentlyContinue; taskkill /F /IM "tailscale*" /T 2>$null; winget uninstall --id Tailscale.Tailscale --silent -h 2>$null`;
  const filezillaPermanentDeleteCmd = `Stop-Service -Name "filezilla-server" -Force -ErrorAction SilentlyContinue; taskkill /F /IM "FileZilla Server*" /T 2>$null; if (Test-Path "C:\\Program Files\\FileZilla Server\\uninstall.exe") { Start-Process -Wait -FilePath "C:\\Program Files\\FileZilla Server\\uninstall.exe" -ArgumentList "/S" 2>$null }; winget uninstall --id TimKosse.FileZillaServer --silent 2>$null`;
  const permanentDeleteCombinedCmd = `# 1. Permanently Uninstall & Remove Tailscale
& "C:\\Program Files\\Tailscale\\tailscale.exe" logout 2>$null
Stop-Service -Name "Tailscale" -Force -ErrorAction SilentlyContinue
taskkill /F /IM "tailscale*" /T 2>$null
winget uninstall --id Tailscale.Tailscale --silent -h 2>$null

# 2. Permanently Uninstall & Remove FileZilla Server
Stop-Service -Name "filezilla-server" -Force -ErrorAction SilentlyContinue
taskkill /F /IM "FileZilla Server*" /T 2>$null
if (Test-Path "C:\\Program Files\\FileZilla Server\\uninstall.exe") { Start-Process -Wait -FilePath "C:\\Program Files\\FileZilla Server\\uninstall.exe" -ArgumentList "/S" 2>$null }
winget uninstall --id TimKosse.FileZillaServer --silent 2>$null

# 3. Restore Screen & Sleep Timeout to Normal Mode (3 Minutes)
powercfg /change standby-timeout-ac 3
powercfg /change monitor-timeout-ac 3

Write-Host "Tailscale uninstalled, FileZilla removed & Screen Timeout reset to 3-minute normal mode!" -ForegroundColor Red`;

  const renderControlsTab = (stepNum: number) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PowerOff className="w-5 h-5 text-red-500" />
            <span>{stepNum}. Controls</span>
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241a15] border border-amber-900/60 text-[11px] font-semibold text-amber-300 shadow-2xs">
          <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>1. Run in CMD / PowerShell</span>
        </div>
      </div>

      {/* 5 Options Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 p-1.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800/90 shadow-sm text-xs sm:text-sm w-full max-w-4xl">
        <button
          type="button"
          onClick={() => setControlProcessTab('shutdown')}
          className={`w-full px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            controlProcessTab === 'shutdown'
              ? 'bg-slate-900 border border-cyan-500/40 text-white font-semibold'
              : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <PowerOff className={`w-3.5 h-3.5 shrink-0 ${controlProcessTab === 'shutdown' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className={`text-xs font-medium whitespace-nowrap ${controlProcessTab === 'shutdown' ? 'text-white font-semibold' : 'text-slate-400'}`}>Shutdown code</span>
        </button>

        <button
          type="button"
          onClick={() => setControlProcessTab('retrieve')}
          className={`w-full px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            controlProcessTab === 'retrieve'
              ? 'bg-slate-900 border border-cyan-500/40 text-white font-semibold'
              : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${controlProcessTab === 'retrieve' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className={`text-xs font-medium whitespace-nowrap ${controlProcessTab === 'retrieve' ? 'text-white font-semibold' : 'text-slate-400'}`}>Retrieve code</span>
        </button>

        <button
          type="button"
          onClick={() => setControlProcessTab('restart')}
          className={`w-full px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            controlProcessTab === 'restart'
              ? 'bg-slate-900 border border-cyan-500/40 text-white font-semibold'
              : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${controlProcessTab === 'restart' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className={`text-xs font-medium whitespace-nowrap ${controlProcessTab === 'restart' ? 'text-white font-semibold' : 'text-slate-400'}`}>Restart code</span>
        </button>

        <button
          type="button"
          onClick={() => setControlProcessTab('status')}
          className={`w-full px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            controlProcessTab === 'status'
              ? 'bg-slate-900 border border-cyan-500/40 text-white font-semibold'
              : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className={`w-3.5 h-3.5 shrink-0 ${controlProcessTab === 'status' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className={`text-xs font-medium whitespace-nowrap ${controlProcessTab === 'status' ? 'text-white font-semibold' : 'text-slate-400'}`}>Status code</span>
        </button>

        <button
          type="button"
          onClick={() => setControlProcessTab('delete')}
          className={`w-full px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            controlProcessTab === 'delete'
              ? 'bg-slate-900 border border-cyan-500/40 text-white font-semibold'
              : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trash2 className={`w-3.5 h-3.5 shrink-0 ${controlProcessTab === 'delete' ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span className={`text-xs font-medium whitespace-nowrap ${controlProcessTab === 'delete' ? 'text-white font-semibold' : 'text-slate-400'}`}>Permanent delete</span>
        </button>
      </div>

      {/* Option 1 Content: Shutdown code */}
      {controlProcessTab === 'shutdown' && (
        <div className="space-y-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 w-full max-w-4xl shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Shutdown</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Left: 3 steps stacked */}
            <div className="flex-1 space-y-2 text-xs min-w-0">
              {/* 1. Stop FileZilla Server */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">1</span>
                <span className="text-slate-200 font-medium truncate">Stop FileZilla Server</span>
              </div>

              {/* 2. Disconnect Tailscale */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">2</span>
                <span className="text-slate-200 font-medium truncate">Disconnect Tailscale</span>
              </div>

              {/* 3. Screen Normal (3 Min) */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">3</span>
                <span className="text-slate-200 font-medium truncate">Screen Normal (3 Min)</span>
              </div>
            </div>

            {/* Middle Bracket connecting all 3 steps to copy button */}
            <div className="flex items-center justify-center shrink-0 text-slate-500 select-none">
              <svg className="w-4 h-[96px] text-slate-500" viewBox="0 0 14 84" fill="none">
                <path d="M 2 4 C 6 4, 7 20, 7 38 C 7 41, 12 42, 12 42 C 12 42, 7 43, 7 46 C 7 64, 6 80, 2 80" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right: Shutdown copy button vertically centered in the middle */}
            <div className="shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => copyToClipboard(shutdownCombinedCmd, 'proc-shutdown-all')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 rounded-lg transition-all cursor-pointer shadow-xs"
                title="Copy all 3 shutdown commands into PowerShell"
              >
                {copiedId === 'proc-shutdown-all' ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Shutdown code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Option 2 Content: Retrieve code */}
      {controlProcessTab === 'retrieve' && (
        <div className="space-y-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 w-full max-w-4xl shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Retrieve</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Left: 3 steps stacked */}
            <div className="flex-1 space-y-2 text-xs min-w-0">
              {/* 1. Start FileZilla Server */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">1</span>
                <span className="text-slate-200 font-medium truncate">Start FileZilla Server</span>
              </div>

              {/* 2. Reconnect Tailscale */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">2</span>
                <span className="text-slate-200 font-medium truncate">Reconnect Tailscale (tailscale up)</span>
              </div>

              {/* 3. Screen Time 24/7 Always-On */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">3</span>
                <span className="text-slate-200 font-medium truncate">Host 24/7 Mode (Never Sleep)</span>
              </div>
            </div>

            {/* Middle Bracket connecting all 3 steps to copy button */}
            <div className="flex items-center justify-center shrink-0 text-slate-500 select-none">
              <svg className="w-4 h-[96px] text-slate-500" viewBox="0 0 14 84" fill="none">
                <path d="M 2 4 C 6 4, 7 20, 7 38 C 7 41, 12 42, 12 42 C 12 42, 7 43, 7 46 C 7 64, 6 80, 2 80" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right: Retrieve copy button vertically centered in the middle */}
            <div className="shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => copyToClipboard(retrieveCombinedCmd, 'proc-retrieve-all')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 rounded-lg transition-all cursor-pointer shadow-xs"
                title="Copy all 3 retrieve commands into PowerShell"
              >
                {copiedId === 'proc-retrieve-all' ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Retrieve code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Option: Restart code */}
      {controlProcessTab === 'restart' && (
        <div className="space-y-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 w-full max-w-4xl shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Restart</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Left: 3 steps stacked */}
            <div className="flex-1 space-y-2 text-xs min-w-0">
              {/* 1. Restart FileZilla Server */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">1</span>
                <span className="text-slate-200 font-medium truncate">Restart FileZilla Server</span>
              </div>

              {/* 2. Reset Tailscale Connection */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">2</span>
                <span className="text-slate-200 font-medium truncate">Reset Tailscale Connection</span>
              </div>

              {/* 3. Flush DNS Cache */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">3</span>
                <span className="text-slate-200 font-medium truncate">Flush DNS Cache</span>
              </div>
            </div>

            {/* Middle Bracket connecting all 3 steps to copy button */}
            <div className="flex items-center justify-center shrink-0 text-slate-500 select-none">
              <svg className="w-4 h-[96px] text-slate-500" viewBox="0 0 14 84" fill="none">
                <path d="M 2 4 C 6 4, 7 20, 7 38 C 7 41, 12 42, 12 42 C 12 42, 7 43, 7 46 C 7 64, 6 80, 2 80" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right: Restart copy button vertically centered in the middle */}
            <div className="shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => copyToClipboard(restartCombinedCmd, 'proc-restart-all')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 rounded-lg transition-all cursor-pointer shadow-xs"
                title="Copy all 3 restart commands into PowerShell"
              >
                {copiedId === 'proc-restart-all' ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Restart code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Option: Status code */}
      {controlProcessTab === 'status' && (
        <div className="space-y-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 w-full max-w-4xl shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Status</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Left: 3 steps stacked */}
            <div className="flex-1 space-y-2 text-xs min-w-0">
              {/* 1. FileZilla Service Status */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">1</span>
                <span className="text-slate-200 font-medium truncate">FileZilla Service Status</span>
              </div>

              {/* 2. Tailscale Mesh Status & IP Check */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">2</span>
                <span className="text-slate-200 font-medium truncate">Tailscale Mesh Status & IP Check</span>
              </div>

              {/* 3. Test TCP Port 22 SFTP Listener */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">3</span>
                <span className="text-slate-200 font-medium truncate">Test TCP Port 22 SFTP Listener</span>
              </div>
            </div>

            {/* Middle Bracket connecting all 3 steps to copy button */}
            <div className="flex items-center justify-center shrink-0 text-slate-500 select-none">
              <svg className="w-4 h-[96px] text-slate-500" viewBox="0 0 14 84" fill="none">
                <path d="M 2 4 C 6 4, 7 20, 7 38 C 7 41, 12 42, 12 42 C 12 42, 7 43, 7 46 C 7 64, 6 80, 2 80" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right: Status copy button vertically centered in the middle */}
            <div className="shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => copyToClipboard(statusCombinedCmd, 'proc-status-all')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 rounded-lg transition-all cursor-pointer shadow-xs"
                title="Copy all 3 status diagnostic commands into PowerShell"
              >
                {copiedId === 'proc-status-all' ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Status code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Option 5 Content: Permanent Delete All code */}
      {controlProcessTab === 'delete' && (
        <div className="space-y-4 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 w-full max-w-4xl shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <Trash2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Permanent Delete</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Left: 3 steps stacked */}
            <div className="flex-1 space-y-2 text-xs min-w-0">
              {/* 1. Tailscale Delete */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">1</span>
                <span className="text-slate-200 font-medium truncate">Delete Tailscale (Uninstall)</span>
              </div>

              {/* 2. FileZilla Server Delete */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">2</span>
                <span className="text-slate-200 font-medium truncate">Delete FileZilla Server (Uninstall)</span>
              </div>

              {/* 3. Screen time normal mode to 3 minutes */}
              <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold border border-cyan-500/40">3</span>
                <span className="text-slate-200 font-medium truncate">Screen Normal (3 Min)</span>
              </div>
            </div>

            {/* Middle Bracket connecting all 3 steps to copy button */}
            <div className="flex items-center justify-center shrink-0 text-slate-500 select-none">
              <svg className="w-4 h-[96px] text-slate-500" viewBox="0 0 14 84" fill="none">
                <path d="M 2 4 C 6 4, 7 20, 7 38 C 7 41, 12 42, 12 42 C 12 42, 7 43, 7 46 C 7 64, 6 80, 2 80" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right: perment delete all copy button vertically centered in the middle */}
            <div className="shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => copyToClipboard(permanentDeleteCombinedCmd, 'proc-delete-all')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 rounded-lg transition-all cursor-pointer shadow-xs"
                title="Copy all 3 permanent deletion commands into PowerShell"
              >
                {copiedId === 'proc-delete-all' ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>perment delete all code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="getting-started-guide-container space-y-8 w-full max-w-full"
      style={{ width: '100%', maxWidth: '100%' }}
    >
      {/* Top Banner */}
      <div className="space-y-4">
        {engine === 'sftp' ? (
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left Column: Title, Description, Pills */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d1c10] flex items-center gap-2.5">
                <span>Direct SFTP Getting Started Guide</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-semibold">
                  ~5 Minutes Total
                </span>
              </h1>
              <p className="text-xs text-[#6b4c35] mt-1.5 max-w-none leading-relaxed">
                Fastest, lightest private cloud setup: Direct <strong>FileZilla Server</strong> + <strong>Tailscale WireGuard</strong>. Delivers maximum disk throughput, 4K streaming with ~15 MB RAM overhead, zero database indexing lag, and complete isolation on <code className="text-amber-800 font-semibold font-mono bg-amber-100/60 px-1 py-0.5 rounded">D:\PersonalCloud</code> with 0 open router ports.
              </p>

              {/* Best Points Feature Highlights */}
              <div className="flex flex-wrap items-center gap-2 pt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>~15 MB RAM Footprint</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Direct Raw Disk Speed</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Zero Indexing Lag</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 border border-emerald-300 text-emerald-900 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span>Zero Open Router Ports</span>
                </span>
              </div>
            </div>

            {/* Right Column: In-Page Walkthrough Video Player */}
            <div className="w-full sm:w-[350px] lg:w-[360px] xl:w-[400px] shrink-0 self-center lg:self-start">
              <div className="rounded-2xl border border-amber-900/40 bg-[#1c120c] p-2 shadow-md overflow-hidden transition-all hover:border-amber-500/60 hover:shadow-amber-950/40">
                {!isPlayingWalkthrough ? (
                  <button
                    type="button"
                    onClick={() => setIsPlayingWalkthrough(true)}
                    className="group relative aspect-video w-full rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center p-4 select-none cursor-pointer focus:outline-none"
                    aria-label="Play 5-Minute Direct SFTP Walkthrough Video"
                  >
                    {/* Background Preview Video (First Frame preview) */}
                    <video
                      src="/walkthrough.mp4#t=0.5"
                      preload="metadata"
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    />

                    {/* Dark Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 pointer-events-none" />

                    {/* Amber Circular Play Button */}
                    <div className="relative z-10 w-13 h-13 rounded-full bg-amber-500 group-hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-black/80 transition-all duration-300 group-hover:scale-110 active:scale-95">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </button>
                ) : (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <video
                      src="/walkthrough.mp4"
                      controls
                      autoPlay
                      preload="metadata"
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      <source src="/walkthrough.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      type="button"
                      onClick={() => setIsPlayingWalkthrough(false)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/85 hover:bg-black text-amber-300 hover:text-white border border-amber-500/40 text-[10px] font-semibold flex items-center gap-1 z-20 cursor-pointer shadow-md transition-colors"
                      title="Close player and return to preview"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d1c10] flex items-center gap-2.5">
                <span>Nextcloud AIO Getting Started Guide</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-semibold">
                  ~5 Minutes Total
                </span>
              </h1>
              <p className="text-xs text-[#6b4c35] mt-1.5 max-w-none leading-relaxed">
                Enterprise personal cloud setup: Full <strong>Google Photos & Drive replacement</strong> via <strong>Docker AIO</strong> + <strong>Tailscale Serve HTTPS</strong>. Delivers native automatic background camera backup, web file portal, AI photo album indexing (Memories), automated 3-2-1 BorgBackup snapshots, and local drive storage on <code className="text-amber-800 font-semibold font-mono bg-amber-100/60 px-1 py-0.5 rounded">D:\PersonalCloud</code> with 0 open router ports and zero domain subscription costs.
              </p>

              {/* Best Points Feature Highlights */}
              <div className="flex flex-wrap items-center gap-2 pt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Google Photos & Drive Clone</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Auto Camera Roll Sync (5G)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 border border-emerald-300 text-emerald-900 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span>Free Tailscale HTTPS</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span>3-2-1 BorgBackup Redundancy</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#dfcebd] text-[#2d1c10] shadow-2xs hover:border-amber-400 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>D:\PersonalCloud Native Mount</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pipeline Navigation Bar - Compact Professional Stepper */}
      <nav aria-label="Step Tracker" className="p-1.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800/90 shadow-sm">
        <ol className={`grid grid-cols-2 ${currentSteps.length === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-6'} gap-1`}>
          {currentSteps.map((s) => {
            const isDone = completedMinutes.includes(s.minute);
            const isCurrent = activeMinute === s.minute;
            return (
              <li key={s.minute}>
                <button
                  onClick={() => setActiveMinute(s.minute)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-900 border border-cyan-500/40 text-white shadow-2xs'
                      : 'bg-transparent border border-transparent hover:bg-slate-900/50 hover:border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Minute ${s.minute}: ${s.title}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <Check className="w-2.5 h-2.5" /> : s.minute}
                    </span>

                    <span className={`text-[11px] font-medium truncate ${
                      isCurrent ? 'text-white font-semibold' : isDone ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      {s.shortTitle}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ========================================================================= */}
      {/* SFTP PROCEDURE (5 MIN) */}
      {/* ========================================================================= */}
      {engine === 'sftp' && (
        <div className="p-6 sm:p-8 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-6">
          {/* STEP 1: Tailscale & FileZilla Server (Merged) */}
          {activeMinute === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    1. Install Tailscale & FileZilla Server
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Prerequisites</span>
                  <button
                    onClick={() => markMinuteCompleted(1)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                  >
                    Confirm Software Installed ✓
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Install both prerequisites on your laptop. <strong>Tailscale</strong> creates a secure encrypted point-to-point mesh network with zero router port forwarding, and <strong>FileZilla Server</strong> runs as an ultra-lightweight native Windows service (~15 MB RAM) to stream your files directly from disk.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tailscale Card */}
                <div className="p-4.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>1. Tailscale Private Mesh Network</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">1.</span>
                      <span>Download Tailscale for Windows: <a href="https://tailscale.com/download" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline inline-flex items-center gap-0.5">tailscale.com <ExternalLink className="w-2.5 h-2.5" /></a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">2.</span>
                      <span>Install & log in with your Google, Microsoft, or GitHub account.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">3.</span>
                      <span>Install Tailscale on your mobile phone (App Store / Play Store) and log into the <strong>exact same account</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">4.</span>
                      <span>
                        After login, copy your laptop/PC Tailscale IPv4 address (e.g., <code className="px-1.5 py-0.5 bg-slate-900 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] rounded font-semibold">100.116.48.9</code>).
                      </span>
                    </li>
                  </ul>
                </div>

                {/* FileZilla Server Card */}
                <div className="p-4.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>2. FileZilla Server Daemon</span>
                  </div>
                  <ol className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">1.</span>
                      <span>Download FileZilla Server for Windows: <a href="https://filezilla-project.org/download.php?type=server" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline inline-flex items-center gap-0.5">filezilla-project.org <ExternalLink className="w-2.5 h-2.5" /></a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">2.</span>
                      <span>Install as a standard Windows Service (starts automatically on boot).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">3.</span>
                      <span>Launch <strong>FileZilla Server Administration</strong> (connect to <code className="font-mono text-slate-200">100.116.48.9</code>).</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Storage Mount & Connection Instructions */}
          {activeMinute === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dfcebd] pb-3">
                <div>
                  <h2 className="text-xl font-bold text-[#2d1c10]">
                    2. Configure User & Storage Mount
                  </h2>
                </div>
                <span className="text-xs font-mono text-amber-800 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 font-semibold">
                  User & Storage Mount (Port 21)
                </span>
              </div>

              {/* 1. Click "Connect to Server..." */}
              <div className="p-4 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5 font-bold text-base text-[#2d1c10]">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    1
                  </span>
                  <h3 className="font-bold">1. Click &quot;Connect to Server...&quot;</h3>
                </div>
                <p className="text-xs text-[#6b4c35] pl-8.5 leading-relaxed">
                  Click the <strong>Connect to Server...</strong> button in the center of your FileZilla Server window (or press <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-[#f5ece1] border border-[#dfcebd] rounded text-[#2d1c10]">Enter</kbd>).
                </p>
              </div>

              {/* Step 1: Set Listener Protocol (Recommended) */}
              <div className="p-4.5 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#2d1c10] text-sm">
                  <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                    Step 1
                  </span>
                  <h4 className="font-bold">Set Listener Protocol (Recommended)</h4>
                </div>
                <div className="text-xs text-[#6b4c35] space-y-2 pl-2 leading-relaxed">
                  <p className="font-medium text-[#2d1c10]">
                    Under <strong>Server listeners</strong> where you are right now:
                  </p>
                  <ul className="space-y-1.5 list-disc pl-5">
                    <li>
                      Click the dropdown under <strong>Protocol</strong> for{' '}
                      <code className="font-mono text-amber-950 font-bold bg-[#f5ece1] px-2 py-0.5 rounded border border-[#dfcebd] shadow-2xs">
                        100.116.48.9 (Port 22)
                      </code>.
                    </li>
                    <li>
                      Change it to <strong className="text-amber-950 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-300">Allow explicit FTP over TLS (or Insecure plain FTP)</strong>.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2: Click "Users" on the Left Sidebar */}
              <div className="p-4.5 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#2d1c10] text-sm">
                  <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                    Step 2
                  </span>
                  <h4 className="font-bold">Click &quot;Users&quot; on the Left Sidebar</h4>
                </div>
                <div className="text-xs text-[#6b4c35] space-y-2 pl-2 leading-relaxed">
                  <ul className="space-y-1.5 list-disc pl-5">
                    <li>In the left panel, click on <strong>Users</strong> (under <em>Rights management</em>).</li>
                    <li>Click the <strong>Add</strong> button on the right.</li>
                    <li>
                      Enter your mobile username: e.g.{' '}
                      <code className="font-mono text-amber-950 font-bold bg-[#f5ece1] px-2 py-0.5 rounded border border-[#dfcebd] shadow-2xs">
                        {username || 'vaultuser'}
                      </code>{' '}
                      and click <strong>OK</strong>.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3: Set Your Password */}
              <div className="p-4.5 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#2d1c10] text-sm">
                  <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                    Step 3
                  </span>
                  <h4 className="font-bold">Set Your Password</h4>
                </div>
                <div className="text-xs text-[#6b4c35] space-y-2 pl-2 leading-relaxed">
                  <ul className="space-y-1.5 list-disc pl-5">
                    <li>With your new user selected, look under <strong>Credentials (Authentication)</strong>.</li>
                    <li>Choose <strong>Require password to log in</strong>.</li>
                    <li>Type a password of your choice (you will use this on your phone).</li>
                  </ul>
                </div>
              </div>

              {/* Step 4: Choose Your Storage Folder (Mount Points) */}
              <div className="p-4.5 bg-white rounded-xl border border-[#dfcebd] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#2d1c10] text-sm">
                  <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                    Step 4
                  </span>
                  <h4 className="font-bold">Choose Your Storage Folder (Mount Points)</h4>
                </div>
                <div className="text-xs text-[#6b4c35] space-y-3 pl-2 leading-relaxed">
                  <p>In the user settings sub-list on the left, click <strong>Mount points</strong>.</p>
                  <p className="font-semibold text-[#2d1c10]">Click the <strong>Add</strong> button:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                    <div className="p-3 bg-[#f5ece1] rounded-lg border border-[#dfcebd] flex items-center justify-between">
                      <span className="text-[#7d5b3f]">Virtual path:</span>
                      <span className="text-amber-950 font-bold bg-white px-2 py-0.5 rounded border border-[#dfcebd]">Type /</span>
                    </div>
                    <div className="p-3 bg-[#f5ece1] rounded-lg border border-[#dfcebd] flex items-center justify-between">
                      <span className="text-[#7d5b3f]">Native path:</span>
                      <span className="text-emerald-900 font-bold bg-white px-2 py-0.5 rounded border border-[#dfcebd]">
                        Click browse or type {storagePath}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="text-[11px] font-medium text-[#7d5b3f] block mb-1">
                      Native path on your hard drive (to store files in):
                    </label>
                    <input
                      type="text"
                      value={storagePath}
                      onChange={(e) => setStoragePath(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-[#fcf8f3] border border-[#dfcebd] rounded text-[#2d1c10] focus:outline-none focus:border-amber-500"
                      placeholder="D:\PersonalCloud"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#2d1c10]">Under Permissions, check:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950 font-bold flex items-center gap-2">
                        <span className="text-emerald-700">☑</span>
                        <span>Read</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950 font-bold flex items-center gap-2">
                        <span className="text-emerald-700">☑</span>
                        <span>Write</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950 font-bold flex items-center gap-2">
                        <span className="text-emerald-700">☑</span>
                        <span>Delete</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950 font-bold flex items-center gap-2">
                        <span className="text-emerald-700">☑</span>
                        <span>Create directory</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#dfcebd] mt-3">
                    <p className="font-semibold text-amber-950 flex items-center gap-1.5 text-xs">
                      <span>Click</span>
                      <strong className="px-2 py-0.5 bg-amber-100 rounded border border-amber-300 text-amber-950 font-bold">OK</strong>
                      <span>at the very bottom right of the window to save!</span>
                    </p>

                    <button
                      onClick={() => markMinuteCompleted(2)}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Confirm User & Storage Done ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {activeMinute === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    3. Open Firewall Port 22 & Configure 24/7 Power Plan
                  </h2>
                </div>
                <span className="text-xs font-mono text-purple-300">PowerShell Automation</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Open <strong>PowerShell as Administrator</strong> and run the combined command below. This enables TCP Port 22 in Windows Defender Firewall (safe because only Tailscale peers can reach it) and prevents your laptop from sleeping when the lid is closed.
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                  <span>PowerShell (Administrator) Script</span>
                  <button
                    onClick={() => copyToClipboard(sftpPowerShell, 'pwr-sftp')}
                    className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'pwr-sftp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'pwr-sftp' ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-56">
                  {sftpPowerShell}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Applied PowerShell rule and verified standby timeout is 0?
                </span>
                <button
                  onClick={() => markMinuteCompleted(3)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                >
                  Mark Step Complete ✓
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {activeMinute === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    4. Connect Mobile Phone over 5G
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-300">Mobile Setup</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Mobile App Connection Card:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markMinuteCompleted(4)}
                      className="px-3.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                    >
                      Confirm Mobile Connected ✓
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-200">
                    Step-by-Step Instructions:
                  </div>
                  <ol className="space-y-2 text-slate-300 text-xs">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold mt-0.5">
                        1
                      </span>
                      <span>
                        Open after installing{' '}
                        <a
                          href="https://play.google.com/store/apps/details?id=com.cxinventor.file.explorer&pcampaignid=web_share"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:text-white underline font-semibold inline-flex items-center gap-0.5"
                          title="Install CX File Explorer from Google Play Store"
                        >
                          CX File Explorer
                          <ExternalLink className="w-2.5 h-2.5 text-cyan-400/80" />
                        </a>
                        , then click on <strong>Network</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold mt-0.5">
                        2
                      </span>
                      <span>
                        Click on <strong>+ new location</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold mt-0.5">
                        3
                      </span>
                      <span>
                        Click on <strong>Remote</strong>, select <strong>FTP</strong>, and in FTP select <strong>FTPS</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold mt-0.5">
                        4
                      </span>
                      <span>
                        Proceed with your details using the connection settings below:
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Connection Type:</span>
                    <span className="text-white font-bold text-xs mt-1">FTPS</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Remote Host / Server:</span>
                    <span className="text-cyan-300 font-bold text-xs mt-1">{tailscaleIp}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Port:</span>
                    <span className="text-white font-bold text-xs mt-1">22</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Username:</span>
                    <span className="text-emerald-300 font-bold text-xs mt-1">{username}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Ensure the Tailscale VPN key toggle is <strong>ACTIVE</strong> on your phone before tapping Connect.
                </p>
              </div>

              {completedMinutes.includes(4) && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Direct SFTP Setup Complete!</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Your laptop is now a 24/7 private cloud. You can stream 4K movies, access uncompressed camera RAW files, and manage your hard drive from anywhere in the world.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('backup')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Open 3-2-1 Resilience & Recovery Playbook
                    </button>
                    {onOpenRunbookExport && (
                      <button
                        onClick={onOpenRunbookExport}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer"
                      >
                        Export Standalone Runbook (.md)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Controls */}
          {activeMinute === 5 && renderControlsTab(5)}
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEXTCLOUD AIO PROCEDURE (5 MIN) */}
      {/* ========================================================================= */}
      {engine === 'nextcloud' && (
        <div className="p-6 sm:p-8 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-6">
          {/* MINUTE 1 */}
          {activeMinute === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    1. Verify Docker Desktop + WSL2 & Tailscale Mesh IP
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Host Virtualization & Tunnel</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Nextcloud All-in-One (AIO) runs under Docker with a WSL2 Linux backend. It gives you Google Photos facial recognition, camera roll synchronization, and web file browsing—all secured through your private Tailscale WireGuard mesh.
              </p>

              <div className="p-4.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Container className="w-4 h-4 text-cyan-400" />
                    <span>Prerequisites Checklist:</span>
                  </div>
                  <button
                    onClick={() => markMinuteCompleted(1)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                  >
                    Mark Step Complete ✓
                  </button>
                </div>

                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400">1.</span>
                    <span>
                      Download & install <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-0.5 font-medium">Docker Desktop for Windows <ExternalLink className="w-2.5 h-2.5" /></a> with <strong>Use the WSL 2 based engine</strong> enabled.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400">2.</span>
                    <span>Ensure Tailscale is connected on both Windows and your smartphone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400">3.</span>
                    <span>Verify in PowerShell: <code className="text-cyan-300 font-mono">wsl --status</code> returns Version 2.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* MINUTE 2 */}
          {activeMinute === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    2. Deploy Nextcloud AIO Mastercontainer
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-400">Docker Command</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Run this single command in PowerShell or terminal. It pulls the official Nextcloud AIO supervisor image which manages database, Redis cache, and storage containers automatically.
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                  <span>PowerShell / Command Prompt (Docker CLI)</span>
                  <button
                    onClick={() => copyToClipboard(nextcloudDockerCmd, 'docker-run')}
                    className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'docker-run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'docker-run' ? 'Copied Command!' : 'Copy Docker Run'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  {nextcloudDockerCmd}
                </pre>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Nextcloud AIO Admin Interface:</span>
                  <span className="text-slate-400">
                    Once the container starts, open in your browser: <code className="text-cyan-300 font-mono">https://localhost:8080</code>
                  </span>
                </div>

                <button
                  onClick={() => markMinuteCompleted(2)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer shrink-0"
                >
                  Confirm Mastercontainer Started ✓
                </button>
              </div>
            </div>
          )}

          {/* MINUTE 3 */}
          {activeMinute === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    3. Save Master Passphrase & Mount D:\PersonalCloud
                  </h2>
                </div>
                <span className="text-xs font-mono text-amber-400">Security & Persistent Storage</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Master passphrase card */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>AIO Admin Setup Passphrase:</span>
                  </div>

                  <p className="text-slate-400">
                    When opening <code className="text-slate-200">https://localhost:8080</code>, AIO displays a master password. Copy and save it securely:
                  </p>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-amber-300 flex justify-between items-center">
                    <span className="truncate">{passphrase}</span>
                    <button
                      onClick={() => copyToClipboard(passphrase, 'aio-pass')}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {copiedId === 'aio-pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 block">
                    Needed to access container management in the future.
                  </span>
                </div>

                {/* Host partition datadir card */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span>Set Host Storage Directory (Datadir):</span>
                  </div>

                  <p className="text-slate-400">
                    In the AIO setup form, enter your dedicated Windows partition to keep data on your hard drive:
                  </p>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-cyan-300 flex justify-between items-center">
                    <span>{storagePath}</span>
                    <span className="text-slate-500 text-[10px]">Host Partition</span>
                  </div>

                  {/* Addon modules check */}
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 text-[11px] font-semibold block">Recommended Addons:</span>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                      <label className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800 cursor-pointer">
                        <input type="checkbox" checked={memoriesEnabled} onChange={e => setMemoriesEnabled(e.target.checked)} className="accent-cyan-400" />
                        <span>Memories (Photos)</span>
                      </label>
                      <label className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800 cursor-pointer">
                        <input type="checkbox" checked={borgBackupEnabled} onChange={e => setBorgBackupEnabled(e.target.checked)} className="accent-cyan-400" />
                        <span>BorgBackup (3-2-1)</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => markMinuteCompleted(3)}
                    className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer mt-1"
                  >
                    Confirm Storage & Passphrase Configured ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MINUTE 4 */}
          {activeMinute === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    4. Tailscale Serve HTTPS & 24/7 Host Power Plan
                  </h2>
                </div>
                <span className="text-xs font-mono text-purple-300">Zero Public DNS Hassle</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                By running <code className="text-cyan-300 font-mono">tailscale serve https</code>, your machine gets an automated valid HTTPS certificate on your Tailscale MagicDNS name (e.g. <code className="text-slate-200">https://vault-host.tailnet.ts.net</code>). <strong>No public domain purchase or port 80/443 router forwarding is needed!</strong>
              </p>

              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
                  <span>PowerShell (Administrator) Script</span>
                  <button
                    onClick={() => copyToClipboard(nextcloudPowerShell, 'pwr-nc')}
                    className="flex items-center gap-1 text-cyan-300 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'pwr-nc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'pwr-nc' ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-56">
                  {nextcloudPowerShell}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Applied Tailscale Serve HTTPS and host sleep prevention?
                </span>
                <button
                  onClick={() => markMinuteCompleted(4)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                >
                  Mark Step Complete ✓
                </button>
              </div>
            </div>
          )}

          {/* MINUTE 5 */}
          {activeMinute === 5 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    5. Connect Nextcloud Mobile App (5G)
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-300">Mobile Setup</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Nextcloud iOS / Android Connection:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Official App</span>
                    <button
                      onClick={() => markMinuteCompleted(5)}
                      className="px-3.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer"
                    >
                      Confirm Mobile Connected ✓
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Server Address:</span>
                    <span className="text-cyan-300 font-bold text-xs mt-1">https://{tailscaleIp}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Tailnet MagicDNS:</span>
                    <span className="text-slate-300 text-xs mt-1">https://vault-host.tailnet.ts.net</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Username:</span>
                    <span className="text-emerald-300 font-bold text-xs mt-1">admin</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">Target Drive:</span>
                    <span className="text-white font-bold text-xs mt-1">{storagePath}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  In the app settings, turn on <strong>Auto-upload &gt; Camera</strong> to automatically backup phone photos over 5G.
                </p>
              </div>

              {completedMinutes.includes(5) && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>5-Minute Nextcloud AIO Stack Setup Complete!</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Your personal Google Drive & Google Photos alternative is active. All data lives on your local partition <code className="text-cyan-300">{storagePath}</code> with private Tailscale HTTPS encryption.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('backup')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Open 3-2-1 Resilience & Recovery Playbook
                    </button>
                    {onOpenRunbookExport && (
                      <button
                        onClick={onOpenRunbookExport}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer"
                      >
                        Export Standalone Runbook (.md)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-5 text-xs">
        <button
          onClick={() => setActiveMinute(prev => Math.max(1, prev - 1))}
          disabled={activeMinute === 1}
          className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Step {Math.max(1, activeMinute - 1)}</span>
        </button>

        {activeMinute < currentSteps.length ? (
          <button
            onClick={() => {
              markMinuteCompleted(activeMinute);
              setActiveMinute(prev => Math.min(currentSteps.length, prev + 1));
            }}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <span>Next: Step {activeMinute + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              markMinuteCompleted(currentSteps.length);
              onNavigate('overview');
            }}
            className="flex items-center gap-1.5 px-4 py-2 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <span>Finish & Return to Workbench</span>
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
