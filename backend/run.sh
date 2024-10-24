#!/bin/zsh

export FLASK_APP=app
export FLASK_RUN_PORT=5001
export FLASK_RUN_HOST=0.0.0.0

flask run --debug
