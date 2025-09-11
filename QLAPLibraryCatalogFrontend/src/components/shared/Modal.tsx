// components/shared/Modal.tsx
import { Fragment, ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle, Description, Transition, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, description,children, footer, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog 
        onClose={onClose}
        className="relative z-50"
      >
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        {/* Modal positioning */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            
            {/* Modal panel */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel 
                className={`
                  w-full ${sizeClasses[size]} 
                  transform overflow-hidden rounded-lg bg-white 
                  p-6 shadow-xl transition-all
                `}
              >
                {/* Header */}
                {title && (
                  <div className="flex items-center justify-between mb-4">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      {title}
                    </DialogTitle>
                    <button
                      onClick={onClose}
                      className="rounded-md p-1 hover:bg-gray-100 transition-colors"
                      aria-label="Close modal"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                )}

                {description && (
                  <Description className="text-sm text-gray-600 mb-4">
                    {description}
                  </Description>
                )}

                {/* Content */}
                <div className="mt-2">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="mt-6 flex justify-end gap-3">
                    {footer}
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>

          </div>
        </div>
      </Dialog>
    </Transition>
  )
}