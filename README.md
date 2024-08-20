# Getting Started

**Prequisites.** Make sure you have the latest versions of [docker](https://docs.docker.com/get-docker/) and [node](https://github.com/nvm-sh/nvm) installed.

**Starting up the stack.** Most of the time, all you will need is the following command which starts up the stack and tails the output from the server/application. The first time you run this command, it will automatically initialize the database and install any additional packages required for the server.

```sh
docker compose up -d; docker compose logs -f app
```

**Connecting to the app.** You should be able to access the application through your browser at `http://localhost:3000/modqueue`. Additionally, you should be able to access a view of the database at `http://localhost:8082`.

**Taking down the stack.** Be sure the run the following command when you are done. This will stop all containers and will preserve the database between sessions.

```sh
docker compose down
```

# Useful Commands

**Soft reset.** Restarts just the container for the main applications and shows the output. Useful when the main application needs to be restarted such as when installing new packages.

```sh
docker compose restart app; docker compose logs -f app
```

**Hard reset.** Removes volumes, restarts containers, and shows output from containers. Useful whenever a fresh start is desired such as when tinkering with database initialization configuration. **Warning: This will reset any changes to the database!**

```sh
docker compose down -v; docker compose up -d; docker compose logs -f app db
```

# Production Commands

**Build production images.** Use before starting the server when the source code has been modified.

```sh
docker compose -f docker-compose-prod.yml build
```

**(Re)Build and start in production mode.** Build and start the container in production mode. Does not reset the volumes.

```sh
docker compose -f docker-compose-prod.yml up --build -d; docker compose -f docker-compose-prod.yml logs -f app
```

**Hard reset.** Restore the internal database to the initial state and restarts the server.

```sh
docker compose -f docker-compose-prod.yml down -v; docker compose -f docker-compose-prod.yml up --build -d; docker compose -f docker-compose-prod.yml logs -f app db
```

# Important Files

`./app/app/modqueue/page.tsx` - Defines the layout of the page at `/modqueue`

`./app/lib/components/modqueue/entry.tsx` - Component for rendering a single entry in the modqueue

`./app/lib/models/modqueue/entries.ts` - Backend model for accessing and updating entries in the modqueue
