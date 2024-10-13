import isUrl from '@/common/isUrl';
import { describe, expect, it } from 'vitest';

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://www.example.com')).toBe(true);
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('https://example.com:8080')).toBe(true);
    expect(isUrl('https://example.com/path?query=1')).toBe(true);
    expect(isUrl('http://example.com#fragment')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('')).toBe(false);
    expect(isUrl('invalidurl')).toBe(false);
    expect(isUrl('example.com')).toBe(false); // missing protocol
    expect(isUrl('https://')).toBe(false);
    expect(isUrl('ftp://example.com')).toBe(false);
  });
});
