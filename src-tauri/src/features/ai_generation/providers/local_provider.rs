use anyhow::Result;
use mistralrs::{IsqBits, ModelBuilder, TextMessages};
use serde::{Deserialize, Serialize};
use std::num::NonZeroU32;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct LocalProvider {
    model_location: String,
    model_name: String,
}

impl LocalProvider {
    /// Builds the full path to the model file from the two parts.
    fn model_path(&self) -> PathBuf {
        Path::new(&self.model_location).join(&self.model_name)
    }

    /// Returns true if the model file exists on disk.
    fn check_model_exists(path: &Path) -> Result<bool> {
        Ok(path.try_exists()?)
    }

    async fn generate(&self, system_prompt: String, user_prompt: String) -> Result<String> {
        let model = ModelBuilder::new("Qwen/Qwen3-4B")
            .with_auto_isq(IsqBits::Four)
            .with_logging()
            .build()
            .await?;

        let messages = TextMessages::new()
            .add_message(mistralrs::TextMessageRole::System, system_prompt)
            .add_message(mistralrs::TextMessageRole::User, user_prompt);

        let response = model.send_chat_request(messages).await?;

        Ok(response.choices[0]
            .message
            .content
            .as_ref()
            .unwrap()
            .to_string())
    }
}

#[cfg(test)]
mod test {

    use super::*;
}
