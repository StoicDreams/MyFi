pub mod account_services;
pub mod feedback_services;
pub mod subscriptions;

pub use account_services::*;
pub use feedback_services::*;
pub use subscriptions::*;

pub use crate::prelude::*;

/// About page
pub fn page_about(_contexts: Contexts) -> Html {
    set_title("About MyFi Services");
    html! {
        <>
            <MarkdownContent href="/d/en-US/about.md" />
            <NextPageButton url="/about/feedback_services" />
        </>
    }
}
