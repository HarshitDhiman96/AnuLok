import React from 'react';
import { ArrowUpRight, MapPin, MessageCircle } from 'lucide-react';

const storeName = 'Dhiman Wood Works';
const storeArea = 'Dehradun, Uttarakhand';
const mapQuery = encodeURIComponent(`${storeName}, ${storeArea}`);
const profileUrl = 'https://g.page/r/Ce4uUzORO_nGEBI/review';
const messageUrl = `https://wa.me/919368656212?text=${encodeURIComponent('Hi, I would like to enquire about the services you provide.')}`;

export default function StoreLocation({ dark = false }) {
  return (
    <section
      className={`rounded-3xl border p-5 sm:p-8 ${
        dark
          ? 'border-white/10 bg-white/5 text-white'
          : 'border-stone-200/80 bg-white text-anulok-espresso shadow-xs'
      }`}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-anulok-amber">
            <MapPin className="h-4 w-4" />
            Visit Our Shop
          </span>
          <h2 className={`mt-2 font-serif text-2xl font-semibold sm:text-3xl ${dark ? 'text-amber-200' : 'text-anulok-walnut'}`}>
            {storeName}
          </h2>
          <p className={`mt-1 text-sm ${dark ? 'text-stone-300' : 'text-stone-600'}`}>
            {storeArea}
          </p>
          <p className={`mt-2 text-xs ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
            Our local shop is officially listed on Google as Dhiman Wood Works.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 self-start sm:self-auto">
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-anulok-wood/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-anulok-wood transition-colors hover:bg-anulok-linen"
          >
            Google Business Profile <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={messageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-anulok-wood px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-anulok-walnut"
          >
            <MessageCircle className="h-4 w-4" /> Message us
          </a>
        </div>
      </div>

      <div className="aspect-[4/3] min-h-64 overflow-hidden rounded-2xl bg-anulok-linen sm:aspect-[16/7]">
        <iframe
          title={`${storeName} location in ${storeArea}`}
          src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-medium text-anulok-wood hover:text-anulok-walnut"
      >
        Get directions <ArrowUpRight className="h-4 w-4" />
      </a>
    </section>
  );
}
