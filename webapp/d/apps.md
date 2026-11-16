<webui-data data-page-title="App Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment elevation="10">
            <webui-flex gap="3">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-apps.companyId" api="user/companies/options"></webui-dropdown>
                <webui-flex align="center" justify="right">
                    <webui-button data-trigger="page-app-create" data-value="1">Add App</webui-button>
                </webui-flex>
            </webui-flex>
            <webui-dialog-action title="Add App" confirm="Add App" api="post|/user/app/create" data-subscribe="page-app-create" header-message="x-debug|x-message" data-success="refresh-apps">
                <template>
                    <webui-page-segment>
                        Provide the name of the app to add. People see this name, with your company's name, when they sign in to it.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                    <webui-input-text label="App Name" name="name" placeholder="Your App Name" maxlength="100"></webui-input-text>
                    <webui-quote theme="info">
                        Note: Apps are installed programs, such as desktop apps, that sign people in to their Stoic Dreams account. Each app gets a key, which it sends in the x-app header. People approve each sign-in on StoicDreams.com, and the app only learns their account's ID and display name.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-report label="My Apps" api="/user/apps" filters="filter-apps" required-filters="companyId" sort-column="name" bordered theme="info" data-subscribe="session-company-id:loadData|refresh-apps:loadData" append-columns=":Actions:" sortable="name;sessions;created;updated">
        <template slot="column" name="actions">
            <webui-button theme="info" start-icon="pencil|shade:tri" title="Update Name" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-app-{_ROWID}-update"></webui-button>
            <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_NAME}" data-value="{TEMPLATE_ROWDATA}" data-trigger="page-app-{_ROWID}-delete"></webui-button>
            <webui-dialog-action title="Update Name of {TEMPLATE_NAME}" confirm="Update Name" api="patch|/user/app" data-subscribe="page-app-{_ROWID}-update" data-success="refresh-apps">
                <template>
                    <webui-page-segment>
                        Provide the new name for {TEMPLATE_NAME}.
                    </webui-page-segment>
                    <input type="hidden" name="appId" value="{TEMPLATE_ID}" />
                    <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                    <webui-input-text label="App Name" name="name" maxlength="100" value="{TEMPLATE_NAME}"></webui-input-text>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Delete {TEMPLATE_NAME}" confirm="Delete {TEMPLATE_NAME}" api="delete|/user/app" data-subscribe="page-app-{_ROWID}-delete" data-success="refresh-apps">
                <template>
                    <webui-page-segment>
                        Please confirm you would like to delete {TEMPLATE_NAME}.
                    </webui-page-segment>
                    <input type="hidden" name="appId" value="{TEMPLATE_ID}" />
                    <webui-quote theme="danger">
                        Note: Everyone signed in to this app is signed out, and its key stops working.
                    </webui-quote>
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
