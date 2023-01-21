import {sum} from './tes';

describe('sum', () => {
  it('should be defined', () => {
    expect(sum).toBeDefined();
  });
  it('should return 4 when fed 2 and 2', () => {
    expect(sum(2, 2)).toBe(4);
  })
})
