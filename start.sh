#!/bin/bash

# ClarityFlow - Application Startup Script
# This script starts the full ClarityFlow budget tracker application

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  ClarityFlow Budget Tracker Startup  ${NC}"
echo -e "${BLUE}======================================${NC}\n"

# Change to the project directory
cd "$SCRIPT_DIR" || {
    echo -e "${RED}Error: Could not change to project directory${NC}"
    exit 1
}

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW} Installing dependencies...${NC}"
    npm install || {
        echo -e "${RED}Error: Failed to install dependencies${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}\n"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}\n"
fi

# Check if .next build directory exists
if [ ! -d ".next" ]; then
    echo -e "${YELLOW} Building application for first time...${NC}"
    npm run build || {
        echo -e "${RED}Error: Build failed${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Build completed successfully${NC}\n"
fi

# Start the development server
echo -e "${GREEN} Starting ClarityFlow development server...${NC}\n"
echo -e "${YELLOW}Application will be available at:${NC}"
echo -e "${BLUE}➜ Local:   http://localhost:3000${NC}"
echo -e "${BLUE}➜ Network: http://$(hostname -I | awk '{print $1}'):3000${NC}\n"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}\n"
echo -e "${BLUE}======================================${NC}\n"

# Start the Next.js development server
npm run dev
