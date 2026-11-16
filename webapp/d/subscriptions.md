<webui-data data-page-title="Subscription Management" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            Subscriptions is where you will choose plans for paid My Fidelity services, such as newsletter plans, and change or cancel them yourself. Each service is sold on its own, so you only pay for what you use.
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
