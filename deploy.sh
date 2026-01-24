#!/bin/bash
# Deployment preparation script

echo \"Preparing JalRakshak for deployment...\"\n\n# Create necessary directories\nmkdir -p server/uploads\n\n# Install Python dependencies\necho \"Installing Python dependencies...\"\npip install -r requirements.txt\n\n# Install Node.js dependencies\necho \"Installing Node.js dependencies...\"\nnpm ci\n\n# Build frontend\necho \"Building frontend...\"\nnpm run build\n\necho \"Deployment preparation complete!\"