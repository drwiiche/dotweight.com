import React from 'react';
import { Truck, Scale, MapPin, BookOpen, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTruckStore } from '../store/useTruckStore';

export const Footer: React.FC = () => {
  const { setActiveView, openLegalTab } = useTruckStore();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-24 lg:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-md">
                <Truck className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">DOT<span className="text-blue-400">Weight</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional DOT Axle Weight & Federal Bridge Formula B compliance calculator built for commercial drivers, dispatchers, hotshot haulers, and fleet managers.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] text-amber-300/90 leading-normal flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>For estimation purposes only. Federal and state weigh stations remain final legal authority.</span>
            </div>
          </div>

          {/* Col 2: Quick Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Calculators & Tools</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('calculator')} className="hover:text-blue-400 transition-colors">
                  Interactive Axle Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('cat-scale-decoder')} className="hover:text-emerald-400 font-semibold transition-colors">
                  CAT Scale Ticket Decoder
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('pseo-matrix')} className="hover:text-blue-400 transition-colors">
                  1,200+ Route Permutation Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-seo-health')} className="hover:text-amber-400 font-mono transition-colors">
                  SEO Audit (/admin/seo-health)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('presets')} className="hover:text-blue-400 transition-colors">
                  53&apos; Semi Truck Preset
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('presets')} className="hover:text-blue-400 transition-colors">
                  4-Axle Dump Truck Preset
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('tests')} className="hover:text-emerald-400 transition-colors flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">System Audit & Test Suite</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: State Regulations & Guides */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Regulations & Guides</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('states')} className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span>50 State DOT Rules Directory</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('guides')} className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-blue-400" />
                  <span>Federal Bridge Formula B Math</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('guides')} className="hover:text-blue-400 transition-colors">
                  California 40&apos; KPRA Law Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('guides')} className="hover:text-blue-400 transition-colors">
                  CAT Scale Ticket Reading Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & AdSense Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Legal & Compliance</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openLegalTab('disclaimer')} className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span>Liability Disclaimer</span>
                </button>
              </li>
              <li>
                <button onClick={() => openLegalTab('privacy')} className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => openLegalTab('terms')} className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DOTWeight.com / Federal Bridge Formula Calculator. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => openLegalTab('privacy')}>Ad Choices & Privacy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => openLegalTab('disclaimer')}>Legal Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
