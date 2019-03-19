import _ from 'lodash'
import BattleSimulator from './BattleSimulator'

import teams from './data/teams.json'

let simulator = new BattleSimulator("team1", "team2")

simulator.test()