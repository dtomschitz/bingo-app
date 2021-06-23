#!/bin/bash

if [[ -z "${NODE_VERSION}" ]]; then
  /wait && deno test ./apps/backend/tests/index.ts --allow-net --allow-env --allow-read --unstable
else
  npm run frontend:test
fi
