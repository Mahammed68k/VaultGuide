import React, { useState, useEffect } from 'react';
import { ActiveTab, AppTheme } from './types';
import { ArchitectureView } from './components/ArchitectureView';
import { BackupSimulatorView } from './components/BackupSimulatorView';
import { GettingStartedOnboarding } from './components/GettingStartedOnboarding';
import { Footer } from './components/Footer';
import { TermsPoliciesModal } from './components/TermsPoliciesModal';
import IntroScreen from './components/IntroScreen';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const theme: AppTheme = 'light'; // Permanent Latte theme
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [onboardingEngine, setOnboardingEngine] = useState<'sftp' | 'nextcloud'>('sftp');
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [termsInitialTab, setTermsInitialTab] = useState<'terms' | 'privacy' | 'security'>('terms');

  useEffect(() => {
    document.documentElement.classList.add('theme-light');
    document.documentElement.classList.remove('theme-midnight');
    localStorage.setItem('vaulthost-theme', 'light');
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleSelectOnboarding = (engine: 'sftp' | 'nextcloud') => {
    setOnboardingEngine(engine);
    setActiveTab('onboarding');
  };

  const handleOpenTerms = (tab: 'terms' | 'privacy' | 'security' = 'terms') => {
    setTermsInitialTab(tab);
    setIsTermsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f3] text-[#2d1c10] theme-light flex flex-col font-sans selection:bg-amber-900/20 selection:text-amber-900 transition-colors duration-200">
      {/* Cinematic Intro Splash Screen */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Sleek Minimal Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 bg-[#fcf8f3]/95 backdrop-blur-md border-b border-[#dfcebd] shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 flex items-center justify-center bg-amber-100/60 shadow-sm group-hover:border-amber-600/70 transition-all duration-300">
              <img 
                src="/logo.svg" 
                alt="VaultGuide Logo" 
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = 'true';
                    target.src = '/download.jpeg';
                  }
                }}
              />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#2d1c10] group-hover:text-amber-700 transition-colors block leading-tight">
                VaultGuide
              </span>
              <span className="text-[10px] font-mono text-amber-800/80 block leading-none mt-0.5">
                Private Cloud & SFTP
              </span>
            </div>
          </button>

          {activeTab !== 'overview' && (
            <button
              onClick={() => setActiveTab('overview')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300/80 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Overview</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport Content Container */}
      <main className="flex-1 w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-3 sm:pt-4 pb-8 sm:pb-10">
        {activeTab === 'overview' && (
          <ArchitectureView 
            onSelectTab={setActiveTab} 
            onSelectOnboarding={handleSelectOnboarding}
          />
        )}

        {activeTab === 'onboarding' && (
          <GettingStartedOnboarding 
            onNavigate={setActiveTab} 
            initialEngine={onboardingEngine}
          />
        )}

        {activeTab === 'backup' && (
          <BackupSimulatorView />
        )}
      </main>

      {/* Global Application Footer */}
      <Footer 
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenTerms={handleOpenTerms}
      />

      {/* Modals & Overlays */}
      <TermsPoliciesModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        initialTab={termsInitialTab}
      />
    </div>
  );
}
