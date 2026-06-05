FROM debian:stable-slim

# Install necessary packages for development (non-interactive)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git gnupg openssh-client curl make nodejs zsh unzip ca-certificates

# Clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Create a non-root user for development
RUN useradd --create-home --user-group --shell /bin/zsh dev
USER dev
WORKDIR /home/dev

# Install Bun for the dev user
ENV BUN_INSTALL=/home/dev/.bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"
RUN curl -fsSL https://bun.sh/install | bash \
	&& ln -sf "${BUN_INSTALL}/bin/bun" "${BUN_INSTALL}/bin/bunx"

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true

# Install global npm packages
RUN bun add -g oxfmt turbo
