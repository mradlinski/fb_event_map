defmodule FbEventMap.Mixfile do
  use Mix.Project

  def project do
    [app: :fb_event_map,
     version: "0.1.0",
     elixir: "~> 1.4",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type "mix help compile.app" for more information
  def application do
    # Specify extra applications you'll use from Erlang/Elixir
    [extra_applications: [:logger, :cowboy, :plug, :httpoison, :timex, :redix],
     mod: {FbEventMap.Application, []}]
  end

  # Dependencies can be Hex packages:
  #
  #   {:my_dep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:my_dep, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
  #
  # Type "mix help deps" for more examples and options
  defp deps do
    [
      {:cowboy, "~> 1.1.2"},
      {:plug, "~> 1.3.0"},
      {:httpoison, "~> 0.11.0"},
      {:poison, "~> 3.0"},
      {:cors_plug, "~> 1.2"},
      {:timex, "~> 3.0"},
      {:redix, "~> 0.5.1"}
    ]
  end
end
