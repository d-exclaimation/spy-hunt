//
//  Gateway.scala
//  spy-hunt
//
//  Created by d-exclaimation on 8:19 PM.
//

package actor

import actor.gateway._
import akka.actor.typed.scaladsl.ActorContext

object Gateway extends GenServer[Msg, State, Unit] {
  def init(params: Unit): Init =
    Init.Ok(
      State(lobbies = Seq.empty)
    )

  def cast(context: ActorContext[Msg], msg: Msg, state: State): Cast = msg match {
    case Msg.Join(client) =>
      val State(lobbies) = state

      lobbies.indexWhere(_.length < 2) match {
        case -1 =>
          val newLobbies = lobbies :+ Seq(client)
          Cast.NoReply(
            State(newLobbies)
          )
        case i =>
          val newLobbies = lobbies
            .zipWithIndex
            .map { case (lobby, j) =>
              if (i == j) lobby :+ client else lobby
            }
          Cast.NoReply(
            State(newLobbies)
          )
      }

    case Msg.Test =>
      println(s"$state")
      Cast.NoReply(state)
  }

  def terminate(reason: String, state: State): Unit = ()
}
