use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Phone {
    pub country_code: String,
    pub number: String,
}
