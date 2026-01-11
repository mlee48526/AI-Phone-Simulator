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
                console.log(`📱 [${EXTENSION_NAME}] Loaded: ${fileName}`);
                resolve();
            };
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
        });
    }

    async function initialize() {
        console.log(`🚀 [${EXTENSION_NAME}] Starting...`);

        try {
            await loadModule('ui.js');
            await loadModule('apps/safari.js');
            await loadModule('apps/messages.js');
            await loadModule('apps/photos.js');

            if (window.AIPhone && window.AIPhone.UI) {
                window.AIPhone.UI.init();
            }

            addPhoneToggleButton();

            console.log(`✅ [${EXTENSION_NAME}] Ready! Press 'X' to open phone.`);

        } catch (error) {
            console.error(`❌ [${EXTENSION_NAME}] Failed:`, error);
        }
    }

    function addPhoneToggleButton() {
        const checkInterval = setInterval(() => {
            const $optionsContent = $('#options .options-content');
            
            if ($optionsContent.length > 0) {
                clearInterval(checkInterval);
                
                if ($('#option_toggle_phone').length > 0) return;
                
                const phoneOption = `
                    <a id="option_toggle_phone">
                        <i class="fa-lg fa-solid fa-mobile-screen"></i>
                        <span>📱 Phone</span>
                    </a>
                `;
                
                $optionsContent.prepend(phoneOption);
                
                $('#option_toggle_phone').on('click', function() {
                    $('#options').hide();
                    if (window.AIPhone && window.AIPhone.UI) {
                        window.AIPhone.UI.togglePhone();
                    }
                });
                
                console.log('📱 [AI Phone] Toggle button added to options menu');
            }
        }, 500);
        
        // 10초 후에도 못 찾으면 포기
        setTimeout(() => clearInterval(checkInterval), 10000);
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
