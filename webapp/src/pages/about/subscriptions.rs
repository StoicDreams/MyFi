use crate::prelude::*;

/// About Subscriptions page
pub fn page_subscriptions(_contexts: &Contexts) -> Html {
    set_title("MyFi - Subscription Management & Services");
    html! {
        <>
            <MarkdownContent href="/d/en-US/about/subscriptions.md" />
            <NextPageButton url="/about/account_services" />
        </>
    }
}
