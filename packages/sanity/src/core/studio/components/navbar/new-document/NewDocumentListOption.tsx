import {CurrentUser} from '@sanity/types'
import {Card, Text} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import {Tooltip} from '../../../../../ui-components'
import {InsufficientPermissionsMessage} from '../../../../components'
import {useI18nText} from '../../../../i18n'
import {NewDocumentOption, PreviewLayout} from './types'
import {useIntentLink} from 'sanity/router'

// This value is used to calculate the max-height of the popover and for the virtual list item size.
// This value is not used anywhere in this file, but it is exported
// from here to make it easier to maintain the value in the future
// if the design changes.
export const INLINE_PREVIEW_HEIGHT = 33

interface NewDocumentListOptionProps {
  currentUser: CurrentUser | null
  onClick: (option: NewDocumentOption) => void
  option: NewDocumentOption
  preview: PreviewLayout
}

export function NewDocumentListOption(props: NewDocumentListOptionProps) {
  const {option, currentUser, onClick, preview} = props
  const params = useMemo(
    () => ({template: option.templateId, type: option.schemaType}),
    [option.schemaType, option.templateId],
  )
  const {onClick: onIntentClick, href} = useIntentLink({
    intent: 'create',
    params,
  })

  const handleDocumentClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onIntentClick(event)
      onClick(option)
    },
    [onIntentClick, onClick, option],
  )

  const {title} = useI18nText(option)

  return (
    <Tooltip
      disabled={option.hasPermission}
      key={option.id}
      portal
      content={
        <InsufficientPermissionsMessage currentUser={currentUser} context="create-document" />
      }
    >
      <div>
        <Card
          as={option.hasPermission ? 'a' : 'button'}
          data-testid={`create-new-${option.templateId}`}
          disabled={!option.hasPermission}
          href={href}
          marginBottom={1}
          onClick={handleDocumentClick}
          padding={preview === 'inline' ? 3 : 4}
          radius={2}
        >
          <Text size={preview === 'inline' ? 1 : undefined}>{title}</Text>
        </Card>
      </div>
    </Tooltip>
  )
}
