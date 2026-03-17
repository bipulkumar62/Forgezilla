/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Mail, 
  Linkedin, 
  ChevronRight, 
  Github,
  ExternalLink,
  Zap,
  Cpu,
  Menu,
  X,
  Youtube
} from 'lucide-react';

import { GoogleGenAI } from "@google/genai";

const UXFORGE_LOGO = import.meta.env.VITE_UXFORGE_LOGO_URL || "https://ufvsgqkqlojmcwsvwvwa.supabase.co/storage/v1/object/sign/jp/ChatGPT%20Image%20Mar%2017,%202026,%2004_07_06%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzgyYjhjMS1mODhlLTQ0YzAtOTRkZS1jYjQyMWYxMzE1NjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJqcC9DaGF0R1BUIEltYWdlIE1hciAxNywgMjAyNiwgMDRfMDdfMDYgUE0ucG5nIiwiaWF0IjoxNzczNzQzODcwLCJleHAiOjMwNTczNzE1MDcwfQ.KdJ37_EA2T4f3jmNaRYpsid9oCmB0CoA_SaFSzxO9zU";
const THUMBFORGE_LOGO = import.meta.env.VITE_THUMBFORGE_LOGO_URL || "https://ufvsgqkqlojmcwsvwvwa.supabase.co/storage/v1/object/sign/jp/WhatsApp%20Image%202026-03-16%20at%204.14.50%20PM.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzgyYjhjMS1mODhlLTQ0YzAtOTRkZS1jYjQyMWYxMzE1NjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJqcC9XaGF0c0FwcCBJbWFnZSAyMDI2LTAzLTE2IGF0IDQuMTQuNTAgUE0uanBlZyIsImlhdCI6MTc3Mzc0NDQ3OCwiZXhwIjo0NjE5Mjg4MTcwMDc4fQ.vXNDmZcOGQuahkR2BAPNPm9WOM2vweLoi7XDNfjxDok";

