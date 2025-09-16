.PHONY: install lint test build update 
DEFAULT_GOAL := build

install:
	@if ! command -v ./bin/golangci-lint >/dev/null 2>&1; then \
	  curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/HEAD/install.sh | sh -s v2.4.0; \
	fi
	bun install --no-audit --no-fund

lint: install 
	npx turbo lint

test: lint
	npx turbo test

build: test
	docker build -t bunderlog-forge .

dev: install
	npx turbo dev

update: install
	npx turbo update
