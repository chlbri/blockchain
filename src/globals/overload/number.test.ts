import './number';

describe('numbers overload', ({ concurrent }) => {
  concurrent('percent', ({ expect }) => {
    expect((10).percent).toBe(0.1);
    expect((50).percent).toBe(0.5);
    expect((100).percent).toBe(1);
  });

  concurrent('percentS', ({ expect }) => {
    expect((10).percentS).toBe('10%');
    expect((50).percentS).toBe('50%');
    expect((100).percentS).toBe('100%');
  });
});
