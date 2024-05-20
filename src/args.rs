#[path = "dto/mode.rs"] mod mode;

use clap::Parser;
use std::str::FromStr;

/**
 * Command line arguments
 */
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub struct Args {
  /// Mode of service
  #[arg(short, long, default_value_t = String::from("server"))]
  pub mode: String,

  /// Allow robots.txt
  #[arg(short = 'r', long, default_value_t = false)]
  pub disable_robots: bool,

  /// Allow API access
  #[arg(short = 'a', long, default_value_t = false)]
  pub disable_api: bool,

  /// Allow API access
  #[arg(short = 'p', long, default_value_t = false)]
  pub disable_postbacks: bool,
}

/**
 * Convert string to enum
 */
impl FromStr for mode::Mode {
  type Err = ();

  fn from_str(input: &str) -> Result<mode::Mode, Self::Err> {
    match input {
      "server" => Ok(mode::Mode::Server),
      "client" => Ok(mode::Mode::Client),
      "collector" => Ok(mode::Mode::Collector),
      _  => Err(()),
    }
  }
}

pub fn parse_and_make() -> (Args, i8) {
  let args = Args::parse();
  let mode_of_service = mode::Mode::from_str(args.mode.to_lowercase().as_str())
    .expect("Invalid mode of service");

  match mode_of_service {
    mode::Mode::Server => {
      return (args, 1);
    }

    mode::Mode::Client => {
      return (args, 2);
    }

    mode::Mode::Collector => {
      return (args, 3);
    }
  }
  
}
  