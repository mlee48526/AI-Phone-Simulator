window.AIPhone = window.AIPhone || {};
window.AIPhone.Apps = window.AIPhone.Apps || {};

window.AIPhone.Apps.Photos = (function() {
    'use strict';

    async function open() {
        const $screen = window.AIPhone.UI.getContentElement();
        
        $screen.html(`
            <div class="ai-app-container">
                <div class="ai-app-header">
                    <div class="ai-app-title">📷 Photos</div>
                </div>
                <div class="ai-app-content">
                    <div class="ai-loading">
                        <div class="ai-spinner"></div>
                        <div>Generating photo albums...</div>
                    </div>
                </div>
            </div>
        `);

        const content = await generatePhotosContent();

        $screen.html(`
            <div class="ai-app-container">
                <div class="ai-app-header">
                    <div class="ai-app-title">📷 Photos</div>
                </div>
                <div class="ai-app-content">
                    ${content}
                </div>
            </div>
        `);
    }

    async function generatePhotosContent() {
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

Generate photo album content for this character.

Include:
- 3-5 albums (Recent, Favorites, Travel, Friends, etc.)
- Photo count and description for each

HTML format:
<div class="photos-grid">
    <div class="album-item">
        <div class="album-cover">📸</div>
        <div class="album-name">Album Name</div>
        <div class="album-count">23 photos</div>
    </div>
</div>

Start with photos-grid, no wrapper div.
                        `
                    }]
                })
            });

            const data = await response.json();
            return data.content?.[0]?.text || '<div class="ai-error">Generation failed</div>';

        } catch (error) {
            console.error('[Photos] Generation failed:', error);
            return '<div class="ai-error">Error occurred</div>';
        }
    }

    return { open };
})();
