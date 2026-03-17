import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from 'react-joyride';
import { authService } from '../services/authService';

interface TutorialOverlayProps {
  steps: Step[];
  onFinish: () => void;
}

const CustomTooltip: React.FC<TooltipRenderProps> = ({
  continuous,
  index,
  step,
  size,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}) => {
  const progress = ((index + 1) / size) * 100;

  return (
    <div
      {...tooltipProps}
      style={{
        background: 'linear-gradient(145deg, #1a3524 0%, #102216 100%)',
        borderRadius: '24px',
        padding: '28px',
        maxWidth: '380px',
        width: '90vw',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(19,236,91,0.15)',
        border: '1px solid rgba(19,236,91,0.2)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '160px',
        height: '160px',
        background: 'radial-gradient(circle, rgba(19,236,91,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Step counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#13ec5b',
          background: 'rgba(19,236,91,0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
        }}>
          {index + 1} de {size}
        </span>
        <button
          {...skipProps}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Pular tutorial
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '3px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '10px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #13ec5b, #0fd651)',
          borderRadius: '10px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Title */}
      {step.title && (
        <h3 style={{
          fontSize: '20px',
          fontWeight: 800,
          margin: '0 0 8px 0',
          color: '#fff',
          lineHeight: 1.3,
        }}>
          {step.title}
        </h3>
      )}

      {/* Content */}
      <p style={{
        fontSize: '14px',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 1.6,
        margin: '0 0 24px 0',
      }}>
        {step.content}
      </p>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
      }}>
        {index > 0 && (
          <button
            {...backProps}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Voltar
          </button>
        )}
        <button
          {...primaryProps}
          style={{
            background: '#13ec5b',
            border: 'none',
            color: '#0d1b12',
            padding: '12px 24px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(19,236,91,0.3)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isLastStep ? 'Começar a usar!' : 'Próximo'}
          <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 700 }}>
            {isLastStep ? 'check' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </div>
  );
};

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ steps, onFinish }) => {
  const [run, setRun] = useState(true);

  const handleCallback = async (data: CallBackProps) => {
    const { status, type, action, index } = data;
    console.log('[DEBUG] TutorialOverlay Callback:', { status, type, action, index });

    const isFinished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
    const isLastStepAction = type === 'step:after' && index === steps.length - 1 && action === 'next';

    if (isFinished || isLastStepAction) {
      console.warn('[CRITICAL] Gatilho de finalização ativado!', { isFinished, isLastStepAction });
      
      // Prevenir múltiplas chamadas
      if (!run) return;
      setRun(false);

      try {
        console.log('[API] Chamando authService.finishTutorial()...');
        await authService.finishTutorial();
        console.log('[API] Sucesso! Redirecionando...');
        window.location.href = '/meu-perfil';
      } catch (err) {
        console.error('[API] Erro na requisição:', err);
        onFinish();
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      callback={handleCallback}
      tooltipComponent={CustomTooltip}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Começar a usar!',
        next: 'Próximo',
        skip: 'Pular tutorial',
      }}
      styles={{
        options: {
          arrowColor: '#1a3524',
          overlayColor: 'rgba(0, 0, 0, 0.65)',
          zIndex: 10000,
        },
        spotlight: {
          borderRadius: '16px',
        },
      }}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
};

export default TutorialOverlay;
