use std::path::{Path, PathBuf};

use anyhow::Result;
use mistralrs::{IsqBits, ModelBuilder, RequestBuilder, TextMessageRole, TextMessages};

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
        let model = ModelBuilder::new("microsoft/Phi-3.5-MoE-instruct")
            .with_auto_isq(IsqBits::Four)
            .with_logging()
            .build()
            .await?;

        let messages = RequestBuilder::new()
            .add_message(TextMessageRole::System, system_prompt)
            .add_message(TextMessageRole::User, user_prompt)
            .set_sampler_temperature(0.3)
            .set_sampler_topp(0.85)
            .set_sampler_frequency_penalty(1.1);

        let response = model.send_chat_request(messages).await?;

        Ok(response.choices[0]
            .message
            .content
            .as_ref()
            .unwrap()
            .to_string())
    }
}

#[tokio::main]
async fn main() {
    let provider = LocalProvider {
        model_name: "".to_string(),
        model_location: "".to_string(),
    };

    let answer = provider
        .generate(
            "You are a helpful assistant".to_string(),
            "What is the capital of france".to_string(),
        )
        .await
        .unwrap();

    println!("{}", answer);
}
