import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';

import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import pluginJest from 'eslint-plugin-jest';
import tsParser from '@typescript-eslint/parser';

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...pluginJest.environments.globals.globals,
      },
      parser: tsParser,
    },
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ),
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      jest: pluginJest,
    },
    rules: {
      'prettier/prettier': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
]);
