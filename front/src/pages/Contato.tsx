import React from 'react';

// Styles Imports
import styles from '../styles/Contato.module.css';

const Contato: React.FC = () => {
    return (
        <div className={"main_container " + styles.contato_container}>
            <h1>Contate-nos por <span>E-mail</span>!</h1>

            <form className={styles.form_box}>

                <div className={styles.form_container}>
                    <label htmlFor="remetente">Remetente:</label>
                    <input type="email" name="remetente" placeholder="Seu e-mail" maxLength={50} required />
                </div>

                <div className={styles.form_container}>
                    <label htmlFor="assunto">Assunto:</label>
                    <input type="text" name="assunto" placeholder="Assunto da mensagem" maxLength={100} required />
                </div>

                <div className={styles.form_container}>
                    <label htmlFor="mensagem">Mensagem:</label>
                    <textarea name="mensagem" placeholder="Digite sua mensagem aqui" maxLength={1500} required></textarea>
                </div>

                <button className={styles.submit_button} type="submit">Enviar</button>

            </form>
           
        </div>
    );

}

export default Contato;