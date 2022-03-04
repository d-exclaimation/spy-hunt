//
//  Window.scala
//  spy-hunt
//
//  Created by d-exclaimation on 7:44 PM.
//


package model

import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._

case class Window(
  isOpen: Boolean = true,
  isTargeted: Boolean = false
) {
  def and(agent: Agent): Window.WithAgent =
    Window.WithAgent(isOpen, isTargeted, agent.team, agent.key)
}

object Window {
  case class WithAgent(
    isOpen: Boolean = true,
    isTargeted: Boolean = false,
    team: Int,
    key: String
  ) {
    def json: Json = this.asJson
  }
}