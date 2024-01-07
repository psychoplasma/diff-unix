FROM node:18.19-alpine3.17

RUN echo "Installing build dependencies" \
  && set -eux \
	&& apk update \
	&& apk add git

RUN echo "Clonning project" \
 && git clone "https://github.com/psychoplasma/diff-unix.git"

RUN echo "Building project" \
  && set -eux \
  && cd "diff-unix" \
  && cd ./lib \
  && npm install \
  && npm run build \
  && npm link \
  && cd .. \
  && npm install \
  && npm link diff-unix \
  && npm run build

# Make directory for test files to be mounted from outside
RUN mkdir /test

VOLUME /test

ENTRYPOINT [ "node", "diff-unix/build/src/index.js"]
CMD ["diff-unix/test/oldtext.txt", "diff-unix/test/newtext.txt"]
