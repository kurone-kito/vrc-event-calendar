const highlights = [
  {
    title: 'Shared issue flow',
    description:
      'Track planning, implementation, and review with the same IDD loop used in the workshop.',
  },
  {
    title: 'Type-safe foundation',
    description:
      'Next.js 15, TypeScript, and Tailwind CSS provide the baseline for future calendar features.',
  },
  {
    title: 'Ready for containers',
    description:
      'The app boots with the standard Node workflow so the next Docker step can wrap it without code churn.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-surface/90 px-6 py-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:px-10 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <p className="inline-flex w-fit rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                Next.js 15 foundation
              </p>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  VRC Event Calendar starts with a clean, type-safe app shell.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
                  This scaffold is the first application layer for the example
                  repository. It keeps the surface intentionally small while
                  proving the App Router, Tailwind styling, and TypeScript setup
                  are ready for the next track.
                </p>
              </div>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-sm text-slate-100 shadow-lg sm:min-w-80">
              <p className="font-mono text-sky-300">npm run dev</p>
              <p>Serves the app on port 3000 for local development.</p>
              <p className="font-mono text-sky-300">npm run build</p>
              <p>Confirms the scaffold is production-build ready.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.45)] backdrop-blur"
            >
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 rounded-[1.75rem] border border-slate-200/80 bg-surface/80 p-6 sm:grid-cols-[1.2fr_0.8fr] sm:p-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              Next steps in the repository
            </h2>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
              Docker Compose, Prisma, and domain features can now build on a
              verified frontend shell instead of a placeholder template.
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-surface-strong/70 p-5">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Current status
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>
                App Router enabled under{' '}
                <code className="font-mono text-xs">src/app</code>
              </li>
              <li>Tailwind utilities active in the UI</li>
              <li>Container-friendly npm scripts in place</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
