"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    country: "UAE",
    resume: "",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();

      // CRITICAL FIX: Check if the backend sent an error
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center selection:bg-blue-500/30">
      
      <header className="max-w-2xl w-full mb-10 mt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">GCC Job Readiness</h1>
        <p className="mt-3 text-lg text-slate-400">
          An honest, AI-powered assessment for the Gulf market. <br className="hidden md:block" />
          No hype. No data storage. Just clarity.
        </p>
      </header>

      <div className="max-w-2xl w-full bg-slate-900 p-8 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-800/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Target Country</label>
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="UAE">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Qatar">Qatar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Years of Experience</label>
              <input 
                type="number" 
                name="experience"
                required
                placeholder="e.g. 5"
                value={formData.experience} 
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Target Role</label>
            <input 
              type="text" 
              name="role"
              required
              placeholder="e.g. Senior Project Manager"
              value={formData.role} 
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Paste Resume Text</label>
            <textarea 
              name="resume"
              required
              rows={6}
              placeholder="Copy and paste the text from your CV here."
              value={formData.resume} 
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 outline-none text-sm resize-y"
            ></textarea>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg text-sm text-center">
              ⚠ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze My Readiness"}
          </button>
        </form>
      </div>

      {result && !result.error && (
        <div id="results-section" className="max-w-2xl w-full mt-10 bg-slate-900 p-8 rounded-2xl border border-slate-800/50">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-slate-800 pb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">Readiness Score</h2>
            </div>
            <div className={`text-5xl font-black ${result.score > 70 ? 'text-green-400' : 'text-amber-400'}`}>
              {result.score}<span className="text-2xl text-slate-500">/100</span>
            </div>
          </div>

          <div className="mb-8 p-5 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-300">
            {result.summary}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-lg text-green-400 mb-4">Strengths</h3>
              <ul className="space-y-3 text-slate-300">
                {result.strengths?.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start"><span className="text-green-500">›</span> {item}</li>
                )) || <li className="text-slate-500">No strengths detected.</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-400 mb-4">Gaps to Fix</h3>
              <ul className="space-y-3 text-slate-300">
                {result.gaps?.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start"><span className="text-amber-500">›</span> {item}</li>
                )) || <li className="text-slate-500">No gaps detected.</li>}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-5">Recommended Next Steps</h3>
            <ul className="space-y-4">
              {result.action_plan?.map((step: string, i: number) => (
                <li key={i} className="flex gap-4 text-slate-300 p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-sm">{i + 1}</span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
