
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReferenceButtons from '../components/ReferenceButtons';

const STEPS = [
  {
    title: "Descubra livros perto de você",
    description: "Encontre livros disponíveis para troca ao seu redor usando o mapa.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600",
    color: "bg-primary"
  },
  {
    title: "Registre seus livros",
    description: "Adicione livros em segundos informando o título, autor e ISBN.",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=600",
    color: "bg-blue-400"
  },
  {
    title: "Troque histórias",
    description: "Conecte-se com outros leitores e dê uma nova vida aos seus livros parados.",
    image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=600",
    color: "bg-emerald-400"
  }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => navigate('/login');

  return (
    <div className="h-screen bg-background-light dark:bg-background-dark flex flex-col overflow-hidden">
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />

      <div className="flex px-6 pt-12 pb-2 justify-end">
        <button onClick={handleSkip} className="text-text-muted font-bold text-sm">Pular</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full relative aspect-[4/5] max-h-[45vh] mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <img src={STEPS[step].image} className="w-full h-full object-cover rounded-3xl shadow-xl" alt="" />
        </div>

        <div className="text-center max-w-xs">
          <h1 className="text-3xl font-extrabold leading-tight mb-3 text-text-main dark:text-white">
            {STEPS[step].title}
          </h1>
          <p className="text-text-muted dark:text-gray-400 font-medium">
            {STEPS[step].description}
          </p>
        </div>
      </div>

      <div className="w-full px-8 pb-12 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary shadow-lg shadow-primary/40' : 'w-2.5 bg-gray-300 dark:bg-white/20'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="h-14 w-14 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/30 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl font-bold">
              {step === STEPS.length - 1 ? 'check' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
