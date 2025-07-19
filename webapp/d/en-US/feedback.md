<webui-data data-page-title="Feedback Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment elevation="10">
            <webui-flex gap="3">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-feedback.companyId" api="user/companies/options"></webui-dropdown>
                <webui-dropdown label="Domain" data-subscribe="session-domain-id|filter-feedback.domainId:loadData" data-trigger="session-domain-id|filter-feedback.domainId" data-api="filter-feedback" api="user/domains/options"></webui-dropdown>
            </webui-flex>
        </webui-page-segment>
        <webui-report label="My Feedback" api="/user/feedback" sort-column="created" sort-order="asc" bordered theme="info" data-subscribe="refresh-feedback:loadData|filter-feedback:loadData" append-columns=":Action:" filters="filter-feedback" required-filters="companyId;domainId" sortable="created">
        <template slot="column" name="action">
            <webui-button theme="info" start-icon="eye|has-shadow:true|ban" title="View Feedback" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-feedback-{_ROWID}-delete"></webui-button>
            <webui-dialog-action title="Feedback" confirm="Delete Feedback" api="delete|/user/feedback" data-subscribe="page-feedback-{_ROWID}-delete" data-success="refresh-feedback">
                <template>
                    <webui-page-segment>
                        <webui-code>{TEMPLATE_FULLMESSAGE}</webui-code>
                    </webui-page-segment>
                    <webui-page-segment>
                        Please confirm you would like to delete this feedback.
                    </webui-page-segment>
                    <input type="hidden" name="feedbackId" value="{TEMPLATE_ID}" />
                </template>
            </webui-dialog-action>
        </template>
        </webui-report>
        <webui-report label="Feedback Counts" api="/user/feedback/counts" sort-column="latest" sort-order="desc" bordered theme="info" data-subscribe="refresh-feedback:loadData" append-columns="" filters="" sortable="latest;domain;company;count"></webui-report>
    </template>
    <template slot="invalid">
        <webui-quote theme="warning">
            You must be signed in to use this service.
        </webui-quote>
    </template>
</webui-restrict-to-role>
