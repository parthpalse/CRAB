import { useState, useEffect } from 'react';

const BASE_W = 1366;
const BASE_H = 768;

export function useScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculate = () => {
      if (window.innerWidth < 768) {
        setScale(1);
        return;
      }
      const scaleX = window.innerWidth / BASE_W;
      const scaleY = window.innerHeight / BASE_H;
      setScale(Math.min(1, scaleX, scaleY));
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return scale;
}

export function scaled(value: number, scale: number): string {
  return `${value * scale}px`;
}
