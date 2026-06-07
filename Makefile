.PHONY: install update lint test dev build next merge

install:
	bun add -g oxfmt oxlint turbo
	bun install
	turbo telemetry disable

update:
	bun upgrade
	bun update -g
	bun update

lint: install
	bunx turbo run lint

test: lint
	rm -rf coverage
	bunx turbo run test
	bun tools/merge-coverage.mjs

dev: install
	bunx turbo run dev

build: install
	rm -Rf dist
	bunx turbo run build

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
		if ! git rev-parse --verify origin/next >/dev/null 2>&1; then \
			git branch --unset-upstream next; \
			git push -u origin next; \
		fi; \
	fi

merge:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main
	sleep 1
	git fetch --prune

clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage
	rm -rf apps/web/node_modules
	rm -rf apps/web/dist
	rm -rf apps/web/coverage