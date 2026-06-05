.PHONY: install update dev

install:
	bun install

update:
	bun upgrade
	bun update -g
	bun update

dev:
	bunx turbo run dev
