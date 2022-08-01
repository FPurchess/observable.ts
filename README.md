# observable.ts 🐜

![npm](https://img.shields.io/npm/v/observable.ts) ![npm bundle size](https://img.shields.io/bundlephobia/min/observable.ts) ![Coverage](https://img.shields.io/badge/coverage-100%25-green) ![License](https://img.shields.io/github/license/FPurchess/observable.ts)

A minimal reactivity library that is

- ⚡ blazing fast
- 🛡️ secure (zero third-party dependencies)
- 🐜 super slim (<4kb)
- 🔑 fully typed

## Installation

```bash
yarn add observable.ts
```

or

```bash
npm install --save observable.ts
```

or

```bash
pnpm add --save observable.ts
```

## Usage

```ts
// create the observerable with an initial value
const fontColor = new Observerable('blue');

// subscribe an observer to listen for changes of `color.value`
fontColor.subscribe((newColor: string) => console.log(newColor));

// changes to the value of color will be propagate onto all registered observers
fontColor.value = 'yellow';

// OUTPUT: "yellow"
```

For more details see the [Documentation](https://fpurchess.github.io/observable.ts/).

## License

MIT

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FFPurchess%2Fobservable.ts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FFPurchess%2Fobservable.ts?ref=badge_large)
