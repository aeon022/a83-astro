import React, { useState, useMemo } from 'react';

// Version: V16.0 - TACTICAL ROI PROJECTION ENGINE
// Vibe: Terminal HUD / Industrial Slider System

export default function RoiCalculator() {
  const [investment, setInvestment] = useState(5000);
  const [revenueIncrease, setRevenueIncrease] = useState(15);
  const [currentRevenue, setCurrentRevenue] = useState(20000);

  const projection = useMemo(() => {
    const monthlyGain = currentRevenue * (revenueIncrease / 100);
    const annualGain = monthlyGain * 12;
    const netProfit = annualGain - investment;
    const roi = (netProfit / investment) * 100;
    const breakEven = investment / monthlyGain;

    return {
      monthlyGain: monthlyGain.toLocaleString('de-DE'),
      annualGain: annualGain.toLocaleString('de-DE'),
      roi: roi.toFixed(0),
      breakEven: breakEven.toFixed(1),
      isPositive: netProfit > 0
    };
  }, [investment, revenueIncrease, currentRevenue]);

  return (
    <div className="bg-a83-surface/30 border border-veranda-green/20 p-8 lg:p-12 font-mono grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden group">
      {/* Decorative HUD Elements */}
      <div className="absolute top-0 right-0 p-4 text-[8px] text-veranda-green/20 font-black tracking-[0.5em]">
        SYSTEM_CALC // PROJECTION_ACTIVE
      </div>

      {/* Input Section (Sliders) */}
      <div className="lg:col-span-7 space-y-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-a83-accent"></div>
          <h3 className="text-[11px] text-a83-accent uppercase tracking-[0.4em] font-black">Input_Parameters</h3>
        </div>

        {/* Investment Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] text-a83-text-bold uppercase font-bold tracking-widest">Initial_Investment</label>
            <span className="text-xl font-black text-a83-text-bold">{investment} €</span>
          </div>
          <input 
            type="range" min="1000" max="50000" step="500"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full accent-a83-accent cursor-none"
          />
        </div>

        {/* Current Revenue Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] text-a83-text-bold uppercase font-bold tracking-widest">Monthly_Base_Revenue</label>
            <span className="text-xl font-black text-a83-text-bold">{currentRevenue} €</span>
          </div>
          <input 
            type="range" min="5000" max="200000" step="1000"
            value={currentRevenue}
            onChange={(e) => setCurrentRevenue(Number(e.target.value))}
            className="w-full accent-a83-accent cursor-none"
          />
        </div>

        {/* Optimization Factor Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] text-a83-text-bold uppercase font-bold tracking-widest">Optimization_Impact (%)</label>
            <span className="text-xl font-black text-a83-accent">+{revenueIncrease}%</span>
          </div>
          <input 
            type="range" min="1" max="50" step="1"
            value={revenueIncrease}
            onChange={(e) => setRevenueIncrease(Number(e.target.value))}
            className="w-full accent-a83-accent cursor-none"
          />
        </div>
      </div>

      {/* Output Section (Data Readout) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-a83-bg/80 border border-veranda-green/20 p-8 flex flex-col justify-between h-full relative">
          
          <div className="space-y-8">
            <div className="flex justify-between border-b border-veranda-green/10 pb-4">
              <span className="text-[10px] text-veranda-green font-bold uppercase tracking-widest">Proj_Annual_Gain</span>
              <span className="text-2xl font-black text-a83-text-bold">+{projection.annualGain} €</span>
            </div>
            
            <div className="flex justify-between border-b border-veranda-green/10 pb-4">
              <span className="text-[10px] text-veranda-green font-bold uppercase tracking-widest">ROI_12_Months</span>
              <span className={`text-4xl font-black ${projection.isPositive ? 'text-a83-accent' : 'text-red-500'}`}>
                {projection.roi}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-veranda-green font-bold uppercase tracking-widest">Break_Even</span>
              <div className="text-right">
                <span className="text-xl font-black text-a83-text-bold">{projection.breakEven}</span>
                <span className="text-[10px] text-veranda-green ml-2">MONTHS</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-a83-accent/20">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full animate-pulse ${projection.isPositive ? 'bg-a83-accent' : 'bg-red-500'}`}></span>
              <span className="text-[9px] text-a83-text-bold font-bold uppercase tracking-[0.3em]">
                {projection.isPositive ? 'Projection: Highly_Profitable' : 'Projection: Risk_Alert'}
              </span>
            </div>
          </div>
        </div>

            <button 
            onClick={() => window.print()}
            className="bg-a83-accent text-a83-bg p-6 text-[11px] font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] print:hidden"
            >
            Generate_Mission_Report_PDF
            </button>
      </div>
    </div>
  );
}