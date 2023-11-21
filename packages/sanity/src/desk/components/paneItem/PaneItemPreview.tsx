import type {SanityDocument, SchemaType} from '@sanity/types'
import React, {isValidElement} from 'react'
import {isNumber, isString} from 'lodash'
import {Inline, TooltipDelayGroupProvider} from '@sanity/ui'
import {useMemoObservable} from 'react-rx'
import {DocumentStatus} from '../../../ui/documentStatus'
import {TOOLTIP_DELAY_PROPS} from '../../../ui/tooltip/constants'
import type {PaneItemPreviewState} from './types'
import {
  DocumentPresence,
  DocumentPreviewPresence,
  DocumentPreviewStore,
  GeneralPreviewLayoutKey,
  getPreviewStateObservable,
  getPreviewValueWithFallback,
  SanityDefaultPreview,
  isRecord,
  useDocumentStatusTimeAgo,
} from 'sanity'

export interface PaneItemPreviewProps {
  documentPreviewStore: DocumentPreviewStore
  icon: React.ComponentType | false
  layout: GeneralPreviewLayoutKey
  presence?: DocumentPresence[]
  schemaType: SchemaType
  value: SanityDocument
}

/**
 * Preview component for _documents_ rendered in desk/structure panes.
 *
 * Note that non-document previews are not handled by this component,
 * despite being pane items! Non-document previews bypass this entirely
 * and are rendered by `<SanityDefaultPreview>`.
 */
export function PaneItemPreview(props: PaneItemPreviewProps) {
  const {icon, layout, presence, schemaType, value} = props
  const title =
    (isRecord(value.title) && isValidElement(value.title)) ||
    isString(value.title) ||
    isNumber(value.title)
      ? value.title
      : null

  // NOTE: this emits sync so can never be null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const {draft, published, isLoading} = useMemoObservable<PaneItemPreviewState>(
    () => getPreviewStateObservable(props.documentPreviewStore, schemaType, value._id, title),
    [props.documentPreviewStore, schemaType, value._id, title],
  )!

  const status = isLoading ? null : (
    <TooltipDelayGroupProvider delay={TOOLTIP_DELAY_PROPS}>
      <Inline space={4}>
        {presence && presence.length > 0 && <DocumentPreviewPresence presence={presence} />}
        <DocumentStatus draft={draft} published={published} />
      </Inline>
    </TooltipDelayGroupProvider>
  )

  const tooltipLabel = useDocumentStatusTimeAgo({
    draftUpdatedAt: draft && '_updatedAt' in draft ? draft._updatedAt : '',
    publishedUpdatedAt: published && '_updatedAt' in published ? published._updatedAt : '',
  })

  return (
    <SanityDefaultPreview
      {...getPreviewValueWithFallback({value, draft, published})}
      isPlaceholder={isLoading}
      icon={icon}
      layout={layout}
      status={status}
      tooltipLabel={tooltipLabel}
    />
  )
}
