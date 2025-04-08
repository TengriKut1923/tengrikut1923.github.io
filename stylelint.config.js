module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    // Gerekirse kuralları geçersiz kılın veya ekleyin
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'] // Eğer Tailwind vb. kullanılmıyorsa kaldırılabilir
    }],
    'declaration-block-trailing-semicolon': 'always',
    'selector-class-pattern': null, // İsimlendirme kuralı esnekliği
    'custom-property-pattern': null, // CSS değişken isimlendirme esnekliği
    'no-descending-specificity': null, // Bazen kaçınılmaz olabilir
  },
};