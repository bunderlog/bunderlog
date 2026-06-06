.PHONY: install update lint test dev next merge

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

next:
	git rev-parse --verify next >/dev/null 2>&1 || git branch next
	git switch next

merge:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main