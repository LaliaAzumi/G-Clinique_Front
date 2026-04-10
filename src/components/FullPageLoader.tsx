/**
 * FullPageLoader - Composant de chargement global avec animation de points
 * Usage: import { FullPageLoader } from "@/components/FullPageLoader";
 */

interface FullPageLoaderProps {
  message?: string;
}

export const FullPageLoader = ({ message = "Chargement" }: FullPageLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
      {/* Le Spinner */}
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

      {/* Le Texte avec points animés */}
      <div className="mt-4 flex items-center text-sm font-medium text-white">
        {message}
        <span className="ml-1 flex">
          {/* Point 1 */}
          <span className="animate-[bounce_1s_infinite_0ms]">.</span>
          {/* Point 2 avec délai de 200ms */}
          <span className="animate-[bounce_1s_infinite_200ms]">.</span>
          {/* Point 3 avec délai de 400ms */}
          <span className="animate-[bounce_1s_infinite_400ms]">.</span>
        </span>
      </div>
    </div>
  );
};

export default FullPageLoader;
