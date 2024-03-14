use crate::prelude::*;

/// About Feedback Services page
pub fn page_feedback_services(_contexts: &Contexts) -> Html {
    set_title("MyFi - Feedback Services");
    html! {
        <>
            <MarkdownContent href="/d/en-US/about/feedback_services.md" />
            <NextPageButton url="/about/subscriptions" />
        </>
    }
}
