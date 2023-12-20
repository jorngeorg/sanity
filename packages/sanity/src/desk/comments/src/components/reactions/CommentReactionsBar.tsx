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

const ReactionButtonCard = styled(Card)`
  max-width: max-content;
  border: 1px solid var(--card-border-color) !important;
`

const renderButton = ({open}: {open: boolean}) => (
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
  reactions: CommentReactionItem[]
  onSelect: (reaction: CommentReactionOption) => void
  currentUser: CurrentUser
}

function groupReactions(reactions: CommentReactionItem[]) {
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

export function CommentReactionsBar(props: CommentReactionsBarProps) {
  const {currentUser, reactions, onSelect} = props

  const handleSelect = useCallback(
    (name: CommentReactionOptionNames) => {
      const option = COMMENT_REACTION_OPTIONS.find((o) => o.name === name)

      if (option) {
        onSelect(option)
      }
    },
    [onSelect],
  )

  const selectedOptionNames = useMemo(() => {
    return reactions.filter((r) => r.userId === currentUser?.id).map((r) => r.name)
  }, [currentUser?.id, reactions])

  const groupedReactions = useMemo(() => groupReactions(reactions), [reactions])

  const usersPerReaction = useMemo(() => {
    return groupedReactions.reduce(
      (acc, [name, reactionsList]) => {
        const users = reactionsList.map((r) => r.userId)

        acc[name] = users

        return acc
      },
      {} as Record<CommentReactionOptionNames, string[]>,
    )
  }, [groupedReactions])

  return (
    <Flex align="center" gap={1} wrap="wrap">
      <TooltipDelayGroupProvider delay={TOOLTIP_DELAY_PROPS}>
        {groupedReactions.map(([name, reactionsList]) => {
          const hasReacted = selectedOptionNames.includes(name)
          const userIds = usersPerReaction[name]

          return (
            <CommentReactionsUsersTooltip
              currentUser={currentUser}
              key={name}
              reactionName={name}
              userIds={userIds}
            >
              <ReactionButtonCard
                radius={6}
                type="button"
                forwardedAs="button"
                tone={hasReacted ? 'primary' : 'transparent'}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleSelect(name)}
                padding={2}
                border
                __unstable_focusRing
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
          renderButton={renderButton}
          selectedOptionNames={selectedOptionNames}
        />
      </TooltipDelayGroupProvider>
    </Flex>
  )
}
