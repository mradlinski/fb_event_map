defmodule FbEventMap.Router do
  use Plug.Router

  plug Plug.Logger
  plug CORSPlug,
    origin: Application.fetch_env!(:fb_event_map, :allowed_origin),
    headers: ["fb-token-auth" | CORSPlug.defaults()[:headers]]
  plug :match
  plug :dispatch

  forward "/events", to: FbEventMap.EventsPlug

  match _, do: send_resp(conn, 404, "Not Found")
end
