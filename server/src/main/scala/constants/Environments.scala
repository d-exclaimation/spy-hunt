//
//  Environments.scala
//  spy-hunt
//
//  Created by d-exclaimation on 2:03 PM.
//

package constants

object Environments {
  /** ENV: PORT */
  val __port__ = sys.env
    .get("PORT")
    .flatMap(_.toIntOption)
    .getOrElse(4000)

  /** ENV: RUNTIME_ENV, for checking if running on production */
  val __prod__ = sys.env
    .get("RUNTIME_ENV")
    .contains("production")

  /** ENV: ENDPOINT, for URI Endpoint for the server */
  val __endpoint__ =
    if (__prod__) sys.env.getOrElse("ENDPOINT", s"http://localhost:${__port__}")
    else s"http://localhost:${__port__}"
}