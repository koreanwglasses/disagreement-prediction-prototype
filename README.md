# Useful Commands

Removes volumes, restarts containers, and shows output from containers. Useful whenever a fresh start is desired such as when tinkering with database initialization configuration.

```sh
docker compose down -v; docker compose up -d; docker compose logs -f app db
```


Restarts just the container for the main applications and shows the output. Useful when the main application needs to be restarted such as when installing new packages.

```sh
docker compose restart app; docker compose logs -f app
```