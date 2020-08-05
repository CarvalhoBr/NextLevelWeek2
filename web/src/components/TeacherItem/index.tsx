import React from 'react'

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css'

export default function TeacherItem(){
    return(
        <article className="teacher-item">
            <header>
                <img src="https://avatars0.githubusercontent.com/u/56210319?s=460&u=b80f87e5a9e42d935269c427f1706534df2df9e9&v=4" alt="me"/>
                <div>
                    <strong>
                        Brandon Carvalho
                    </strong>
                    <span>
                        História
                    </span>
                </div>
            </header>
            <p>
                Entusiásta dos melhores livros da mitologia nórdica
                <br/><br/>
                Vivendo só pra jogar assassins creed valhalla 
            </p>
            <footer>
                <p>
                    Preço/hora
                    <strong>
                        R$ 70,00
                    </strong>
                </p>
                <button>
                    <img src={whatsappIcon} alt="whatsapp"/>
                    Entrar em contato
                </button>
            </footer>
        </article>
    )
    
}