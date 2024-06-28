# FROM rust AS build

# # Capture dependencies
# COPY Cargo.toml Cargo.lock .cargo user_agents config.toml /usr/src/app/
# COPY src/ /usr/src/app/src/
# COPY containers/ /usr/src/app/containers/

# WORKDIR /usr/src/app/

# RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

# RUN --mount=type=cache,target=/usr/local/cargo/registry <<EOF
#   touch /usr/src/app/Cargo.toml
#   cargo build --release
# EOF

# CMD ["/usr/src/app/target/release/bellissimo"]


# Planner 
FROM rust as planner
WORKDIR /usr/src/app
RUN cargo install cargo-chef 
COPY Cargo.toml Cargo.lock .cargo user_agents config.toml /usr/src/app/
COPY src/ /usr/src/app/src/
COPY containers/ /usr/src/app/containers/
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
COPY containers/ /usr/src/app/containers/
# Copy over the cached dependencies
COPY --from=cacher /usr/src/app/target target
RUN cargo build --release

# Runtime
FROM rust as runtime
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/release/bellissimo /usr/local/bin
ENTRYPOINT ["/usr/local/bin"]

# CMD ["/usr/src/app/target/release/bellissimo"]

# # FROM rust:latest

# # WORKDIR /usr/src/app
# # COPY . .

# # RUN cargo build --release

# # RUN --mount=type=cache,target=/usr/local/cargo/registry \
# #     --mount=type=cache,target=/usr/src/app/target \
# #     cargo build --release

# # # RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release


# # CMD ["/usr/src/app/target/release/bellissimo"]
