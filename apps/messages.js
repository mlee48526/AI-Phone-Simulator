window.AIPhone = window.AIPhone || {};
window.AIPhone.Apps = window.AIPhone.Apps || {};

window.AIPhone.Apps.Messages = (function() {
    'use strict';

    async function open() {
        const $screen = window.AIPhone.UI.getContentElement();
        
        $screen.html(`
            <div class="ai-app-container">
                <div class="ai-app-header">
                    <div class="ai-app-title">💬 Messages</div>
                </div>
                <div class="ai-app-content">
                    <div class="ai-loading">
                        <div class="ai-spinner"></div>
                        <div>Generating messages...</div>
                    </div>
                </div>
            </div>
        `);

        const content = await generateMessagesContent();

        $screen.html(`
            <div class="ai-app-container">
                <div class="ai-app-header">
                    <div class="ai-app-title">💬 Messages</div>
                </div>
                <div class="ai-app-content">
                    ${content}
                </div>
            </div>
        `);
    }

    async function generateMessagesContent() {
        try {
            const ctx = window.SillyTavern?.getContext();
            const charName = ctx?.name || 'Character';
            const charDescription = ctx?.description || '';
            
            let recentChat = '';
            if (ctx?.chat && ctx.chat.length > 0) {
                const recent = ctx.chat.slice(-10);
                recentChat = recent.map(m => `${m.name}: ${m.mes}`).join('\n');
            }

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 2000,
                    messages: [{
                        role: "user",
                        content: `
Character: ${charName}
Description: ${charDescription}
Recent Chat: ${recentChat || 'None'}

Generate a message list for this character's phone.

Create 5-8 conversations with:
- Family, friends, coworkers, romantic interests, etc.
- Reflect recent chat context
- Each conversation shows last message and time

HTML format:
<div class="msg-list">
    <div class="msg-item">
        <div class="msg-avatar">😊</div>
        <div class="msg-info">
            <div class="msg-name">Name</div>
            <div class="msg-preview">Last message text...</div>
        </div>
        <div class="msg-time">10m ago</div>
    </div>
</div>

Start with msg-list, no wrapper div.
                        `
                    }]
                })
            });

            const data = await response.json();
            return data.content?.[0]?.text || '<div class="ai-error">Generation failed</div>';

        } catch (error) {
            console.error('[Messages] Generation failed:', error);
            return '<div class="ai-error">Error occurred</div>';
        }
    }

    return { open };
})();
