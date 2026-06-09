import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Download, RefreshCw, Play, Pause,
  Instagram, Linkedin, PlaySquare, Heart, MessageCircle,
  Bookmark, Send, Share2, MoreHorizontal, Plus, ThumbsUp,
  Repeat2, Globe, ChevronLeft, ChevronRight, Eye, Code,
  FileText
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { BRAND } from '../lib/brandTokens.js';
import CarouselPreview from './CarouselPreview.jsx';
import InfographicPreview from './InfographicPreview.jsx';
import { 
  runWeeklyResearch, 
  generateCarouselData, 
  generateInfographicData, 
  generateReelScript 
} from '../lib/researchEngine.js';

// ─── Default Mock Data in Case of Empty States ────────────────────────
const getMockPreviewData = () => {
  const research = runWeeklyResearch();
  const topTrend = research.trends[0];
  return {
    trend: topTrend,
    carousel: generateCarouselData(topTrend),
    infographic: generateInfographicData(topTrend),
    reel: generateReelScript(topTrend)
  };
};

export default function Previewer({ animationData, scriptData, prefilledAsset }) {
  const [platform, setPlatform] = useState('instagram'); // instagram | tiktok | linkedin
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');
  const [linkedinExpanded, setLinkedinExpanded] = useState(false);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const viewportRef = useRef(null);

  // Load mock data if no assets have been compiled yet
  const mockData = getMockPreviewData();
  
  // Decide which asset to preview
  // 1. Compiled Reel Animation
  // 2. Prefilled/Generated Carousel
  // 3. Prefilled/Generated Infographic
  const activeAssetType = animationData 
    ? 'reel' 
    : prefilledAsset?.format 
      ? prefilledAsset.format 
      : 'carousel'; // default fallback

  const activeCarouselData = scriptData 
    ? { slides: scriptData, exam: prefilledAsset?.exam || 'IELTS', topic: prefilledAsset?.topic || 'IELTS Writing' } 
    : mockData.carousel;

  const activeInfographicData = prefilledAsset?.format === 'infographic'
    ? mockData.infographic // in production, it maps dynamically
    : mockData.infographic;

  const activeReelData = animationData || {
    id: 1,
    topic: mockData.trend.topic,
    niche: mockData.trend.category,
    scenes: mockData.reel.scenes.map(s => ({
      id: s.id,
      label: s.label,
      accent: s.label === 'HOOK' || s.label === 'THE FIX',
      style: s.label === 'HOOK' ? 'headline' : 'stacked',
      lines: s.script.split('. ')
    })),
    colors: {
      bg: '#08162b',
      primary: '#ffffff',
      accent: BRAND.gold,
      dim: 'rgba(255,255,255,0.45)'
    },
    timing: { sceneDuration: 3000, stagger: 0.15 },
    branding: '@viatestprep'
  };

  const examColor = prefilledAsset?.exam === 'PTE' ? BRAND.teal : BRAND.gold;

  const handleExportPNG = async () => {
    if (!viewportRef.current) return;
    setIsExporting(true);
    setExportMsg('');
    try {
      const canvas = await html2canvas(viewportRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0b0f19',
        scale: 2.5, // high resolution
        logging: false,
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VIA-Preview-${platform}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setExportMsg('High-res mockup snapshot downloaded!');
    } catch (err) {
      setExportMsg('Export failed — verify permissions');
      console.error(err);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportMsg(''), 3000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-full" style={{ fontFamily: BRAND.font }}>
      
      {/* ════════════════════════════════════════════════════════
          LEFT: Viewport Frame (Platform Sandbox)
      ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0 mx-auto lg:mx-0">
        
        {/* Platform Selector Tabs */}
        <div className="flex gap-2 p-1 bg-obsidian-mid/80 rounded-2xl border border-white/6 backdrop-blur-sm w-full max-w-[390px]">
          {[
            { id: 'instagram', label: 'Instagram', icon: Instagram },
            { id: 'tiktok', label: 'TikTok', icon: PlaySquare },
            { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
          ].map(tab => {
            const Icon = tab.icon;
            const active = platform === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setPlatform(tab.id);
                  setLinkedinExpanded(false);
                }}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl
                  text-xs font-bold transition-all duration-200 select-none
                  ${active 
                    ? 'bg-orange text-white shadow-md' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/4'}
                `}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Render Sandbox */}
        <div 
          ref={viewportRef}
          style={{
            width: 390,
            height: 600,
            background: platform === 'instagram' ? '#000000' : platform === 'tiktok' ? '#000000' : '#0d1117',
            border: `1px solid ${BRAND.border}`,
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: BRAND.shadowCard
          }}
        >
          {/* PLATFORM: INSTAGRAM MOCKUP */}
          {platform === 'instagram' && (
            <InstagramMockup 
              assetType={activeAssetType}
              carouselData={activeCarouselData}
              infographicData={activeInfographicData}
              reelData={activeReelData}
              examColor={examColor}
              isPlaying={isPlaying}
            />
          )}

          {/* PLATFORM: TIKTOK MOCKUP */}
          {platform === 'tiktok' && (
            <TikTokMockup 
              reelData={activeReelData}
              isPlaying={isPlaying}
            />
          )}

          {/* PLATFORM: LINKEDIN MOCKUP */}
          {platform === 'linkedin' && (
            <LinkedInMockup 
              assetType={activeAssetType}
              carouselData={activeCarouselData}
              infographicData={activeInfographicData}
              expanded={linkedinExpanded}
              setExpanded={setLinkedinExpanded}
              currentSlide={currentCarouselSlide}
              setCurrentSlide={setCurrentCarouselSlide}
            />
          )}
        </div>

        {/* Playback Controls (Only for Reel scripts / compilations) */}
        {activeAssetType === 'reel' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/6 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 50);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white/50 text-sm hover:text-white hover:bg-white/8 transition-colors"
            >
              <RefreshCw size={13} />
              Restart
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT: Export controls & details
      ════════════════════════════════════════════════════════ */}
      <div className="flex-1 space-y-6 min-w-0">
        <div>
          <h2 className="text-white font-extrabold text-xl">Mockup Preview & Export</h2>
          <p className="text-white/35 text-sm mt-1">
            Toggle feeds to preview final layout styles across popular platforms before scheduling.
          </p>
        </div>

        {/* Detail Card */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4" style={{ background: BRAND.bgCard }}>
          <h4 className="text-white/40 text-xs uppercase tracking-widest font-bold">Mockup Details</h4>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/4 pb-2">
              <span className="text-white/35">Active Niche Topic</span>
              <span className="text-white/80 font-bold">{prefilledAsset?.topic || mockData.trend.topic}</span>
            </div>
            <div className="flex justify-between border-b border-white/4 pb-2">
              <span className="text-white/35">Asset Type</span>
              <span className="text-white/80 font-bold uppercase" style={{ color: examColor }}>
                {activeAssetType} ({prefilledAsset?.exam || 'IELTS'})
              </span>
            </div>
            <div className="flex justify-between border-b border-white/4 pb-2">
              <span className="text-white/35">Safety Margins</span>
              <span className="text-white/80 font-mono text-[10px]">L/R 35px Zero-Bleed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/35">Instagram Handle</span>
              <span className="text-orange font-bold">@viatestprep</span>
            </div>
          </div>
        </div>

        {/* Export Action Card */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3" style={{ background: BRAND.bgCard }}>
          <h4 className="text-white/40 text-xs uppercase tracking-widest font-bold">Snapshot Mockup</h4>
          
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange hover:bg-orange-dim text-white font-bold text-sm transition-all shadow-lg"
          >
            {isExporting ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Capturing Mockup...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Download Platform Mockup PNG</span>
              </>
            )}
          </button>

          {exportMsg && (
            <p className="text-center text-xs text-green-400 font-semibold mt-1">
              {exportMsg}
            </p>
          )}

          <p className="text-[11px] text-white/30 text-center leading-relaxed">
            Takes a 2.5x high-res snapshot of the active mobile/desktop mockup card directly from the preview pane.
          </p>
        </div>

      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PLATFORM MOCKUP: INSTAGRAM
// ═══════════════════════════════════════════════════════════════════════════════
function InstagramMockup({ assetType, carouselData, infographicData, reelData, examColor, isPlaying }) {
  return (
    <div className="w-full h-full flex flex-col justify-between text-white" style={{ background: '#000000' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-[#0f0f0f]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center text-[9px] font-black text-white">
            VIA
          </div>
          <div>
            <div className="text-[11px] font-bold">viatestprep</div>
            <div className="text-[8px] text-white/50 leading-none">Sponsored · Kathmandu, Nepal</div>
          </div>
        </div>
        <MoreHorizontal size={14} className="text-white/50" />
      </div>

      {/* Content Post Container */}
      <div className="flex-1 flex items-center justify-center bg-[#050505] p-2 relative overflow-hidden">
        {assetType === 'carousel' && (
          <div className="scale-[0.80] transform origin-center">
            <CarouselPreview data={carouselData} examColor={examColor} />
          </div>
        )}
        {assetType === 'infographic' && (
          <div className="scale-[0.80] transform origin-center">
            <InfographicPreview data={infographicData} examColor={examColor} />
          </div>
        )}
        {assetType === 'reel' && (
          <div className="w-[280px] h-[340px] rounded-xl overflow-hidden relative scale-[0.85] origin-center border border-white/10">
            <MockReelPlayer reelData={reelData} isPlaying={isPlaying} compact />
          </div>
        )}
      </div>

      {/* Footer / Caption */}
      <div className="px-3 pb-3 pt-2 bg-[#0f0f0f] border-t border-white/10 space-y-1.5">
        
        {/* Interaction bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart size={18} className="hover:text-red-500 cursor-pointer" />
            <MessageCircle size={18} className="cursor-pointer" />
            <Send size={18} className="cursor-pointer" />
          </div>
          <Bookmark size={18} className="cursor-pointer" />
        </div>
        
        {/* Likes */}
        <div className="text-[11px] font-bold">2,482 likes</div>

        {/* Caption */}
        <div className="text-[10px] leading-relaxed line-clamp-2">
          <span className="font-bold mr-1.5">viatestprep</span>
          {carouselData?.caption || 'Check out our weekly test prep strategy.'}
        </div>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PLATFORM MOCKUP: TIKTOK
// ═══════════════════════════════════════════════════════════════════════════════
function TikTokMockup({ reelData, isPlaying }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-between text-white" style={{ background: '#000000' }}>
      
      {/* 9:16 Full Screen Reel Player */}
      <div className="absolute inset-0 z-0">
        <MockReelPlayer reelData={reelData} isPlaying={isPlaying} />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-center items-center gap-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-[11px] text-white/60 font-semibold cursor-pointer">Following</span>
        <span className="text-[12px] text-white font-bold border-b-2 border-white pb-1 cursor-pointer">For You</span>
      </div>

      {/* Side Overlays & Bottom Text */}
      <div className="relative z-10 flex justify-between items-end p-3.5 bg-gradient-to-t from-black/80 to-transparent">
        
        {/* Description & Audio */}
        <div className="space-y-1.5 max-w-[240px]">
          <div className="text-xs font-bold">@viatestprep</div>
          <p className="text-[10px] text-white/80 leading-relaxed line-clamp-2">
            Stuck at Band 6.5? Use this seamless loop fix for Speaking! #IELTS #SpeakingBand7 #PTETips
          </p>
          <div className="flex items-center gap-1.5 text-[9px] text-white/50">
            <span className="animate-pulse">🎵</span>
            <span className="truncate">Original Audio - @viatestprep</span>
          </div>
        </div>

        {/* Action Column */}
        <div className="flex flex-col items-center gap-3.5 pb-2">
          {/* Creator Profile */}
          <div className="relative mb-1">
            <div className="w-8 h-8 rounded-full bg-orange border border-white flex items-center justify-center text-[10px] font-black text-white">
              V
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 w-3 h-3 rounded-full flex items-center justify-center border border-white text-[8px] font-bold">
              +
            </div>
          </div>

          {/* Heart */}
          <div className="text-center">
            <Heart size={20} fill="#ef4444" stroke="#ef4444" />
            <span className="text-[9px] text-white/80 block mt-0.5">45.2K</span>
          </div>

          {/* Comments */}
          <div className="text-center">
            <MessageCircle size={20} fill="white" stroke="white" />
            <span className="text-[9px] text-white/80 block mt-0.5">892</span>
          </div>

          {/* Save */}
          <div className="text-center">
            <Bookmark size={20} fill="#ffd700" stroke="#ffd700" />
            <span className="text-[9px] text-white/80 block mt-0.5">12.5K</span>
          </div>

          {/* Share */}
          <div className="text-center">
            <Share2 size={20} />
            <span className="text-[9px] text-white/80 block mt-0.5">Share</span>
          </div>
        </div>

      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PLATFORM MOCKUP: LINKEDIN
// ═══════════════════════════════════════════════════════════════════════════════
function LinkedInMockup({ assetType, carouselData, infographicData, expanded, setExpanded, currentSlide, setCurrentSlide }) {
  const slides = carouselData?.slides || [];
  const slide = slides[currentSlide];

  const handleNext = () => {
    setCurrentSlide(p => (p < slides.length - 1 ? p + 1 : 0));
  };
  const handlePrev = () => {
    setCurrentSlide(p => (p > 0 ? p - 1 : slides.length - 1));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between text-[#e1e9f0]" style={{ background: '#1d2226' }}>
      
      {/* Header */}
      <div className="px-3.5 pt-3.5 pb-2 flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#0077b5] flex items-center justify-center text-xs font-black text-white">
            VIA
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              VIA Testprep
              <span className="text-[9px] text-white/40 font-normal">• 1st</span>
            </div>
            <div className="text-[9px] text-white/40 leading-none">Premier Test Prep Consultancies in Nepal</div>
            <div className="text-[8px] text-white/40 flex items-center gap-1 mt-0.5">
              <span>Promoted</span>
              <span>•</span>
              <Globe size={8} />
            </div>
          </div>
        </div>
        <button className="text-[#0077b5] hover:text-blue-400 text-xs font-extrabold flex items-center gap-1">
          <Plus size={12} />
          Follow
        </button>
      </div>

      {/* LinkedIn Post Text */}
      <div className="px-3.5 pb-2 text-[10.5px] leading-relaxed text-white/80">
        {expanded ? (
          <div>
            {carouselData?.caption}
            <button onClick={() => setExpanded(false)} className="text-[#0077b5] ml-1 font-bold">
              ...less
            </button>
          </div>
        ) : (
          <div>
            {carouselData?.caption?.substring(0, 100)}
            <button onClick={() => setExpanded(true)} className="text-[#0077b5] ml-1 font-bold">
              ...see more
            </button>
          </div>
        )}
      </div>

      {/* Main Document Viewer (Simulated PDF Slider) */}
      <div className="flex-1 bg-[#2d3237] border-y border-white/5 relative flex flex-col justify-between p-2 overflow-hidden">
        
        {/* Document Header Info */}
        <div className="flex justify-between items-center px-1.5 py-0.5 text-[8.5px] text-white/60 font-semibold border-b border-white/5 pb-1">
          <span className="truncate max-w-[150px]">IELTS-Speaking-Plateau-Guide.pdf</span>
          <span>{slides.length} pages</span>
        </div>

        {/* Carousel or Infographic Rendered in Document frame */}
        <div className="flex-1 flex items-center justify-center p-1">
          {assetType === 'carousel' ? (
            <div className="scale-[0.52] transform origin-center select-none pointer-events-none">
              <CarouselPreview data={{ ...carouselData, slides: [slide] }} examColor={BRAND.gold} />
            </div>
          ) : (
            <div className="scale-[0.52] transform origin-center select-none pointer-events-none">
              <InfographicPreview data={infographicData} examColor={BRAND.teal} />
            </div>
          )}
        </div>

        {/* Document Footer Navigation */}
        <div className="flex justify-between items-center px-1 border-t border-white/5 pt-1">
          <span className="text-[9px] text-white/50">Page {currentSlide + 1} of {slides.length}</span>
          
          <div className="flex gap-2.5">
            <button 
              onClick={handlePrev}
              className="w-4 h-4 rounded-full bg-[#1d2226] border border-white/10 flex items-center justify-center text-white hover:bg-[#0077b5]"
            >
              <ChevronLeft size={10} />
            </button>
            <button 
              onClick={handleNext}
              className="w-4 h-4 rounded-full bg-[#1d2226] border border-white/10 flex items-center justify-center text-white hover:bg-[#0077b5]"
            >
              <ChevronRight size={10} />
            </button>
          </div>
        </div>

      </div>

      {/* LinkedIn Post Interactions */}
      <div className="px-3.5 py-2 flex justify-between items-center bg-[#181d20] text-xs text-white/40 border-t border-white/5">
        <button className="flex items-center gap-1.5 hover:text-blue-400">
          <ThumbsUp size={13} />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400">
          <MessageCircle size={13} />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400">
          <Repeat2 size={13} />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400">
          <Send size={13} />
          <span>Send</span>
        </button>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DYNAMIC SUB-COMPONENT: REEL PLAYER (FOR TIKTOK/INSTAGRAM)
// ═══════════════════════════════════════════════════════════════════════════════
function MockReelPlayer({ reelData, isPlaying, compact = false }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const intervalRef = useRef(null);

  const scenes = reelData.scenes || [];
  const scene = scenes[sceneIndex] || scenes[0];

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSceneIndex(prev => (prev + 1) % scenes.length);
    }, reelData.timing?.sceneDuration || 3000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, scenes.length, reelData.timing?.sceneDuration]);

  if (!scene) return null;

  return (
    <div 
      className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden" 
      style={{ background: reelData.colors?.bg || '#08162b', padding: compact ? '20px' : '35px' }}
    >
      {/* Background Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      {/* Progress Track */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          key={sceneIndex}
          initial={{ width: '0%' }}
          animate={{ width: isPlaying ? '100%' : '0%' }}
          transition={{ duration: (reelData.timing?.sceneDuration || 3000) / 1000, ease: 'linear' }}
          className="h-full"
          style={{ background: reelData.colors?.accent || BRAND.gold }}
        />
      </div>

      {/* Text Lines */}
      <div className="text-center z-10 w-full space-y-2">
        <span className="text-[8px] font-black tracking-widest text-orange uppercase block mb-1">
          {scene.label}
        </span>
        
        {scene.lines.map((line, idx) => {
          const isAccent = scene.accent && idx === scene.lines.length - 1;
          return (
            <motion.p
              key={`${sceneIndex}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
              style={{
                color: isAccent ? (reelData.colors?.accent || BRAND.gold) : '#ffffff',
                fontSize: compact ? '12px' : '16px',
                fontWeight: scene.style === 'headline' ? 900 : 700,
                lineHeight: 1.3
              }}
            >
              {line}
            </motion.p>
          );
        })}
      </div>

      {/* Branding overlay */}
      <div className="absolute bottom-4 text-[9px] font-bold text-white/30 uppercase tracking-widest">
        {reelData.branding}
      </div>
    </div>
  );
}
