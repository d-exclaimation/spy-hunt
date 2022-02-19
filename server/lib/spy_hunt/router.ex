#
#  router.ex
#  server
#
#  Created by d-exclaimation on 14:11.
#

defmodule SpyHunt.Router do
  @moduledoc """
    HTTP based routing using Plug and Cowboy
  """
  use Plug.Router

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(:dispatch)

  get "/" do
    body =
      Jason.encode!(%{
        type: "ok",
        status: 200,
        payload: %{message: "hello world"}
      })

    conn
    |> Plug.Conn.put_resp_content_type("application/json")
    |> Plug.Conn.send_resp(200, body)
  end

  match _ do
    body = Jason.encode!(%{type: "error", status: 404, reason: ["Invalid route"]})

    conn
    |> Plug.Conn.send_resp(404, body)
  end
end
