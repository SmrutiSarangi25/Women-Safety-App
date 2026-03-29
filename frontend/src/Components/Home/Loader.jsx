import React from 'react';

function Loader() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-5 shadow-lg">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm font-medium text-gray-700">Please wait...</p>
    </div>
  );
}

export default Loader;
