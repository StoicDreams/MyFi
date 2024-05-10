use crate::prelude::*;

pub fn nav_menu_info() -> DrawerToggleInfo {
    DrawerToggleInfo::builder(
        |_| String::from("Navigation Menu"),
        |_| html! {FaIcon::solid("bars").to_html()},
        DynContextsHtml::new(nav_menu_render),
    )
    .set_button_class("btn toggle theme-inherit")
    .hide_header()
    .hide_footer()
    .set_drawer(Direction::Left)
    .build()
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

fn nav_menu_render(contexts: &Contexts) -> Html {
    html! {
        <>
            <Paper class="logo d-flex pa-1 justify-center ml-a mr-a">
                <AppLogo text="MyFi" />
            </Paper>
            <NavDisplay routes={get_nav_routing(contexts)} class="d-flex flex-column pa-1" />
        </>
    }
}
