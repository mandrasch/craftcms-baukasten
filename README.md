![Image CraftCMS Baukasten](CraftCMS-Baukasten.png)

# CraftCMS Baukasten

Fork of [davidhellmann/craftcms-baukasten](https://github.com/davidhellmann/craftcms-baukasten), heavily opinionated starter kit for CraftCMS Projects. Preparation for PR to add DDEV, Gitpod and GitHub Codespaces Support.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mandrasch/craftcms-baukasten-ddev/)

🚧 Status: Work in progress 🚧

## Local Development

- Requirements: [Docker runtime](https://ddev.readthedocs.io/en/stable/users/install/docker-installation/) and [DDEV](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/)
- PHP, MySQL and NodeJS configuration: `.ddev/config.yaml`

### First time setup

1. Clone the project repository to your system.
   ```sh
   git clone git@github.com:mandrasch/craftcms-baukasten-ddev.git craftcms-baukasten-ddev && cd craftcms-baukasten-ddev
   ```

2. Important: Copy `.env.ddev.example` to `.env`, Baukasten has some special env vars which can not set automatically by DDEV:
   ```sh
   cp .env.ddev.example .env
   ```

2. Start the ddev project
   ```sh
   ddev start
   ```

4. Install the Composer dependencies:
   ```sh
   ddev composer install
   ```

5. Install the NodeJS dependencies:
   ```sh
   ddev npm install
   ```

- [ ] TODO: This error occurs on M1 Mac with Puppeteer - https://blog.pt1602.de/docker/m1-ddev-chromium-npm/, fixable via https://github.com/ddev/ddev-contrib/blob/master/recipes/puppeteer-headless-chrome-support/README.md?, We currently have disabled chromium download via `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` in `.ddev/config.yaml`

6. Import the example database
    ```sh
    ddev exec 'cp seed_db.gz seed_db.sql.gz' && ddev import-db --file=seed_db.sql.gz && ddev exec 'rm seed_db.sql.gz'
    ```

- [ ] TODO: I needed to run `ddev craft up`, db dump not yet updated? Exception 'yii\web\HttpException' with message 'You need to be on at least Blitz 4.11.1 before you can update to Blitz 5.7.1.'

7. That's it. The login credentials are: `superuser:superuser`, open the login site via:
   ```sh
   ddev launch admin/
   ```

### Regular development

Run `ddev start`, open site via `ddev launch` and run `ddev npm run dev` to get started.

Further options:

- Execute craft CLI commands via `ddev craft`
- Inspect your database with `ddev sequelace` (or similiar tools). You can jump into the web container with `ddev ssh`. 
- Import and export databases via `ddev import-db --file=dump.sql.gz` or use snapshots, see [DDEV backups](https://ddev.com/blog/ddev-backups/) for more information.
- If you change your project configuration in `.ddev/config.yaml`, use `ddev restart` to apply changes. Stop your projects with `ddev stop`, or all projects with `ddev poweroff`.  
- There is also the possibility of writing pull scripts, which are executed with `ddev pull` ([example](https://github.com/mandrasch/ddev-craftcms-vite/blob/main/.ddev/providers/production.yaml)) - to pull in your latest live database and/or uploaded files.
- Check all project settings with `ddev describe`, list all projects with `ddev list`. You can also add [custom commands](https://ddev.readthedocs.io/en/stable/users/extend/custom-commands/).
- There are DDEV plugins available for [VSCode](https://marketplace.visualstudio.com/items?itemName=biati.ddev-manager) as well as [PhpStorm](https://plugins.jetbrains.com/plugin/18813-ddev-integration).

## Stack

- DDEV (Docker)
- https://github.com/ddev/ddev-redis
- https://github.com/ddev/ddev-redis-commander

## Further TODOs

- [ ] Cypress, pupeteer and DDEV - see https://github.com/ddev/ddev-contrib/pull/196 / for now we used `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` in .ddev/config.yaml. 

- [ ] Vite build fails because of critical css as well?

- [ ] husky --> needs a better switch between valet and ddev, not working yet ... 

```
Error: unknown command "npm" for "ddev"
Run 'ddev --help' for usage.
We run npm locally, no DDEV detected ...
husky - DEPRECATED
```

```
Please remove the following two lines from .husky/pre-commit:

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

They WILL FAIL in v10.0.0
```
