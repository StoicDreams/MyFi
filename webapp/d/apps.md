<webui-data data-page-title="App Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            Apps are programs you make that people install, such as desktop apps. Adding one gives it a key, so people can sign in to it with their Stoic Dreams account, and you can see how many computers are signed in.
        </webui-page-segment>
        <webui-page-help heading="Apps Guide" storage-key="myfi-apps-help">
            <webui-tabs theme="info">
                <webui-button slot="tabs">Getting Started</webui-button>
                <webui-content slot="content" nodetach>

1. **Pick the company** that makes the app.
2. **Add the app** with the name people should see when they sign in.
3. **Copy its key** from the App Key column into your app. The app sends it in the `x-app` header with every request.

                </webui-content>
                <webui-button slot="tabs">How Sign-In Works</webui-button>
                <webui-content slot="content" nodetach>

1. Your app starts a sign-in, and shows a short code.
2. It opens StoicDreams.com, where the person signs in and checks the code matches the one in the app.
3. Once they approve, the app receives its own session, which lasts 90 days from the last time it's used.

The app learns the person's account ID and display name, never their email or password. **Signed In** counts the computers signed in right now.

                </webui-content>
                <webui-button slot="tabs">Renaming and Deleting</webui-button>
                <webui-content slot="content" nodetach>

Renaming changes the name people see when they sign in.

Deleting an app signs out everyone signed in to it, and its key stops working. It can't be undone.

                </webui-content>
            </webui-tabs>
        </webui-page-help>
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
