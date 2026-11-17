import firebaseRules from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*'],
  },
  {
    files: ['firestore.rules'],
    plugins: {
      '@firebase/security-rules': firebaseRules,
    },
    languageOptions: {
      parser: firebaseRules.parser,
    },
    rules: {
      ...firebaseRules.configs.recommended.rules,
    },
  },
];
