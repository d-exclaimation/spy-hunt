defmodule SpyHunt do
  @moduledoc """
  SpyHunt server.
  """
  use Application

  @spec start(any(), any()) :: {:ok, pid} | {:error, any()}
  def start(_t, _a) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: SpyHunt.Router,
        options: [
          dispatch: dispatch(),
          port: String.to_integer(System.get_env("PORT", "4000"))
        ]
      )
    ]

    Supervisor.start_link(children,
      strategy: :one_for_one,
      name: SpyHunt.Application
    )
  end

  @spec dispatch() :: [{:_, [{String.t() | atom, atom, [any]}]}]
  defp dispatch() do
    [
      {:_,
       [
         {"/ws/[...]", SpyHunt.Socket, []},
         {:_, Plug.Cowboy.Handler, {SpyHunt.Router, []}}
       ]}
    ]
  end
end
