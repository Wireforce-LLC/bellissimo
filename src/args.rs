
use clap::Parser;
use std::str::FromStr;
use crate::mode::StartupMode;

// Command line arguments
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub struct Args {
  // Mode of service
  #[arg(short, long, default_value_t = String::from("server"))]
  pub mode: String,
}

// Implement FromStr for Mode
impl FromStr for StartupMode {
  type Err = ();

  fn from_str(input: &str) -> Result<StartupMode, Self::Err> {
    match input {
      "server" => Ok(StartupMode::Server),
      "collector" => Ok(StartupMode::Background),
      "background" => Ok(StartupMode::Background),
      _  => Err(()),
    }
  }
}

// Parse launched mode
pub fn parse_launched_mode() -> StartupMode {
  let args = Args::parse();
  
  return StartupMode::from_str(args.mode.to_lowercase().as_str())
    .or_else(|_| StartupMode::from_str(std::env::var("MODE").or_else(|_| Ok::<String, String>(String::from("server"))).unwrap().as_str()))
    .expect("Invalid mode of service");
}
  