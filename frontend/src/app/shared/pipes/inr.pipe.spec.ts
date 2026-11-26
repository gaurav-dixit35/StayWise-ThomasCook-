import { InrPipe } from './inr.pipe';

describe('InrPipe', () => {
  const pipe = new InrPipe();

  it('formats Indian rupees with Indian digit grouping', () => {
    expect(pipe.transform(1234567.5)).toBe('₹12,34,567.50');
  });

  it('returns a dash for absent or non-finite prices', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(undefined)).toBe('—');
    expect(pipe.transform(Number.NaN)).toBe('—');
  });
});
