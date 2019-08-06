import assert from 'assertthat';

import sleep from '../../../../src/common/utils/sleep';

suite('sleep', (): void => {
  test('waits for the given amount of milliseconds.', async (): Promise<void> => {
    const start = Date.now();

    await sleep({ ms: 50 });

    const stop = Date.now();
    const duration = stop - start;

    assert.that(duration).is.atLeast(50);
  });
});
