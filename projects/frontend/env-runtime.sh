#!/bin/sh
if [ -z "$SERVER_ENDPOINT" ]; then
    SERVER_ENDPOINT_VALUE=http://localhost:5000/
else
    SERVER_ENDPOINT_VALUE=$SERVER_ENDPOINT
fi

ENV_CONFIG=./env-config.js

rm -rf $ENV_CONFIG
touch $ENV_CONFIG

echo "window._env_ = {" >> $ENV_CONFIG
echo "  SERVER_ENDPOINT: \"$SERVER_ENDPOINT_VALUE\"," >> $ENV_CONFIG
echo "}" >> $ENV_CONFIG

nginx -g "daemon off;"