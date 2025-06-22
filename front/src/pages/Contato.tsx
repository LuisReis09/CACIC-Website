import React from 'react';

const Contato: React.FC = () => {
    return(
        <div className={"main_container"}>
            <h1>Contate-nos via <span>E-mail</span></h1>

            <div>
                <label htmlFor="campo_remetente">Remetente:</label>
                <input type="text" name="campo_remetente"/>
            </div>

            <div>
                <label htmlFor="campo_assunto">Assunto:</label>
                <input type="text" name="campo_assunto"/>
            </div>

            <div>
                <label htmlFor="campo_conteudo">Conteúdo:</label>
                <input type="text" name="campo_conteudo"/>
            </div>

            <button>Enviar</button>
        </div>
    )
}

export default Contato;