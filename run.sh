#!/bin/bash

set -e

docker run \
-u "$(id -u):$(id -g)" -it --rm \
-e HOME=/workspace \
-v "$(pwd)":/workspace -w /workspace \
node:21-bullseye "$@"
