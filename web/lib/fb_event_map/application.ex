defmodule FbEventMap.Application do
  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    # Define workers and child supervisors to be supervised
    children = [
      Plug.Adapters.Cowboy.child_spec(
        :http,
        FbEventMap.Router,
        [],
        port: Application.fetch_env!(:fb_event_map, :port)
      ),
      worker(Redix, [[host: "redis"], [name: :redix]])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: FbEventMap.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
