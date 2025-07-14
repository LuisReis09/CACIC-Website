import React from 'react';
import { useAdminContext } from '../../utils/AdminContext';
import { useRef } from 'react';


import styles from '../../styles/admin/Login.module.css';
import { Notificacao, NotificacaoTipo } from '../../utils/Notificacao';  


const Login: React.FC = () => {
    const [login, setLogin]       = React.useState('');
    const [password, setPassword] = React.useState('');
    const { setScreen } = useAdminContext();

    const [notificacao, setNotificacao] = React.useState<{
        tipo: NotificacaoTipo;
        titulo: string;
        conteudo: string;
    } | null>(null);

    // Referência para o campo de login
    const passwordInputRef = useRef<HTMLInputElement>(null);


    const handleLogin = () => {
        fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: login,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Se data tiver campo 'acess_token', significa que o login foi bem-sucedido
            if (data.access_token) {
                // Armazena o token no localStorage
                localStorage.setItem('adminToken', data.access_token); // Armazena o token no localStorage
                setScreen('listar');
            }else{
                // Se não, exibe uma mensagem de erro
                setNotificacao({
                    tipo: NotificacaoTipo.ERRO,
                    titulo: 'Erro ao fazer login',
                    conteudo: 'Login falhou. Verifique suas credenciais e tente novamente.',
                });
            }
        })
    }

    React.useEffect(() => {
        // Verifica se já existe um token no localStorage, se existe, testa se ainda é válido
        const token = localStorage.getItem('adminToken');
        if (token) {
            fetch('http://localhost:4000/auth/validar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => {
                if (response.ok) {
                    // Se a resposta for ok, significa que o token é válido
                    setScreen('listar');
                } else {
                    // Se não, limpa o token do localStorage
                    localStorage.removeItem('adminToken');
                }
            })
            .catch(error => {
                localStorage.removeItem('adminToken'); // Limpa o token em caso de erro
            });
        }
    }, []);

    return (
        <div className={styles.admin_login_container}>
            {notificacao && (
                <Notificacao
                    tipo={notificacao.tipo}
                    titulo={notificacao.titulo}
                    conteudo={notificacao.conteudo}
                    onRemover={() => setNotificacao(null)}
                />
            )}
            
           <h1><span className={styles.admin_span_highlight}>Admin</span> Log-In</h1>

            <div className={styles.admin_login_inputs}>
                <div className={styles.admin_login_input_container}>
                    <label htmlFor="login">Login:</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Enter your login..."
                        maxLength={100}
                        onKeyDown={(e) => {
                            // Se pressionar Enter, move pro campo de senha, referenciado por passwordInputRef
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Previne o comportamento padrão do Enter
                                if (passwordInputRef.current) {
                                    passwordInputRef.current.focus(); // Foca no campo de senha
                                }
                            }
                        }}
                    />    
                </div>
                <div className={styles.admin_login_input_container}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password..."
                        maxLength={100}
                        ref={passwordInputRef} // Referência para o campo de senha
                        onKeyDown={(e) => {
                            // Se pressionar Enter, chama a função de login
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Previne o comportamento padrão do Enter
                                handleLogin(); // Chama a função de login
                            }
                        }}
                    />
                </div>    
            </div>

            <button
                onClick={() => handleLogin()}
                className={styles.admin_login_button}
            >
            Entrar
            </button>
        </div>
    );

}

export default Login;