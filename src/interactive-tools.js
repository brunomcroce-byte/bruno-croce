/**
 * TributaOAB Desktop Pro — Script de Interatividade & Acessibilidade
 * Provê atalhos globais, menu flutuante de apoio ao estudante,
 * modal de atalhos e animações sutis.
 */

(function () {
  'use strict';

  // Espera carregar o DOM
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Criação do botão flutuante de Ajuda Rápida e Atalhos
    const quickBar = document.createElement('div');
    quickBar.id = 'tributa-quick-assistant';
    quickBar.setAttribute('role', 'region');
    quickBar.setAttribute('aria-label', 'Assistente Rápido de Navegação');
    quickBar.className = 'no-print';

    // Injeta estilo específico do componente interativo
    const style = document.createElement('style');
    style.textContent = `
      #tributa-quick-assistant {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 50;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        font-family: 'Segoe UI', system-ui, sans-serif;
      }
      .tributa-fab-btn {
        width: 42px;
        height: 42px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #0284c7, #2563eb);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .tributa-fab-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 18px rgba(2, 132, 199, 0.5);
      }
      .tributa-fab-btn:active {
        transform: scale(0.95);
      }
      .tributa-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(4px);
        z-index: 100;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: fadeIn 0.15s ease-out;
      }
      .tributa-modal-backdrop.active {
        display: flex;
      }
      .tributa-modal-content {
        background: #1e293b;
        border: 1px solid #475569;
        border-radius: 16px;
        max-width: 500px;
        width: 100%;
        color: #f1f5f9;
        padding: 24px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Botão FAB
    const fabButton = document.createElement('button');
    fabButton.className = 'tributa-fab-btn';
    fabButton.setAttribute('title', 'Atalhos de Teclado & Central de Ajuda [Pressione ?]');
    fabButton.setAttribute('aria-label', 'Atalhos de Teclado');
    fabButton.innerHTML = '?';

    // Modal de Atalhos
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'tributa-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div class="tributa-modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #334155; padding-bottom: 12px;">
          <h3 id="modal-title" style="margin: 0; font-size: 16px; font-weight: 700; color: #38bdf8;">
            ⚡ Atalhos Rápidos do TributaOAB
          </h3>
          <button id="close-tributa-modal" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">&times;</button>
        </div>
        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 1</kbd> Painel & Regras</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 2</kbd> Cronograma</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 3</kbd> Peças FGV</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 4</kbd> Competência</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 5</kbd> Direito Material</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 6</kbd> Súmulas</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 7</kbd> Simulador 150L</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 8</kbd> Flashcards</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 9</kbd> Vade Mecum</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + 0</kbd> Legislação</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + M</kbd> Mapas Mentais</div>
          <div><kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #38bdf8;">Alt + P</kbd> Planner</div>
          <div style="grid-column: span 2; margin-top: 6px; padding-top: 8px; border-top: 1px solid #334155;">
            <kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #4ade80;">Ctrl + K</kbd> ou <kbd style="background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #475569; color: #4ade80;">/</kbd> : <strong>Busca Global Integrada</strong>
          </div>
        </div>
        <div style="margin-top: 16px; text-align: right;">
          <button id="btn-entendido" style="background: #0284c7; color: white; border: none; padding: 6px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
            Entendido
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);
    quickBar.appendChild(fabButton);
    document.body.appendChild(quickBar);

    function toggleModal(show) {
      if (show) {
        modalBackdrop.classList.add('active');
      } else {
        modalBackdrop.classList.remove('active');
      }
    }

    fabButton.addEventListener('click', () => toggleModal(true));
    modalBackdrop.querySelector('#close-tributa-modal').addEventListener('click', () => toggleModal(false));
    modalBackdrop.querySelector('#btn-entendido').addEventListener('click', () => toggleModal(false));
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) toggleModal(false);
    });

    // Pressionar '?' abre a modal de atalhos (se não estiver em campo de texto)
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (!isInput && e.key === '?') {
        e.preventDefault();
        toggleModal(!modalBackdrop.classList.contains('active'));
      }
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        toggleModal(false);
      }
    });

    console.log('[TributaOAB] Interatividade inicializada com sucesso.');
  });
})();
