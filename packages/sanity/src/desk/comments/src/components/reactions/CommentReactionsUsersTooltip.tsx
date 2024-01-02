import {Flex, Text, Stack} from '@sanity/ui'
import React, {Fragment, useMemo} from 'react'
import styled from 'styled-components'
import {COMMENT_REACTION_EMOJIS} from '../../constants'
import {CommentReactionOptionNames} from '../../types'
import {Tooltip} from '../../../../../ui-components'
import {CurrentUser, useUser} from 'sanity'

const TEXT_SIZE = 1

const EmojiText = styled(Text)`
  font-size: 2em;
`

const ContentStack = styled(Stack)`
  max-width: 220px;
`

const InlineText = styled(Text).attrs({size: TEXT_SIZE})`
  display: inline-block !important;
`

interface UserDisplayNameProps {
  currentUserId: string
  isFirst?: boolean
  separator?: boolean
  userId: string
}

function UserDisplayName(props: UserDisplayNameProps) {
  const {currentUserId, isFirst, userId, separator} = props
  const [user] = useUser(userId)

  const isCurrentUser = currentUserId === userId
  const you = isFirst ? 'You' : 'you'
  const content = isCurrentUser ? you : user?.displayName ?? 'Unknown user'
  const text = separator ? `${content}, ` : content

  return <InlineText weight="medium">{text}</InlineText>
}

interface CommentReactionsUsersTooltipProps {
  children: React.ReactNode
  currentUser: CurrentUser
  reactionName: CommentReactionOptionNames
  userIds: string[]
}

export function CommentReactionsUsersTooltip(props: CommentReactionsUsersTooltipProps) {
  const {children, currentUser, reactionName, userIds} = props

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
    const othersArr = userIds.slice(0, 2)
    const others = userIds.slice(0, 2).map((id, index) => (
      <Fragment key={id}>
        <UserDisplayName
          currentUserId={currentUser.id}
          isFirst={index === 0}
          separator={index < othersArr.length - 1}
          userId={id}
        />{' '}
      </Fragment>
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
      portal
      content={
        <ContentStack padding={1} paddingBottom={2} space={2}>
          <Flex justify="center">
            <EmojiText> {COMMENT_REACTION_EMOJIS[reactionName]}</EmojiText>
          </Flex>

          <div>
            {content} <InlineText muted>reacted with </InlineText>
            <wbr /> <InlineText muted>{reactionName}</InlineText>
          </div>
        </ContentStack>
      }
    >
      <div>{children}</div>
    </Tooltip>
  )
}
