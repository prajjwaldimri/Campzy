#!/usr/bin/env bash

echo "Deploying to heroku from backend folder..."
git subtree push --prefix backend heroku master
