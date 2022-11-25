#!/bin/bash

## migrate auth-server db
cd .. && cd auth-server && yarn && yarn migrate

## migrate node watcher
cd .. && cd node-watcher && yarn && yarn prisma:deploy

## chain-db-open-server
cd .. && cd chain-db-open-server && yarn && yarn prisma:deploy

# ## hasura
cd .. && cd hasura/hasura-migrations && hasura migrate apply && hasura metadata apply