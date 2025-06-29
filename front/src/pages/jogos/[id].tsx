import React from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/jogos/Id.module.css';

const Jogo: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [jogo, setJogo] = React.useState<any>(null);
    const [horarios, setHorarios] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/jogos/consultar/${id}`)
                .then(response => response.json())
                .then(data => setJogo(data))
                .catch(error => console.error('Erro ao buscar jogo:', error));

            fetch(`http://localhost:4000/aluguel/disponibilidade/${id}`)
                .then(response => response.json())
                .then(data => {
                    setHorarios(data);
                })
                .catch(error => console.error('Erro ao buscar horários:', error));
        }
    }, []);

    return (
        <div className={styles.jogo_container}>
            <div>
                <i className='fa fa-arrow-left'></i>
                <h1>Alugar {jogo.nome}</h1>
            </div>


            <div className={styles.jogo_details}>
                    <div className={styles.jogo_info}>
                        <img src={jogo?.imagem} alt="Imagem Ilustrativa do Jogo"></img>
                        <div className={styles.jogo_text}>
                            <h1>{jogo?.nome}</h1>
                            <p><strong>R$ {jogo?.precoPorHora}</strong> por hora</p>
                        </div>
                    </div>

                    <div>
                        {
                            horarios &&
                            horarios.map((horario, index) => {
                                return <></>
                            })
                        }
                    </div>
            </div>

            <div>
                {/* Aqui vai o formulário dos dados do cliente */}
            </div>
        </div>
    );

}

export default Jogo;