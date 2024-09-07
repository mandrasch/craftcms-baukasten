#!/usr/bin/env bash

# Prepare vscode-xdebug setup
mkdir -p .vscode
cp .gitpod/templates/launch.json .vscode/.

# Workaround for Vite:
# Normally expose port 3100 for Vite in .ddev/config.yaml, but ddev-router
# is not used  on Gitpod / Codespaces, etc. The Routing is handled by Gitpod /
# Codespaces itself. Therefore we will create an additional config file for
# DDEV which will expose port 3100 without ddev-router.
cp .gitpod/templates/docker-compose.vite-workaround.yaml .ddev/.

# Start the DDEV project
export DDEV_NONINTERACTIVE=true

# important, copy env first since baukasten has some special env vars
ddev exec 'cp .env.ddev.example .env'

ddev start -y
ddev composer install
# install without peer-deeps because of puppeteer (https://blog.pt1602.de/docker/m1-ddev-chromium-npm/)
ddev npm install --ignore-scripts --legacy-peer-deps
# import dump
ddev exec 'cp seed_db.gz seed_db.sql.gz' && ddev import-db --file=seed_db.sql.gz && ddev exec 'rm seed_db.sql.gz'
