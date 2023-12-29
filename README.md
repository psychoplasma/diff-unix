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

npm run build

# build main project
# change dir to the root directory of the main project
cd ../

npm install

# link planetarium-diff package locally
npm link planetarium-diff

npm run build

# file1 and file2 are the files to be diffed
node dist/src/index.js path/to/file1 path/to/file2
```

The npm package can be also uploaded and published in NPM registry by running `npm login` and `npm publish` commands in `./lib` directory.
If you pushlish the package you must install the package by `npm install -s <package name>` and skip linking part above.

Example `file1` content

```bash
This part of the
document has stayed the
same from version to
version.  It shouldn't
be shown if it doesn't
change.  Otherwise, that
would not be helping to
compress the size of the
changes.

This paragraph contains
text that is outdated.
It will be deleted in the
near future.

It is important to spell
check this dokument. On
the other hand, a
misspelled word isn't
the end of the world.
Nothing in the rest of
this paragraph needs to
be changed. Things can
be added after it.
```

Example `file2` content

```bash
This is an important
notice! It should
therefore be located at
the beginning of this
document!

This part of the
document has stayed the
same from version to
version.  It shouldn't
be shown if it doesn't
change.  Otherwise, that
would not be helping to
compress the size of the
changes.

It is important to spell
check this document. On
the other hand, a
misspelled word isn't
the end of the world.
Nothing in the rest of
this paragraph needs to
be changed. Things can
be added after it.

This paragraph contains
important new additions
to this document.
```

Then the difference would be printed as follows

```bash
++  This is an important
++  notice! It should
++  therefore be located at
++  the beginning of this
++  document!
++
++
--  This paragraph contains
--  text that is outdated.
--  It will be deleted in the
--  near future.
--
--
--  check this dokument. On
--
++  check this document. On
++
--  be added after it.
++  be added after it.
++
++  This paragraph contains
++  important new additions
++  to this document.
```

The lines starting `++` would be the lines added/changed and the lines starting with `--` would be the line removed/changed.
