FROM ubuntu:22.04

# Install necessary packages for development (non-interactive).
RUN apt-get update \
	&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
		git gnupg openssh-client curl make bash nodejs zsh ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Create a non-root user for development and ensure home directory exists.
RUN useradd -m -s /bin/zsh dev && chown -R dev:dev /home/dev
USER dev
WORKDIR /home/dev

# Install Oh My Zsh for dev user (non-fatal if it exits non-interactively).
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true

# Set environment variables for Bun installation and usage.
ENV BUN_INSTALL=/home/dev/.bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

# Install Bun for the dev user so bun/bunx are available in interactive shells.
RUN curl -fsSL https://bun.sh/install | bash || true

# Bun installer currently only places `bun`; add a `bunx` compatibility entrypoint.
RUN ln -sf "${BUN_INSTALL}/bin/bun" "${BUN_INSTALL}/bin/bunx" || true
