import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';

import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
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
        ...globals.jest,
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
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
