# diff-unix

A simple `cli` program that diffs the contents of the two given files and prints out the changes on `stdout`.

## Prerequisites

```bash
node >= 18.19.0
npm >= 10.2.5
```

## Building & Running

### Locally

```bash
# build diff-unix package
cd ./lib

npm install

npm run build

npm link

# build main project
# change dir to the root directory of the main project
cd ../

npm install

# link diff-unix package locally
npm link diff-unix

npm run build

# file1 and file2 are the files to be diffed
node build/src/index.js path/to/file1 path/to/file2
```

### By using Docker

```bash
# Build the docker image
docker build -t diff-unix .

# Run with the default test files
docker run -ti --rm diff-unix

# Run with the specified input files by mounting a volume
docker run -v local/path/to/test/files:/test -ti --rm diff-unix /test/file1.txt /test/file2.txt
```

#### Docker example with specified input files

```bash
@user1~ cd ~ && mkdir test_files

# Create a test file
@user1~ vi ./test_files/test1.dat
> test is an important matter
> it should be taken seriously
> 
> Sincerely, bye!

# Crete another test file
@user1~ vi ./test_files/test2.dat
> test is important matter
> it should be taken seriously
>
> Sincerely, bye!
>
> PS: This is not a joke

@user1~ pwd
> /home/user1/

# Run the container with the test files created above
@user1~ docker run  -v /home/user1/test_files:/test -ti --rm diff-unix /test/test1.dat /test/test2.dat
> --  test is an important matter
> --
> ++  test is important matter
> ++
> ++
> ++  PS: This is not a joke
> ++
```

## Publishing on NPM

The npm package can be also uploaded and published in NPM registry by running `npm login` and `npm publish` commands in `./lib` directory.
If you pushlish the package you must install the package by `npm install -s <package name>` and skip linking part above.

## Example ouptut for given input

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
++  check this document. On
++
++
++  This paragraph contains
++  important new additions
++  to this document.
```

The lines starting `++` would be the lines added/changed and the lines starting with `--` would be the line removed/changed.
