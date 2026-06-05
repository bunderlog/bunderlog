FROM oven/bun:1

# Install necessary packages for development (non-interactive).
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git gnupg openssh-client curl make nodejs zsh ca-certificates

# Clean up apt cache to reduce image size.
RUN rm -rf /var/lib/apt/lists/*

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true

# Install oxfmt globally using bun
RUN bun install -g oxfmt npm-check-updates
