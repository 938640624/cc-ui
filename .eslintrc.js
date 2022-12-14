module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'plugin:prettier/recommended'],
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
