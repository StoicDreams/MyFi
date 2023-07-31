use crate::prelude::*;

/// App home page
pub fn page_home(_contexts: Contexts) -> Html {
    set_title("MyFi - API Services and Content Management");
    html! {
        <>
            <MarkdownContent href="/d/en-US/home.md" />
            <NextPageButton url="/about/feedback_services" />
        </>
    }
}
