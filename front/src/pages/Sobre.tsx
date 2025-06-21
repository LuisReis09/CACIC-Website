import React from 'react';
import { useRouter } from 'next/router';

const Sobre: React.FC = () => {
    const router = useRouter();

    return (
        <div className={"main_container"}>
           Sobre
           {/* <button onClick={() => router.push("/Infos")}>Mudar</button> */}
        </div>
    );

}

export default Sobre;