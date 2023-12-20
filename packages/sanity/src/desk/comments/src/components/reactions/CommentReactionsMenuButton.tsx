import React, {cloneElement, useCallback, useMemo, useState} from 'react'
import {Card, useClickOutside} from '@sanity/ui'
import {CommentReactionOption, CommentReactionOptionNames} from '../../types'
import {Popover, PopoverProps} from '../../../../../ui-components'
import {CommentReactionsMenu} from './CommentReactionsMenu'

const POPOVER_FALLBACK_PLACEMENTS: PopoverProps['fallbackPlacements'] = ['top', 'bottom']

export interface CommentReactionsMenuButtonProps {
  onMenuClose?: () => void
  onMenuOpen?: () => void
  onSelect: (option: CommentReactionOption) => void
  options: CommentReactionOption[]
  renderButton: (props: {open: boolean}) => React.ReactElement
  selectedOptionNames: CommentReactionOptionNames[]
}

export function CommentReactionsMenuButton(props: CommentReactionsMenuButtonProps) {
  const {options, onSelect, selectedOptionNames, onMenuClose, onMenuOpen, renderButton} = props
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null)
  const [popoverElement, setPopoverElement] = useState<HTMLDivElement | null>(null)

  const [open, setOpen] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    setOpen((prev) => {
      const next = !prev

      if (next) {
        onMenuOpen?.()
      } else {
        onMenuClose?.()
      }

      return next
    })
  }, [onMenuClose, onMenuOpen])

  const handleClose = useCallback(() => {
    if (!open) return

    setOpen(false)
    onMenuClose?.()
    buttonElement?.focus()
  }, [buttonElement, onMenuClose, open])

  const handleClickOutside = useCallback(handleClose, [handleClose])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const {key, shiftKey} = event

      if ((shiftKey && key === 'Tab') || key === 'Escape' || key === 'Tab') {
        handleClose()
      }
    },
    [handleClose],
  )

  useClickOutside(handleClickOutside, [popoverElement, buttonElement])

  const handleSelect = useCallback(
    (option: CommentReactionOption) => {
      onSelect(option)
      handleClose()
    },
    [handleClose, onSelect],
  )

  const button = useMemo(() => {
    const btn = renderButton({open})

    return cloneElement(btn, {
      'aria-expanded': open,
      'aria-haspopup': 'true',
      id: 'reactions-menu-button',
      onClick: handleClick,
      ref: setButtonElement,
    })
  }, [handleClick, open, renderButton])

  return (
    <Popover
      ref={setPopoverElement}
      placement="bottom"
      fallbackPlacements={POPOVER_FALLBACK_PLACEMENTS}
      tone="default"
      content={
        <Card
          aria-labelledby="reactions-menu-button"
          onKeyDown={handleKeyDown}
          padding={1}
          radius={3}
          tone="default"
        >
          <CommentReactionsMenu
            onSelect={handleSelect}
            options={options}
            selectedOptionNames={selectedOptionNames}
          />
        </Card>
      }
      constrainSize
      portal
      open={open}
    >
      {button}
    </Popover>
  )
}
