FROM rust:latest

WORKDIR /usr/src/app
COPY . .

RUN rustup override set nightly
RUN cargo build --release

CMD ["/usr/src/app/target/release/bellissimo"]