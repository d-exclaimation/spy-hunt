//
//  GenServer.scala
//  spy-hunt
//
//  Created by d-exclaimation on 8:40 PM.
//


package actor

import akka.actor.typed.scaladsl.{ActorContext, Behaviors}
import akka.actor.typed.{Behavior, RecipientRef}

trait GenServer[Msg, State, InitParams] {

  sealed trait Init

  object Init {
    case class Ok(state: State) extends Init

    case class Stop() extends Init
  }

  sealed trait Cast

  object Cast {
    case class NoReply(state: State) extends Cast

    case class Stop(reason: String, state: State) extends Cast
  }

  sealed trait Call[Resp]

  object Call {
    case class Reply[Resp](reply: Resp, state: State) extends Call[Resp]

    case class NoReply[Resp](state: State) extends Call[Resp]

    case class Stop[Resp](reason: String, state: State) extends Call[Resp]

    case class StopReply[Resp](reason: String, reply: Resp, state: State) extends Call[Resp]
  }

  def apply(params: InitParams): Behavior[Msg] = init(params) match {
    case Init.Ok(state) => behavior(state)
    case Init.Stop() => Behaviors.stopped
  }


  private def behavior(state: State): Behavior[Msg] =
    Behaviors.receive { (ctx, msg) =>
      cast(ctx, msg, state) match {
        case Cast.NoReply(state) =>
          behavior(state)
        case Cast.Stop(reason, state) =>
          Behaviors.stopped(() => terminate(reason, state))
      }
    }

  def call[Resp](recipientRef: RecipientRef[Resp])(func: => Call[Resp]): Cast = {
    func match {
      case Call.Reply(reply, state) =>
        recipientRef ! reply
        Cast.NoReply(state)

      case Call.StopReply(reason, reply, state) =>
        recipientRef ! reply
        Cast.Stop(reason, state)

      case Call.NoReply(state) =>
        Cast.NoReply(state)

      case Call.Stop(reason, state) =>
        Cast.Stop(reason, state)
    }
  }


  def init(params: InitParams): Init

  def cast(context: ActorContext[Msg], msg: Msg, state: State): Cast

  def terminate(reason: String, state: State): Unit
}


