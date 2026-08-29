"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";

export function ProductGridReveal({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-5 min-[430px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {Children.toArray(children).map((child, index) => (
        <div
          key={index}
          className={`h-full transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: `${(index % 4) * 75}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
