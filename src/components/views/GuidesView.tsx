import React from 'react';
import { useTruckStore } from '../../store/useTruckStore';
import { GUIDE_ARTICLES } from '../../lib/data/guides';
import { BookOpen, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

export const GuidesView: React.FC = () => {
  const { activeView, activeGuideSlug, openGuideDetail, setActiveView } = useTruckStore();

  const activeArticle = GUIDE_ARTICLES.find(g => g.slug === activeGuideSlug) || GUIDE_ARTICLES[0];

  if (activeView === 'guide-detail') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setActiveView('guides')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          ← Back to All Guides & Articles
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="flex items-center space-x-3 text-xs">
              <span className="font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                {activeArticle.category}
              </span>
              <span className="text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.readTime}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {activeArticle.title}
            </h1>
            <p className="text-sm text-slate-600 font-medium">{activeArticle.subtitle}</p>
          </div>

          {/* Key Takeaways Box */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Key Takeaways</span>
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-800 space-y-1.5 pl-1">
              {activeArticle.keyTakeaways.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          <AdSlot placement="InLineResults" />

          {/* Article Body */}
          <div className="max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
            {activeArticle.content}
          </div>
        </div>

        <AdSlot placement="InLineResults" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Scale & Bridge Formula Guides</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          In-depth guides regarding Federal Bridge Formula math, scale ticket interpretation, kingpin laws, and lift axle regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDE_ARTICLES.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                  {article.category}
                </span>
                <span className="text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">{article.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{article.subtitle}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => openGuideDetail(article.slug)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow transition-colors flex items-center space-x-1.5"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdSlot placement="InLineResults" />
    </div>
  );
};
