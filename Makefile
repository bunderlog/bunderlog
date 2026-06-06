.PHONY: install update lint test dev

install:
	bun install

update:
	bun upgrade
	bun update -g
	bun update

lint:
	bunx turbo run lint

test:
	bunx turbo run test

dev:
	bunx turbo run dev
