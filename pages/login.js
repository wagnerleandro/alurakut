import React, { useState } from 'react';
import {useRouter} from 'next/router';
import nookies from 'nookies';

export default function LoginScreen() {

    const router = useRouter();
    const [githubUser, setGithubUser] = useState('');
    
    return (
            <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <div className="loginScreen">
                    <section className="logoArea">
                        <img src="https://alurakut.vercel.app/logo.svg" alt="Logo Alurakut" />
                        <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
                        <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
                        <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
                    </section>

                    <section className="formArea">
                        <form className="box" onSubmit={(e) =>{
                            e.preventDefault();
                            router.push('/')
                            fetch('https://alurakut.vercel.app/api/login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'Application/json'
                                },
                                body: JSON.stringify({ githubUser: githubUser })
                            })
                            .then(async (responseServer) =>{
                                const data = await responseServer.json()
                                const token = data.token;
                                nookies.set(null, 'USER_TOKEN', token, {
                                    path: '/',
                                    maxAge: 86400 * 7
                                })
                                router.push('/')
                            })

                        }} >
                            <p>
                                Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
                            </p>
                            <input 
                                value={githubUser}
                                required
                                placeholder="Usuário" 
                                onChange={(e) =>{
                                    setGithubUser(e.target.value)
                                }}
                                
                            /> 
                            <button type="submit" aria-label="Login" style={{ background: '#2E7BB4' }}>
                                Login
                            </button>
                        </form>

                        <footer className="box">
                            <p>
                                Ainda não é membro? <br />
                                <a href="/login" style={{ color: '#226ca3' }}>
                                    <strong>
                                        ENTRAR JÁ
                                    </strong>
                                </a>
                            </p>
                        </footer>
                    </section>

                    <footer className="footerArea">
                        <p>
                            ©2021 alura.com.br - 
                            <a href="https://github.com/alura-challenges/alurakut/" title="Sobre o Alurakut" target="_blank" rel="noopener noreferrer"> Sobre o Alurakut.br</a> -
                            <a href="/"> Centro de segurança</a> - 
                            <a href="/"> Privacidade</a> - 
                            <a href="/"> Termos</a> - 
                            <a href="/"> Contato</a>
                        </p>
                    </footer>
                </div>
            </main>
       
    )
}