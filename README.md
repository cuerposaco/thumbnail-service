# thumbnail-service

API REST server to generate thumbnails in tasks from any image uploaded or requested

## Requirements
- NodeJS
- npm
- Docker
- Docker Compose

## Installation
```bash
git clone https://github.com/cuerposaco/thumbnail-service.git
cd thumbnail-service
```

## Running Environment
```bash
# or run docker-compose environment
docker-compose up
# or run in background
docker-compose up -d
```

## Running Tests
```bash
# install dependencies locally
npm install
# run mongodb container
docker-compose up mongo
# run tests
npm test
```
