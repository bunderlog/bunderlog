.PHONY: install lint test build update 
DEFAULT_GOAL := build

install:
	@if ! command -v ./bin/golangci-lint >/dev/null 2>&1; then \
	  curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/HEAD/install.sh | sh -s v2.4.0; \
	fi
	bun install

lint: install 
	bunx turbo lint

test: lint
	bunx turbo test

build: test
	docker build -t andrewmolyuk/bunderlog:latest .

preview: 
	docker run --rm --publish 8080:8080 andrewmolyuk/bunderlog:latest

dev: install
	bunx turbo dev

update: install
	bunx turbo update
	bunx npm-check-updates -u && bun install

next:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main

clean:
	@chmod +x .scripts/clean.sh || true
	@.scripts/clean.sh
