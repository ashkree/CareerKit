use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct Application {
    pub id: Option<i64>,
    pub job_title: String,
    pub job_url: String,
    pub company: String,
    pub company_website: String,
    pub status: String,
    pub date_saved: String,
    pub date_applied: String,
    pub contact: String,
    pub contact_email: String,
    pub contact_linkedin_url: String,
}
