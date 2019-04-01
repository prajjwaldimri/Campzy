#!/usr/bin/env bash

cd frontend
yarn build
gcloud app deploy app.yaml
