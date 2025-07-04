import React from 'react';
import styles from './../styles/Sobre.module.css';

const membros = [
  {
    nome: 'Lucas Gabriel',
    cargo: 'Presidente',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  {
    nome: 'Luis Gustavo',
    cargo: 'Tesoureiro',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  {
    nome: 'Herick José',
    cargo: '???',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  {
    nome: 'Iguatemir',
    cargo: 'Mastermind',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  {
    nome: 'Iguatemir',
    cargo: 'Mastermind',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  {
    nome: 'Iguatemir',
    cargo: 'Mastermind',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  {
    nome: 'Iguatemir',
    cargo: 'Mastermind',
    avatar: '', 
    github: '#',
    linkedin: '#',
  },
  
];

const SobreContent: React.FC = () => (
  <div className={styles.rightPane}>
    <div className={styles.contentRow}>
      <div className={styles.membersGrid + " scrollbar"}>
        {membros.map((membro, idx) => (
          <div className={styles.memberCard} key={idx}>
            <div className={styles.avatar}>
            </div>
            <div className={styles.info}>
              <p className={styles.name}>{membro.nome}</p>
              <p className={styles.role}>{membro.cargo}</p>
              <div className={styles.socials}>
                <a href={membro.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github" />
                </a>
                <a href={membro.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.text}>
        <h2>Qual o nosso objetivo?</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, GANHAR DINHEIRO!  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <h2>Como nos contatar?</h2>
        <p>
            Lorem ipsum dolor sit amet, loren sask consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>
    </div>
  </div>
);

export default SobreContent;