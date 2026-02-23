const state = new Map()

const setState = (id, data) => state.set(id, data)
const getState = (id) => state.get(id)
const clearState = (id) => state.delete(id)

module.exports = { setState, getState, clearState }