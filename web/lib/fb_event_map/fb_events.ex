defmodule FbEventMap.FbEvents do
  def get_places_with_events_at_loc(lat, lng, fb_token \\ FbEventMap.FbApi.default_fb_token()) do
    place_ids = FbEventMap.FbApi.get_place_ids_at_loc(lat, lng, fb_token)

    %{
      cached: cached,
      cached_empty_num: _,
      not_cached: not_cached
    } = get_places_from_cache(place_ids)

    {downloaded_places, empty_places} = get_places_from_api(not_cached, fb_token)

    Task.async(fn -> cache_places(downloaded_places, empty_places) end)

    downloaded_places ++ cached
  end

  defp get_places_from_cache(place_ids) do
    result = %{cached: [], cached_empty_num: 0, not_cached: []}

    Enum.reduce(place_ids, result, fn p_id, acc ->
      case FbEventMap.PlaceCache.get(p_id) do
        nil -> %{acc | not_cached: [p_id | acc.not_cached]}
        :empty -> %{acc | cached_empty_num: acc.cached_empty_num + 1}
        cache_hit -> %{acc | cached: [cache_hit | acc.cached]}
      end
    end)
  end

  defp get_places_from_api(place_ids, fb_token) do
    {places_batches, empty_batches} = place_ids
      |> Enum.chunk(50, 50, [])
      |> Enum.map(&Task.async(fn -> get_place_api_batch(&1, fb_token) end))
      |> Enum.map(&Task.await(&1, 5000))
      |> Enum.unzip

    {List.flatten(places_batches), List.flatten(empty_batches)}
  end

  defp get_place_api_batch(place_ids, fb_token) do
    {places_with_events, empty_places} =
      FbEventMap.FbApi.get_places_batch(place_ids, fb_token)
        |> Map.values
        |> Enum.split_with(&place_has_events?/1)

    {
      Enum.map(places_with_events, &FbEventMap.PlaceFormatter.format_place/1),
      Enum.map(empty_places, &(&1["id"]))
    }
  end

  defp place_has_events?(place) do
    Map.has_key?(place, "events") and Kernel.length(place["events"]["data"]) > 0
  end

  defp cache_places(places, empty_place_ids) do
    Enum.each(places, &FbEventMap.PlaceCache.save(&1));
    Enum.each(empty_place_ids, &FbEventMap.PlaceCache.save_empty(&1));
  end
end
