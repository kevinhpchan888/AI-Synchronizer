import assert from "node:assert/strict";
import test from "node:test";
import { jobTargetsForMachine } from "../src/lib/hermes-worker-routing.mjs";

test("Mac Mini Hermes coordinator claims shared Hermes queues", () => {
  assert.deepEqual(jobTargetsForMachine({
    id: "machine-1",
    key: "mac-mini",
    name: "Mac Mini",
    role: "Hermes coordinator"
  }), ["mac-mini", "machine-1", "hermes"]);
});

test("non-Hermes machines do not claim Mac Mini shared queues", () => {
  assert.deepEqual(jobTargetsForMachine({
    id: "machine-2",
    key: "macbook-pro",
    name: "MacBook Pro",
    role: "workstation"
  }), ["macbook-pro", "machine-2"]);
});
