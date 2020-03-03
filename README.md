# where-should-we-go

I chose to implement this as an JSON API using nodejs and koa. It fetches the data direct from github so you'll need internet to run it. Local mocks are used for the tests.

I've been working on php apis recently, which is why I ended up using a bit of OOP in the implementation. This is unusual for me, but I think it's worked well.

## Running

First create the .env file

```
cp .env.example .env
```

There's nothing secret here, but I have `.env` globally gitignored from the root level on my machine and I don't dare change that! Hence the need for this charade.

### With Docker

`make run`

### Without Docker

You will need node 12 and yarn installed. It will work with npm, but you won't get the benefit of the yarn.lock file

```
// install dependencies
yarn
// run app
yarn start
```

## Tests

Sorry, I didn't manage to get these running in docker (the integreation tests need fixing, localhost doesn't work) so you will need node12 and yarn or npm to run these.

```
// Run unit tests
yarn test:unit

// Run integration tests
yarn test:int

// Run all tests
yarn test
```

The integration tests work by running the app using `spawn` so don't run them at the same time as the app is running, there may be port conflicts. Also, using `--watch` for these is not recommended, I'm not sure if it will keep spinning up new processes every time.
