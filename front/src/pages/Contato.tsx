import React from 'react';
import { Notificacao, NotificacaoTipo } from '../utils/Notificacao';

// Styles Imports
import styles from '../styles/Contato.module.css';
import { EventEmitterAsyncResource } from 'events';

const Contato: React.FC = () => {
    const [remetente, setRemetente] = React.useState('');
    const [assunto, setAssunto] = React.useState('');
    const [mensagem, setMensagem] = React.useState('');

    const [notificacao, setNotificacao] = React.useState<{
    tipo: NotificacaoTipo;
    titulo: string;
    conteudo: string;
} | null>(null);


    const handleEnviarEmail = async () => {
        fetch('http://localhost:4000/monitorias/SAC', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: remetente,
                assunto: assunto,
                mensagem: mensagem
            })

        })
        .then(response => {
            if (response.ok) {
                setNotificacao({
                tipo: NotificacaoTipo.SUCESSO,
                titulo: "E-mail Enviado!",
                conteudo: "Seu e-mail foi enviado com sucesso!"
            });
            } else {
                setNotificacao({
                tipo: NotificacaoTipo.ERRO,
                titulo: "Erro ao Enviar E-mail!",
                conteudo: "Ocorreu um erro ao enviar o e-mail. Por favor,Tente novamente mais tarde."
            });
            }

            setRemetente('');
            setAssunto('');
            setMensagem('');
        })
    };

    return (
        <div className={"main_container " + styles.contato_container}>
            <div className={styles.main_content + " scrollbar"}>
            <h1>Contate-nos por <span>E-mail</span>!</h1>

            <div className={styles.form_box}>

                <div className={styles.form_container}>
                    <label htmlFor="remetente">Remetente:</label>
                    <input 
                        type="email" 
                        name="remetente" 
                        placeholder="Seu e-mail" 
                        maxLength={100} 
                        value={remetente} 
                        onChange={(e) => setRemetente(e.target.value)} 
                        required
                    />
                </div>

                <div className={styles.form_container}>
                    <label htmlFor="assunto">Assunto:</label>
                    <input 
                        type="text" 
                        name="assunto" 
                        placeholder="Assunto do e-mail" 
                        maxLength={100} 
                        value={assunto} 
                        onChange={(e) => setAssunto(e.target.value)} 
                        required
                    />
                </div>

                <div className={styles.form_container}>
                    <label htmlFor="mensagem">Mensagem:</label>
                    <textarea 
                        name="mensagem" 
                        placeholder="Digite sua mensagem aqui..." 
                        maxLength={500} 
                        value={mensagem} 
                        onChange={(e) => setMensagem(e.target.value)} 
                        required
                    ></textarea>
                </div>

                <button className={styles.submit_button} onClick={() => handleEnviarEmail()}>Enviar</button>

            </div>
           
            </div>
        </div>
    );

}

export default Contato;