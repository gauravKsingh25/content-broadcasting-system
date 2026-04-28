export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-[#E8E6E1] bg-white/80 px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2A9D8F]/10">
          <Icon size={28} className="text-[#2A9D8F]" />
        </div>
      )}
      <h3 className="mb-2 text-lg sm:text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <p className="max-w-sm text-sm text-[#6B6B6B]">{description}</p>
      {action && <div className="mt-6 w-full sm:w-auto">{action}</div>}
    </div>
  )
}
