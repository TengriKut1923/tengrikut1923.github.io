function loadGiscus() {
    const giscusDiv = document.createElement('div');
    giscusDiv.id = 'giscus';
    giscusDiv.dataset.repo = 'tengrikut1923/tengrikut1923.github.io';
    giscusDiv.dataset.repoId = 'R_kgDOK_ZQ9Q';
    giscusDiv.dataset.category = 'Sunum';
    giscusDiv.dataset.categoryId = 'DIC_kwDOK_ZQ9c4Cg3y1';
    giscusDiv.dataset.mapping = 'title';
    giscusDiv.dataset.strict = '0';
    giscusDiv.dataset.reactionsEnabled = '0';
    giscusDiv.dataset.emitMetadata = '0';
    giscusDiv.dataset.theme = 'dark_dimmed';
    giscusDiv.dataset.inputPosition = 'bottom';
    giscusDiv.dataset.lang = 'tr';
    giscusDiv.dataset.loading = 'lazy';
    giscusDiv.setAttribute('crossorigin', 'anonymous');
    giscusDiv.setAttribute('async', '');

    const giscusScript = document.createElement('script');
    giscusScript.src = 'https://giscus.app/client.js';
    giscusScript.dataset.repo = 'tengrikut1923/tengrikut1923.github.io';
    giscusScript.dataset.repoId = 'R_kgDOK_ZQ9Q';
    giscusScript.dataset.category = 'Sunum';
    giscusScript.dataset.categoryId = 'DIC_kwDOK_ZQ9c4Cg3y1';
    giscusScript.dataset.mapping = 'title';
    giscusScript.dataset.strict = '0';
    giscusScript.dataset.reactionsEnabled = '0';
    giscusScript.dataset.emitMetadata = '0';
    giscusScript.dataset.theme = 'dark_dimmed';
    giscusScript.dataset.inputPosition = 'bottom';
    giscusScript.dataset.lang = 'tr';
    giscusScript.dataset.loading = 'lazy';
    giscusScript.setAttribute('crossorigin', 'anonymous');
    giscusScript.setAttribute('async', '');

    document.body.appendChild(giscusDiv);
    document.body.appendChild(giscusScript);
}

document.addEventListener('DOMContentLoaded', loadGiscus);
