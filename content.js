(() => {
  console.log("🟢 ChatGPT Batch Delete cargado");

  const SELECTOR = 'a[href^="/c/"]';

  function prepararChats() {
    const chats = document.querySelectorAll(SELECTOR);

    chats.forEach(chat => {
      if (chat.dataset.batchReady === "true") return;

      chat.dataset.batchReady = "true";

      // Contenedor visual de selección
      const selector = document.createElement("span");
      selector.className = "batch-selector";
      selector.setAttribute("role", "checkbox");
      selector.setAttribute("aria-checked", "false");

      // Ocupa espacio REAL. Nada de absolute/fixed.
      Object.assign(selector.style, {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        minWidth: "16px",
        marginRight: "8px",
        border: "1.5px solid #8e8e8e",
        borderRadius: "4px",
        boxSizing: "border-box",
        cursor: "pointer",
        verticalAlign: "middle",
        flex: "0 0 16px",
        fontSize: "12px",
        lineHeight: "16px",
        color: "white",
        userSelect: "none"
      });

      selector.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        const seleccionado =
          selector.getAttribute("aria-checked") === "true";

        if (seleccionado) {
          selector.setAttribute("aria-checked", "false");
          selector.textContent = "";
          selector.style.background = "transparent";
        } else {
          selector.setAttribute("aria-checked", "true");
          selector.textContent = "✓";
          selector.style.background = "#10a37f";
        }
      });

      /*
       * IMPORTANTE:
       * buscamos el elemento que contiene el título que vimos
       * en el DOM real de ChatGPT.
       */
      const titulo = chat.querySelector('[data-thread-title="true"]');

      if (titulo && titulo.parentElement) {
        titulo.parentElement.insertBefore(selector, titulo);
      } else {
        // Fallback: si ChatGPT cambia ligeramente el DOM.
        chat.insertBefore(selector, chat.firstChild);
      }
    });
  }

  // ChatGPT carga el sidebar después del documento inicial.
  prepararChats();

  let programado = false;

  const observer = new MutationObserver(() => {
    if (programado) return;

    programado = true;

    requestAnimationFrame(() => {
      programado = false;
      prepararChats();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();