import styled from 'styled-components'
import MainGrid from '../src/components/MainGrid/'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import { useState, useEffect } from 'react'
import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { userCheck } from '../src/functions';

function ProfileSidebar(props) {
  return (
    <Box >
      <img src={`https://github.com/${props.userimage}.png`}
        alt="Foto do usuário" style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.userimage}`}>
          @{props.userimage}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {/* {comunidades.map((itemAtual) => {
          return (
            <li>
              <a href={`/users/${itemAtual.title}`} key={itemAtual.id}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>

    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {

  const userProfile = props.githubUser;

  const [comunidades, setComunidades] = useState([]);

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    const seguidores = fetch('https://api.github.com/users/peas/followers')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSeguidores(data);
      })
      .catch((error) => {
        console.log(error)
      })

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '4ae795cbe12556b4bc820dc14ee9a2',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities{
            title
            id
            imageUrl
            creatorSlug
          }
        }` })
    })
      .then((response) => response.json())
      .then((data) => {
        const comunidadesApi = data.data.allCommunities;
        console.log(comunidadesApi)
        setComunidades(comunidadesApi);
      })
  }, []);



  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar userimage={userProfile} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">
              O que você deseja fazer?
            </h2>
            <form onSubmit={function handleSubmit(e) {
              e.preventDefault();

              const dadosForm = new FormData(e.target);

              const comunidade = {
                id: new Date().toISOString,
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                creatorSlug: userProfile,
              }

              fetch("/api/comunidades", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
                .then(async (response) => {
                  const data = await response.json();
                  console.log(data.created);
                  const comunidade = data.created;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })


            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  arial-aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  arial-aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                />
              </div>

              <button>
                Criar comunidade
              </button>

            </form>
          </Box>
        </div>


        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li>
                    <a href={`/communities/${itemAtual.id}`} key={itemAtual.id}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} key={userProfile}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {

  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const  {isAuthenticated}  = await fetch(
    'https://alurakut.vercel.app/api/auth',
    {
      headers: {
        Authorization: token,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    };
  }

  console.log(isAuthenticated);

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser
    },
  }
}
