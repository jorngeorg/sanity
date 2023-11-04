import {SortIcon} from '@sanity/icons'
import {Card, Flex, Menu, MenuButton, MenuDivider} from '@sanity/ui'
import isEqual from 'lodash/isEqual'
import React, {useCallback, useId, useMemo} from 'react'
import styled from 'styled-components'
import {ORDERINGS} from '../definitions/orderings'
import {Button, MenuItem} from '../../../../../../ui'
import {useSearchState} from '../contexts/search/useSearchState'
import type {SearchOrdering} from '../types'

interface SearchDivider {
  type: 'divider'
}

const MENU_ORDERINGS: (SearchDivider | SearchOrdering)[] = [
  ORDERINGS.relevance,
  {type: 'divider'},
  ORDERINGS.createdAsc,
  ORDERINGS.createdDesc,
  {type: 'divider'},
  ORDERINGS.updatedAsc,
  ORDERINGS.updatedDesc,
]

const SortMenuContentFlex = styled(Flex)`
  box-sizing: border-box;
`

function isSearchDivider(item: SearchDivider | SearchOrdering): item is SearchDivider {
  return (item as SearchDivider).type === 'divider'
}

function CustomMenuItem({ordering}: {ordering: SearchOrdering}) {
  const {
    dispatch,
    state: {ordering: currentOrdering},
  } = useSearchState()

  const handleClick = useCallback(() => {
    dispatch({ordering, type: 'ORDERING_SET'})
  }, [dispatch, ordering])

  const isSelected = useMemo(() => isEqual(currentOrdering, ordering), [currentOrdering, ordering])

  return (
    <MenuItem onClick={handleClick} pressed={isSelected} tone="default" text={ordering.title} />
  )
}

export function SortMenu() {
  const {
    state: {ordering},
  } = useSearchState()

  const menuButtonId = useId()

  const currentMenuItem = MENU_ORDERINGS.find(
    (item): item is SearchOrdering => isEqual(ordering, item) && !isSearchDivider(item),
  )

  if (!currentMenuItem) {
    return null
  }

  return (
    <Card borderBottom>
      <SortMenuContentFlex align="center" flex={1} padding={2}>
        <MenuButton
          button={<Button mode="bleed" size="small" icon={SortIcon} text={currentMenuItem.title} />}
          id={menuButtonId || ''}
          menu={
            <Menu>
              {MENU_ORDERINGS.map((item, index) => {
                if (isSearchDivider(item)) {
                  // eslint-disable-next-line react/no-array-index-key
                  return <MenuDivider key={index} />
                }
                return (
                  <CustomMenuItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    ordering={item}
                  />
                )
              })}
            </Menu>
          }
          placement="bottom-start"
          popover={{portal: true, radius: 2}}
        />
      </SortMenuContentFlex>
    </Card>
  )
}
