/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdContainerProps {
  type: 'leaderboard' | 'sidebar' | 'banner';
  className?: string;
}

export default function AdContainer({ type, className = '' }: AdContainerProps) {
  // Respecting usability rules: "The core utility must remain usable without interacting with advertisements."
  // Beautifully designed neutral box that matches the clean layout.
  
  const styles = {
    leaderboard: 'w-full max-w-4xl mx-auto min-h-[90px] py-2 md:py-4 flex flex-col items-center justify-center border border-dashed border-stone-200 bg-stone-50 rounded-lg text-[11px] text-stone-400 font-mono tracking-wider uppercase px-4 text-center',
    sidebar: 'w-full min-h-[250px] p-4 flex flex-col items-center justify-center border border-dashed border-stone-200 bg-stone-50 rounded-lg text-[11px] text-stone-400 font-mono tracking-wider uppercase text-center h-full',
    banner: 'w-full min-h-[100px] p-4 flex flex-col items-center justify-center border border-dashed border-stone-200 bg-stone-50 rounded-lg text-[11px] text-stone-400 font-mono tracking-wider uppercase text-center',
  };

  return (
    <div className={`my-6 select-none ${className}`} id={`ad-container-${type}`}>
      <div className={styles[type]}>
        <span className="text-stone-300 font-sans font-semibold mb-1 text-[9px] uppercase tracking-widest block">Sponsor Area</span>
        <span className="text-stone-400 font-medium text-[10px]">LOCALPDFTOOLS AD SLOT</span>
        <span className="text-[9px] text-stone-300 mt-0.5 font-sans normal-case">Ad slot reserved. Processing remains 100% private and free.</span>
      </div>
    </div>
  );
}
