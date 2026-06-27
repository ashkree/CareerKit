use serde::{Deserialize, Serialize};

use crate::shared::{duration::Duration, link::Link};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Project {
    pub id: Option<i64>,
    pub name: String,
    pub description: String,
    pub status: String,
    pub highlights: Vec<String>,
    pub duration: Duration,
    pub links: Vec<Link>,
}
