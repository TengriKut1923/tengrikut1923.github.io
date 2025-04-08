module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier', // Prettier ile çakışmaları önler
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Type-aware linting için
    extraFileExtensions: ['.astro'], // Astro dosyalarını tanıması için
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Astro'ya özel kurallar veya kapatılması gerekenler
        'react/jsx-filename-extension': 'off', // Astro'da JSX yok
        'jsx-a11y/anchor-is-valid': 'off', // Astro <Link> vb. kullanabilir
      },
    },
    {
        files: ['*.ts', '*.tsx'],
        parser: '@typescript-eslint/parser',
        rules: {
           // Preact veya TS/TSX özel kuralları
           'react/react-in-jsx-scope': 'off', // Preact 17+ için gerekli değil
           'react/prop-types': 'off' // TypeScript kullanıyoruz
        }
    }
  ],
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  rules: {
    // Genel kurallar
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // Geliştirme logları için
    // Erişilebilirlik kurallarını özelleştirme (örnek)
    // 'jsx-a11y/img-redundant-alt': 'warn',
    // 'jsx-a11y/no-autofocus': 'off', // Bazen gerekebilir
  },
  settings: {
    react: {
        version: 'detect', // Veya '17.0' (Preact/compat için)
        pragma: 'h', // Preact için
        fragment: 'Fragment' // Preact için
    }
  }
};