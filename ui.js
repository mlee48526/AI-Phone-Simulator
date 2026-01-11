window.AIPhone = window.AIPhone || {};

window.AIPhone.UI = (function() {
    'use strict';

    let $phoneContainer;

    function init() {
        createPhoneElement();
        renderHomeScreen();
        console.log('📱 [AI Phone] UI initialized');
    }

    function createPhoneElement() {
        if ($('#ai-phone-container').length > 0) return;

        const html = `
            <div id="ai-phone-container">
                <div class="ai-phone-screen">
                    <div class="ai-phone-status-bar">
                        <div class="ai-phone-notch"></div>
                    </div>
                    <div id="ai-phone-content"></div>
                    <div class="ai-phone-home-area" id="ai-home-btn">
                        <div class="ai-phone-home-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(html);
        $phoneContainer = $('#ai-phone-container');

        $('#ai-home-btn').on('click', function() {
            const isHome = $('#ai-phone-content').find('.ai-home-grid').length > 0;
            if (isHome) {
                togglePhone();
            } else {
                renderHomeScreen();
            }
        });
    }

    function renderHomeScreen() {
        const $content = $('#ai-phone-content');
        $content.empty();

        const apps = [
            { id: 'safari', name: 'Safari', icon: '🌐', bg: 'linear-gradient(135deg, #007AFF, #5AC8FA)' },
            { id: 'messages', name: 'Messages', icon: '💬', bg: 'linear-gradient(135deg, #34C759, #30D158)' },
            { id: 'photos', name: 'Photos', icon: '📷', bg: 'linear-gradient(135deg, #FF2D55, #FF375F)' },
            { id: 'notes', name: 'Notes', icon: '📝', bg: 'linear-gradient(135deg, #FFD60A, #FFD426)' },
            { id: 'mail', name: 'Mail', icon: '✉️', bg: 'linear-gradient(135deg, #0A84FF, #409CFF)' },
            { id: 'calendar', name: 'Calendar', icon: '📅', bg: 'linear-gradient(135deg, #FF3B30, #FF453A)' }
        ];

        let iconsHtml = apps.map(app => `
            <div class="ai-app-item" data-app="${app.id}">
                <div class="ai-app-icon" style="background: ${app.bg};">
                    ${app.icon}
                </div>
                <div class="ai-app-name">${app.name}</div>
            </div>
        `).join('');

        $content.html(`<div class="ai-home-grid">${iconsHtml}</div>`);

        $('.ai-app-item').on('click', function() {
            const appId = $(this).data('app');
            openApp(appId);
        });
    }

    function openApp(appId) {
        const Apps = window.AIPhone.Apps;
        if (!Apps) {
            toastr.error('Failed to load app');
            return;
        }

        switch(appId) {
            case 'safari':
                Apps.Safari?.open();
                break;
            case 'messages':
                Apps.Messages?.open();
                break;
            case 'photos':
                Apps.Photos?.open();
                break;
            case 'notes':
                Apps.Notes?.open();
                break;
            case 'mail':
                Apps.Mail?.open();
                break;
            case 'calendar':
                Apps.Calendar?.open();
                break;
            default:
                toastr.warning('App not available yet');
        }
    }

    function togglePhone() {
        if (!$phoneContainer) return;
        $phoneContainer.toggleClass('active');
    }

    function getContentElement() {
        return $('#ai-phone-content');
    }

    return {
        init,
        togglePhone,
        getContentElement,
        renderHomeScreen
    };
})();
