export function assert(clause: boolean): void {
  if (!clause) throw new Error("Assertion failed");
}
