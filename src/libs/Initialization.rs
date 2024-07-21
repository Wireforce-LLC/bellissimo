use std::collections::BinaryHeap;
use std::cmp::Ordering;
use std::sync::Mutex;

use paris::info;

use crate::{dataset_sdk, file_sdk, http_over_sdk, mongo_sdk, remote_function, statistica_sdk::{self}, widget_sdk};

type InitializationFunction = Box<dyn Fn() + Send + Sync>;

struct Task {
    priority: i32,
    name: String,
    function: InitializationFunction,
}

impl Ord for Task {
    fn cmp(&self, other: &Self) -> Ordering {
        other.priority.cmp(&self.priority) // Higher priority first
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for Task {
    fn eq(&self, other: &Self) -> bool {
        self.priority == other.priority
    }
}

impl Eq for Task {}

lazy_static::lazy_static! {
    static ref TASKS: Mutex<BinaryHeap<Task>> = Mutex::new(BinaryHeap::new());
}

pub fn add_to_stack(
    name: &str,
    priority: i32,
    function: InitializationFunction,
) -> Result<(), String> {
    info!("Adding function '{}' with priority {} to initialization stack", name, priority);

    let task = Task {
        priority,
        name: name.to_string(),
        function,
    };

    let mut tasks = TASKS.lock().map_err(|_| "Failed to acquire lock".to_string())?;
    tasks.push(task);
    Ok(())
}

pub fn initialize() {
    register_top_level_tasks();

    info!("Initializing initialization stack");
    let mut tasks = TASKS.lock().expect("Failed to acquire lock");

    while let Some(task) = tasks.pop() {
        info!("Initializing function '{}'", task.name);
        (task.function)();
    }
}

#[macro_export]
macro_rules! register_task {
    ($name:expr, $priority:expr, $func:expr) => {
        {
            use crate::initialization_sdk;
            initialization_sdk::add_to_stack($name, $priority, Box::new($func)).unwrap();
        }
    }; 
}

fn register_top_level_tasks() {
    register_task!("http_over", 1, http_over_sdk::init_func);
    register_task!("mongo", 2, mongo_sdk::init_func);
    register_task!("bfs", 4, file_sdk::init_func);
    register_task!("statistica", 5, statistica_sdk::init_func);
    register_task!("widgets_append_http_over", 6, widget_sdk::init_func);
    register_task!("remote_functions_init", 7, remote_function::init_func);
    register_task!("dataset", 8, dataset_sdk::init_func);
}