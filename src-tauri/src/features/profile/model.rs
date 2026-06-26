use crate::shared::location::Location;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct ProfilePhone {
    pub country_code: String,
    pub number: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct ProfileLink {
    pub name: String,
    pub url: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Profile {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: ProfilePhone,
    pub location: Location,
    pub links: Vec<ProfileLink>,
    pub languages: Vec<String>,
}
