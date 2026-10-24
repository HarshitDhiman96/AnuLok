import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, MoveUpRight } from 'lucide-react';

export default function StoreExperience() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const moveCursor = (event) => {
      const bounds = section.getBoundingClientRect();
      setCursor({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    };
    section.addEventListener('pointermove', moveCursor);
    return () => section.removeEventListener('pointermove', moveCursor);
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#211a15] px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="relative z-10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-anulok-sand">Step inside Anulok</span>
          <h2 className="mt-4 max-w-lg font-serif text-4xl font-normal leading-tight sm:text-5xl">A closer look at how we make a home.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65 sm:text-base">
            Take a moment to explore our store, the pieces we make, and the thoughtful service behind every visit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={togglePlayback} className="inline-flex items-center gap-2.5 rounded-full bg-anulok-cream px-5 py-3 text-xs font-semibold uppercase tracking-wider text-anulok-espresso transition hover:bg-white">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause video' : 'Watch video'}
            </button>
            <button onClick={toggleAudio} className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/10">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              Audio {isMuted ? 'off' : 'on'}
            </button>
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-white/40">Sound is off until you turn it on</p>
        </div>

        <div
          className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl"
          onPointerEnter={() => setIsHovering(true)}
          onPointerLeave={() => setIsHovering(false)}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/store-tour.mp4"
            muted
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-anulok-sand" /> Anulok, in person
          </div>
          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            Explore the store <MoveUpRight className="h-3 w-3" />
          </div>

          {isHovering && (
            <div className="absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-2xl border border-white/20 bg-[#211a15]/90 p-2 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-auto sm:right-5 sm:translate-x-0">
              <button onClick={togglePlayback} className="inline-flex items-center gap-2 rounded-xl bg-anulok-cream px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-anulok-espresso hover:bg-white">
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? 'Pause' : 'Watch video'}
              </button>
              <button onClick={toggleAudio} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-white/10">
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                Audio {isMuted ? 'off' : 'on'}
              </button>
            </div>
          )}

          {isHovering && (
            <div
              className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-anulok-cream/90 text-anulok-espresso shadow-xl backdrop-blur-sm transition-transform duration-150 sm:flex"
              style={{ left: cursor.x - sectionRef.current?.getBoundingClientRect().left - (sectionRef.current?.querySelector('.group')?.getBoundingClientRect().left - sectionRef.current?.getBoundingClientRect().left || 0), top: cursor.y - (sectionRef.current?.querySelector('.group')?.getBoundingClientRect().top - sectionRef.current?.getBoundingClientRect().top || 0), width: 92, height: 92 }}
              aria-hidden="true"
            >
              <span className="text-center text-[9px] font-semibold uppercase leading-4 tracking-[0.15em]">Move<br />to explore</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
