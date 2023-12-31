module.exports.removeElementFromArray = (index, state, setState) => {
  setState(state.filter((_, i) => i!== index))
}