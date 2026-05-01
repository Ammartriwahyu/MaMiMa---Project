import { motion } from 'framer-motion'
import { fadeUpVariant, staggerContainer } from '@/design-system/tokens'

export function AnimatedSection({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={{ ...fadeUpVariant, visible: { ...fadeUpVariant.visible, transition: { duration: 0.5, ease: 'easeOut', delay } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerSection({ children, className }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
