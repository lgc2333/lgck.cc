import { defineCollection } from 'valaxy'

export default defineCollection({
  key: 'uncollapsed-notes',
  title: '不折叠合集测试',
  description: 'This collection should not appear as a collapsed feed card.',
  collapse: false,
  items: [{ title: 'Only chapter', key: '1' }],
})
