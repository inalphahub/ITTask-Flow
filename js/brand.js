(() => {
    const logoPath = "it-taskflow-logo.svg";
    const brandName = "IT TaskFlow";
    const replaceBrandName = (value) => value.replace(/(?<!IT )(Task Flow|TaskFlow)/g, brandName);

    const replaceBrandText = (root = document) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let node;

        while ((node = walker.nextNode())) {
            if (/Task Flow|TaskFlow/.test(node.nodeValue)) textNodes.push(node);
        }

        textNodes.forEach((textNode) => {
            textNode.nodeValue = replaceBrandName(textNode.nodeValue);
        });

        root.querySelectorAll?.(".brand > span:last-child").forEach((element) => {
            if (!element.classList.contains("brand-text") && element.textContent.includes("TaskFlow")) {
                element.textContent = brandName;
            }
        });

        root.querySelectorAll?.("title, meta[name='description'], [aria-label]").forEach((element) => {
            if (element.tagName === "TITLE" && element.textContent.includes("TaskFlow")) {
                element.textContent = replaceBrandName(element.textContent);
            }
            ["content", "aria-label"].forEach((attribute) => {
                const value = element.getAttribute(attribute);
                if (value?.includes("TaskFlow")) {
                    element.setAttribute(attribute, replaceBrandName(value));
                }
            });
        });
    };

    const addLogo = (element) => {
        if (element.dataset.itTaskflowLogo === "true") return;
        element.dataset.itTaskflowLogo = "true";
        element.classList.add("it-taskflow-mark");
        element.innerHTML = `<img class="it-taskflow-logo" src="${logoPath}" alt="${brandName} logo">`;
    };

    const updateLogos = (root = document) => {
        root.querySelectorAll?.(".brand-mark, .logo-icon, .brand-icon, .logo-mark, .brand > .brand-logo").forEach(addLogo);

        root.querySelectorAll?.(".mini-brand").forEach((element) => {
            if (element.dataset.itTaskflowLogo === "true") return;
            element.dataset.itTaskflowLogo = "true";
            element.innerHTML = `<span class="it-taskflow-mark"><img class="it-taskflow-logo" src="${logoPath}" alt=""></span><span>${brandName}</span>`;
        });

        root.querySelectorAll?.(".employee-sidebar .brand").forEach((element) => {
            const mark = element.firstElementChild;
            if (mark && !mark.classList.contains("it-taskflow-mark")) addLogo(mark);
        });
    };

    const refresh = (root = document) => {
        replaceBrandText(root);
        updateLogos(root);
    };

    const start = () => {
        refresh();
        new MutationObserver((mutations) => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) refresh(node);
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
