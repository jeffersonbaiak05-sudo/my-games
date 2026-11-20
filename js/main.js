
var interval;

function check() {
  const panicMode = document.getElementById("panicmode");

  if (panicMode && typeof panicurl !== "undefined") {
    panicMode.href = panicurl;
  }

  const mini = document.querySelector(".seleniteminified");

  if (mini) {
    $.get(
      "https://raw.githubusercontent.com/skysthelimitt/selenite-optimized/main/build/bookmark.txt",
      function (data) {
        mini.href = data;
      }
    );

    const carAxle = document.querySelector(".caraxle");

    if (carAxle) {
      $.get(
        "https://raw.githubusercontent.com/car-axle-client/car-axle-client/main/dist/build.js",
        function (data) {
          carAxle.href = "javascript:" + encodeURI(data);
        }
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {

  // Remove anúncios aleatoriamente ou conforme configuração
  document.querySelectorAll("#adcontainer").forEach(function (ad) {
    if (
      Math.random() < 0.5 ||
      localStorage.getItem("selenite.adblock") === "true"
    ) {
      ad.innerHTML = "";
    }
  });

  // Migração de tema antigo
  if (localStorage.getItem("theme")) {
    localStorage.setItem(
      "selenite.theme",
      localStorage.getItem("theme")
    );
    localStorage.removeItem("theme");
  }

  // Aplicar tema
  document.body.setAttribute(
    "theme",
    localStorage.getItem("selenite.theme") || "main"
  );

  // Configurações
  const iconSetting = document.querySelector("input#discordIcon");
  const blockClose = document.querySelector("input#blockClose");
  const tabDisguise = document.querySelector("input#tabDisguise");

  if (iconSetting) {
    iconSetting.checked =
      localStorage.getItem("selenite.discordIcon") === "true";

    iconSetting.addEventListener("change", function () {
      localStorage.setItem(
        "selenite.discordIcon",
        iconSetting.checked
      );

      const widget = document.querySelector("widgetbot-crate");

      if (widget) {
        widget.style.display =
          iconSetting.checked ? "none" : "";
      }
    });
  }

  if (blockClose) {
    blockClose.checked =
      localStorage.getItem("selenite.blockClose") === "true";

    blockClose.addEventListener("change", function () {
      localStorage.setItem(
        "selenite.blockClose",
        blockClose.checked
      );
    });
  }

  if (tabDisguise) {
    tabDisguise.checked =
      localStorage.getItem("selenite.tabDisguise") === "true";

    tabDisguise.addEventListener("change", function () {
      localStorage.setItem(
        "selenite.tabDisguise",
        tabDisguise.checked
      );
    });
  }

  // Ocultar Widgetbot caso configurado
  const widget = document.querySelector("widgetbot-crate");

  if (
    widget &&
    localStorage.getItem("selenite.discordIcon") === "true"
  ) {
    widget.style.display = "none";
  }

  // Botão Open Blank
  const openBlank = document.getElementById("blank");

  if (openBlank) {
    openBlank.addEventListener("click", function (event) {
      event.preventDefault();

      const win = window.open("about:blank", "_blank");

      if (!win) {
        alert("Permita pop-ups para utilizar o Open Blank.");
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Home</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              border: none;
              box-sizing: border-box;
            }

            body {
              height: 100vh;
              width: 100vw;
              overflow: hidden;
            }

            header {
              display: flex;
              height: 4vh;
              justify-content: center;
            }

            button {
              height: 100%;
              aspect-ratio: 1 / 1;
              cursor: pointer;
            }

            iframe {
              width: 100%;
              height: 96vh;
              border: none;
            }
          </style>
        </head>
        <body>
          <header>
            <button id="goBack">Home</button>
            <button id="reload">Reload</button>
          </header>
          <iframe id="selenite"></iframe>

          <script>
            const frame = document.getElementById("selenite");

            frame.src = ${JSON.stringify(location.origin)};

            document.getElementById("goBack").onclick = function () {
              frame.src = ${JSON.stringify(location.origin)};
            };

            document.getElementById("reload").onclick = function () {
              frame.src = frame.src;
            };
          <\/script>
        </body>
        </html>
      `;

      win.document.open();
      win.document.write(html);
      win.document.close();
    });
  }

  // Verificar alerta de boas-vindas
  checkAlert();

  // Verificar links especiais
  check();
});

// Sistema de alerta
function checkAlert() {
  const dialog = document.querySelector(".dialog-width");

  if (!dialog) return;

  if (getCookie("supportalert")) return;

  const closeButton = dialog.querySelector(
    'sl-button[slot="footer"]'
  );

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      dialog.hide();
    });
  }

  setTimeout(function () {
    if (typeof dialog.show === "function") {
      dialog.show();
    }
  }, 250);

  setCookie("supportalert", "true", 60);
}

// Cookies sem dependência externa
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  const date = new Date();

  date.setTime(
    date.getTime() + days * 24 * 60 * 60 * 1000
  );

  document.cookie =
    name + "=" + encodeURIComponent(value) +
    "; expires=" + date.toUTCString() +
    "; path=/; SameSite=Lax";
}

// Panic Mode
function setPanicMode() {
  const panicInput = document.getElementById("panic");

  if (!panicInput) return;

  let url = panicInput.value.trim();

  if (!url.startsWith("https://")) {
    url = "https://" + url;
  }

  document.cookie =
    "panicurl=" + encodeURIComponent(url) +
    "; path=/; SameSite=Lax";
}

// Copiar para área de transferência
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(function () {
      alert("Copied text!");
    })
    .catch(function () {
      alert("Não foi possível copiar o texto.");
    });
}

// Alterar tema
function setTheme(theme) {
  localStorage.setItem("selenite.theme", theme);

  document.body.setAttribute("theme", theme);

  if (theme !== "custom") {
    const customMenu = document.getElementById("customMenu");

    if (customMenu) {
      customMenu.style.display = "none";
    }

    document.body.style = "";
  }
}

// Senha
function setPassword() {
  const pass = document.getElementById("pass");

  if (!pass || typeof enc === "undefined") return;

  localStorage.setItem(
    "selenite.password",
    enc.encode(pass.value)
  );
}

// Remover senha
function delPassword() {
  location.hash = "";

  localStorage.removeItem("selenite.passwordAtt");
  localStorage.removeItem("selenite.password");
}
