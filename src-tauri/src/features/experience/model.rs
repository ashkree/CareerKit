use crate::shared::{duration::Duration, location::Location};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Experience {
    pub id: Option<i64>,
    pub role: String,
    pub location: Location,
    pub company: String,
    pub description: String,
    pub highlights: Vec<String>,
    pub duration: Duration,
}
