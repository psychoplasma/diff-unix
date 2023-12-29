import { diffLines } from '../src/index';


describe('diff/line', () => {
  describe('#DiffLine', () => {

    it('should diff lines', () => {
      const result = diffLines(
        'line\nold value\nline',
        'line\nnew value\nline',
      );
      console.log(result);
    });

    it('should the same lines in diff', () => {
      const result = diffLines(
        'line\nvalue\nline',
        'line\nvalue\nline',
      );
      console.log(result);
    });

    it('should handle leading and trailing whitespace', () => {
      const result = diffLines(
        'line\nvalue \nline',
        'line\nvalue\nline',
      );
      console.log(result);
    });

    it('should handle windows line endings', () => {
      const result = diffLines(
        'line\r\nold value \r\nline',
        'line\r\nnew value\r\nline',
      );
      console.log(result);
    });

    it('should handle empty lines', () => {
      const result = diffLines(
        'line\n\nold value \n\nline',
        'line\n\nnew value\n\nline',
      );
      console.log(result);
    });

    it('should handle empty input', () => {
      const result = diffLines(
        'line\n\nold value \n\nline',
        '',
      );
      console.log(result);
    });

    describe('given options.maxEditLength', () => {
      it('should terminate early', () => {
        const result = diffLines(
          'line\nold value\nline',
          'line\nnew value\nline', { maxEditLength: 1 },
        );
        expect(result).toBeUndefined();
      });
    });
  });
});
