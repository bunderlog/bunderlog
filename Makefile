.PHONY: install lint test build update 
DEFAULT_GOAL := build

install:
	bun install --no-audit --no-fund 

lint: install 
	npx turbo lint

test: lint
	npx turbo test

build: test
	npx turbo build

dev: install
	npx turbo dev

update: install
	npx turbo update
