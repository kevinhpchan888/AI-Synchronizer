import assert from "node:assert/strict";
import test from "node:test";
import { checkVercelAuth } from "../src/lib/cloud.mjs";

// P-2: "vercel whoami" is a network call that used to run on every dashboard
// refresh and dominated /api/summary latency. The auth answer is cached; a
// refresh within the TTL must not hit the network again.

test("vercel auth check is cached between summary refreshes", async () => {
  let calls = 0;
  const runner = async () => {
    calls += 1;
    return { ok: true };
  };

  const first = await checkVercelAuth({ force: true, runner });
  assert.equal(first, true);
  assert.equal(calls, 1);

  // Within the TTL the cached answer is served; the runner stays untouched.
  const second = await checkVercelAuth({ runner });
  assert.equal(second, true);
  assert.equal(calls, 1);

  // A forced check refreshes the cache.
  const third = await checkVercelAuth({ force: true, runner });
  assert.equal(third, true);
  assert.equal(calls, 2);
});
