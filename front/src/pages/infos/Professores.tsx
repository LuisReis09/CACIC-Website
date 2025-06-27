import React from 'react';

// Components Imports
import ProfessorList from './professores/ProfessorList';
import ProfessorScreen from './professores/ProfessorScreen';

const Professores = () => {
    const [screen, setScreen] = React.useState<string>("lista");
    const [professor, setProfessor] = React.useState();
    const handleSelectProfessor = (prof: any) => {
        setProfessor(prof);
        setScreen("professor");
    };
    if(screen == "lista"){
        return <ProfessorList onSelectProfessor={handleSelectProfessor}/>
    }else{
        return <ProfessorScreen setScreen={setScreen} prof={professor}/>
    }
}

export default Professores;