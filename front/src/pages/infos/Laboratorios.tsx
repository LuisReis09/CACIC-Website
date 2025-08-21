import React from 'react';
import { useRouter } from 'next/router';

import styles_back_button from '../../styles/infos/ProfessorList.module.css'
import styles from '@/styles/infos/Laboratorios.module.css';
import LabCard from '@/utils/LabCard';
import { NotificacaoTipo, Notificacao } from '@/utils/Notificacao';

const Laboratorios: React.FC = () => {
    const router = useRouter();
    const [laboratorios, setLaboratorios] = React.useState<any[]>([]);
    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

    const fetchLaboratorios = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratorios/listar`)
            .then(response => response.json())
            .then(data => {
                setLaboratorios(data);
            })
            .catch(error => {
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro ao carregar laboratórios',
                    conteudo: 'Ocorreu um erro ao carregar os laboratórios. Por favor, tente novamente mais tarde.'
                });
            });
    }

    React.useEffect(() => {
        fetchLaboratorios();
    }, []);

    return (
        <div className={"main_container"}>
            {
                notificacao && 
                <Notificacao 
                    tipo={notificacao.tipo} 
                    titulo={notificacao.titulo} 
                    conteudo={notificacao.conteudo} 
                    onRemover={() => setNotificacao(null)} />
            }
            
                <div className={styles_back_button.header}>
                <div className={styles_back_button.back_button} onClick={() => router.push("/Infos")}>
                    <i className={"fa fa fa-caret-left" + " " + styles_back_button.i} />
                </div>
                <p>Informações dos Laboratórios</p>
            </div>

            <div className={styles.labs_container + " scrollbar"}>
            {
                laboratorios.map((laboratorio, index) => (
                    <LabCard
                        key={index}
                        nome={laboratorio.nome}
                        link={laboratorio.link}
                        descricao={laboratorio.descricao}
                        localizacao={laboratorio.localizacao}
                        imagem={laboratorio.imagem || "ufpb_logo.svg"} // Fallback image
                    />
                ))
            }
            </div>
        </div>
    );

}

export default Laboratorios;