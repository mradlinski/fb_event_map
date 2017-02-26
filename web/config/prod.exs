use Mix.Config

  IO.puts(System.get_env("FB_EV_MAP_ALLOWED_ORIGIN"))

  case System.get_env("FB_EV_MAP_DEFAULT_TOKEN") do
    nil -> nil
    val -> config :fb_event_map,
      default_fb_token: val
  end

  case System.get_env("FB_EV_MAP_ALLOWED_ORIGIN") do
    nil -> nil
    val -> config :fb_event_map,
      allowed_origin: ~r/#{val}/
  end

  case System.get_env("FB_EV_MAP_PORT") do
    nil -> nil
    val -> config :fb_event_map,
      port: val
  end
