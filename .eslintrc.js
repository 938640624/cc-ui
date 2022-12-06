// module.exports = {
//   root: true,
//   env: {
//       // es2021: true,
//       node: true,
//   },
//   extends: [
//       // 'plugin:vue/vue3-essential',
//       'eslint:recommended',
//       // 'prettier',
//       'plugin:prettier/recommended',
//       '@vue/standard'
//   ],
//   // parser: 'vue-eslint-parser',
//   parserOptions: {
//       sourceType: 'module',
//       ecmaVersion: 12,
//       ecmaFeatures: {
//           globalReturn: false,
//           impliedStrict: false,
//           jsx: false,
//       },
//       vueFeatures: {
//           filter: true,
//           interpolationAsNonHTML: true,
//           styleCSSVariableInjection: true,
//       },
//   },
//   globals: {
//       defineProps: 'readonly',
//       defineEmits: 'readonly',
//       defineExpose: 'readonly',
//       withDefaults: 'readonly',
//   },
//   rules: {
//       'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//       'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//       'prettier/prettier': [
//           'error',
//           {
//               semi: false,
//               singleQuote: true,
//               tabWidth: 4,
//               useTabs: false,
//               bracketSpacing: true,
//               tslintIntegration: false,
//               endOfLine: 'lf',
//               printWidth: 120,
//           },
//       ],
//       'vue/multi-word-component-names': 0, // 组件名称可以为indexW
//   },
// }

// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   globals: {
//     "xt3d": false,
//     "Cesium": false,
//     "mars3d": false
//   },
//   'extends': [
//     'eslint:recommended',
//     'plugin:vue/recommended',
//     '@vue/standard'
//   ],
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
//   rules: {
//     'prefer-template':1,
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     "handle-callback-err": "off",
//     "quotes": ["error", "double", { "allowTemplateLiterals": true }],
//     "semi": "off",
//     "no-new": "off",
//     "vue/no-v-html": "off",
//     "comma-dangle": "off",
//     // "vue/html-self-closing": ["error", {
//     //   "html": {
//     //     "void": "never",
//     //     "normal": "never",
//     //     "component": "always"
//     //   },
//     //   "svg": "always",
//     //   "math": "always"
//     // }]
//     // "space-before-function-paren": ["error", {
//     //   "anonymous": "always",
//     //   "named": "never",
//     //   "asyncArrow": "always"
//     // }],
//   }
// }

module.exports = {
  root: true,
  env: {
      node: true,
  },
  extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
      ecmaFeatures: {
          globalReturn: false,
          impliedStrict: false,
          jsx: false,
      },
      vueFeatures: {
          filter: true,
          interpolationAsNonHTML: true,
          styleCSSVariableInjection: true,
      },
  },
  globals: {
      defineProps: 'readonly',
      defineEmits: 'readonly',
      defineExpose: 'readonly',
      withDefaults: 'readonly',
  },
  rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': [
          'error',
          {
              semi: false,
              singleQuote: true,
              tabWidth: 4,
              useTabs: false,
              bracketSpacing: true,
              tslintIntegration: false,
              endOfLine: 'lf',
              printWidth: 120,
          },
      ],
      'vue/multi-word-component-names': 0, // 组件名称可以为indexW
  },
}