// Connect the provided Gemini API Key
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('Website');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);
  const [limitReached, setLimitReached] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if limit was already reached today on mount
    const lastGen = localStorage.getItem('last_generation_date');
    if (lastGen) {
      const lastDate = new Date(lastGen);
      const today = new Date();
      if (lastDate.toDateString() === today.toDateString()) {
        setLimitReached(true);
      }
    }

    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      duration: Math.random() * 10 + 10
    }));
    setParticles(newParticles);
  }, []);

  const handleGenerate = async () => {
    if (!prompt || limitReached) return;
    
    setIsGenerating(true);
    setGeneratedCode('');

    try {
      if (!genAI) {
        throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.');
      }

      const systemPrompt = `You are an expert UI/UX designer and frontend developer. 
      Generate a modern, clean, and responsive HTML/CSS layout for a ${type} based on the user's description.
      Use Tailwind CSS for styling. Return ONLY the HTML code block. 
      The design should be futuristic and high-quality.`;

      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt
        }
      });
      
      const text = result.text || '';
      setGeneratedCode(text);

      // Update daily limit
      const today = new Date();
      localStorage.setItem('last_generation_date', today.toISOString());
      setLimitReached(true);

    } catch (error) {
      console.error('Generation failed:', error);
      alert("Failed to generate UI. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-green/30 overflow-x-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#00ff88]/10 blur-xl"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(0,255,136,0.8)] transition-all">
              <img 
                src={UXFORGE_LOGO} 
                alt="Forgezilla Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tighter" style={{ textShadow: '0 0-10px rgba(0, 255, 136, 0.5)' }}>Forgezilla</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Tools', 'Support', 'About'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium text-gray-400 hover:text-[#00ff88] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => scrollToSection('tools')}
              className="hidden sm:block px-5 py-2 rounded-full border border-[#00ff88] text-[#00ff88] text-sm font-semibold hover:bg-[#00ff88] hover:text-black transition-all"
            >
              Get Started
            </button>
            
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6">
                {['Home', 'Tools', 'Support', 'About'].map((item) => (
                  <button 
                    key={item}
                    onClick={() => {
                      scrollToSection(item.toLowerCase());
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-lg font-medium text-gray-400 hover:text-[#00ff88] transition-colors"
                  >
                    {item}
                  </button>
                ))}
                <button 
                  onClick={() => {
                    scrollToSection('tools');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00ff88] text-black font-bold text-center"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 md:pt-40 pb-12 md:pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight" style={{ animation: 'float 6s ease-in-out infinite' }}>
              Build Stunning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ffff]" style={{ textShadow: '0 0 10px rgba(0, 255, 136, 0.5)' }}>Designs with AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              AI tools built by an independent developer to simplify design and content creation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => scrollToSection('generator')}
                className="px-8 py-3 rounded-full font-semibold border-2 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] transition-all flex items-center justify-center gap-2"
              >
                Generate UI <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('tools')}
                className="px-8 py-3 rounded-full font-semibold border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all"
              >
                Explore Tools
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Tools</h2>
            <p className="text-gray-400">Specialized generators for modern creators.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* UXForge AI */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#00ff88]/50"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-[#00ff88]/10 group-hover:bg-[#00ff88]/20 transition-colors mb-6">
                <img 
                  src={UXFORGE_LOGO} 
                  alt="UXForge AI Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-3xl font-bold mb-4">UXForge AI</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Generate modern UI and UX layouts instantly with AI. Perfect for rapid prototyping and design inspiration.
              </p>
              <button 
                onClick={() => scrollToSection('generator')}
                className="w-full py-3 rounded-full font-semibold border-2 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black transition-all"
              >
                Open Generator
              </button>
            </motion.div>

            {/* ThumbForge AI */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-[#00ffff]/50"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-[#00ffff]/10 group-hover:bg-[#00ffff]/20 transition-colors">
                  <img 
                    src={THUMBFORGE_LOGO} 
                    alt="ThumbForge AI Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">ThumbForge AI</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Generate professional YouTube thumbnails with AI. Boost your CTR with eye-catching designs in seconds.
              </p>
              <a 
                href="https://thumbnailwrap.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-full font-semibold border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all text-center"
              >
                Open Tool
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-16 md:py-20 px-4 md:px-6 bg-white/5 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI UI Generator</h2>
            <p className="text-gray-400">Describe your vision and watch the code come to life.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 hover:border-[#00ff88]/50 transition-all">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the UI you want to generate..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] outline-none transition-all h-32 resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Project Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#00ff88] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Website</option>
                    <option>Dashboard</option>
                    <option>Mobile App</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt || limitReached}
                    className={`px-8 py-4 rounded-xl font-bold border-2 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black transition-all w-full md:w-auto flex items-center justify-center gap-2 ${isGenerating || limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : limitReached ? (
                      'Daily Limit Reached'
                    ) : (
                      <>
                        <Zap size={20} /> Generate UI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {limitReached && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#00ff88]/10 to-[#00ffff]/10 border border-[#00ff88]/20 text-center"
                >
                  <p className="text-[#00ff88] font-bold mb-2 flex items-center justify-center gap-2">
                    <Zap size={20} /> Daily Limit Reached
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    You've used your 1 free generation for today. Upgrade to Pro for unlimited access!
                  </p>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-6 py-2 rounded-full bg-[#00ff88] text-black font-bold hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] transition-all"
                  >
                    Upgrade to Pro — $14
                  </button>
                </motion.div>
              )}

              <AnimatePresence>
                {generatedCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#00ff88]">Generated Result</span>
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? <Check size={14} className="text-[#00ff88]" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="bg-black rounded-xl p-6 border border-white/10 overflow-x-auto">
                      <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-gray-500 italic">
                  "Free users can generate 1 design per day."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 border-l-4 border-l-[#00ff88] rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">About the Platform</h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              This platform is built by an independent developer exploring AI tools and automation. 
              The goal is to build useful AI-powered tools that solve real problems for designers, 
              developers, and content creators.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00ffff]" />
              <div>
                <p className="font-bold">Bipul Kumar</p>
                <p className="text-sm text-gray-500">Independent Student Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16 md:py-20 px-4 md:px-6 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-400 mb-10">For support or collaboration inquiries contact:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <a 
              href="mailto:yash.webstudio@gmail.com"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 hover:bg-white/10 hover:border-[#00ff88]/50 transition-all"
            >
              <Mail className="text-[#00ff88]" size={32} />
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Us</p>
                <p className="font-bold">yash.webstudio@gmail.com</p>
              </div>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/bipul-kumar-23067837b"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 hover:bg-white/10 hover:border-[#00ffff]/50 transition-all"
            >
              <Linkedin className="text-[#00ffff]" size={32} />
              <div>
                <p className="text-sm text-gray-500 mb-1">LinkedIn</p>
                <p className="font-bold">Connect with Bipul</p>
              </div>
            </a>

            <a 
              href="http://www.youtube.com/@Startupzilla_official"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 hover:bg-white/10 hover:border-[#ff0000]/50 transition-all"
            >
              <Youtube className="text-[#ff0000]" size={32} />
              <div>
                <p className="text-sm text-gray-500 mb-1">YouTube</p>
                <p className="font-bold">Startupzilla</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src={UXFORGE_LOGO} 
                    alt="Forgezilla Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold tracking-tighter">Forgezilla</span>
              </div>
              <p className="text-gray-500 max-w-sm">
                Simplifying design and content creation through the power of artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#00ff88] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#00ff88] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#support" className="hover:text-[#00ff88] transition-colors">Support</a></li>
                <li><a href="mailto:yash.webstudio@gmail.com" className="hover:text-[#00ff88] transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Forgezilla – Built by Bipul Kumar
            </p>
            <div className="flex items-center gap-6">
              <a href="http://www.youtube.com/@Startupzilla_official" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ff0000] transition-colors"><Youtube size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><ExternalLink size={20} /></a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ff88] to-[#00ffff]" />
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#00ff88]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-[#00ff88]" size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-gray-400">Unlock the full power of Forgezilla</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Unlimited AI Generations',
                  'High-Priority Processing',
                  'Commercial Usage License',
                  'Export in Multiple Formats',
                  '24/7 Priority Support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <Check size={18} className="text-[#00ff88]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 text-center border border-white/5">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Lifetime Access</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-black">$14</span>
                  <span className="text-gray-500">one-time</span>
                </div>
              </div>

              <button 
                className="w-full py-4 rounded-xl bg-[#00ff88] text-black font-black text-lg hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] transition-all mb-4"
                onClick={() => alert("Redirecting to secure checkout...")}
              >
                Get Pro Access Now
              </button>
              
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-gray-500 text-sm hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
