import { NightsPipe } from './nights.pipe';

describe('NightsPipe', () => {
  const pipe = new NightsPipe();

  it('uses singular only for one night', () => {
    expect(pipe.transform(1)).toBe('1 night');
    expect(pipe.transform(2)).toBe('2 nights');
    expect(pipe.transform(0)).toBe('0 nights');
  });

  it('returns an empty string for absent or non-finite values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(Number.POSITIVE_INFINITY)).toBe('');
  });
});
