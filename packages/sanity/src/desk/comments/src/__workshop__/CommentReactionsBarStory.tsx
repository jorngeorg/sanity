import React, {useCallback, useState} from 'react'
import {Flex} from '@sanity/ui'
import {uuid} from '@sanity/uuid'
import {CommentReactionsBar} from '../components'
import {CommentReactionItem, CommentReactionOption} from '../types'
import {useCurrentUser} from 'sanity'

const INITIAL_REACTIONS: CommentReactionItem[] = [
  {
    name: ':eyes:',
    userId: 'p8U8TipFc',
    _key: '1',
  },
  {
    name: ':heavy_plus_sign:',
    userId: 'abc',
    _key: '2',
  },
]

export default function CommentReactionsBarStory() {
  const [selectedOptions, setSelectedOptions] = useState<CommentReactionItem[]>(INITIAL_REACTIONS)
  const currentUser = useCurrentUser()

  const handleReactionSelect = useCallback(
    (reaction: CommentReactionOption) => {
      const hasReaction = selectedOptions.some(
        (r) => r.name === reaction.name && r.userId === currentUser?.id,
      )

      if (hasReaction) {
        const next = selectedOptions
          .map((item) => {
            if (item.name === reaction.name && item.userId === currentUser?.id) {
              return undefined
            }

            return item
          })
          .filter(Boolean) as CommentReactionItem[]

        setSelectedOptions(next)
        return
      }

      const next = [...selectedOptions, {...reaction, userId: currentUser?.id || '', _key: uuid()}]

      setSelectedOptions(next)
    },
    [currentUser?.id, selectedOptions],
  )

  if (!currentUser) return null

  return (
    <Flex align="center" justify="center" height="fill">
      <CommentReactionsBar
        reactions={selectedOptions}
        onSelect={handleReactionSelect}
        currentUser={currentUser}
      />
    </Flex>
  )
}
