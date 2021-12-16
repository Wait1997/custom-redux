export const changed = (oldState, newState) => {
  let changed = false
  for (const key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
    }
  }
  return changed
}
