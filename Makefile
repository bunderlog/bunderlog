.PHONY: install update

install:
	bun ci

update:
	bun upgrade
	bun update -g
	bun update
