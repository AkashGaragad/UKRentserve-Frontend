export default function HeroSection({ heading, subtext, cta }) {
  return (
    <section className="my-5 border border-blue-100 dark:border-[#2a3768] rounded-3xl bg-gradient-to-br from-blue-50 to-white dark:from-[#1b2754] dark:to-[#131b38] p-8 flex items-center justify-between gap-5 overflow-hidden flex-wrap shadow-sm">
      {/* Text */}
      <div className="flex-1 min-w-56">
        <h1
          className="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 max-w-xl tracking-tight"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}
        >
          {heading}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mt-3 mb-5 leading-relaxed">{subtext}</p>
        {cta}
      </div>

      {/* Road animation */}
      <div className="relative w-72 h-32 flex-none hidden sm:block" aria-hidden="true">
        {/* Sky background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <img
            src="/assets/images/hero-home.webp"
            alt=""
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
            onError={(e) => { e.target.style.display='none'; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-100/80 dark:from-[#1b2754]/80 to-transparent" />
        </div>
        {/* Pin */}
        <span className="absolute top-2 right-5 text-4xl z-10">📍</span>
        {/* Road line */}
        <div
          className="road-line absolute bottom-5 left-0 right-0 h-1 z-10"
          style={{ background: 'repeating-linear-gradient(90deg,#1b3fd8 0 22px,transparent 22px 40px)' }}
        />
        {/* Car */}
        <span
          className="road-car absolute bottom-6 text-5xl z-10"
          style={{ left: 0 }}
        >
          🚗
        </span>
      </div>
    </section>
  );
}
