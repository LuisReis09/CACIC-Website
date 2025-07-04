import React from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/jogos/Id.module.css';



const Jogo: React.FC = () => {
    const router = useRouter();

    const { id } = router.query;
    const [jogo, setJogo] = React.useState<any>(null);
    const [horarios, setHorarios] = React.useState<any[]>([]);

    const [horariosSelected, setHorariosSelected] = React.useState<Set<string>>(new Set());

    const parseHorarios = () => {
        return Array.from(horariosSelected).map(horario => {
            return Number(horario);
        })
    }

    const handleHorarioClassName = (horario: string) => {
        if (horariosSelected.has(horario)) 
            return styles.horario_card_selected;

        else if (horarios[0][horario] === "DISPONIVEL")
            return styles.horario_card_disponivel;

        else
            return styles.horario_card_alugado;
    }

    const handleHorarioClick = (horario: string) => {
        setHorariosSelected(prev => {
            // Não permite selecionar horários já alugados
            if(horarios[0][horario] != "DISPONIVEL") return prev; 
            
            // Se o horário já estiver selecionado, remove-o; caso contrário, adiciona-o
            const newSet = new Set(prev);
            if (newSet.has(horario)) {
                newSet.delete(horario);
            } else {
                newSet.add(horario);
            }
            return newSet;
        });
    };

    React.useEffect(() => {
        if (id) {
            fetch(`http://localhost:4000/jogos/consultar/${id}`)
                .then(response => response.json())
                .then(data => setJogo(data))
                .catch(error => console.error('Erro ao buscar jogo:', error));
                

            fetch(`http://localhost:4000/aluguel/disponibilidade/${id}`)
                .then(response => response.json())
                .then(data => {
                    setHorarios([data]);
                })
                .catch(error => console.error('Erro ao buscar horários:', error));
        }
    }, []);

    return (
        <div className={"main_container " + styles.jogo_container}>
            
            <div className={styles.header}>
                <div className={styles.back_button} onClick={() => router.push("../Jogos")}>
                <i className={"fa fa-caret-left" + " " + styles.i} />
                </div>
                <p>Alugar {jogo?.nome}</p>
            </div>


            <div className={styles.jogo_details}>
                    <div className={styles.jogo_info}>
                        <img 
                            className={styles.jogo_img}
                            src={jogo?.imagem} 
                            alt="Imagem Ilustrativa do Jogo"/>
                        <div className={styles.jogo_text}>
                            <h1 className={styles.h1}>{jogo?.nome}</h1>
                            <p><span className={styles.span}>R$ {Number(jogo?.precoPorHora).toFixed(2)}</span> por hora</p>
                        </div>
                    </div>

                    <div className={styles.horarios}>
                        <p className={styles.horarios_title}>Selecione os horários disponíveis <br/> que deseja alugar:</p>
                        <div className={styles.horarios_container}>
                            {   
                                horarios &&
                                Object.keys(horarios[0] || {}).map((horario) => {
                                    return (
                                        <div 
                                            className={styles.horario_card + " " + handleHorarioClassName(horario)} 
                                            key={horario}
                                            onClick={() => handleHorarioClick(horario)}>

                                            <p>{Number(horario) < 10 ? "0":""}{horario}:00 - {Number(horario) < 9 ? "0":""}{Number(horario) + 1}:00</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
            </div>

            <div className={styles.form_container}>
                {/* Aqui vai o formulário dos dados do cliente */}
                <p>Para solicitar a reserva do aluguel, preencha as informações abaixo:</p>
                
            </div>
        </div>
    );

}

export default Jogo;