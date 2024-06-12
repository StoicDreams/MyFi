use crate::prelude::*;

pub fn nav_content(contexts: &Contexts) -> Html {
    html! {
        <>
            <webui-flex justify="center" slot="header">
                <webui-stoic-dreams-logo title="MyFi Logo" text="MyFi"></webui-stoic-dreams-logo>
            </webui-flex>
            <NavDisplay routes={get_nav_routing(contexts)} class="d-flex flex-column pa-1" />
        </>
    }
}

pub(crate) fn get_nav_routing(_contexts: &Contexts) -> Vec<NavRoute> {
    let nav_routes = vec![
        NavLinkInfo::link(
            "Home",
            "/",
            &FaIcon::duotone("house"),
            roles::PUBLIC,
            page_home,
        ),
        NavLinkInfo::link(
            "About",
            "/about",
            &FaIcon::duotone("circle-info"),
            roles::PUBLIC,
            page_about,
        ),
        NavGroupInfo::link(
            "Stoic Dreams Admin",
            &FaIcon::duotone("jedi"),
            roles::SITE_ADMIN,
            vec![NavLinkInfo::link(
                "Stock Images",
                "/stock_images",
                &FaIcon::duotone("images"),
                roles::SITE_ADMIN,
                page_stock_images,
            )],
        ),
        NavGroupInfo::link(
            "Coming Soon",
            &FaIcon::duotone("person-chalkboard"),
            roles::PUBLIC,
            vec![
                NavLinkInfo::link(
                    "Account Services",
                    "/about/account_services",
                    &FaIcon::duotone("users-viewfinder"),
                    roles::PUBLIC,
                    page_account_services,
                ),
                NavLinkInfo::link(
                    "Feedback Services",
                    "/about/feedback_services",
                    &FaIcon::duotone("comment-smile"),
                    roles::PUBLIC,
                    page_feedback_services,
                ),
                NavLinkInfo::link(
                    "Subscriptions",
                    "/about/subscriptions",
                    &FaIcon::duotone("conveyor-belt-boxes"),
                    roles::PUBLIC,
                    page_subscriptions,
                ),
            ],
        ),
        NavLinkInfo::link(
            "Terms",
            "/terms",
            &FaIcon::duotone("handshake"),
            roles::PUBLIC,
            starter_page_terms,
        ),
        NavLinkInfo::link(
            "Privacy",
            "/privacy",
            &FaIcon::duotone("shield-exclamation"),
            roles::PUBLIC,
            starter_page_privacy,
        ),
    ];
    nav_routes
}
