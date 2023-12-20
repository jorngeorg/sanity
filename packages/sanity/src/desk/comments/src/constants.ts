import {CommentReactionOption, CommentReactionOptionNames} from './types'

export const COMMENT_REACTION_OPTIONS: CommentReactionOption[] = [
  {
    name: ':eyes:',
    title: 'Eyes',
  },
  {
    name: ':thumbsup:',
    title: 'Thumbs up',
  },
  {
    name: ':rocket:',
    title: 'Rocket',
  },
  {
    name: ':heart_eyes:',
    title: 'Heart',
  },
  {
    name: ':heavy_plus_sign:',
    title: 'Heavy plus sign',
  },
  {
    name: ':thumbsdown:',
    title: 'Thumbs down',
  },
]

export const COMMENT_REACTION_EMOJIS: Record<CommentReactionOptionNames, string> = {
  ':eyes:': '👀',
  ':heart_eyes:': '😍',
  ':thumbsup:': '👍',
  ':thumbsdown:': '👎',
  ':heavy_plus_sign:': '➕',
  ':rocket:': '🚀',
}
