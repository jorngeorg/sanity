import {Box, Flex, Grid, Text, useClickOutside, useGlobalKeyDown, useLayer} from '@sanity/ui'
import React, {useCallback, useState} from 'react'
import {structureLocaleNamespace} from '../../../../i18n'
import {Button, Popover} from '../../../../../ui-components'
import {POPOVER_FALLBACK_PLACEMENTS} from './constants'
import {DocumentActionConfirmDialogProps, useTranslation} from 'sanity'

export function ConfirmDialog(props: {
  dialog: DocumentActionConfirmDialogProps
  referenceElement: HTMLElement | null
}) {
  const {dialog, referenceElement} = props

  return (
    <Popover
      content={<ConfirmDialogContent dialog={dialog} />}
      fallbackPlacements={POPOVER_FALLBACK_PLACEMENTS}
      open
      placement="top"
      portal
      preventOverflow
      referenceElement={referenceElement}
    />
  )
}

function ConfirmDialogContent(props: {dialog: DocumentActionConfirmDialogProps}) {
  const {dialog} = props
  const {
    cancelButtonIcon,
    cancelButtonText,
    confirmButtonIcon,
    confirmButtonText,
    // color,
    message,
    onCancel,
    onConfirm,
    tone,
  } = dialog
  const {t} = useTranslation(structureLocaleNamespace)
  const {isTopLayer} = useLayer()
  const [element, setElement] = useState<HTMLElement | null>(null)

  const handleClickOutside = useCallback(() => {
    if (isTopLayer) onCancel()
  }, [isTopLayer, onCancel])

  const handleGlobalKeyDown = useCallback(
    (event: any) => {
      if (event.key === 'Escape' && isTopLayer) onCancel()
    },
    [isTopLayer, onCancel],
  )

  useClickOutside(handleClickOutside, [element])
  useGlobalKeyDown(handleGlobalKeyDown)

  return (
    <Flex direction="column" ref={setElement} style={{minWidth: 320 - 16, maxWidth: 400}}>
      <Box flex={1} overflow="auto" padding={4}>
        <Text>{message}</Text>
      </Box>
      <Box paddingX={4} paddingY={3} style={{borderTop: '1px solid var(--card-border-color)'}}>
        <Grid columns={2} gap={2}>
          <Button
            icon={cancelButtonIcon}
            onClick={onCancel}
            mode="ghost"
            text={cancelButtonText || t('confirm-dialog.cancel-button.fallback-text')}
          />
          <Button
            icon={confirmButtonIcon}
            onClick={onConfirm}
            text={confirmButtonText || t('confirm-dialog.confirm-button.fallback-text')}
            tone={tone}
          />
        </Grid>
      </Box>
    </Flex>
  )
}
