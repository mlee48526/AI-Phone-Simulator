(function() {
    'use strict';

    const EXTENSION_NAME = 'AI Phone';
    const EXTENSION_FOLDER = 'ai-phone';
    const BASE_PATH = `/scripts/extensions/third-party/${EXTENSION_FOLDER}`;

    function loadModule(fileName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${BASE_PATH}/${fileName}`;
            script.onload = () => {
                console.log(`[${EXTENSION_NAME}] Loaded: ${fileName}`);
                resolve();
            };
            script.onerror = (e) => {
                console.error(`[${EXTENSION_NAME}] Failed to load: ${fileName}`, e);
                reject(e);
            };
            document.head.appendChild(script);
        });
    }

    async function initialize() {
        console.log(`🚀 [${EXTENSION_NAME}] Starting initialization...`);

        try {
            await loadModule('ui.js');
            await loadModule('apps/safari.js');
            await loadModule('apps/messages.js');
            await loadModule('apps/photos.js');

            if (window.AIPhone && window.AIPhone.UI) {
                window.AIPhone.UI.init();
            }

            addPhoneToggleButton();

            console.log(`✅ [${EXTENSION_NAME}] All modules initialized! Press 'X' to toggle phone.`);

        } catch (error) {
            console.error(`❌ [${EXTENSION_NAME}] Initialization failed:`, error);
        }
    }

    function addPhoneToggleButton() {
        if ($('#option_toggle_phone').length > 0) return;

        const $optionsContent = $('#options .options-content');
        if ($optionsContent.length > 0) {
            const phoneOption = `
                <a id="option_toggle_phone">
                    <i class="fa-lg fa-solid fa-mobile-screen"></i>
                    <span>📱 Phone</span>
                </a>
            `;

            const $anOption = $('#option_toggle_AN');
            if ($anOption.length > 0) {
                $anOption.after(phoneOption);
            } else {
                $optionsContent.prepend(phoneOption);
            }

            $('#option_toggle_phone').on('click', function() {
                $('#options').hide();
                if (window.AIPhone && window.AIPhone.UI) {
                    window.AIPhone.UI.togglePhone();
                }
            });

            console.log(`📱 [${EXTENSION_NAME}] Phone toggle button added to options menu.`);
        }
    }

    $(document).ready(function() {
        setTimeout(initialize, 500);

        $(document).on('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.isContentEditable) {
                return;
            }

            if (e.key.toLowerCase() === 'x') {
                if (window.AIPhone && window.AIPhone.UI) {
                    window.AIPhone.UI.togglePhone();
                }
            }
        });
    });
})();
