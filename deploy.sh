#!/usr/bin/env bash
# Deploy project to OpenWhisk (see "config/swagger.json" for details)

# Install production dependencies
npm install --production

# Package functions
zip build/postTransaction.zip "handlers/transaction.js" package.json
zip build/getTransaction.zip -r "handlers/transaction/{id}.js" package.json

# Deploy functions
wsk action create postTransaction --kind nodejs:6 build/postTransaction.zip --web true
wsk action create getTransaction --kind nodejs:6 build/getTransaction.zip --web true

# Configure API gateway
wsk api create --config-file config/swagger.json