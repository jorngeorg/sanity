/* eslint-disable camelcase */
import {CommentReactionOption, CommentReactionOptionNames} from './types'

// These should not be alphabetized as the current order is intentional
export const COMMENT_REACTION_OPTIONS: CommentReactionOption[] = [
  {
    name: 'eyes',
    title: 'Eyes',
  },
  {
    name: 'thumbs_up',
    title: 'Thumbs up',
  },
  {
    name: 'rocket',
    title: 'Rocket',
  },
  {
    name: 'heart_eyes',
    title: 'Heart eyes',
  },
  {
    name: 'heavy_plus_sign',
    title: 'Heavy plus sign',
  },
  {
    name: 'thumbs_down',
    title: 'Thumbs down',
  },
]

export const COMMENT_REACTION_EMOJIS: Record<CommentReactionOptionNames, string> = {
  eyes: '👀',
  heart_eyes: '😍',
  thumbs_up: '👍',
  thumbs_down: '👎',
  heavy_plus_sign: '➕',
  rocket: '🚀',
}
