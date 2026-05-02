#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Tauri dev and measuring compilation time...${NC}"

# Record start time in milliseconds
START_TIME=$(date +%s%3N)

# Start npm run tauri dev and pipe output to both terminal and a temporary log
# We look for common "ready" markers in the output.
# Adjust the pattern if your specific setup outputs something different when ready.
# Common markers: 
# - "Ready in" (Next.js/Turbopack)
# - "Running dev command" (Tauri)
# - "[tauri] Started dev server"

READY_MARKER="Running dev command"

npm run tauri dev | tee >(while read line; do
    echo "$line"
    if [[ "$line" == *"$READY_MARKER"* ]]; then
        END_TIME=$(date +%s%3N)
        ELAPSED=$((END_TIME - START_TIME))
        SECONDS=$(echo "scale=3; $ELAPSED / 1000" | bc)
        echo -e "\n${GREEN}========================================${NC}"
        echo -e "${GREEN}TAURI READY IN: $SECONDS seconds${NC}"
        echo -e "${GREEN}========================================${NC}\n"
    fi
done)
