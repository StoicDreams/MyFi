<webui-data data-page-title="Feedback Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment elevation="10">
            <webui-flex gap="3">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-feedback.companyId" api="user/companies/options"></webui-dropdown>
                <webui-dropdown label="Domain" data-subscribe="session-domain-id|filter-feedback.domainId:loadData" data-trigger="session-domain-id|filter-feedback.domainId" data-api="filter-feedback" api="user/domains/options"></webui-dropdown>
            </webui-flex>
        </webui-page-segment>
        <webui-report label="My Feedback" api="/user/feedback" sort-column="created" bordered theme="info" data-subscribe="refresh-feedback:loadData|filter-feedback:loadData" append-columns=":Action:" filters="filter-feedback" sortable="created">
        <template slot="column" name="action">
            <webui-button theme="info" start-icon="pencil|has-shadow:true|shade:tri" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-feedback-{_ROWID}-update"></webui-button>
            <webui-button theme="danger" start-icon="circle|has-shadow:true|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-feedback-{_ROWID}-delete"></webui-button>
            <webui-dialog-action title="Update Name of {TEMPLATE_NAME}" confirm="Update Name" api="patch|/user/company" data-subscribe="page-feedback-{_ROWID}-update" data-success="refresh-feedback">
                <template>
                    <webui-page-segment>
                        Provide the new name for company {TEMPLATE_NAME}.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" value="{TEMPLATE_ID}" />
                    <webui-input-text label="Company Name" name="name" maxlength="100" value="{TEMPLATE_NAME}"></webui-input-text>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Delete Feedback" confirm="Delete Feedback" api="delete|/user/company" data-subscribe="page-feedback-{_ROWID}-delete" data-success="refresh-feedback">
                <template>
                    <webui-page-segment>
                        Please confirm you would like to delete this feedback.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" value="{TEMPLATE_ID}" />
                </template>
            </webui-dialog-action>
        </template>
        </webui-report>
    </template>
    <template slot="invalid">
        <webui-quote theme="warning">
            You must be signed in to use this service.
        </webui-quote>
    </template>
</webui-restrict-to-role>
