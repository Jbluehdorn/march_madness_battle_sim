import _ from 'lodash'
import BattleSimulator from './BattleSimulator'
import dice from './util/dice'
import rl from 'readline-sync'

import teams from './data/teams.json'

let teamInputs

do {
  teamInputs = [null, null]

  _.forEach(teamInputs, (team, key) => {
    let input = rl.question(`Team ${key + 1}: `)
    let teamObj = _.find(teams, ['name', input])

    if(!teamObj)
      console.log('Error: Team not found!')
    else
      teamInputs[key] = teamObj
  })

  console.log()
} while(check_null_array(teamInputs))

let simulator = new BattleSimulator(teamInputs[0], teamInputs[1])

simulator.run()

function check_null_array(arr) {
  let null_exists = false

  _.forEach(arr, el => {
    if(el === null)
      null_exists = true
  })

  return null_exists
}