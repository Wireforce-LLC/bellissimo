use std::{path::{Path, PathBuf}, sync::Arc};

use crate::config::CONFIG;

lazy_static! {
    // The absolute path of the public folder
    pub static ref PUBLIC_ABSOLUTE_FOLDER: Arc<PathBuf> = Arc::new(Path::new(CONFIG["http_server_serve_path"].as_str().unwrap()).canonicalize().unwrap());
}