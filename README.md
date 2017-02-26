# FB Event Map

A simple Elixir webservice returning Facebook events near a geographical point. This project was created mostly to learn a little bit of Elixir and Docker.

The frontend part resides on the github-pages branch of this repo.

## Technology used
- Backend
	- Elixir
	- Plug (no Phoenix - seemed overkill)
	- Redis (caching requests to Facebook API)
	- Docker / Docker Compose

- Frontend
	- JavaScript (no framework, just slightly messy vanilla JS + jQuery)
	- Google Maps

## TODO
- Proper error handling
- Tests
- Possibly some better way to deploy
- Frontend improvements (filtering events by time, people attending)
