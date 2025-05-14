import React from "react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 rounded-full latio-gradient animate-pulse mx-auto mb-4"></div>
        <p className="text-gray-500">Loading Latio...</p>
      </div>
    </div>
  );
};
