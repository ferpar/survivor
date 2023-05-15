# Database instructions

The postgres database is held within a docker container, it has an initialization script for creating the base table structure. In case the database has already been initialized you will notice a /data folder within this directory that holds the database files shared via a docker volume, in which case you will just need to start the container. Otherwise you will need to initialize the database (which implies also seeding the basic data).

## DB start (when already initialized)

- docker-compose up

## DB initialization

### with no available information

You should find some seed data for exchanges, assets, periods and symbols in the seeds folder, otherwise download it from the coinAPI API. Then run the following commands:

- docker-compose up --build
- node seedDatabase.js

### reset database

- sudo rm -rf data (removes data folder used to store the database files via a volume)

## Adding Market Data

This can be done via the following script (albeit modifying the source for the .json files). The table structured is meant for OHLCV gathered from the coinAPI API.

- node seedOHLCV.js
