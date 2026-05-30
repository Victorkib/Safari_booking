import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'drizzle/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ['components/ui/**', 'hooks/**'],
    rules: {
      // shadcn/ui boilerplate patterns
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]

export default eslintConfig
