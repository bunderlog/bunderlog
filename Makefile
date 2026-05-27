.PHONY: install update next pr merge

install:
	bun install

update: 
	bunx npm-check-updates -u 
	bun install --no-audit --no-fund

next:
	git fetch origin
	@if git rev-parse --verify next >/dev/null 2>&1; then \
		git switch next; \
	elif git show-ref --verify --quiet refs/remotes/origin/next; then \
		git switch --track origin/next; \
	else \
		git switch -c next; \
	fi
	git push -u origin next

pr:
	@if ! gh pr view --head next >/dev/null 2>&1; then \
		gh pr create --base main --head next --title "next" --body "Automated PR for next branch"; \
	else \
		echo "PR for 'next' already exists"; \
	fi

merge:
	git pull origin main
	git checkout main
	git merge next
	git push -u origin main