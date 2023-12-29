# take-home-2023-psychoplasma

A simple `cli` program that diffs the contents of the two given files and prints out the changes on `stdout`.

## Prequities

```bash
node >= 18.19.0
npm >= 10.2.5
```

## Building & Running

```bash
# build planetarium-diff package
cd ./lib

npm install

npm build

# build main project
# change dir to the root directory of the main project
cd ../

npm install

# link planetarium-diff package locally
npm link planetarium-diff

npm build

# file1 and file2 are the files to be diffed
npm node dist/src/index.js path/to/file1 path/to/file2
```

The npm package can be also uploaded and published in NPM registry by running `npm login` and `npm publish` commands in `./lib` directory.
If you pushlish the package you must install the package by `npm install -s <package name>` and skip linking part above.
