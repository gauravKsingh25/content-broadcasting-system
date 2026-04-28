import { Separator } from '@/components/ui/separator'

export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-2xl font-normal text-[#2C2C2C] sm:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-[#6B6B6B]">{description}</p>}
        </div>
        {action && <div className="w-full sm:w-auto">{action}</div>}
      </div>
      <Separator />
    </div>
  )
}
