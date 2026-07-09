import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, size = 40, color = 'text-primary-600' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 
        className={`animate-spin ${color}`} 
        size={size} 
      />
      <p className="text-sm text-surface-500 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default Loader;
