use crate::prelude::*;

/// Account Services page
pub fn page_account_services(_contexts: Contexts) -> Html {
    set_title("MyFi Account Services");
    html! {
        <>
            <MarkdownContent href="/d/en-US/about/account_services.md" />
            <NextPageButton url="/" />
        </>
    }
}
