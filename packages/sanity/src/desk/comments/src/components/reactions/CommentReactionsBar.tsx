import React, {useCallback, useMemo} from 'react'
import {CurrentUser} from '@sanity/types'
import {Card, Flex, Text, TooltipDelayGroupProvider} from '@sanity/ui'
import styled from 'styled-components'
import {CommentReactionItem, CommentReactionOption, CommentReactionOptionNames} from '../../types'
import {COMMENT_REACTION_EMOJIS, COMMENT_REACTION_OPTIONS} from '../../constants'
import {ReactionIcon} from '../icons'
import {TOOLTIP_DELAY_PROPS, Tooltip} from '../../../../../ui-components'
import {CommentReactionsMenuButton} from './CommentReactionsMenuButton'
import {CommentReactionsUsersTooltip} from './CommentReactionsUsersTooltip'

/**
 * A function that groups reactions by name. For example:
 *
 * ```js
 * [
 *  [':name:', [{name: ':name:', userId: 'user1'}, {name: ':name:', userId: 'user2'}],
 *  [':name2:', [{name: ':name2:', userId: 'user1'}]
 * ]
 *```
 */
function groupReactionsByName(reactions: CommentReactionItem[]) {
  const grouped = reactions.reduce(
    (acc, reaction) => {
      const {name} = reaction

      if (!acc[name]) {
        acc[name] = []
      }

      acc[name].push(reaction)

      return acc
    },
    {} as Record<CommentReactionOptionNames, CommentReactionItem[]>,
  )

  // Sort based on the first appearance of the reaction in `reactions` array.
  // This is to ensure that the order of the reactions is consistent so that
  // the reactions are not jumping around when new reactions are added.
  const sorted = Object.entries(grouped).sort(([nameA], [nameB]) => {
    const indexA = reactions.findIndex((r) => r.name === nameA)
    const indexB = reactions.findIndex((r) => r.name === nameB)

    return indexA - indexB
  })

  return sorted as [CommentReactionOptionNames, CommentReactionItem[]][]
}

const ReactionButtonCard = styled(Card)`
  max-width: max-content;
  border: 1px solid var(--card-border-color) !important;
`

const renderMenuButton = ({open}: {open: boolean}) => (
  <ReactionButtonCard
    __unstable_focusRing
    forwardedAs="button"
    pressed={open}
    radius={6}
    tone="transparent"
    type="button"
  >
    <Tooltip animate content="Add reaction">
      <Flex align="center" justify="center" padding={2} paddingX={3}>
        <Text muted size={1}>
          <ReactionIcon />
        </Text>
      </Flex>
    </Tooltip>
  </ReactionButtonCard>
)

interface CommentReactionsBarProps {
  currentUser: CurrentUser
  onSelect: (reaction: CommentReactionOption) => void
  reactions: CommentReactionItem[]
}

export function CommentReactionsBar(props: CommentReactionsBarProps) {
  const {currentUser, onSelect, reactions} = props

  const handleSelect = useCallback(
    (name: CommentReactionOptionNames) => {
      const option = COMMENT_REACTION_OPTIONS.find((o) => o.name === name)

      if (option) {
        onSelect(option)
      }
    },
    [onSelect],
  )

  const currentUserReactions = useMemo(() => {
    return reactions.filter((r) => r.userId === currentUser?.id).map((r) => r.name)
  }, [currentUser?.id, reactions])

  const groupedReactions = useMemo(() => groupReactionsByName(reactions), [reactions])

  return (
    <Flex align="center" gap={1} wrap="wrap">
      <TooltipDelayGroupProvider delay={TOOLTIP_DELAY_PROPS}>
        {groupedReactions.map(([name, reactionsList]) => {
          const hasReacted = currentUserReactions.includes(name)
          const userIds = reactionsList.map((r) => r.userId)

          return (
            <CommentReactionsUsersTooltip
              currentUser={currentUser}
              key={name}
              reactionName={name}
              userIds={userIds}
            >
              <ReactionButtonCard
                __unstable_focusRing
                border
                forwardedAs="button"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleSelect(name)}
                padding={2}
                radius={6}
                tone={hasReacted ? 'primary' : 'transparent'}
                type="button"
              >
                <Flex align="center" gap={2}>
                  <Text size={1}>{COMMENT_REACTION_EMOJIS[name]}</Text>

                  <Text size={1} weight={hasReacted ? 'medium' : undefined}>
                    {reactionsList?.length}
                  </Text>
                </Flex>
              </ReactionButtonCard>
            </CommentReactionsUsersTooltip>
          )
        })}

        <CommentReactionsMenuButton
          // eslint-disable-next-line react/jsx-no-bind
          onSelect={(o) => handleSelect(o.name)}
          options={COMMENT_REACTION_OPTIONS}
          renderMenuButton={renderMenuButton}
          selectedOptionNames={currentUserReactions}
        />
      </TooltipDelayGroupProvider>
    </Flex>
  )
}
