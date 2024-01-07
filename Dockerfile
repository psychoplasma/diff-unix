FROM node:18.19-alpine3.17

ARG RELEASE_TAG="latest"
ARG GITHUB_REPO_URL="psychoplasma/diff-unix"
ARG SOURCE_DIR=$(pwd)/$GITHUB_REPO_URL

# Install build dependencies
RUN echo "Installing build dependencies from apt"; \
  set -eux; \
  savedAptMark="$(apt-mark showmanual)"; \
	apt-get update; \
	apt-get install -y --no-install-recommends git; \
	rm -rf /var/lib/apt/lists/*; \
  apt-get clean; \
  apt-mark auto '.*' > /dev/null; \
  [ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null

RUN echo "Clonning project" \
 && git clone $GITHUB_REPO_URL

RUN echo "Building project" \
  && set -ux \
  && cd $SOURCE_DIR \
  && cd ./lib \
  && npm install \
  && npm run build \
  && npm link \
  && cd .. \
  && npm install \
  && npm link planetarium-diff \
  && npm run build

CMD ["node", "$SOURCE_DIR/build/src/index.js", "$SOURCE_DIR/test/oldtext.txt", "$SOURCE_DIR/test/newtext.txt"]
