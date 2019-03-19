import _ from 'lodash'

export default {
  roll(sides) {
    return _.random(1, sides)
  }
}