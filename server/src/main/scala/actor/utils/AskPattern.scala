//
//  AskPattern.scala
//  spy-hunt
//
//  Created by d-exclaimation on 12:00 AM.
//

package actor.utils

import akka.actor.typed.scaladsl.Behaviors
import akka.actor.typed.{Behavior, RecipientRef}

object AskPattern {

  def react[Message, Resp](recipientRef: RecipientRef[Resp])(act: => (Resp, Behavior[Message])): Behavior[Message] = {
    val (resp, behavior) = act
    recipientRef ! resp
    behavior
  }

  def reply[Message, Resp](recipientRef: RecipientRef[Resp], behavior: Behavior[Message] = Behaviors.same)
    (act: => Resp): Behavior[Message] = {
    val resp = act
    recipientRef ! resp
    behavior
  }
}
