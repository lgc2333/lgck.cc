import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'

export default antfu(
  {
    ignores: ['pnpm-workspace.yaml'],
    markdown: false,
  },
  prettier,
  {
    rules: {
      'antfu/if-newline': 'off',
      'antfu/consistent-chaining': 'off',

      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-template-description': 'off',
      'jsdoc/require-throws-description': 'off',
      'jsdoc/require-yields-description': 'off',

      'jsonc/comma-dangle': 'off',

      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',

      'ts/no-redeclare': ['error', { ignoreDeclarationMerge: true }],

      'vue/v-on-event-hyphenation': 'off',
    },
  },
)
