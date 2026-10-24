import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export const OPENING_SCROLL_DISTANCE = 1450;

const roomScenes = [
  {
    title: 'Room to unwind',
    detail: 'Sofas & lounges',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
    alt: 'Warm, inviting living room with a sculptural sofa',
    className: 'left-[6%] top-[108vh] w-[68%] sm:left-[9%] sm:w-[38%]',
    speed: -90,
  },
  {
    title: 'Gather beautifully',
    detail: 'Dining furniture',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85',
    alt: 'Elegant dining room with a solid wood dining table',
    className: 'right-[6%] top-[128vh] w-[68%] sm:right-[9%] sm:w-[38%]',
    speed: -130,
  },
  {
    title: 'A slower morning',
    detail: 'Bedroom furniture',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
    alt: 'Serene bedroom with natural textures and a timber bed',
    className: 'left-[16%] top-[153vh] w-[68%] sm:left-[20%] sm:w-[34%]',
    speed: -170,
  },
];

export default function OpeningExperience() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const scenesRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      if (imageRef.current) {
        imageRef.current.style.clipPath = 'inset(0)';
        imageRef.current.style.transform = 'scale(1)';
      }
      return undefined;
    }

    let frameId = 0;

    const updateScrollEffect = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = Math.min(
          1,
          Math.max(0, -section.getBoundingClientRect().top / travel)
        );

        if (imageRef.current) {
          imageRef.current.style.clipPath = `inset(${12 * (1 - progress)}% round ${24 * (1 - progress)}px)`;
          imageRef.current.style.transform = `scale(${1.08 - progress * 0.08})`;
          imageRef.current.style.opacity = String(
            Math.max(0, 1 - Math.max(0, progress - 0.84) / 0.16)
          );
        }

        if (scenesRef.current) {
          scenesRef.current.querySelectorAll('[data-parallax-speed]').forEach((scene) => {
            const speed = Number(scene.dataset.parallaxSpeed);
            scene.style.transform = `translate3d(0, ${progress * speed}px, 0)`;
          });
        }
      });
    };

    updateScrollEffect();
    window.addEventListener('scroll', updateScrollEffect, { passive: true });
    window.addEventListener('resize', updateScrollEffect);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateScrollEffect);
      window.removeEventListener('resize', updateScrollEffect);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${OPENING_SCROLL_DISTANCE}px)` }}
      aria-label="Explore Anulok interiors"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-anulok-espresso">
        <div
          ref={imageRef}
          className="absolute inset-0 origin-center"
          style={{ clipPath: 'inset(12% round 24px)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=90"
            alt="Anulok living room with thoughtfully crafted contemporary furniture"
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-anulok-espresso/90 via-anulok-espresso/55 to-anulok-espresso/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-anulok-espresso/85 via-transparent to-anulok-espresso/35" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent to-anulok-espresso/90" />
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/75">
          <span>Scroll to explore Anulok</span>
          <span className="h-8 w-px animate-pulse bg-anulok-sand/70" />
        </div>
      </div>

      <div
        ref={scenesRef}
        className="pointer-events-none absolute inset-0 z-20"
        aria-hidden="true"
      >
        {roomScenes.map((scene) => (
          <div
            key={scene.title}
            data-parallax-speed={scene.speed}
            className={`absolute ${scene.className} overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-anulok-espresso/25`}
          >
            <img
              src={scene.image}
              alt={scene.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div>
                <p className="font-serif text-sm text-anulok-espresso sm:text-base">{scene.title}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-anulok-wood sm:text-[10px]">
                  {scene.detail}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-anulok-wood" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
