<webui-data data-page-title="User Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            Users will show statistics about the people who sign in to your websites and apps, without their personal information.
        </webui-page-segment>
        <webui-quote theme="warning">
            Coming Soon
        </webui-quote>
    </template>
    <template slot="invalid">
        <webui-quote theme="warning">
            You must be signed in to use this service.
        </webui-quote>
    </template>
</webui-restrict-to-role>
