"use client";

import { useEffect, useRef, useState, createContext, useContext, ReactNode } from "react";

interface ScrollyContext {
  activeStep: number;
  progress: number;
}

const ScrollytellingContext = createContext<ScrollyContext>({ activeStep: 0, progress: 0 });

export function useScrollytelling() {
  return useContext(ScrollytellingContext);
}

interface Props {
  children: ReactNode;
  onStepChange?: (step: number) => void;
}

export function ScrollytellingProvider({ children, onStepChange }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleStepChange = (step: number, prog: number) => {
    setActiveStep(step);
    setProgress(prog);
    onStepChange?.(step);
  };

  return (
    <ScrollytellingContext.Provider value={{ activeStep, progress }}>
      <ScrollytellingInner onUpdate={handleStepChange}>{children}</ScrollytellingInner>
    </ScrollytellingContext.Provider>
  );
}

function ScrollytellingInner({
  children,
  onUpdate,
}: {
  children: ReactNode;
  onUpdate: (step: number, progress: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const steps = container.querySelectorAll("[data-step]");
    if (steps.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxStep = 0;
        entries.forEach((entry) => {
          const stepIndex = parseInt(
            (entry.target as HTMLElement).dataset.step || "0"
          );
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxStep = stepIndex;
          }
        });
        if (maxRatio > 0) {
          onUpdate(maxStep, maxRatio);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [onUpdate]);

  return <div ref={containerRef}>{children}</div>;
}
