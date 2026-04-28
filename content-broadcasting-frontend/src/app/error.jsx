'use client'

export default function ErrorPage({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F7F4] px-6">
      <h1 className="mb-3 text-4xl text-[#2C2C2C]" style={{ fontFamily: 'var(--font-heading)' }}>
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-center text-sm text-[#6B6B6B]">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-[#2A9D8F] px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#238a7e]"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-[#E8E6E1] px-6 py-2.5 text-sm text-[#2C2C2C] transition-colors hover:bg-white"
        >
          Go home
        </a>
      </div>
    </div>
  )
}