# Planner 
FROM rust as planner
WORKDIR /usr/src/app
RUN cargo install cargo-chef 
COPY Cargo.toml Cargo.lock .cargo user_agents config.toml /usr/src/app/
COPY src/ /usr/src/app/src/
RUN cargo chef prepare  --recipe-path recipe.json

# Cacher
FROM rust as cacher
WORKDIR /usr/src/app
RUN cargo install cargo-chef
COPY --from=planner /usr/src/app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

# Builder
FROM rust as builder
WORKDIR /usr/src/app
COPY Cargo.toml Cargo.lock .cargo user_agents config.toml /usr/src/app/
COPY src/ /usr/src/app/src/
# Copy over the cached dependencies
COPY --from=cacher /usr/src/app/target target
RUN cargo build --release

# Runtime
FROM rust as runtime
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/release/bellissimo /usr/local/bin
ENTRYPOINT ["/usr/local/bin/bellissimo"]
