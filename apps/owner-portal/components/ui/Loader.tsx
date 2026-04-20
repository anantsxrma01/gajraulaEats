import React from "react";

export function Loader() {
  return (
    <div className="min-h-[200px] flex w-full items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/20 rounded-full animate-[spin_1s_linear_infinite]" />
        <div className="w-12 h-12 border-4 border-t-amber-500 rounded-full animate-[spin_1s_linear_infinite] absolute top-0 left-0" />
      </div>
    </div>
  );
}
