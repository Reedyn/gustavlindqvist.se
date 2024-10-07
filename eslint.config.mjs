import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat["extends"]('eslint:recommended'),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		rules: {
			'linebreak-style': ['error', 'unix'],
			'array-bracket-spacing': 2,
			'brace-style': 2,
			'comma-dangle': 0,
			'comma-spacing': 1,

			'comma-style': [
				1,
				'last',
				{
					exceptions: {
						VariableDeclaration: true,
					},
				},
			],

			curly: 2,

			'dot-notation': [
				1,
				{
					allowKeywords: false,
				},
			],

			'eol-last': [2, 'always'],
			eqeqeq: 2,
			indent: [0, 'tab', { SwitchCase: 1, MemberExpression: 0 }],
			'key-spacing': 1,
			'keyword-spacing': 1,
			'new-cap': 0,
			'no-continue': 2,

			'no-empty': [
				2,
				{
					allowEmptyCatch: true,
				},
			],

			'no-multiple-empty-lines': [
				1,
				{
					max: 2,
				},
			],

			'no-eval': 2,
			'no-implied-eval': 2,
			'no-mixed-spaces-and-tabs': 2,
			'no-multi-str': 1,
			'no-new-func': 2,
			'no-sequences': 2,

			'no-trailing-spaces': [
				1,
				{
					skipBlankLines: true,
				},
			],

			'no-undef': 2,
			'no-underscore-dangle': 0,
			'no-use-before-define': 2,
			'no-console': 1,
			'no-with': 2,
			'one-var': [1, 'never'],
			semi: 2,
			'semi-spacing': 1,
			'space-before-blocks': 1,

			'space-before-function-paren': [
				1,
				{
					anonymous: 'always',
					named: 'never',
				},
			],

			'space-in-parens': 1,
			'space-infix-ops': 1,
			'space-unary-ops': 1,
			'vars-on-top': 0,
			'wrap-iife': 2,

			'no-unused-vars': [
				1,
				{
					vars: 'local',
				},
			],

			'max-len': [
				0,
				{
					code: 100,
					tabWidth: 4,
					ignoreTemplateLiterals: true,
					ignoreRegExpLiterals: true,
					ignoreStrings: false,
					ignoreComments: true,
				},
			],
		},
	},
];
