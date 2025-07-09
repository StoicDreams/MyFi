<webui-data data-page-title="Company Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            <webui-flex align="center" justify="right">
                <webui-button data-trigger="page-company-create" data-value="1">Add Company</webui-button>
            </webui-flex>
            <webui-dialog-action title="Add Company" confirm="Add Company" api="post|/user/company/create" data-subscribe="page-company-create" header-message="x-debug|x-message">
                <template>
                    <webui-page-segment>
                        Provide the name of the company to add.
                    </webui-page-segment>
                    <webui-input-text label="Company Name" name="name" maxlength="100"></webui-input-text>
                    <webui-quote theme="info">
                        Note: Companies are used as a top-level grouping. Within a company you can have 1 or more domains. Domains can only belong to 1 company. Most My Fidelity resources/services are grouped under domains - such as Feedback and Newsletters. But some resources/services are grouped directly under a company - such as Short URL.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-report label="My Companies" api="/user/companies" sort-column="name" bordered theme="info">
        <template slot="column" name="action">
            <webui-button theme="info" start-icon="edit" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-company-{_ROWID}-update"></webui-button>
            <webui-button theme="danger" start-icon="ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-company-{_ROWID}-delete"></webui-button>
            <webui-dialog-action title="Update Name of {TEMPLATE_NAME}" confirm="Update Name" api="patch|/user/company" data-subscribe="page-company-{_ROWID}-update">
                <template>
                    <webui-page-segment>
                        Provide the new name for company {TEMPLATE_NAME}.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" value="{TEMPLATE_ID}" />
                    <webui-input-text label="Company Name" name="name" maxlength="100"></webui-input-text>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/company" data-subscribe="page-company-{_ROWID}-delete">
                <template>
                    <webui-page-segment>
                        Please confirm you would like to delete {TEMPLATE_NAME}.
                    </webui-page-segment>
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
