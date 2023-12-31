use webui::actors::fetch;

use crate::prelude::*;

use webui::prelude::serde::*;

/// Stock Images page
pub fn page_stock_images(_contexts: Contexts) -> Html {
    set_title("MyFi - Stock Images");
    html! {
        <>
            <MarkdownContent href="/d/en-US/stock_images.md" />
            <RenderStockImages />
            <NextPageButton url="/" />
        </>
    }
}

define_form!(ImageData, {
    file_name: String,
    file_path: String,
    file_type: String,
    updated: String
});

#[function_component(RenderStockImages)]
fn render_stock_images() -> Html {
    let image_data_state = use_state(Vec::<ImageData>::new);
    let page_state = use_state(|| 1usize);
    let per_page_state = use_state(|| 50usize);
    let page_count_state = use_state(|| 0usize);
    let image_data_setter = image_data_state.to_owned();

    spawn_async!({
        let loaded = image_data_setter.deref();
        if !loaded.is_empty() {
            return;
        }

        let request = FetchRequest::new(String::from("/imagedata.json"), FetchMethod::Get);
        let response = fetch(request).await;
        if !response.is_ok() {
            return;
        }
        if let Some(result) = response.get_result() {
            let data = from_json::<Vec<ImageData>>(&result);
            if let Ok(data) = data {
                image_data_setter.set(data);
            }
        }
    });
    let item_count = image_data_state.len();

    if item_count == 0 {
        return html! {};
    }

    let page = page_state.deref();
    let per_page = per_page_state.deref();
    let page_count = (item_count / per_page) + signum(item_count % per_page);

    if &page_count != page_count_state.deref() {
        page_count_state.set(page_count);
        page_state.set(1);
        return html! {};
    }

    let index_start = page_count * (page - 1);
    let index_end = if index_start + per_page >= item_count {
        item_count - (index_start + per_page)
    } else {
        index_start + per_page
    };
    let records_displayed = index_end - index_start;

    let btn_count_displayed = 10;
    let count_left = btn_count_displayed / 2;
    let mut start_count = if page_count <= btn_count_displayed {
        1
    } else if page > &count_left {
        page - count_left
    } else {
        1
    };
    let end_count = if page_count <= btn_count_displayed {
        page_count
    } else {
        page_count.min(start_count + btn_count_displayed)
    };
    if btn_count_displayed < page_count && end_count - (start_count - 1) < btn_count_displayed {
        start_count = end_count - (btn_count_displayed - 1);
    }
    let link_pages = Vec::from_iter(start_count..=end_count);
    let onclick_first = {
        let page_state = page_state.clone();
        Callback::from(move |_| {
            if *page_state > 1 {
                page_state.set(1);
            }
        })
    };
    let onclick_last = {
        let page_state = page_state.clone();
        Callback::from(move |_| {
            if *page_state < page_count {
                page_state.set(page_count);
            }
        })
    };
    let onclick_prev = {
        let page_state = page_state.clone();
        Callback::from(move |_| {
            if *page_state > 1 {
                page_state.set(*page_state - 1);
            }
        })
    };
    let onclick_next = {
        let page_state = page_state.clone();
        Callback::from(move |_| {
            if *page_state < page_count {
                page_state.set(*page_state + 1);
            }
        })
    };
    let default_button = "btn tab-button";
    let disable_next = page == &page_count;
    let disable_prev = page == &1;
    html! {
        <>
            <Paper class="d-flex flex-column gap-1 ma-2">
                <Paper class="d-flex flex-row flex-wrap gap-1 align-center justify-right pa-1 elevation-n10">
                    <Paper>{format!("Showing {} of {} Records - Page {} of {}", records_displayed, item_count, page, page_count)}</Paper>
                    <Paper class="d-flex flex-row gap-1 flex-wrap">
                        if start_count > 1 {
                            <Button class={default_button.to_string()} onclick={onclick_first}>
                                {"1"}
                            </Button>
                            if start_count > 2 {
                                <Paper>{".."}</Paper>
                            }
                        }
                        { for link_pages.to_owned().iter().map(|page_displayed| {
                            let classes = &mut Classes::new();
                            classes.push(default_button);
                            let onclick = {
                                let page_state = page_state.clone();
                                let page_displayed = page_displayed.to_owned();
                                Callback::from(move |_| {
                                    page_state.set(page_displayed.to_owned());
                                })
                            };
                            let btn_disabled = page_displayed == page;
                            html!{
                                <Button class={classes.to_string()} onclick={onclick} disabled={btn_disabled}>
                                    {page_displayed}
                                </Button>
                            }
                        }) }
                        if end_count < page_count {
                            if end_count + 1 < page_count {
                                <Paper>{".."}</Paper>
                            }
                            <Button class={default_button.to_string()} onclick={onclick_last}>
                                {page_count.to_owned()}
                            </Button>
                        }
                        <Button class={default_button.to_string()} onclick={onclick_prev} disabled={disable_prev}>
                            <i class="fa-solid fa-chevron-left" />
                        </Button>
                        <Button class={default_button.to_string()} onclick={onclick_next} disabled={disable_next}>
                            <i class="fa-solid fa-chevron-right" />
                        </Button>
                    </Paper>
                </Paper>
            </Paper>
        </>
    }
}

fn signum(number: usize) -> usize {
    if number > 0 {
        return 1;
    }
    0
}
