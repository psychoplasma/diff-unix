// LinkedList node for diff component
export interface Component {
  prev: Component | undefined;
  added?: boolean;
  removed?: boolean;
  count: number;
  value?: string;
};

interface Path {
  oldPos: number;
  lastComponent: Component | undefined;
};

export default class Diff {
  useLongestToken: boolean = true;

  diff (oldString, newString): Array<Component> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));

    const newLen = newString.length;
    const oldLen = oldString.length;
    let editLength = 1;
    const maxEditLength = newString.length + oldString.length;

    const bestPath: Array<Path> = [{ oldPos: -1, lastComponent: undefined }];

    // Seed editLength = 0, i.e. the content starts with the same values
    let newPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      // Identity per the equality and tokenizer
      return [{ value: this.join(newString), count: newString.length }] as Array<Component>;
    }

    // Main worker method. Checks all permutations of a given edit length for acceptance.
    function execEditLength () {
      for (let diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        let basePath: Path;
        const removePath = bestPath[diagonalPath - 1];
        const addPath = bestPath[diagonalPath + 1];

        if (removePath) {
          // No one else is going to attempt to use this value, clear it
          delete bestPath[diagonalPath - 1];
        }

        let canAdd = false;
        if (addPath) {
          // what newPos will be after we do an insertion:
          const addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }

        const canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          delete bestPath[diagonalPath];
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the old string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canRemove || (canAdd && removePath.oldPos + 1 < addPath.oldPos)) {
          basePath = self.addToPath(addPath, true, undefined, 0);
        } else {
          basePath = self.addToPath(removePath, undefined, true, 1);
        }

        newPos = self.extractCommon(basePath, newString, oldString, diagonalPath);

        // If we have hit the end of both strings, then we are done
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return buildValues(self, basePath.lastComponent as Component, newString, oldString, self.useLongestToken);
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    }

    // Performs the length of edit iteration. Loops over execEditLength until a value
    // is produced, or until the edit length exceeds options.maxEditLength (if given),
    // in which case it will return undefined.
    while (editLength <= maxEditLength) {
      const ret = execEditLength();
      if (ret) {
        return ret;
      }
    }
  }

  addToPath (path: Path, added: boolean | undefined, removed: boolean | undefined, oldPosInc): Path {
    const last = path.lastComponent;
    if (last && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: last.count + 1,
          added: added,
          removed: removed,
          prev: last.prev,
        } as Component,
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: 1,
          added: added,
          removed: removed,
          prev: last,
        } as Component,
      };
    }
  }

  extractCommon (basePath: Path, newString: string, oldString: string, diagonalPath: number): number {
    const newLen = newString.length;
    const oldLen = oldString.length;
    let oldPos = basePath.oldPos;
    let newPos = oldPos - diagonalPath;
    let commonCount = 0;

    while (newPos + 1 < newLen
      && oldPos + 1 < oldLen
      && this.equals(newString[newPos + 1], oldString[oldPos + 1])
    ) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.lastComponent = {
        count: commonCount,
        prev: basePath.lastComponent as Component,
      };
    }

    basePath.oldPos = oldPos;
    return newPos;
  }

  equals (left, right) {
    return left === right;
  }

  removeEmpty (array: []) {
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  }

  tokenize (value) {
    return value.split('');
  }

  join (chars) {
    return chars.join('');
  }
}

function buildValues (diff, lastComponent: Component, newString, oldString, useLongestToken?: boolean) {
  // First we convert our linked list of components
  // in reverse order to an array in the right order
  const components: Array<Component> = [];
  let nextComponent;
  while (lastComponent) {
    components.push(lastComponent);
    nextComponent = lastComponent.prev;
    delete lastComponent.prev;
    lastComponent = nextComponent;
  }
  components.reverse();

  let componentPos = 0;
  const componentLen = components.length;
  let newPos = 0;
  let oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    const component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        let value = newString.slice(newPos, newPos + component.count);
        value = value.map((value, i) => {
          const oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });

        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }
      newPos += component.count;

      // Common case
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;

      // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.
      if (componentPos && components[componentPos - 1].added) {
        const tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  }

  // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.
  const finalComponent = components[componentLen - 1];
  if (componentLen > 1
      && typeof finalComponent.value === 'string'
      && (finalComponent.added || finalComponent.removed)
      && diff.equals('', finalComponent.value)) {
    components[componentLen - 2].value += finalComponent.value;
    components.pop();
  }

  return components;
}
