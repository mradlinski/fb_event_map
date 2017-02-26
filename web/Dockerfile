FROM elixir:1.4.2

ARG mix_env

ENV MIX_ENV $mix_env

RUN apt-get -y update && apt-get install -y erlang-dev erlang-parsetools

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN mix do local.hex --force, local.rebar --force
COPY mix.exs /usr/src/app/
COPY mix.lock /usr/src/app/
RUN mix do deps.get, deps.compile

COPY . /usr/src/app
RUN mix compile

CMD ["mix", "run", "--no-halt"]
