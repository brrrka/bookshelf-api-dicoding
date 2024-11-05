import globals from 'globals';
import pluginJs from '@eslint/js';
import dicodingAcademyStyle from 'eslint-config-dicodingacademy';

/** @type {import('eslint').Linter.Config[]} */
export default [
  dicodingAcademyStyle,
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
