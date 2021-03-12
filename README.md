# DSPGithubPages

## Github Pages Setup
### `yarn create nuxt-app` Setup
```bash
✨  Generating Nuxt.js project in DSPGithubPages
? Project name: DSPGithubPages
? Programming language: TypeScript
? Package manager: Yarn
? UI framework: Vuetify.js
? Nuxt.js modules: Axios - Promise based HTTP client, Progressive Web App (PWA)
? Linting tools: ESLint, Prettier
? Testing framework: Jest
? Rendering mode: Single Page App
? Deployment target: Static (Static/JAMStack hosting)
? Development tools: jsconfig.json (Recommended for VS Code if you're not using typescript)
? Continuous integration: None
? Version control system: None
```

### nuxt.config.js or nuxt.config.ts Setup
1. 배포 라이브러리 설치
   ```bash
   yarn add -D push-dir
   ```
1. 배포 명령어 설정
   ```json
   // package.json
   "scripts": {
     "dev": "nuxt",
     "generate": "nuxt generate",
     "start": "nuxt start",
     "deploy": "push-dir --dir=dist --branch=gh-pages --cleanup"
   },
   ```
2. 아래 내용 입력
   ```javascript
   // nuxt.config.js

   // Target: https://go.nuxtjs.dev/config-target
   target: 'static',
   router: {
     base: '/DSP.github.io/',
   },
   ```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# generate static project
$ yarn deploy
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
