const requiredNumberOfSpaces = 4;

module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true
    },
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'complexity': ['error', {'max': 6 }],
        'eqeqeq': ['error', 'always', {'null': 'ignore'}],
        'no-magic-numbers': ['error', {
            'ignore': [1], 
            'ignoreArrayIndexes': true 
        }],
        'no-multi-spaces': 'error',
        'no-unused-vars': 'error',
        'keyword-spacing': ['error', { 
            'before': true,
            'after': true 
        }],
        'indent': ['error', requiredNumberOfSpaces]
    }
};