//
//  Agent.scala
//  spy-hunt
//
//  Created by d-exclaimation on 7:10 PM.
//


package model

import java.util.UUID

case class Agent(
  team: Int,
  key: String
) {
  def perspective(from: Int): Agent =
    Agent(
      team = if (team == Agent.NEUTRAL) Agent.NEUTRAL else if (team == from) Agent.PLAYER1 else Agent.PLAYER2,
      key = key
    )
}

object Agent {
  val NEUTRAL = 0
  val PLAYER1 = 1
  val PLAYER2 = 2

  def neutral(): Agent = apply(NEUTRAL, UUID.randomUUID().toString)

  def player1(): Agent = apply(PLAYER1, UUID.randomUUID().toString)

  def player2(): Agent = apply(PLAYER2, UUID.randomUUID().toString)
}
