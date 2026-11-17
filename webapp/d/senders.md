<webui-data data-page-title="Sending Addresses" data-page-subtitle=""></webui-data>

<webui-restrict-to-role role="1">
    <template slot="valid">
        <webui-page-segment>
            Sending addresses are your own email accounts, such as news@yourdomain.com, that My Fidelity sends your newsletters from. Your subscribers see your address, not ours, and replies come back to you. Add an address with your mail provider's settings, and once My Fidelity has checked it works, choose it for your newsletters.
        </webui-page-segment>
        <webui-page-help heading="Sending Addresses Guide" storage-key="myfi-senders-help">
            <webui-tabs theme="info">
                <webui-button slot="tabs">Getting Started</webui-button>
                <webui-content slot="content" nodetach>

1. **Pick the company** the address belongs to. Its domain must be a verified domain of any company you own, such as an address at example.com for www.example.com.
2. **Add the address** with your mail provider's SMTP settings and the password to sign in. See Provider Settings for the common ones.
3. **Wait for the check.** Within a few minutes My Fidelity signs in and sends a test email to the address. It then shows as **Ready**, or **Needs attention** with the reason.
4. **Choose it for a newsletter** with the sending address button on the newsletter's row on the [Newsletters](/newsletters) page. One address can send for any of the company's newsletters.

                </webui-content>
                <webui-button slot="tabs">Provider Settings</webui-button>
                <webui-content slot="content" nodetach>

| Provider | Server | Port and security | Password |
|---|---|---|---|
| Gmail and Google Workspace | smtp.gmail.com | 587, STARTTLS | An app password, made in your Google Account after turning on 2-Step Verification |
| Microsoft 365 and Outlook | smtp.office365.com | 587, STARTTLS | Your password, if your administrator allows SMTP sign-in. Microsoft is phasing this out, so it may be refused |
| Zoho Mail | smtp.zoho.com | 465, TLS | Your password, or an app password with two-factor sign-in |
| Rackspace Email | secure.emailsrvr.com | 587, STARTTLS | Your password |

Your provider's help pages list its SMTP settings if yours isn't here. The username is usually the full email address.

Don't use port 25. It is for mail servers passing mail to each other, and most networks block it, so the check only times out.

                </webui-content>
                <webui-button slot="tabs">Limits and Retries</webui-button>
                <webui-content slot="content" nodetach>

Every provider caps how much you can send, such as about 500 emails a day for Gmail and 2,000 for Google Workspace or Microsoft 365. Set each address's **hourly and daily limits** below your provider's, and My Fidelity never sends more than that through it. Emails over the limit wait for the next hour or day.

When a mail server asks to try later, the email is sent again after 5 minutes, 15 minutes, 1 hour, and 4 hours, then given up. When the server refuses the sign-in, the address shows **Needs attention** and its emails wait until you fix it and check it again. Every failure is listed in the **Delivery Problems** report on the Newsletters page.

                </webui-content>
                <webui-button slot="tabs">Security</webui-button>
                <webui-content slot="content" nodetach>

