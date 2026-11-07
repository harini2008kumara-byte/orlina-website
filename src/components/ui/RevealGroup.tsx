import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
}

export function RevealGroup({ children, className }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.09,
        clearProps: 'opacity,transform',
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
