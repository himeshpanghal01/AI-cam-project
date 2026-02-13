
import React, { useState, useCallback } from 'react';
import { Shield, Upload, FileVideo, FileImage, X, Search, Settings, Info, Menu } from 'lucide-react';
import { UploadedFile, AnalysisResult } from './types';
import VideoInspector from './components/VideoInspector';
import ChatWithVideo from './components/ChatWithVideo';
import Support from './components/Support';
import { analyzeVideo } from './services/geminiService';


const App: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'inspect' | 'chat' | 'support'>('inspect');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate size (mock constraint for browser safety)
    if (selectedFile.size > 200 * 1024 * 1024) { // 200MB limit for web demo
      alert("File is too large. For larger CCTV files, please use smaller segments or dedicated infrastructure.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFile({
        file: selectedFile,
        base64,
        type: selectedFile.type,
        previewUrl: URL.createObjectURL(selectedFile)
      });
      setAnalysis(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDeepScan = useCallback(async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const results = await analyzeVideo(file.base64, file.type);
      setAnalysis(results);
    } catch (error) {
      alert("Analysis failed. Ensure your API key is correct and valid for Gemini 3.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [file]);

  const removeFile = () => {
    if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
    setFile(null);
    setAnalysis(null);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className={`bg-slate-950 border-r border-slate-900 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inspect')}>
          <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <span className="font-black text-sm tracking-tight text-white uppercase italic leading-tight">AI CCTV<br />Video Inspector</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('inspect')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'inspect' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
              }`}
          >
            <Search className="w-5 h-5" />
            {isSidebarOpen && <span className="font-semibold">Inspector</span>}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            disabled={!file}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300 disabled:opacity-30'
              }`}
          >
            <FileVideo className="w-5 h-5" />
            {isSidebarOpen && <span className="font-semibold">Query Video</span>}
          </button>
        </nav>

        <div className="p-4 mt-auto space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-900/50 transition-all">
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Settings</span>}
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'support' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
              }`}
          >
            <Info className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Support</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {activeTab === 'inspect' ? 'Intelligence Dashboard' : activeTab === 'chat' ? 'Contextual Query Console' : 'Support Center'}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Gemini Node Active • Latency: 42ms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://picsum.photos/seed/${i + 10}/32/32`} className="w-8 h-8 rounded-full border-2 border-slate-950" />
              ))}
            </div>
            <div className="px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-slate-400 border border-slate-800">
              STATION_X
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'support' ? (
            <Support />
          ) : !file ? (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-xl w-full">
                <label className="group relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 hover:border-indigo-500/50 transition-all duration-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-8">
                    <div className="p-5 bg-slate-900 rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500 shadow-xl">
                      <Upload className="w-10 h-10 text-indigo-500 group-hover:text-white" />
                    </div>
                    <p className="mb-2 text-xl font-bold text-slate-200">Ingest Surveillance Stream</p>
                    <p className="text-sm text-slate-500 max-w-xs">Drop your MP4, MOV, or security footage here to begin neural interrogation.</p>
                  </div>
                  <input type="file" className="hidden" accept="video/*,image/*" onChange={handleFileUpload} />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <FileVideo className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <FileImage className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </label>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { title: 'Multimodal', desc: 'Senses visual & audio' },
                    { title: 'Semantic', desc: 'Understands complex acts' },
                    { title: 'Real-time', desc: 'Rapid inference engine' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-900/30 rounded-2xl border border-slate-900">
                      <h4 className="text-xs font-bold text-slate-300 uppercase mb-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600/20 rounded-lg">
                    <FileVideo className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-200 block">{file.file.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase mono">{(file.file.size / (1024 * 1024)).toFixed(2)} MB • {file.file.type}</span>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeTab === 'inspect' ? (
                <VideoInspector
                  file={file}
                  analysis={analysis}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleDeepScan}
                />
              ) : (
                <ChatWithVideo file={file} />
              )}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default App;
