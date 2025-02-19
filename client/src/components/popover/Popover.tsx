import { ElementType, useRef, useState } from 'react'
import { arrow, offset, shift, useFloating } from '@floating-ui/react-dom'
import { FloatingPortal, Placement } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  className?: string
  children?: React.ReactNode
  renderPopover?: React.ReactNode
  as?: ElementType
  placement?: Placement
}

const Popover = ({ className, children, renderPopover, as: Element = 'div', placement = 'bottom-end' }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, strategy, reference, floating, middlewareData } = useFloating({
    middleware: [offset(10), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element
      className={`flex cursor-pointer flex-row items-center gap-2 ${className}`}
      ref={reference}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      {renderPopover}
      {/* Popover */}
      <FloatingPortal id='custom-root-id'>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={floating}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.5 }}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
            >
              <span
                ref={arrowRef}
                className="  absolute z-10  translate-y-[-95%] after:inline-block after:h-[20px]  after:w-28 after:translate-x-[-50%] after:bg-transparent after:content-['']"
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y,
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid white'
                }}
              />
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}

export default Popover