- The address, username, and password are encrypted before they are stored, and are only decrypted to sign in and send.
- They are never shown again, here or anywhere else. To change the sign-in, edit the address and enter it again.
- Failure details never include your sign-in or your subscribers' addresses.
- Deleting an address removes its saved sign-in at once, whatever its status. You can also revoke the app password at your provider.

                </webui-content>
            </webui-tabs>
        </webui-page-help>
        <webui-page-segment elevation="10">
            <webui-flex gap="3">
                <webui-dropdown label="Current Company" data-subscribe="session-company-id" data-trigger="session-company-id|filter-senders.companyId" api="user/companies/options"></webui-dropdown>
                <webui-flex align="center" justify="right">
                    <webui-button data-trigger="page-sender-create" data-value="1">Add Sending Address</webui-button>
                </webui-flex>
            </webui-flex>
            <webui-dialog-action title="Add Sending Address" confirm="Add Address" api="post|/user/email/credential/create" data-subscribe="page-sender-create" data-success="refresh-senders">
                <template>
                    <webui-page-segment>
                        Enter the address and your mail provider's SMTP settings. The address must use a verified domain of any company you own. Everything you enter here is encrypted before it is saved.
                    </webui-page-segment>
                    <input type="hidden" name="companyId" data-subscribe="session-company-id" />
                    <webui-input-text label="Name" name="label" placeholder="Such as Newsletters, to tell your addresses apart" maxlength="100"></webui-input-text>
                    <webui-input-text label="Email Address" name="email" type="email" placeholder="news@yourdomain.com" maxlength="320"></webui-input-text>
                    <webui-input-text label="SMTP Server" name="smtpHost" placeholder="smtp.gmail.com" maxlength="255"></webui-input-text>
                    <webui-input-text label="Port" name="smtpPort" type="number" min="1" max="65535" value="587"></webui-input-text>
                    <label>Security <select name="smtpSecurity"><option value="starttls" selected>STARTTLS (usually port 587)</option><option value="tls">TLS (usually port 465)</option></select></label>
                    <webui-input-text label="Username" name="smtpUsername" placeholder="Usually the full email address" maxlength="320"></webui-input-text>
                    <webui-input-text label="Password" name="smtpPassword" type="password" placeholder="An app password for Gmail or Outlook" maxlength="500"></webui-input-text>
                    <webui-input-text label="Hourly Limit" name="hourlyLimit" type="number" min="1" max="100000" value="100"></webui-input-text>
                    <webui-input-text label="Daily Limit" name="dailyLimit" type="number" min="1" max="1000000" value="500"></webui-input-text>
                    <webui-quote theme="info">
                        Keep the limits below what your provider allows, such as about 500 a day for Gmail. Open the help for common providers' settings.
                    </webui-quote>
                    <webui-quote theme="warning">
                        Password managers may fill in your My Fidelity sign-in here. Check that the username and password are your mailbox's, or the check fails with the sign-in refused.
                    </webui-quote>
                </template>
            </webui-dialog-action>
        </webui-page-segment>
        <webui-page-segment>
            Each address shows whether it is **Ready** to send, still **Checking**, or **Needs attention**, with the details of the last check. Use the buttons on a row to edit it, check it again after fixing something at your provider, or delete it.
        </webui-page-segment>
        <webui-report label="My Sending Addresses" api="/user/email/credentials" filters="filter-senders" required-filters="companyId" sort-column="label" bordered theme="info" data-subscribe="filter-senders:loadData|refresh-senders:loadData" append-columns=":Actions:" sortable="label;address;status;sent;failed;newsletters">
        <template slot="column" name="actions">
            <webui-button theme="info" start-icon="pencil|shade:tri" title="Edit {TEMPLATE_LABEL}" data-trigger="page-sender-{_ROWID}-update" data-value="1"></webui-button>
            <webui-button theme="tertiary" start-icon="refresh" title="Check {TEMPLATE_LABEL} Again" data-trigger="page-sender-{_ROWID}-check" data-value="1"></webui-button>
            <webui-button theme="danger" start-icon="circle|ban" title="Delete {TEMPLATE_LABEL}" data-trigger="page-sender-{_ROWID}-delete" data-value="1"></webui-button>
            <webui-dialog-action title="Edit {TEMPLATE_LABEL}" confirm="Save Address" api="patch|/user/email/credential" data-subscribe="page-sender-{_ROWID}-update" data-success="refresh-senders">
                <template>
                    <webui-page-segment>
                        The address itself can't change: add a new sending address instead. Changing the server or sign-in checks it again before anything more is sent through it.
                    </webui-page-segment>
                    <input type="hidden" name="credentialId" value="{TEMPLATE_ID}" />
                    <webui-input-text label="Name" name="label" maxlength="100" data-subscribe="page-tr-{_ROWID}.label"></webui-input-text>
                    <webui-input-text label="SMTP Server" name="smtpHost" maxlength="255" data-subscribe="page-tr-{_ROWID}.smtp_host"></webui-input-text>
                    <webui-input-text label="Port" name="smtpPort" type="number" min="1" max="65535" data-subscribe="page-tr-{_ROWID}.smtp_port"></webui-input-text>
                    <label>Security <select name="smtpSecurity" data-subscribe="page-tr-{_ROWID}.smtp_security:value"><option value="starttls">STARTTLS (usually port 587)</option><option value="tls">TLS (usually port 465)</option></select></label>
                    <webui-input-text label="Username" name="smtpUsername" placeholder="Leave empty to keep the saved one" maxlength="320"></webui-input-text>
                    <webui-input-text label="Password" name="smtpPassword" type="password" placeholder="Leave empty to keep the saved one" maxlength="500"></webui-input-text>
                    <webui-input-text label="Hourly Limit" name="hourlyLimit" type="number" min="1" max="100000" data-subscribe="page-tr-{_ROWID}.hourly_limit"></webui-input-text>
                    <webui-input-text label="Daily Limit" name="dailyLimit" type="number" min="1" max="1000000" data-subscribe="page-tr-{_ROWID}.daily_limit"></webui-input-text>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Check {TEMPLATE_LABEL} Again" confirm="Check Again" api="post|/user/email/credential/check" data-subscribe="page-sender-{_ROWID}-check" data-success="refresh-senders">
                <template>
                    <input type="hidden" name="credentialId" value="{TEMPLATE_ID}" />
                    <webui-page-segment>
                        My Fidelity will sign in and send a test email to this address again in the next few minutes. Use this after fixing the password or permissions at your mail provider.
                    </webui-page-segment>
                </template>
            </webui-dialog-action>
            <webui-dialog-action title="Delete {TEMPLATE_LABEL}" confirm="Delete Address" api="delete|/user/email/credential" data-subscribe="page-sender-{_ROWID}-delete" data-success="refresh-senders">
                <template>
                    <input type="hidden" name="credentialId" value="{TEMPLATE_ID}" />
                    <webui-quote theme="danger">
                        This deletes {TEMPLATE_LABEL} and its saved sign-in. Newsletters sending from it stop sending until you choose another address for them.
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
