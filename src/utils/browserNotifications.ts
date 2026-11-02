/**
 * Utilitário de Notificações do Navegador (Notifications API & Push API)
 * Permite alertar o usuário mesmo com a janela minimizada ou em segundo plano.
 */

import { SafeStorage } from './storage';

export type StatusPermissaoNotificacao = 'default' | 'granted' | 'denied' | 'nao_suportado';

export interface OpcoesNotificacaoDesktop {
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  onClick?: () => void;
}

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Inicializa e registra o Service Worker para garantir notificações mesmo em segundo plano
 */
export async function inicializarServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    swRegistration = reg;
    return reg;
  } catch (err) {
    // Fallback silencioso caso ambiente ou iframe restrinja workers
    return null;
  }
}

/**
 * Verifica se a API de Notificações é suportada pelo navegador atual
 */
export function checarSuporteNotificacao(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Retorna o status atual da permissão de notificações do navegador
 */
export function obterStatusPermissaoNotificacao(): StatusPermissaoNotificacao {
  if (!checarSuporteNotificacao()) {
    return 'nao_suportado';
  }
  return Notification.permission as StatusPermissaoNotificacao;
}

/**
 * Solicita a permissão do usuário para exibir notificações nativas de desktop
 */
export async function solicitarPermissaoNotificacao(): Promise<StatusPermissaoNotificacao> {
  if (!checarSuporteNotificacao()) {
    return 'nao_suportado';
  }

  try {
    const resultado = await Notification.requestPermission();
    if (resultado === 'granted') {
      SafeStorage.set('tributa_notif_desktop_ativa', 'true');
      await inicializarServiceWorker();
    } else if (resultado === 'denied') {
      SafeStorage.set('tributa_notif_desktop_ativa', 'false');
    }
    return resultado as StatusPermissaoNotificacao;
  } catch (err) {
    // Compatibilidade com callbacks antigos
    return new Promise((resolve) => {
      try {
        Notification.requestPermission((res) => {
          if (res === 'granted') {
            SafeStorage.set('tributa_notif_desktop_ativa', 'true');
          }
          resolve(res as StatusPermissaoNotificacao);
        });
      } catch {
        resolve('denied');
      }
    });
  }
}

/**
 * Dispara uma notificação nativa do sistema operacional (Desktop / Mobile)
 * Funciona mesmo com o navegador minimizado ou focado em outra janela.
 */
export async function dispararNotificacaoDesktop(
  titulo: string,
  opcoes: OpcoesNotificacaoDesktop
): Promise<boolean> {
  if (!checarSuporteNotificacao()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  const defaultIcon = '/favicon.ico';
  const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
    body: opcoes.body,
    icon: opcoes.icon || defaultIcon,
    badge: opcoes.badge || defaultIcon,
    tag: opcoes.tag || 'tributaoab-notif',
    requireInteraction: opcoes.requireInteraction ?? true,
    silent: false,
    vibrate: [200, 100, 200]
  };

  // 1. Tentar exibir via Service Worker Registration (melhor suporte com app minimizado)
  try {
    if ('serviceWorker' in navigator) {
      const reg = swRegistration || (await navigator.serviceWorker.getRegistration());
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(titulo, notificationOptions);
        return true;
      }
    }
  } catch (err) {
    // Fallback para new Notification caso o Service Worker não esteja disponível
  }

  // 2. Fallback direto via API nativa Notification
  try {
    const notif = new Notification(titulo, notificationOptions);
    notif.onclick = () => {
      window.focus();
      notif.close();
      if (opcoes.onClick) {
        opcoes.onClick();
      }
    };
    return true;
  } catch (err) {
    console.warn('Erro ao disparar Notification:', err);
    return false;
  }
}
