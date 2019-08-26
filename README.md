# zeit-now-dependency-error-example

This is just an example project to demonstrate an issue with dependency installs with serverless functions deployed using Zeit Now 2.0.

### What do you need to run this example?

- An API key for [browserless](https://www.browserless.io/), which is basically "puppeteer-as-a-service" (NOTE: requires \$10 USD to get started)
- Zeit Now 2.0 (get the [CLI](https://zeit.co/download) if you haven't already)

### What's the error that this example surfaces?

When one of the dependencies listed in `package.json` ([puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)) is called in the app, there is a runtime error which indicates that `puppeteer-extra-plugin-stealth` has not been successfully added to the project / installed.

Here's an image from the Zeit Now 2.0 runtime logs:

![Zeit Now 2.0 Runtime Error][logo]

[logo]: assets/DependencyErrorPuppeteerExtra.png "Zeit Now 2.0 Runtime Error"

### What does this example app do?

This app grabs lyrics from [Genius](https://genius.com/) and displays them in the browser. This is accomplished by scraping the lyrics with [puppeteer](https://github.com/GoogleChrome/puppeteer). When you're scraping, it can be advantageous to use tools like [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth), which can be optionally required in this app by changing the second argument of the scraping function from `false` to `true`. For example:

```js
const artistAndSong = "michael-jackson-thriller";
const lyrics = await getThoseLyrics(artistAndSong, false);
```

will display the lyrics for Michael Jackson's _Thriller_. Check on [Genius](https://genius.com/) to make sure the song you want is on the site, and take a look at the lyrics' URL to verify spelling, etc.

### What is the structure of the API?

It's very simple! By taking advantage of [Now 2.0 path segments](https://zeit.co/docs/v2/serverless-functions/introduction/), simply add the artist name and song name to the `api/getlyrics` route using the format:`/api/getlyrics/artistFirstName-artistLastName-songName`

to the base URL, where the words in a multi-word `songName` are seperated by dashes (`-`). For example, to get the lyrics for _The Man_ by Taylor Swift, use:

`/baseURL/api/getlyrics/taylor-swift-the-man`

### How can I run the app?

There are two ways:

1. Either run `now` and navigate to the indicated URL once the function has finished building, or run `now dev` and navigate to `localhost:3000`. Either way, append to the URL with the path segments described in the section above.

2. To just test the logic without testing the API routes, use `node localtest.js` in the project root to spin up a local node server. When you visit the link that gets spit into the console (`http://127.0.0.1:5555`), the app will go and fetch the lyrics to Frankie Lane's _Rawhide_.

### How can I break the app?

To enable `puppeteer-extra-plugin-stealth` and break the app with a runtime exception with Zeit Now 2.0, change the second argument of `getThoseLyrics()` from `false` to `true`, e.g.:

**FROM THIS**

```js
const lyrics = await getThoseLyrics(artistAndSong, false);
```

**TO THIS**

```js
const lyrics = await getThoseLyrics(artistAndSong, true);
```

Note that the `getThoseLyrics()` function appears in two files:

1. `api/getlyrics/[getlyrics].js` (setting `true` here will break `now` and `now dev`)
2. `localtest.js` (setting `true` here _won't_ break the local test)

### What should I take away from this?

Setting the second argument of `getThoseLyrics()` to `true` in `localtest.js` doesn't break the local test, so `puppeteer-extra-plugin-stealth` is enabled without issue. This indicates that the runtime error encountered with `now` and `now dev` exposes a problem specific to Now 2.0. The problem appears to be that a dependency listed in `package.json` isn't being properly installed.

### Do I really have to use Browserless?

At the time of writing, if you want to use [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth), I think [Browserless](https://www.browserless.io/) is the only option for deploying with Zeit Now 2.0.

The issue is with node runtime versions. As I noted in [this](https://github.com/berstend/puppeteer-extra/issues/59) GitHub issue, [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) package requires a node runtime of `9.11.2` or greater.

A Zeit blog post ([Serverless Chrome via Puppeteer with Now 2.0](https://zeit.co/blog/serverless-chrome)) used the lightweight chrome binary [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) to deploy Puppeteer with Now 2.0, but `chrome-aws-lambda` requires a node runtime of `8.10.x` as there is an [issue](https://github.com/alixaxel/chrome-aws-lambda/issues/37) with running on the `10.x` runtime.

So until `chrome-aws-lambda` can support the `10.x` runtime, running a chromium binary remotely with websockets using [Browserless](https://www.browserless.io/) seems like the only real option to deploy a serverless function which uses `puppeteer-extra-plugin-stealth` on Zeit Now 2.0.
