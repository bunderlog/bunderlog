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
	@if ! git rev-parse --verify next >/dev/null 2>&1; then \
		if git rev-parse --verify origin/next >/dev/null 2>&1; then \
			git checkout --track origin/next; \
		else \
			git branch next; \
			git switch next; \
			git push -u origin next; \
		fi; \
	else \
		git switch next; \
	fi

merge:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main
	sleep 1
	git fetch --prune