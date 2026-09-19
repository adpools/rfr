import { useState, useEffect } from 'react';

export interface CursorState {
  x: number;
  y: number;
  isHovered: boolean;
  hoverText: string;
  isClicking: boolean;
  isVisible: boolean;
}

export const useCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    isHovered: false,
    hoverText: '',
    isClicking: false,
    isVisible: false,
  });

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      let text = '';
      let hovered = false;

      if (target) {
        const interactiveEl = target.closest('[data-cursor]') as HTMLElement | null;
        if (interactiveEl) {
          text = interactiveEl.getAttribute('data-cursor') || '';
          hovered = true;
        } else if (target.closest('a, button, input, textarea, select')) {
          hovered = true;
        }
      }

      setCursor((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        isVisible: true,
        isHovered: hovered,
        hoverText: text,
      }));
    };

    const onMouseDown = () => setCursor((prev) => ({ ...prev, isClicking: true }));
    const onMouseUp = () => setCursor((prev) => ({ ...prev, isClicking: false }));
    const onMouseLeave = () => setCursor((prev) => ({ ...prev, isVisible: false }));
    const onMouseEnter = () => setCursor((prev) => ({ ...prev, isVisible: true }));

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return cursor;
};
