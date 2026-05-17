import Page from '@/app/page';
import { describe, expect, it } from 'vitest';

describe('vitest smoke test', () => {
  it('discovers tests and resolves the app alias', () => {
    expect(1 + 1).toBe(2);
    expect(typeof Page).toBe('function');
  });
});
