use crate::prelude::*;

pub fn nav_menu_info() -> DrawerToggleInfo {
    DrawerToggleInfo::builder(
        "Navigation Menu",
        || html! {<i class="fa-solid fa-bars"></i>},
        DynHtml::new(nav_menu_render),
    )
    .set_button_class("btn toggle theme-inherit")
    .hide_header()
    .hide_footer()
    .set_drawer(Direction::Left)
    .build()
}

pub(crate) fn get_nav_routing() -> Vec<NavRoute> {
    let nav_routes = vec![
        NavLinkInfo::link("Home", "/", "fa-duotone fa-house", roles::PUBLIC, page_home),
        NavLinkInfo::link(
            "About",
            "/about",
            "fa-duotone fa-circle-info",
            roles::PUBLIC,
            page_about,
        ),
        NavGroupInfo::link(
            "Coming Soon",
            "fa-duotone fa-person-chalkboard",
            roles::PUBLIC,
            vec![
                NavLinkInfo::link(
                    "Feedback Services",
                    "/about/feedback_services",
                    "fa-duotone fa-comment-smile",
                    roles::PUBLIC,
                    page_feedback_services,
                ),
                NavLinkInfo::link(
                    "Account Services",
                    "/about/account_services",
                    "fa-duotone fa-users-viewfinder",
                    roles::PUBLIC,
                    page_account_services,
                ),
            ],
        ),
        NavLinkInfo::link(
            "Terms",
            "/terms",
            "fa-duotone fa-handshake",
            roles::PUBLIC,
            starter_page_terms,
        ),
        NavLinkInfo::link(
            "Privacy",
            "/privacy",
            "fa-duotone fa-shield-exclamation",
            roles::PUBLIC,
            starter_page_privacy,
        ),
    ];
    nav_routes
}

fn nav_menu_render() -> Html {
    html! {
        <>
            <Paper class="d-flex pa-1 justify-center">
                <img src="Logo.svg" title="Web UI Logo" />
            </Paper>
            <NavDisplay routes={get_nav_routing()} class="d-flex flex-column pa-1" />
        </>
    }
}
