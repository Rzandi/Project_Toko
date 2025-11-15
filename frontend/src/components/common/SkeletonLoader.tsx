import { motion } from 'framer-motion'
import { pulse } from '../../utils/animations'

type SkeletonLoaderProps = {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export default function SkeletonLoader({
  width = 'w-full',
  height = 'h-4',
  borderRadius = 'rounded-md',
  className = ''
}: SkeletonLoaderProps) {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 ${width} ${height} ${borderRadius} ${className}`}
      variants={pulse}
      animate="animate"
    />
  )
}

type SkeletonTableProps = {
  rows?: number
  columns?: number
}

export function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-3">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonLoader
              key={colIdx}
              width={colIdx === 0 ? 'w-1/3' : 'w-full'}
              height="h-10"
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

type SkeletonFormProps = {
  fields?: number
}

export function SkeletonForm({ fields = 4 }: SkeletonFormProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <SkeletonLoader width="w-1/4" height="h-4" />
          <SkeletonLoader width="w-full" height="h-10" />
        </div>
      ))}
      <SkeletonLoader width="w-1/4" height="h-10" borderRadius="rounded-lg" className="mt-6" />
    </div>
  )
}
