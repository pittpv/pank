// Скрипт для обновления балансов из localStorage
(function() {
    const WALLET_KEY = 'pwa_wallet_balance';
    const SBERBONUS_KEY = 'pwa_sberbonus_balance';
    const DEFAULT_WALLET = '1 964,77';
    const DEFAULT_SBERBONUS = '111';

    function updateBalances() {
        // Обновляем баланс кошелька
        const walletElement = document.getElementById('wallet-balance-amount');
        if (walletElement) {
            const walletValue = localStorage.getItem(WALLET_KEY) || DEFAULT_WALLET;
            walletElement.textContent = walletValue;
        }

        // Обновляем бонусы СберСпасибо
        const sberbonusElement = document.getElementById('sberbonus-balance');
        if (sberbonusElement) {
            const sberbonusValue = localStorage.getItem(SBERBONUS_KEY) || DEFAULT_SBERBONUS;
            sberbonusElement.textContent = sberbonusValue;
        }
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBalances);
    } else {
        updateBalances();
    }

    // Слушаем изменения localStorage (для обновления при возврате с админки)
    window.addEventListener('storage', updateBalances);
})();
