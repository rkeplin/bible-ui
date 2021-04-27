module.exports =  {
    parser:  '@typescript-eslint/parser',
    extends:  [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parserOptions: {
        'project': 'tsconfig.json'
    },
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    rules:  {
        "prettier/prettier": "error",
    },
    settings:  {
        react:  {
            version: 'detect',
        },
    },
};
