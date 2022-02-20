//
//  GenServer.scala
//  spy-hunt
//
//  Created by d-exclaimation on 8:40 PM.
//


package actor

import akka.actor.typed.scaladsl.{ActorContext, Behaviors}
import akka.actor.typed.{Behavior, RecipientRef}

/**
 * A GenServer is a process (Actor) and it can be used to keep state, execute code asynchronously and so on.
 * The advantage of using a generic server process (GenServer) implemented using this module is that it will have a standard set of interface functions.
 *
 * @tparam Msg        Message type
 * @tparam State      State type
 * @tparam InitParams Initial parameter type
 */
trait GenServer[Msg, State, InitParams] {

  /** Initial returned value */
  sealed trait Init

  object Init {
    /** Valid initialization */
    case class Ok(state: State) extends Init

    /** Invalid initialization */
    case class Stop() extends Init
  }

  /** On message non-replying returned value */
  sealed trait Cast

  object Cast {
    /** No reply with a new state */
    case class NoReply(state: State) extends Cast

    /** Stopping server with a reason and a new state */
    case class Stop(reason: String, state: State) extends Cast
  }

  /** On message replying returned value */
  sealed trait Call[Resp]

  object Call {
    /** Reply with value and a new state */
    case class Reply[Resp](reply: Resp, state: State) extends Call[Resp]

    /** No reply with a new state */
    case class NoReply[Resp](state: State) extends Call[Resp]

    /** Stopping server with a reason and a new state */
    case class Stop[Resp](reason: String, state: State) extends Call[Resp]

    /** Stopping server with a reason and a new state, while also replying */
    case class StopReply[Resp](reason: String, reply: Resp, state: State) extends Call[Resp]
  }

  def apply(params: InitParams): Behavior[Msg] = init(params) match {
    case Init.Ok(state) => behavior(state)
    case Init.Stop() => Behaviors.stopped
  }


  /**
   * Akka functional behavior
   *
   * @param state Current state
   * @return a new behavior with new state
   */
  private def behavior(state: State): Behavior[Msg] =
    Behaviors.receive { (ctx, msg) =>
      cast(ctx, msg, state) match {
        case Cast.NoReply(state) =>
          behavior(state)
        case Cast.Stop(reason, state) =>
          Behaviors.stopped(() => terminate(reason, state))
      }
    }

  /**
   * Invoked to handle synchronous messages from `cast`
   *
   * @param recipientRef Recipient of reply
   * @param func         Function returning Call returned value
   * @tparam Resp Reply type
   * @return a Cast returned value
   */
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

  /**
   * Invoked when the server is started
   *
   * @param params Initial parameters from `apply`
   * @return Initial returned value
   */
  def init(params: InitParams): Init

  /**
   * Invoked to handle asynchronous messages
   *
   * @param context Actor context
   * @param msg     Message incoming
   * @param state   Current state
   * @return a Cast returned value
   */
  def cast(context: ActorContext[Msg], msg: Msg, state: State): Cast

  /**
   * Invoked when the server is stopped
   *
   * @param reason Reason given
   * @param state  Last state
   */
  def terminate(reason: String, state: State): Unit
}


