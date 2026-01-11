window.AIPhone = window.AIPhone || {};
window.AIPhone.Apps = window.AIPhone.Apps || {};

window.AIPhone.Apps.Safari = (function() {
    'use strict';

    async function open() {
        const $screen = window.AIPhone.UI.getContentElement();
        
        $screen.html(`
            <div class="ai-app-container">
                <div class="ai-app-header">
                    <div class="ai-app-title">🌐 Safari</div>
                </div>
                <div class="ai-app-content">
                    <div class="ai-loading">
                        <div class="ai-spinner"></div>
                        <div>Generating browser content...</div>
                    </div>
                </div>
            </div>
        `);

        const content = await generateSafariContent();

        $screen.html(`
            <div class="ai-app-container">
                <div class="ai-app-header">
                    <div class="ai-app-title">🌐 Safari</div>
                </div>
                <div class="ai-app-content">
                    ${content}
                </div>
            </div>
        `);
    }

    async function generateSafariContent() {
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 2000,
                    messages: [{
                        role: "user",
                        content: `
### Character Information
Name: ${charName}
Description: ${charDescription}

### Recent Chat History
${recentChat || '(No recent history)'}

### Task
Generate Safari browser content for this character.

Include:
1. Search history (5-7 items)
2. Bookmarks/Favorites (3-5 sites)
3. Currently open tabs (2-4 tabs)

Make it realistic based on the character's personality, interests, and recent conversations.

Output in HTML format using these structures:

<div class="safari-section">
    <h3>🔍 Recent Searches</h3>
    <div class="safari-item">search query</div>
</div>

<div class="safari-section">
    <h3>⭐ Bookmarks</h3>
    <div class="safari-bookmark">
        <div class="bookmark-icon">🌐</div>
        <div class="bookmark-title">Site Name</div>
        <div class="bookmark-url">example.com</div>
    </div>
</div>

<div class="safari-section">
    <h3>📑 Open Tabs</h3>
    <div class="safari-tab">Tab Title</div>
</div>

Use only the CSS classes shown above. Do NOT wrap everything in an outer div.
                        `
                    }]
                })
            });

            const data = await response.json();
            const text = data.content?.[0]?.text || '';
            
            return text || '<div class="ai-error">Generation failed</div>';

        } catch (error) {
            console.error('[Safari] Generation failed:', error);
            return '<div class="ai-error">Error generating content</div>';
        }
    }

    return { open };
})();
