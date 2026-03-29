import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useMemo, useState } from "react";

function SmoothScrolling({ children }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchPointer, setIsTouchPointer] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchPointerQuery = window.matchMedia('(pointer: coarse)');

    const applySettings = () => {
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setIsTouchPointer(touchPointerQuery.matches);
    };

    applySettings();
    reducedMotionQuery.addEventListener('change', applySettings);
    touchPointerQuery.addEventListener('change', applySettings);

    return () => {
      reducedMotionQuery.removeEventListener('change', applySettings);
      touchPointerQuery.removeEventListener('change', applySettings);
    };
  }, []);

  const lenisOptions = useMemo(() => ({
    lerp: isTouchPointer ? 0.14 : 0.1,
    duration: isTouchPointer ? 1.1 : 1.25,
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 1,
    wheelMultiplier: 0.95,
  }), [isTouchPointer]);

  if (prefersReducedMotion) {
    return children;
  }

  return (
    <ReactLenis root autoRaf options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
export default SmoothScrolling;
