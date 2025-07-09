"use strict"
{
    const content = `
<webui-report label="My Companies" api="/user/companies" sort-column="name" bordered theme="info">
<template slot="column" name="action">
    <webui-button theme="danger" start-icon="ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-company-{_ROWID}"></webui-button>
    <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/company" data-subscribe="page-company-{_ROWID}">
        <template>
            <webui-page-segment>
                Please confirm you would like to delete {TEMPLATE_NAME}.
            </webui-page-segment>
        </template>
    </webui-dialog-action>
</template>
</webui-report>
`;
    webui.define("app-my-companies", {
        content: true,
        watchVisibility: false,
        isInput: false,
        preload: '',
        constructor: (t) => { },
        flags: [],
        attr: ['height', 'max-height'],
        attrChanged: (t, property, value) => {
            switch (property) {
                case 'height':
                    t.style.height = webui.pxIfNumber(value);
                    break;
                case 'maxHeight':
                    t.style.maxHeight = webui.pxIfNumber(value);
                    break;
            }
        },
        connected: function (t) {
            t.setupComponent();
        },
        disconnected: function (t) { },
        reconnected: function (t) { },
        setupComponent: function () {
            const t = this;
            t.innerHTML = content;
        },
    });
}