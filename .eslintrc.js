module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'vue/singleline-html-element-content-newline': 'off', // https://eslint.vuejs.org/rules/singleline-html-element-content-newline.html
    'vue/no-v-html': 'off', // This rule reports all uses of v-html directive in order to reduce the risk of injecting potentially unsafe / unescaped html into the browser leading to Cross-Site Scripting (XSS) attacks.
    'comma-dangle': ['error', 'always-multiline'], // *conlict prettier, ref : https://eslint.org/docs/rules/comma-dangle
    'space-before-function-paren': ['error', 'never'], // *conlict prettier, ref : https://eslint.org/docs/rules/space-before-function-paren
  },
}
