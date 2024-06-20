FROM rust:latest

WORKDIR /usr/src/app
COPY . .

RUN cargo build --release

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/src/app/target \
    cargo build --release

# RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release


CMD ["/usr/src/app/target/release/bellissimo"]