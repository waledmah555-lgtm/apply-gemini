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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
      // Scroll to results on mobile
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // MAIN CONTAINER: Deep dark background, light text
    <main className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="max-w-2xl w-full mb-10 mt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">GCC Job Readiness</h1>
        <p className="mt-3 text-lg text-slate-400">
          An honest, AI-powered assessment for the Gulf market. <br className="hidden md:block" />
          No hype. No data storage. Just clarity.
        </p>
      </header>

      {/* Input Form Container: Slightly lighter dark card */}
      <div className="max-w-2xl w-full bg-slate-900 p-8 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-800/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Target Country</label>
              {/* Dark Input Styling */}
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Paste Resume Text</label>
            <textarea 
              name="resume"
              required
              rows={6}
              placeholder="Copy and paste the text from your CV here. Don't worry about formatting."
              value={formData.resume} 
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-y"
            ></textarea>
          </div>

          {/* Vibrant Blue Button for contrast */}
          <button 
            type="submit" 
            disabled={loading || !formData.resume || !formData.role || !formData.experience}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:hover:bg-blue-600 shadow-lg shadow-blue-900/30 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing Profile...
              </span>
            ) : "Analyze My Readiness"}
          </button>
        </form>
      </div>

      {/* Results Section Container */}
      {result && (
        <div id="results-section" className="max-w-2xl w-full mt-10 bg-slate-900 p-8 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-800/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Score Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-slate-800 pb-8 gap-4 md:gap-0">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">Readiness Score</h2>
              <p className="text-sm text-slate-400">Based on current GCC market standards</p>
            </div>
            {/* Score Text Colors modified for dark mode readability */}
            <div className={`text-5xl font-black ${result.score > 70 ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]'}`}>
              {result.score}<span className="text-2xl text-slate-500">/100</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mb-8 p-5 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-300 leading-relaxed">
            {result.summary}
          </div>

          {/* Grid: Strengths & Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-lg text-green-400 mb-4 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
               Strengths
              </h3>
              <ul className="space-y-3 text-slate-300">
                {result.strengths.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-green-500 mt-1">›</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-400 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                Gaps to Fix
              </h3>
              <ul className="space-y-3 text-slate-300">
                {result.gaps.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-amber-500 mt-1">›</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5">Recommended Next Steps</h3>
            <ul className="space-y-4">
              {result.action_plan.map((step: string, i: number) => (
                <li key={i} className="flex gap-4 text-slate-300 p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
           {/* Static Links Footer */}
           <div className="mt-10 pt-6 border-t border-slate-800 text-center md:text-left">
             <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Recommended Search Platforms</h3>
             <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="https://www.linkedin.com/jobs" target="_blank" className="px-4 py-2 rounded-full bg-slate-800 text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors text-sm font-medium">LinkedIn Jobs ↗</a>
                <a href="https://www.naukrigulf.com" target="_blank" className="px-4 py-2 rounded-full bg-slate-800 text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors text-sm font-medium">NaukriGulf ↗</a>
                <a href="https://www.bayt.com" target="_blank" className="px-4 py-2 rounded-full bg-slate-800 text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors text-sm font-medium">Bayt ↗</a>
             </div>
           </div>

        </div>
      )}
    </main>
  );
}
