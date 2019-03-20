import _ from 'lodash'
import dice from './util/dice'

export default class BattleSimulator {
  constructor(team1, team2) {
    this.teams = new Array()

    this.teams[0] = _.clone(team1)
    this.teams[1] = _.clone(team2)
  }

  run() {
    generate_teams(this.teams)
    simulate_fight(this.teams)

    // this.print()
  }

  print() {
    _.forEach(this.teams, team => {
      console.log(team.teamMembers)
    })
  }
}

function generate_teams(teams) {
  _.forEach(teams, team => {
    let count = 17 - team.seed
    team.teamMembers = new Array()

    for(let i = 0; i < count; i++) {
      let member = create_new_team_member(team)
      member.id = i

      team.teamMembers.push(member)
    }
  })
}

function simulate_fight(teams) {
  teams = sort_teams(teams)
  let rounds = 0

  while(true) {
    if(!check_both_teams_healthy(teams))
      break

    rounds++

    console.log(`==ROUND ${rounds}==`)
    attack(teams[0], teams[1])
    console.log()
    attack(teams[1], teams[0])
    console.log()
  }

  let victor = determine_winner(teams)

  console.log('==FINAL==')
  console.log(`${victor.name} won the fight after ${rounds} rounds!`)
  console.log(`There were/was ${count_healthy(victor)} out of ${victor.teamMembers.length} ${victor.mascot}(s) remaining`)
}

function sort_teams(teams) {
  if(teams[0].speed == teams[1].speed && teams[0].seed == teams[1].seed) 
    return _.shuffle(teams)
  else
    return  _.orderBy(teams, ['speed', 'seed'], ['desc', 'asc'])
}

function attack(attackingTeam, defendingTeam) {
  _.forEach(attackingTeam.teamMembers, attacker => {
    if(!check_one_team_healthy(defendingTeam))
      return

    if(!attacker.hp <= 0) {
      let atkRoll = dice.roll(20) + (attacker.atk / 3)
      let defRoll = dice.roll(20) + (defendingTeam.def / 3)

      if(!attackingTeam.ranged && defendingTeam.airborne)
        atkRoll *= .4

      if(atkRoll > defRoll) {
        let dmg = dice.roll(6) + attacker.str
        let healthyId = pick_random_healthy_team_member_id(defendingTeam.teamMembers)

        let target = _.find(defendingTeam.teamMembers, defender => {
          return defender.id == healthyId
        })

        target.hp -= dmg

        if(target.hp < 0)
          target.hp = 0

        console.log(`${attackingTeam.mascot} #${attacker.id + 1} attacks ${defendingTeam.mascot} #${target.id + 1} and inflicts ${dmg} points of damage!`)
        if(target.hp == 0)
          console.log(`${defendingTeam.mascot} #${target.id + 1} has died.`)
        else
          console.log(`${defendingTeam.mascot} #${target.id + 1} has ${target.hp} hp remaining.`)
      } else {
        console.log(`${attackingTeam.mascot} #${attacker.id + 1} missed!`)
      }
    }
  })
}

function pick_random_healthy_team_member_id(teamMembers) {
  let critical = _.filter(teamMembers, member => {
    return member.hp <= member.maxHp * .25 && member.hp > 0
  })

  if(critical.length) 
    return _.sample(critical).id

  return _.chain(teamMembers)
            .filter(member => {
              return member.hp > 0
            })
            .sample()
            .value()
            .id
}

function check_both_teams_healthy(teams) {
  let healthy = true

  _.forEach(teams, team => {
    if(!check_one_team_healthy(team))
      healthy = false
  })

  return healthy
}

function check_one_team_healthy(team) {
  let healthy = false

  _.forEach(team.teamMembers, member => {
    if(member.hp > 0)
      healthy = true
  })

  return healthy
}

function count_healthy(team) {
  let count = 0

  _.forEach(team.teamMembers, member => {
    if(member.hp > 0) {
      count++
    }
  })

  return count
}

function determine_winner(teams) {
  let winner = null

  _.forEach(teams, team => {
    if(check_one_team_healthy(team))
      winner = team
  })

  return winner
}

function create_new_team_member(team) {
  return {
    type: team.mascot,
    atk: team.atk,
    str: team.str,
    def: team.def,
    hp: team.health * 5,
    maxHp: team.health * 5
  }
}