/* =========================================================
   LIVRO INTERATIVO - JavaScript Puro
   Controla abertura, fechamento e virada de páginas
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  // Seleciona todos os livros da página (suporta múltiplos)
  const books = document.querySelectorAll('.book-wrapper');

  books.forEach(function (wrapper) {
    const container = wrapper.querySelector('.book-container');
    const cover = wrapper.querySelector('.book-cover');
    const coverBack = wrapper.querySelector('.cover-back');
    const pages = wrapper.querySelectorAll('.book-page');
    const closeBtn = wrapper.querySelector('.book-close-btn');
    const hint = wrapper.querySelector('.book-hint');
    const prevBtn = wrapper.querySelector('.book-nav-prev');
    const nextBtn = wrapper.querySelector('.book-nav-next');
    const dots = wrapper.querySelectorAll('.book-page-dot');
    const restartBtn = wrapper.querySelector('.book-back-cover__restart');

    if (!container || !cover) {
      console.warn("Livro interativo: '.book-container' ou '.book-cover' não encontrado no wrapper.");
      return;
    }

    let isOpen = false;
    let currentPage = -1; // -1 = nenhuma página virada (mostrando capa interna)
    const totalPages = pages ? pages.length : 0;

    // --- Funções auxiliares ---

    function updatePageZIndex() {
      pages.forEach(function (page, i) {
        const isFlipped = i <= currentPage;
        if (isFlipped) {
          page.style.zIndex = i + 1;
        } else {
          page.style.zIndex = totalPages - i;
        }
      });
    }

    function updateDots() {
      dots.forEach(function (dot, i) {
        // O índice -1 ativa o dot da capa (se existir), senão ativa por página
        if (i === currentPage + 1) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }

    function updateNavButtons() {
      if (prevBtn) {
        prevBtn.disabled = currentPage < -1;
      }
      if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages - 1;
      }
    }

    // --- Abrir o livro ---
    function openBook() {
      if (isOpen) return;
      isOpen = true;
      currentPage = -1;
      wrapper.classList.add('is-open');
      container.classList.add('is-open');
      cover.classList.add('is-flipped');
      updatePageZIndex();
      updateDots();
      updateNavButtons();
    }

    // --- Fechar o livro ---
    function closeBook() {
      if (!isOpen) return;
      isOpen = false;
      currentPage = -1;
      wrapper.classList.remove('is-open');
      container.classList.remove('is-open');
      cover.classList.remove('is-flipped');

      // Desvira todas as páginas
      pages.forEach(function (page) {
        page.classList.remove('is-flipped');
      });

      updatePageZIndex();
      updateDots();
      updateNavButtons();
    }

    // --- Próxima página ---
    function nextPage() {
      if (currentPage >= totalPages - 1) return;
      currentPage++;
      pages[currentPage].classList.add('is-flipped');
      updatePageZIndex();
      updateDots();
      updateNavButtons();
    }

    // --- Página anterior ---
    function prevPage() {
      if (currentPage < 0) return;
      pages[currentPage].classList.remove('is-flipped');
      currentPage--;
      updatePageZIndex();
      updateDots();
      updateNavButtons();
    }

    // --- Ir para página específica ---
    function goToPage(targetPage) {
      // targetPage: -1 = capa interna, 0 = primeira página, etc.
      while (currentPage < targetPage) {
        currentPage++;
        pages[currentPage].classList.add('is-flipped');
      }
      while (currentPage > targetPage) {
        pages[currentPage].classList.remove('is-flipped');
        currentPage--;
      }
      updatePageZIndex();
      updateDots();
      updateNavButtons();
    }

    // --- Recomeçar ---
    function restart() {
      goToPage(-1);
    }

    // --- Event listeners ---

    // Clicar na capa para abrir
    cover.addEventListener('click', function (e) {
      if (!isOpen) {
        e.stopPropagation();
        openBook();
      }
    });

    // Clicar na capa interna (verso) para voltar
    if (coverBack) {
      coverBack.addEventListener('click', function (e) {
        e.stopPropagation();
        prevPage();
      });
    }

    // Clicar na dica para abrir
    if (hint) {
      hint.addEventListener('click', function () {
        openBook();
      });
    }

    // Botão fechar
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeBook();
      });
    }

    // Setas de navegação
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        prevPage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        nextPage();
      });
    }

    // Clique nas frentes das páginas (avança)
    pages.forEach(function (page) {
      var front = page.querySelector('.page-front');
      if (front) {
        front.addEventListener('click', function (e) {
          e.stopPropagation();
          nextPage();
        });
      }

      var back = page.querySelector('.page-back');
      if (back) {
        back.addEventListener('click', function (e) {
          e.stopPropagation();
          prevPage();
        });
      }
    });

    // Dots indicadores
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToPage(i - 1); // i=0 é capa, i=1 é página 0, etc.
      });
    });

    // Botão recomeçar
    if (restartBtn) {
      restartBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        restart();
      });
    }

    // Navegação por teclado
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') closeBook();
    });

    // Inicializa
    updatePageZIndex();
    updateNavButtons();
  });
});
