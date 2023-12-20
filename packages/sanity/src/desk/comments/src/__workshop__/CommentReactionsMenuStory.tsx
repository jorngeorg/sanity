import React, {useCallback, useState} from 'react'
import {CommentReactionsMenu} from '../components'
import {CommentReactionOption, CommentReactionOptionNames} from '../types'
import {COMMENT_REACTION_OPTIONS} from '../constants'

export default function CommentReactionsMenuStory() {
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
    <div>
      <CommentReactionsMenu
        onSelect={handleOnSelect}
        options={COMMENT_REACTION_OPTIONS}
        selectedOptionNames={selectedOptions}
      />
    </div>
  )
}
