import React from 'react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => {
    return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700
                    transform transition-all duration-300 hover:scale-105 hover:border-purple-500
                    hover:shadow-2xl hover:shadow-purple-500/20
                    flex flex-col items-center text-center h-full w-100">
      <div className="bg-purple-600/10 p-3 rounded-lg border border-purple-800 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-base leading-relaxed">{children}</p>
    </div>
  );
}