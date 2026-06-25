use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Duration {
    pub start_date: String,
    pub end_date: String,
}
