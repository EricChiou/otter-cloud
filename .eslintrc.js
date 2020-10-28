export default {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        '@typescript-eslint'
    ],
    'rules': {
        'semi': ['error', 'always'],
        'no-extra-semi': 'error',
        'quotes': ['error', 'single'],
        'linebreak-style': ['off'],
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['error', { 'code': 100 }],
        'arrow-parens': ['error', 'as-needed'],
        'no-param-reassign': ['error', { 'props': false }],
        'operator-linebreak': ['error', 'after'],
        'max-lines': ['error', 500],
        'no-tabs': ['error'],
        'no-trailing-spaces': 'error',
        'max-depth': ['error', 4],
    }
};
