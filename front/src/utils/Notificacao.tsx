import React from 'react';
import { useState, useEffect } from 'react';

import styles from '../styles/utils/Notificacao.module.css';

export enum NotificacaoTipo {
  INFO = 'INFO',
  SUCESSO = 'SUCESSO',
  ERRO = 'ERRO',
  ATENCAO = 'ATENCAO'
}

interface NotificacaoProps {
  tipo: NotificacaoTipo;
  titulo: string;
  conteudo: string;
  tempo?: number;
  width?: string | null;
  onRemover?: () => void;
}

export const Notificacao: React.FC<NotificacaoProps> = ({ tipo, titulo, conteudo, tempo = 5000, width, onRemover }) => {
  const [classeAnimacao, setClasseAnimacao] = useState(styles.invisivel);

  useEffect(() => {
    const entrada = setTimeout(() => setClasseAnimacao(styles.visivel), 10);

    const saida = setTimeout(() => setClasseAnimacao(styles.invisivel), tempo);

    const remover = setTimeout(() => {
      onRemover?.();
    }, tempo + 600); 

    return () => {
      clearTimeout(entrada);
      clearTimeout(saida);
      clearTimeout(remover);
    };
  }, [tempo, onRemover]);

  const RenderIcone = () => {
    switch (tipo) {
      case NotificacaoTipo.INFO:
        return <i className={styles.notificacao_icon + ' ' + styles.info_icon + ' fa fa-info-circle'}></i>;
      case NotificacaoTipo.SUCESSO:
        return <i className={styles.notificacao_icon + ' ' + styles.sucesso_icon + ' fa fa-check-circle'}></i>;
      case NotificacaoTipo.ERRO:
        return <i className={styles.notificacao_icon + ' ' + styles.erro_icon + ' fa fa-exclamation-triangle'}></i>;
      case NotificacaoTipo.ATENCAO:
        return <i className={styles.notificacao_icon + ' ' + styles.atencao_icon + ' fa fa-exclamation-circle'}></i>;
      default:
        return "";
    }
  };

  const RenderEstiloLateral = () => {
    switch (tipo) {
      case NotificacaoTipo.INFO:
        return styles.info;
      case NotificacaoTipo.SUCESSO:
        return styles.sucesso;
      case NotificacaoTipo.ERRO:
        return styles.erro;
      case NotificacaoTipo.ATENCAO:
        return styles.atencao;
      default:
        return '';
    }
  };

  return (
    <div
      className={`${styles.notificacao_box} ${classeAnimacao}`}
      style={width ? { width: width + 'px' } : {}}
    >
      <i
        className={'fa fa-times-circle ' + styles.fechar}
        onClick={() => setClasseAnimacao(styles.invisivel)}
      ></i>
      <div className={RenderEstiloLateral() + ' ' + styles.barra_lateral} />

      <div className={styles.notificacao_container}>
        {RenderIcone()}

        <div className={styles.notificacao}>
          <h3 className={styles.notificacao_titulo}>{titulo}</h3>
          <p className={styles.notificacao_conteudo}>{conteudo}</p>
        </div>
      </div>
    </div>
  );
};
