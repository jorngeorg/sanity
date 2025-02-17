import {isArraySchemaType, isReferenceSchemaType, ReferenceValue} from '@sanity/types'
import {Box, Card, Stack} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import {Button} from '../../../../../../../../../../ui-components'
import {useSchema} from '../../../../../../../../../hooks'
import {SearchableType} from '../../../../../../../../../search'
import {useSearchState} from '../../../../../contexts/search/useSearchState'
import {OperatorInputComponentProps} from '../../../../../definitions/operators/operatorTypes'
import {getSchemaField} from '../../../../../utils/getSchemaField'
import {SearchResultItem} from '../../../../searchResults/item/SearchResultItem'
import {useTranslation} from '../../../../../../../../../i18n'
import {ReferenceAutocomplete} from './ReferenceAutocomplete'

export function SearchFilterReferenceInput({
  fieldDefinition,
  onChange,
  value,
}: OperatorInputComponentProps<ReferenceValue>) {
  const {
    onClose,
    state: {documentTypesNarrowed},
  } = useSearchState()
  const schema = useSchema()
  const {t} = useTranslation()

  const handleChange = useCallback(
    (referenceValue: ReferenceValue | null) => onChange(referenceValue),
    [onChange],
  )

  // Extract all searchable types
  const searchableTypes = useMemo(() => {
    if (!fieldDefinition) {
      return []
    }

    return fieldDefinition.documentTypes
      .filter((d) => documentTypesNarrowed.includes(d))
      .flatMap((type) => {
        const schemaType = schema.get(type)
        if (schemaType) {
          const field = getSchemaField(schemaType, fieldDefinition.fieldPath)
          if (isArraySchemaType(field?.type)) {
            return field?.type.of.filter(isReferenceSchemaType).flatMap((i) => i.to)
          }
          if (isReferenceSchemaType(field?.type)) {
            return field?.type.to
          }
        }
        return []
      })
      .reduce<SearchableType[]>((acc, val) => {
        if (acc.findIndex((v) => v.name === val?.name) < 0) {
          acc.push(val as SearchableType)
        }
        return acc
      }, [])
  }, [documentTypesNarrowed, fieldDefinition, schema])

  const handleClear = useCallback(() => handleChange(null), [handleChange])

  const handleClick = useCallback(() => {
    onClose?.()
  }, [onClose])

  return (
    <Box style={{width: 'min(calc(100vw - 40px), 420px)'}}>
      {value?._ref && value?._type ? (
        <Stack space={3}>
          <Card padding={1} radius={1} shadow={1}>
            <SearchResultItem
              documentId={value._ref}
              documentType={value._type}
              layout="compact"
              onClick={handleClick}
            />
          </Card>
          <Button
            mode="ghost"
            onClick={handleClear}
            text={t('search.filter-reference-clear')}
            tone="critical"
          />
        </Stack>
      ) : (
        <ReferenceAutocomplete onSelect={handleChange} types={searchableTypes} value={value} />
      )}
    </Box>
  )
}
