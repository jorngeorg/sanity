import React, {useCallback, useState} from 'react'
// eslint-disable-next-line no-restricted-imports
import {Button, Flex} from '@sanity/ui'
import {CommentReactionsMenuButton} from '../components'
import {CommentReactionOption, CommentReactionOptionNames} from '../types'
import {COMMENT_REACTION_OPTIONS} from '../constants'

export default function CommentReactionsMenuButtonStory() {
  const [selectedOptions, setSelectedOptions] = useState<CommentReactionOptionNames[]>([])

  const handleOnSelect = useCallback(
    (option: CommentReactionOption) => {
      const hasOption = selectedOptions.includes(option.name)

      if (hasOption) {
        setSelectedOptions((prev) => prev.filter((o) => o !== option.name))
      } else {
        setSelectedOptions((prev) => [...prev, option.name])
      }
    },
    [selectedOptions],
  )

  return (
    <Flex align="center" justify="center" height="fill">
      <CommentReactionsMenuButton
        // eslint-disable-next-line react/jsx-no-bind
        renderMenuButton={({open}) => <Button text="Reactions" selected={open} />}
        onSelect={handleOnSelect}
        options={COMMENT_REACTION_OPTIONS}
        selectedOptionNames={selectedOptions}
      />
    </Flex>
  )
}
