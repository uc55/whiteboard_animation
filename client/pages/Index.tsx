import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Move3d, Zap } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">✦</span>
            </div>
            <span className="text-white font-bold text-xl">WhiteBoard</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Infinite Creative <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Possibilities</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Create interactive whiteboards with draggable elements, multiple layers, and various resolution formats. Perfect for brainstorming, design, and collaborative work.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <span className="text-slate-200">Drag and reposition any element</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <span className="text-slate-200">Manage multiple layers with ease</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <span className="text-slate-200">Support for various resolutions</span>
              </div>
            </div>

            <Link to="/whiteboard">
              <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white border-0 text-lg px-8">
                Create New Whiteboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Right - Visual Demo */}
          <div className="relative h-96 lg:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl blur-3xl" />
            <div className="relative bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl p-8 h-full flex flex-col justify-between overflow-hidden">
              <div className="space-y-3">
                <div className="h-12 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-lg flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400/60" />
                  <span className="text-sm text-slate-300">Text Element</span>
                </div>
                <div className="h-12 bg-slate-700/40 rounded-lg flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400/60" />
                  <span className="text-sm text-slate-400">Heading Title</span>
                </div>
                <div className="h-12 bg-slate-700/40 rounded-lg flex items-center px-4 gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-slate-400">Task Item</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">Layers</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === 1 ? "bg-cyan-400" : "bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <Move3d className="h-12 w-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Draggable Elements</h3>
            <p className="text-slate-400">Easily drag and reposition text, headings, lists, and more with smooth interactions.</p>
          </div>
          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <Layers className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Layer Support</h3>
            <p className="text-slate-400">Create complex designs with multiple layers, manage visibility and order easily.</p>
          </div>
          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <Zap className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Resolution Formats</h3>
            <p className="text-slate-400">Work with landscape, portrait, and custom resolution formats for your projects.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>Created with modern React, Vite, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
