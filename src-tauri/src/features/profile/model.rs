use crate::shared::link::Link;
use crate::shared::location::Location;
use crate::shared::phone::Phone;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Profile {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Phone,
    pub location: Location,
    pub links: Vec<Link>,
    pub languages: Vec<String>,
}
