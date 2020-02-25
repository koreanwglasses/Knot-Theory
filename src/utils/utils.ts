export function assert(clause: boolean) {
  if (!clause) throw new Error("Assertion failed");
}
