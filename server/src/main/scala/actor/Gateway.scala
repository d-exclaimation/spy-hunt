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
      gateway.State(lobbies = Seq.empty)
    )

  def cast(context: ActorContext[Msg], msg: Msg, state: State): Cast =
    Cast.NoReply(state)

  def terminate(reason: String, state: State): Unit = ()
}
