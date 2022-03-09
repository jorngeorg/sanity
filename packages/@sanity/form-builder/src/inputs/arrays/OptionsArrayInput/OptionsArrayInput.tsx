import React from 'react'
import {get} from 'lodash'
import {FormFieldSet} from '@sanity/base/components'
import {ArraySchemaType, isTitledListValue} from '@sanity/types'
import {Box, Checkbox, Flex, Text} from '@sanity/ui'
import {resolveTypeName} from '@sanity/util/content'
import {useConditionalReadOnly} from '@sanity/base/_internal'
import PatchEvent, {set, unset} from '../../../PatchEvent'
import Preview from '../../../Preview'
import {ItemWithMissingType} from '../ArrayOfObjectsInput/item/ItemWithMissingType'
import {Item, List} from '../common/list'
import {ConditionalReadOnlyField} from '../../common'
import {FormInputProps} from '../../../types'
import {resolveValueWithLegacyOptionsSupport, isLegacyOptionsItem} from './legacyOptionsSupport'

type Focusable = {focus: () => void}

const changeIndicatorOptions = {compareDeep: true}

function isEqual(item, otherItem) {
  if (isLegacyOptionsItem(item) || isLegacyOptionsItem(otherItem)) {
    return item.value === otherItem.value
  }
  if (item === otherItem) {
    return true
  }
  if (typeof item !== typeof otherItem) {
    return false
  }
  if (typeof item !== 'object' && !Array.isArray(item)) {
    return item === otherItem
  }
  if (item._key && item._key === otherItem._key) {
    return true
  }
  if (Array.isArray(item)) {
    if (!item.length !== otherItem.length) {
      return false
    }
    return item.every((it, i) => isEqual(item[i], otherItem[i]))
  }
  const keys = Object.keys(item)
  const otherKeys = Object.keys(item)
  if (keys.length !== otherKeys.length) {
    return false
  }
  return keys.every((keyName) => isEqual(item[keyName], otherItem[keyName]))
}

function inArray(array, candidate) {
  return array ? array.some((item) => isEqual(item, candidate)) : false
}

type OptionsArrayInputProps = FormInputProps<unknown[], ArraySchemaType>

export default class OptionsArrayInput extends React.PureComponent<OptionsArrayInputProps> {
  _element: Focusable | null

  handleChange = (isChecked, optionValue) => {
    const {type, value = []} = this.props
    const list = get(type.options, 'list')
    if (!isChecked && optionValue._key) {
      // This is an optimization that only works if list items are _keyed
      this.props.onChange(PatchEvent.from(unset([{_key: optionValue._key}])))
    }
    const nextValue = list
      .filter((item) =>
        isEqual(optionValue, item)
          ? isChecked
          : inArray(value, resolveValueWithLegacyOptionsSupport(item))
      )
      .map(resolveValueWithLegacyOptionsSupport)
    this.props.onChange(PatchEvent.from(nextValue.length > 0 ? set(nextValue) : unset()))
  }

  getMemberTypeOfItem(option) {
    const {type} = this.props
    return type.of.find(
      (memberType) =>
        memberType.name === resolveTypeName(resolveValueWithLegacyOptionsSupport(option))
    )
  }

  setElement = (el: Focusable | null) => {
    this._element = el
  }

  focus() {
    if (this._element) {
      this._element.focus()
    }
  }

  handleFocus = (index: number) => {
    this.props.onFocus([index])
  }

  render() {
    const {type, markers, value, level, readOnly, presence, onFocus, onBlur} = this.props
    const options: any[] = type.options?.list || []

    // note: direction was never documented and makes more sense to use "grid" for it too
    const isGrid = type.options?.direction === 'horizontal' || type.options?.layout === 'grid'

    return (
      <FormFieldSet
        ref={this.setElement}
        title={type.title}
        description={type.description}
        __unstable_presence={presence}
        level={level}
        __unstable_changeIndicator={changeIndicatorOptions}
        __unstable_markers={markers}
      >
        <List isGrid={isGrid}>
          {options.map((option, index) => {
            const optionType = this.getMemberTypeOfItem(option)
            const checked = inArray(value, resolveValueWithLegacyOptionsSupport(option))
            const disabled = !optionType
            const isTitled = isTitledListValue(option)
            return (
              <Item index={index} isGrid={isGrid} key={index}>
                <Flex align="center" as="label" muted={disabled}>
                  <ConditionalReadOnlyField
                    readOnly={readOnly || optionType?.readOnly}
                    parent={value}
                    value={checked}
                  >
                    <WrappedCheckbox
                      disabled={disabled}
                      checked={checked}
                      onChange={(e) => this.handleChange(e.currentTarget.checked, option)}
                      onFocus={() => this.handleFocus(index)}
                      onBlur={onBlur}
                    />
                    {optionType &&
                      (isTitled ? (
                        <Box padding={2}>
                          <Text>{option.title}</Text>
                        </Box>
                      ) : (
                        <Box marginLeft={2}>
                          <Preview
                            layout="grid"
                            type={optionType}
                            value={resolveValueWithLegacyOptionsSupport(option)}
                          />
                        </Box>
                      ))}
                    {!optionType && (
                      <ItemWithMissingType value={option} onFocus={() => onFocus([])} />
                    )}
                  </ConditionalReadOnlyField>
                </Flex>
              </Item>
            )
          })}
        </List>
      </FormFieldSet>
    )
  }
}

const WrappedCheckbox = (props: React.HTMLProps<HTMLInputElement>) => {
  const {disabled, checked, onChange, onFocus, onBlur} = props
  const readOnly = useConditionalReadOnly()
  return <Checkbox {...{disabled, checked, readOnly, onChange, onFocus, onBlur}} />
}
