(() => {
  console.log("🟢 ChatGPT Batch Delete cargado");

  const SELECTOR = 'a[href^="/c/"]';

  // =========================================================
  // CONTAR SELECCIONADOS
  // =========================================================

  function contarSeleccionados() {
    return document.querySelectorAll(
      '.batch-selector[aria-checked="true"]'
    ).length;
  }

  // =========================================================
  // ACTUALIZAR BOTÓN
  // =========================================================

  function actualizarBoton() {
    const boton = document.getElementById("batch-delete-button");

    if (!boton) return;

    const cantidad = contarSeleccionados();

    boton.textContent = `🗑 Borrar seleccionados (${cantidad})`;

    boton.style.opacity = cantidad > 0 ? "1" : "0.55";
  }

  // =========================================================
  // CREAR BOTÓN BASURA
  // =========================================================

  function crearBotonBorrar() {
    if (document.getElementById("batch-delete-button")) {
      return;
    }

    const primerChat = document.querySelector(SELECTOR);

    if (!primerChat) {
      return;
    }

    /*
     * DOM REAL QUE ACABAMOS DE COMPROBAR:
     *
     * primerChat
     *   ↑ parentElement
     * div[data-thread-title-trigger]
     *   ↑ parentElement
     * wrapper de la fila
     *
     * El botón debe ir ANTES de ese wrapper.
     */

    const wrapperChat =
      primerChat.parentElement?.parentElement;

    if (!wrapperChat) {
      return;
    }

    const contenedorLista =
      wrapperChat.parentElement;

    if (!contenedorLista) {
      return;
    }

    const boton = document.createElement("button");

    boton.id = "batch-delete-button";
    boton.type = "button";

    boton.textContent =
      "🗑 Borrar seleccionados (0)";

    Object.assign(boton.style, {
      display: "block",

      width: "calc(100% - 16px)",

      margin: "6px 8px 8px 8px",

      padding: "9px 10px",

      boxSizing: "border-box",

      background: "#2f2f2f",
      color: "#ffffff",

      border: "1px solid #565656",
      borderRadius: "8px",

      fontSize: "13px",
      fontWeight: "600",

      textAlign: "left",

      cursor: "pointer",

      position: "relative",
      zIndex: "10"
    });

    /*
     * TODAVÍA NO BORRAMOS.
     * Primero comprobamos botón + contador.
     */
    boton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      console.log(
        "🗑 Seleccionados:",
        contarSeleccionados()
      );
    });

    /*
     * ESTA ES LA CORRECCIÓN IMPORTANTE:
     *
     * insertamos el botón ANTES del wrapper
     * completo del primer chat.
     */
    contenedorLista.insertBefore(
      boton,
      wrapperChat
    );

    console.log("🗑 Botón agregado correctamente");

    actualizarBoton();
  }

  // =========================================================
  // PREPARAR CHATS
  // =========================================================

  function prepararChats() {
    const chats =
      document.querySelectorAll(SELECTOR);

    chats.forEach(chat => {

      if (chat.dataset.batchReady === "true") {
        return;
      }

      chat.dataset.batchReady = "true";

      // -----------------------------------------------
      // CHECKBOX
      // -----------------------------------------------

      const selector =
        document.createElement("span");

      selector.className =
        "batch-selector";

      selector.setAttribute(
        "role",
        "checkbox"
      );

      selector.setAttribute(
        "aria-checked",
        "false"
      );

      /*
       * ESTA PARTE ES LA ESTABLE.
       * NO LA CAMBIAMOS.
       */

      Object.assign(selector.style, {

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        width: "16px",
        height: "16px",

        minWidth: "16px",

        marginRight: "8px",

        border:
          "1.5px solid #8e8e8e",

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

      // -----------------------------------------------
      // CLICK CHECKBOX
      // -----------------------------------------------

      selector.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          const seleccionado =
            selector.getAttribute(
              "aria-checked"
            ) === "true";

          if (seleccionado) {

            selector.setAttribute(
              "aria-checked",
              "false"
            );

            selector.textContent = "";

            selector.style.background =
              "transparent";

          } else {

            selector.setAttribute(
              "aria-checked",
              "true"
            );

            selector.textContent = "✓";

            selector.style.background =
              "#10a37f";
          }

          actualizarBoton();
        }
      );

      // -----------------------------------------------
      // INSERTAR CHECKBOX
      // -----------------------------------------------

      const titulo =
        chat.querySelector(
          '[data-thread-title="true"]'
        );

      if (
        titulo &&
        titulo.parentElement
      ) {

        titulo.parentElement.insertBefore(
          selector,
          titulo
        );

      } else {

        chat.insertBefore(
          selector,
          chat.firstChild
        );
      }
    });

    // El sidebar ya existe:
    // intentamos agregar el botón.

    crearBotonBorrar();

    actualizarBoton();
  }

  // =========================================================
  // EJECUCIÓN INICIAL
  // =========================================================

  prepararChats();

  // =========================================================
  // OBSERVER
  // =========================================================

  let programado = false;

  const observer =
    new MutationObserver(() => {

      if (programado) {
        return;
      }

      programado = true;

      requestAnimationFrame(() => {

        programado = false;

        prepararChats();

      });
    });

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

})();