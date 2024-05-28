![Harmonify](./public/baner.png)

![Vercel](https://vercelbadge.vercel.app/api/marcinskic/harmonify)
![License](https://img.shields.io/github/license/kaczkadevteam/harmonify.svg)
![Release](https://img.shields.io/github/release/kaczkadevteam/harmonify.svg)

## Description

Web app for playing the "Name that tune" game with playlists and albums from user's Spotify collection.
**Usage is heavily limited, see [Notice](#notice).**

## Features

- Multiplayer guessing game
- Loading all of host's playlists and albums
- Host selects tracks from albums and playlists
- Game consists of multiple rounds, in each one track to guess
- Guessing done with autocomplete bar where user can search by title, author or album
- Support for keyboard only gameplay
- Points calculated based on how fast player guessed (partial points for guessing only album or artist)

## Showcase

![Selecting playlists and albums window](/public/showcase/selection.png)

</br>

![Game UI](/public/showcase/game.png)

</br>

![Guessed track modal](/public/showcase/guessed.png)

</br>

![Guessed track modal](/public/showcase/result.png)

## Notice

The app, unfortunately, will never leave development mode due to Spotify's ToS (unless I change API in the future 🫣). Therefore, player can only join existing rooms not create ones, unless you send me your email associated with Spotify account and I add it to developer dashboard.

---

### Used technologies

[<img align="left" width="26" height="26" alt="Vue.js" src="https://api.iconify.design/devicon:vuejs.svg" style="padding: 0 20px 16px 0"/>](https://vuejs.org 'Vue.js')
[<img align="left" width="26" height="26" alt="VueUse" src="https://api.iconify.design/logos:vueuse.svg" style="padding: 0 20px 16px 0"/>](https://vueuse.org 'VueUse')
[<img align="left" width="26" height="26" alt="Pinia" src="https://api.iconify.design/logos:pinia.svg" style="padding: 0 20px 16px 0"/>](https://pinia.vuejs.org 'Pinia')
[<img align="left" width="26" height="26" alt="Typescript" src="https://api.iconify.design/devicon:typescript.svg" style="padding: 0 20px 16px 0"/>](https://www.typescriptlang.org 'Typescript')
[<img align="left" width="26" height="26" alt="shadcn-vue" src="https://api.iconify.design/simple-icons:shadcnui.svg?color=%2341b883" style="padding: 0 20px 16px 0"/>](https://www.shadcn-vue.com 'shadcn-vue')
[<img align="left" width="26" height="26" alt="TailwindCSS" src="https://api.iconify.design/devicon:tailwindcss.svg" style="padding: 0 20px 16px 0"/>](https://tailwindcss.com 'TailwindCSS')
[<img align="left" width="26" height="26" alt="Vite" src="https://api.iconify.design/devicon:vitejs.svg" style="padding: 0 20px 16px 0"/>](https://vitejs.dev/ 'Vite')
[<img align="left" width="26" height="26" alt="Vitest" src="https://api.iconify.design/devicon:vitest.svg" style="padding: 0 20px 16px 0"/>](https://vitest.dev 'Vitest')
