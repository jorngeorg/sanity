import {Flex, Text, Stack} from '@sanity/ui'
import React, {useMemo} from 'react'
import styled from 'styled-components'
import {COMMENT_REACTION_EMOJIS} from '../../constants'
import {CommentReactionOptionNames} from '../../types'
import {Tooltip} from '../../../../../ui-components'
import {useCurrentUser, useUser} from 'sanity'

const TEXT_SIZE = 1

const EmojiText = styled(Text)`
  font-size: 2em;
`

const ContentStack = styled(Stack)`
  max-width: 250px;
`

const InlineText = styled(Text).attrs({size: TEXT_SIZE})`
  display: inline-block !important;
`

interface UserDisplayNameProps {
  currentUserId: string
  isFirst?: boolean
  userId: string
}

function UserDisplayName(props: UserDisplayNameProps) {
  const {currentUserId, isFirst, userId} = props
  const [user] = useUser(userId)

  const isCurrentUser = currentUserId === userId
  const you = isFirst ? 'You' : 'you'
  const text = isCurrentUser ? you : user?.displayName ?? 'Unknown user'

  return <InlineText weight="medium">{text}</InlineText>
}

interface CommentReactionsUsersTooltipProps {
  children: React.ReactNode
  reactionName: CommentReactionOptionNames
  userIds: string[]
}

export function CommentReactionsUsersTooltip(props: CommentReactionsUsersTooltipProps) {
  const {children, reactionName, userIds} = props
  const currentUser = useCurrentUser()

  const content = useMemo(() => {
    const len = userIds.length

    if (len === 0 || !currentUser) {
      return null
    }

    if (len === 1) {
      return <UserDisplayName currentUserId={currentUser.id} userId={userIds[0]} isFirst />
    }

    if (len === 2) {
      return (
        <>
          <UserDisplayName currentUserId={currentUser.id} userId={userIds[0]} isFirst />{' '}
          <InlineText>and</InlineText>{' '}
          <UserDisplayName currentUserId={currentUser.id} userId={userIds[1]} />
        </>
      )
    }

    const last = userIds[len - 1]
    const others = userIds
      .slice(0, 2)
      .map((id, index) => (
        <UserDisplayName
          currentUserId={currentUser.id}
          isFirst={index === 0}
          key={id}
          userId={id}
        />
      ))

    return (
      <>
        {others} <InlineText>and</InlineText>{' '}
        <UserDisplayName currentUserId={currentUser.id} userId={last} />
      </>
    )
  }, [currentUser, userIds])

  return (
    <Tooltip
      placement="bottom"
      content={
        <ContentStack padding={1} paddingBottom={2} space={2}>
          <Flex justify="center">
            <EmojiText> {COMMENT_REACTION_EMOJIS[reactionName]}</EmojiText>
          </Flex>

          <div>
            {content} <InlineText muted>reacted with</InlineText>{' '}
            <InlineText muted>{reactionName}</InlineText>
          </div>
        </ContentStack>
      }
    >
      <div>{children}</div>
    </Tooltip>
  )
}
