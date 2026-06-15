const temaSalvo = localStorage.getItem('bibliotech-theme');

if (temaSalvo) {
    document.documentElement.setAttribute('data-theme', temaSalvo);
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');

    if (btn) {
        btn.addEventListener('click', () => {
            const root = document.documentElement;
            const next =
                root.getAttribute('data-theme') === 'dark'
                    ? 'light'
                    : 'dark';

            root.setAttribute('data-theme', next);
            localStorage.setItem('bibliotech-theme', next);
        });
    }
});