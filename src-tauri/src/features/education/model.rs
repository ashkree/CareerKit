use serde::{Deserialize, Serialize};

use crate::{features::skills::Skill, shared::{duration::Duration, location::Location}};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Education {
    pub id: Option<i64>,
    pub school: String,
    pub qualification: String,
    pub specializations: Vec<String>,
    pub duration: Duration,
    pub location: Location,
    pub coursework: Vec<String>,
    pub skills: Vec<Skill>,
}
