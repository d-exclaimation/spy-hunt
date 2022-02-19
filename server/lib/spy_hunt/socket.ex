#
#  socket.ex
#  server
#
#  Created by d-exclaimation on 14:16.
#

defmodule SpyHunt.Socket do
  @moduledoc """
    WebSocket Handler
  """
  @behaviour :cowboy_websocket

  @type state :: %{}
  @type response :: {:ok, state()} | {:reply, {:text, binary()}, state()}

  @protocol "spyhunt-ws"

  @spec init(:cowboy_req.req(), state()) :: {:cowboy_websocket, :cowboy_req.req(), state()}
  def init(%{headers: %{"sec-websocket-protocol" => protocols}} = request, _state) do
    state = %{}

    subs =
      protocols
      |> String.split(",")
      |> Enum.map(&String.trim/1)

    using_protocol? = fn subprotocol ->
      subprotocol === @protocol
    end

    with [h | t] <- subs,
         true <- Enum.any?([h | t], using_protocol?) do
      new_request = :cowboy_req.set_resp_header("sec-websocket-protocol", "#{@protocol}", request)

      {:cowboy_websocket, new_request, state}
    else
      _ ->
        {:cowboy_websocket, :cowboy_req.reply(400, request), state}
    end
  end

  @spec websocket_init(state()) :: response()
  def websocket_init(state) do
    response =
      Jason.encode!(%{
        type: "init",
        payload: %{
          id: inspect(self())
        }
      })

    IO.puts("A client connected successfully with a pid of #{inspect(self())}")
    {:reply, {:text, response}, state}
  end

  @spec websocket_handle({:text, any()}, state()) :: response()
  def websocket_handle({:text, json}, state) do
    resp = Jason.decode(json)
    IO.inspect(resp)
    {:ok, state}
  end

  @spec websocket_info(String.t(), state()) :: response()
  def websocket_info(message, state) do
    {:reply, {:text, message}, state}
  end
end
