import React from 'react';
import styles from './../styles/Sobre.module.css';

const membros = [
  {
    nome: 'Lucas Gabriel',
    cargo: 'Presidente',
    avatar: 'https://avatars.githubusercontent.com/u/113773187?v=4', 
    github: 'https://github.com/LucasGabrielFontes',
    linkedin: 'https://www.linkedin.com/in/lucas-gabriel-fontes-da-silva-02b12930a/',
  },
  {
    nome: 'Michel',
    cargo: 'Vice-Presidente',
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQE8om5owNf_KQ/profile-displayphoto-shrink_200_200/B56ZQzggWfG8Ac-/0/1736030947632?e=1757548800&v=beta&t=mjDrOTD5HiqVizUMxO7pCe0paGDMKSmrCYISOkYDW9g',
    github: 'https://github.com/Alquimas',
    linkedin: 'https://www.linkedin.com/in/michel-medeiros-815b53344/'
  },
  {
    nome: 'Luis Gustavo',
    cargo: 'Tesoureiro',
    avatar: 'https://avatars.githubusercontent.com/u/145137414?v=4', 
    github: 'https://github.com/LuisReis09',
    linkedin: 'https://www.linkedin.com/in/luis-reis-7b22a6330/',
  },
  {
    nome: 'Rafael',
    cargo: 'Tesoureiro',
    avatar: 'https://avatars.githubusercontent.com/u/120503111?v=4',
    github: 'https://github.com/rafaelfranca1',
    linkedin: 'https://www.linkedin.com/in/rafael-franca-ofc/',
  },
  {
    nome: 'Herick José',
    cargo: 'Mídias',
    avatar: 'https://avatars.githubusercontent.com/u/125290993?v=4', 
    github: 'https://github.com/Herickjf',
    linkedin: 'https://www.linkedin.com/in/herick-jos%C3%A9-de-freitas-99a1ba266/',
  },
  {
    nome: 'Rauana',
    cargo: 'Mídias',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQFdgfH0ZnBynw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718223112046?e=1757548800&v=beta&t=J3A8qAMGfoPH3TpI7RmXapajMucZQZQ5Jk5DlFm6r2U', 
    github: 'https://github.com/rauana-carvalho',
    linkedin: 'https://www.linkedin.com/in/rauana-carvalho-8a61241b9/',
  },
  {
    nome: 'Nicolas',
    cargo: 'Arquivos',
    avatar: 'https://avatars.githubusercontent.com/u/129176336?v=4',
    github: 'https://github.com/AlecrimLunar',
    linkedin: 'https://www.linkedin.com/in/nicolas-passos-698ba3308/',
  },
  {
    nome: 'Pedro Luca',
    cargo: 'Arquivos',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQGohGZSjgvxcw/profile-displayphoto-shrink_200_200/B4DZUzvg20GcAc-/0/1740329848640?e=1757548800&v=beta&t=BXtXrFOhxH4vS2iAKrtvUQsOEQfk2v98oju5uJ5aCBU',
    github: 'https://github.com/PucaVaz',
    linkedin: 'https://www.linkedin.com/in/pucavaz/',
  }
];

const devs = [
  {
    nome: 'Herick',
    cargo: 'UX/UI e Frontend',
    avatar: 'https://avatars.githubusercontent.com/u/125290993?v=4',
    github: 'https://github.com/Herickjf',
    linkedin: 'https://www.linkedin.com/in/herick-jos%C3%A9-de-freitas-99a1ba266/',
  },
  {
    nome: 'Kaique',
    cargo: 'Frontend',
    avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQH_47isgDHNSg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729345424936?e=1757548800&v=beta&t=o_09EJ0You9vOjjzE14P3AV4TgrtxHg__dpX_GIq1bU',
    github: 'https://github.com/KaiqueSantos2004',
    linkedin: 'https://www.linkedin.com/in/kaique-santos-b25664331/',
  },
  {
    nome: 'Luis',
    cargo: 'Fullstack',
    avatar: 'https://avatars.githubusercontent.com/u/145137414?v=4',
    github: 'https://github.com/LuisReis09',
    linkedin: 'https://www.linkedin.com/in/luis-reis-7b22a6330/',
  },
  {
    nome: 'Rafael',
    cargo: 'Backend',
    avatar: 'https://avatars.githubusercontent.com/u/120503111?v=4',
    github: 'https://github.com/rafaelfranca1',
    linkedin: 'https://www.linkedin.com/in/rafael-franca-ofc/',
  },
]

const SobreContent: React.FC = () => (
  <div className={styles.rightPane}>
    <div className={styles.contentRow}>
      <div className={styles.membersGrid + " scrollbar"}>
        <h1>Devs</h1>
        {devs.map((membro, idx) => (
          <div className={styles.memberCard} key={idx}>
            <div className={styles.avatar} style={membro.avatar ? { backgroundImage: `url(${membro.avatar})` } : {}}>
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
        <hr/>
        <h1>Membros</h1>
        {membros.map((membro, idx) => (
          <div className={styles.memberCard} key={idx}>
            <div className={styles.avatar} style={membro.avatar ? { backgroundImage: `url(${membro.avatar})` } : {}}>
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