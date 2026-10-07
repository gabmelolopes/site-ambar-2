document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------
  // 1. ELEMENTOS DO CARROSSEL
  // ----------------------------------------------------------
  const hero = document.querySelector(".hero");
  const slides = [...document.querySelectorAll(".slide")];
  const pageButtons = [...document.querySelectorAll(".pages button")];
  const previous = document.querySelector(".previous");
  const next = document.querySelector(".next");
  let active = 0;
  let timer;

  // Exibe o slide solicitado e atualiza os indicadores 01, 02 e 03.
  function showSlide(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const selected = position === active;
      slide.classList.toggle("is-active", selected);
      slide.setAttribute("aria-hidden", String(!selected));
    });
    pageButtons.forEach((button, position) => {
      const selected = position === active;
      button.classList.toggle("selected", selected);
      selected
        ? button.setAttribute("aria-current", "true")
        : button.removeAttribute("aria-current");
    });
  }

  // Reinicia a troca automática a cada 6,5 segundos.
  function startCarousel() {
    clearInterval(timer);
    if (!slides.length) return;
    timer = setInterval(() => showSlide(active + 1), 6500);
  }

  // ----------------------------------------------------------
  // 2. BOTÕES DE NAVEGAÇÃO
  // ----------------------------------------------------------
  previous?.addEventListener("click", () => {
    showSlide(active - 1);
    startCarousel();
  });
  next?.addEventListener("click", () => {
    showSlide(active + 1);
    startCarousel();
  });
  pageButtons.forEach((button) =>
    button.addEventListener("click", () => {
      showSlide(Number(button.dataset.slide));
      startCarousel();
    }),
  );
  // ----------------------------------------------------------
  // 3. PAUSA E RETOMADA AUTOMÁTICA
  // ----------------------------------------------------------
  hero?.addEventListener("mouseenter", () => clearInterval(timer));
  hero?.addEventListener("mouseleave", startCarousel);
  document.addEventListener("visibilitychange", () =>
    document.hidden ? clearInterval(timer) : startCarousel(),
  );
  // Inicia o carrossel assim que a página termina de carregar.
  if (slides.length) startCarousel();

  // Mantém somente uma resposta do FAQ aberta por vez.
  const questions = [...document.querySelectorAll(".faq-list details")];
  questions.forEach((question) => {
    question.addEventListener("toggle", () => {
      if (!question.open) return;
      questions.forEach((item) => {
        if (item !== question) item.open = false;
      });
    });
  });

  // Mantém somente uma trilha de treinamento aberta por vez.
  const courses = [...document.querySelectorAll(".course-accordion details")];
  courses.forEach((course) => {
    course.addEventListener("toggle", () => {
      if (!course.open) return;
      courses.forEach((item) => {
        if (item !== course) item.open = false;
      });
    });
  });

  // Interações do formulário desta prévia.
  const form = document.querySelector(".contact-form");
  const message = form?.querySelector("textarea");
  const counter = form?.querySelector(".character-count");
  const feedback = form?.querySelector(".form-feedback");

  message?.addEventListener("input", () => {
    counter.textContent = `${message.value.length} / 180`;
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    feedback.textContent = "Mensagem validada. Na versão final, o envio será conectado ao canal definido pela Ambar Ras.";
    form.classList.add("is-success");
  });

  // Área do cliente: alternância entre login, cadastro e recuperação.
  const authRoot = document.querySelector("[data-auth-root]");
  if (authRoot) {
    const authTabs = [...authRoot.querySelectorAll("[data-auth-tab]")];
    const authPanels = [...authRoot.querySelectorAll("[data-auth-panel]")];
    const registerSteps = [...authRoot.querySelectorAll("[data-register-step]")];
    const progressItems = [...authRoot.querySelectorAll(".register-progress div")];

    const showAuthPanel = (name) => {
      authPanels.forEach((panel) => {
        const selected = panel.dataset.authPanel === name;
        panel.hidden = !selected;
        panel.classList.toggle("is-active", selected);
      });
      authTabs.forEach((tab) => {
        const selected = tab.dataset.authTab === name;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
    };

    const showRegisterStep = (step) => {
      registerSteps.forEach((item) => {
        const selected = Number(item.dataset.registerStep) === step;
        item.hidden = !selected;
        item.classList.toggle("is-active", selected);
      });
      progressItems.forEach((item, index) => item.classList.toggle("is-active", index < step));
    };

    const validateFields = (container) => {
      const fields = [...container.querySelectorAll("input[required]")];
      let valid = true;
      fields.forEach((field) => {
        const label = field.closest("label");
        const fieldValid = field.checkValidity();
        label?.classList.toggle("has-error", !fieldValid);
        if (!fieldValid) valid = false;
      });
      if (!valid) container.querySelector("input:invalid")?.focus();
      return valid;
    };

    authTabs.forEach((tab) => tab.addEventListener("click", () => showAuthPanel(tab.dataset.authTab)));
    authRoot.querySelectorAll("[data-auth-link]").forEach((link) =>
      link.addEventListener("click", () => showAuthPanel(link.dataset.authLink)),
    );

    authRoot.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        const visible = input.type === "text";
        input.type = visible ? "password" : "text";
        button.textContent = visible ? "Ver" : "Ocultar";
        button.setAttribute("aria-label", visible ? "Mostrar senha" : "Ocultar senha");
      });
    });

    const firstStep = authRoot.querySelector('[data-register-step="1"]');
    authRoot.querySelector("[data-register-next]")?.addEventListener("click", () => {
      if (validateFields(firstStep)) showRegisterStep(2);
    });
    authRoot.querySelector("[data-register-back]")?.addEventListener("click", () => showRegisterStep(1));

    const newPassword = authRoot.querySelector('input[name="new-password"]');
    const strength = authRoot.querySelector(".password-strength");
    newPassword?.addEventListener("input", () => {
      const value = newPassword.value;
      let score = 0;
      if (value.length >= 15) score++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      const labels = ["Segurança da senha", "Senha fraca", "Senha razoável", "Senha boa", "Senha forte"];
      const colors = ["#bf5656", "#bf5656", "#d49b2d", "#6f9e62", "#3f8a56"];
      strength.style.setProperty("--strength", `${score * 25}%`);
      strength.style.setProperty("--strength-color", colors[score]);
      strength.querySelector("span").textContent = labels[score];
    });

    authRoot.querySelectorAll("input").forEach((input) =>
      input.addEventListener("input", () => input.closest("label")?.classList.remove("has-error")),
    );

    authRoot.querySelectorAll("[data-auth-form]").forEach((authForm) => {
      authForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!validateFields(authForm)) return;
        if (authForm.dataset.authForm === "register") {
          const password = authForm.querySelector('input[name="new-password"]');
          const confirmation = authForm.querySelector('input[name="confirm-password"]');
          if (password.value !== confirmation.value) {
            confirmation.closest("label")?.classList.add("has-error");
            confirmation.focus();
            return;
          }
        }
        const feedback = authForm.querySelector(".auth-feedback");
        const messages = {
          login: "Dados validados. O acesso será conectado ao servidor na versão final.",
          register: "Solicitação validada. O cadastro será enviado para aprovação na versão final.",
          recover: "E-mail validado. O envio das instruções será conectado na versão final.",
        };
        feedback.textContent = messages[authForm.dataset.authForm];
        feedback.classList.add("is-visible");
      });
    });
  }

  // Atualiza automaticamente o ano do rodapé.
  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();

  // Revela os blocos das páginas internas durante a rolagem.
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});
/* Menu responsivo compartilhado por todas as páginas.
   O botão é criado pelo JavaScript para manter o HTML das páginas simples. */
const siteHeader = document.querySelector(".topbar");

if (siteHeader) {
  const siteNav = siteHeader.querySelector("nav");

  if (siteNav) {
    const menuButton = document.createElement("button");
    menuButton.className = "mobile-menu-toggle";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Abrir menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = "<span></span><span></span><span></span>";
    siteHeader.appendChild(menuButton);

    const closeMenu = () => {
      siteHeader.classList.remove("menu-open");
      document.body.classList.remove("menu-is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = siteHeader.classList.toggle("menu-open");
      document.body.classList.toggle("menu-is-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
}
