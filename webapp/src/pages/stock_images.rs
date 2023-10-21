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
    let image_data = use_state(Vec::<ImageData>::new);

    let image_loader = image_data.to_owned();
    spawn_async!({
        let loaded = image_loader.deref();
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
                image_loader.set(data);
            }
        }
    });

    html! {
        <>
        </>
    }
}
