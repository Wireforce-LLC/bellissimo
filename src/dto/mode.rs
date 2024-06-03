use std::fmt;

pub enum StartupMode {
    Server,
    Background
}

impl fmt::Display for StartupMode {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // implement how you want the Mode to be displayed
        match self {
            StartupMode::Server => write!(f, "Server"),
            StartupMode::Background => write!(f, "Background"),
        }
    }
}