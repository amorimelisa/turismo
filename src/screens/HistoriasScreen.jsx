import React, { useEffect, useMemo, useState } from "react";
import {

  ActivityIndicator,

  Alert,

  Image,

  KeyboardAvoidingView,

  Platform,

  SafeAreaView,

  ScrollView,

  Share,

  StyleSheet,

  Text,

  TextInput,

  TouchableOpacity,

  View,

} from "react-native";

import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { listStories, publishStory } from "../services/auth";



const cores = {

  azul: "#168DB9",

  marinho: "#143252",

  ceu: "#88CAED",

  gelo: "#F5FAFF",

  claro: "#D9EFFC",

  lilas: "#CBDFFA",

  verde: "#C6EEF0",

  amarelo: "#FFED92",

  branco: "#FFFFFF",

  cinza: "#627987",

};



const imagens = {

  praia: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",

  natureza: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900",

  cidade: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900",

  montanha: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",

  cafe: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900",

};



const paises = ["Brasil", "Argentina", "Chile", "Uruguai", "Peru", "Estados Unidos", "Canadá", "Portugal", "Espanha", "França", "Itália", "Reino Unido", "Japão", "Coreia do Sul", "Tailândia", "Austrália", "Outro país"];

const estadosBrasil = ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins", "Não informado"];

const tiposLugar = ["Praias", "Pontos turísticos", "Cidades", "Natureza", "Montanhas", "Gastronomia", "Outros lugares"];

const opcoesLugar = (pais) => pais === "Brasil" ? estadosBrasil : tiposLugar;

function normalizarViagem(item) {
  const pais = item.pais || "Brasil";
  const estadoEncontrado = estadosBrasil.find((estado) => (item.destino || "").toLowerCase().includes(estado.toLowerCase()));
  return {
    ...item,
    imagem: item.imagem || imagens.praia,
    pais,
    lugar: item.lugar || (pais === "Brasil" ? (estadoEncontrado || "Não informado") : (tiposLugar.includes(item.categoria) ? item.categoria : "Outros lugares")),
  };
}



const exemplos = [

  {

    id: "1",

    titulo: "O lugar mais bonito que encontrei na Bahia",

    destino: "Morro de São Paulo, Bahia",

    autor: "Marina",

    imagem: imagens.praia,

    historia: "Não estava no meu roteiro, mas acabou sendo minha parte favorita da viagem.",

    categoria: "Praias",
    pais: "Brasil",
    lugar: "Bahia",

    dias: "5",

    gastos: "1200",

    curtidas: 127,

  },

  {

    id: "2",

    titulo: "Uma aventura sem pressa pela natureza",

    destino: "Chapada dos Veadeiros, Goiás",

    autor: "Ana",

    imagem: imagens.natureza,

    historia: "Fui sozinha, conheci pessoas incríveis e aprendi a aproveitar cada momento.",

    categoria: "Natureza",
    pais: "Brasil",
    lugar: "Goiás",

    dias: "4",

    gastos: "940",

    curtidas: 89,

  },

  {

    id: "3",

    titulo: "Pequenos lugares, grandes histórias",

    destino: "Paraty, Rio de Janeiro",

    autor: "João",

    imagem: imagens.cidade,

    historia: "As melhores descobertas aconteceram quando deixei o roteiro de lado.",

    categoria: "Cidades",
    pais: "Brasil",
    lugar: "Rio de Janeiro",

    dias: "3",

    gastos: "680",

    curtidas: 64,

  },

];



function Titulo({ etiqueta, texto }) {

  return (

    <View style={styles.areaTitulo}>

      <Text style={styles.etiqueta}>{etiqueta}</Text>

      <Text style={styles.tituloSecao}>{texto}</Text>

    </View>

  );

}



function Cartao({ viagem, curtido, salvo, aoCurtir, aoSalvar }) {

  return (

    <View style={styles.cartao}>

      <View>

        <Image source={{ uri: viagem.imagem }} style={styles.fotoCartao} />



        <View style={styles.fita} />



        <View style={styles.tagFoto}>

          <Text style={styles.tagFotoTexto}>{viagem.pais} · {viagem.lugar}</Text>

        </View>

      </View>



      <View style={styles.corpoCartao}>

          <Text style={styles.local}>⌖ {viagem.destino}, {viagem.pais}</Text>

        <Text style={styles.tituloCartao}>{viagem.titulo}</Text>

        <Text style={styles.historia}>“{viagem.historia}”</Text>



        <View style={styles.detalhes}>

          <Text style={styles.detalheTexto}>{viagem.dias} dias</Text>

          <Text style={styles.detalheTexto}>

            R$ {Number(viagem.gastos || 0).toLocaleString("pt-BR")}

          </Text>

        </View>



        <View style={styles.rodapeCartao}>

          <Text style={styles.autor}>por {viagem.autor}</Text>



          <View style={styles.acoes}>

            <TouchableOpacity onPress={aoCurtir}>

              <Text style={[styles.acao, curtido && styles.acaoAtiva]}>

                {curtido ? "♥" : "♡"} {viagem.curtidas + (curtido ? 1 : 0)}

              </Text>

            </TouchableOpacity>



            <TouchableOpacity onPress={aoSalvar}>

              <Text style={[styles.acao, salvo && styles.acaoAtiva]}>

                {salvo ? "Salvo" : "Salvar"}

              </Text>

            </TouchableOpacity>



            <TouchableOpacity

              onPress={() =>

                Share.share({

                  message: viagem.titulo + " — " + viagem.destino,

                })

              }

            >

              <Text style={styles.acao}>↗</Text>

            </TouchableOpacity>

          </View>

        </View>

      </View>

    </View>

  );

}



export default function Index() {

  const [tela, setTela] = useState("inicio");

  const [paisFiltro, setPaisFiltro] = useState("Tudo");
  const [lugarFiltro, setLugarFiltro] = useState("Todos");

  const [busca, setBusca] = useState("");

  const [viagens, setViagens] = useState(exemplos);

  const [curtidas, setCurtidas] = useState([]);

  const [salvos, setSalvos] = useState([]);

  const [seguindo, setSeguindo] = useState([]);

  const [carregado, setCarregado] = useState(false);



  const [titulo, setTitulo] = useState("");

  const [destino, setDestino] = useState("");

  const [historia, setHistoria] = useState("");

  const [dias, setDias] = useState("");

  const [gastos, setGastos] = useState("");

  const [paisViagem, setPaisViagem] = useState("Brasil");
  const [lugarViagem, setLugarViagem] = useState("São Paulo");
  const [paisPersonalizado, setPaisPersonalizado] = useState("");

  const [foto, setFoto] = useState(null);



  useEffect(() => {

    async function carregar() {

      try {

        const dados = await AsyncStorage.getItem("@vooa_historias");

        let viagensLocais = exemplos;
        if (dados) {

          const resultado = JSON.parse(dados);

          viagensLocais = resultado.viagens || exemplos;

          setCurtidas(resultado.curtidas || []);

          setSalvos(resultado.salvos || []);

          setSeguindo(resultado.seguindo || []);

        }

        let viagensPublicadas = [];
        try {
          viagensPublicadas = await listStories();
        } catch (error) {
          console.error("Não foi possível carregar as histórias publicadas:", error);
          Alert.alert("Aviso", "Não foi possível carregar as histórias da comunidade.");
        }

        const historiasLocais = viagensLocais.filter(
          (item) => !String(item.id).startsWith("server:")
        );
        setViagens(
          [...viagensPublicadas, ...historiasLocais].map(normalizarViagem)
        );

      } catch (erro) {

        Alert.alert("Aviso", "Não foi possível carregar os dados.");

      } finally {

        setCarregado(true);

      }

    }



    carregar();

  }, []);



  useEffect(() => {

    if (!carregado) return;



    async function salvarDados() {

      try {

        await AsyncStorage.setItem(

          "@vooa_historias",

          JSON.stringify({ viagens, curtidas, salvos, seguindo })

        );

      } catch (erro) {

        console.log("Erro ao salvar:", erro);

      }

    }



    salvarDados();

  }, [viagens, curtidas, salvos, seguindo, carregado]);



  const viagensFiltradas = useMemo(() => {

    return viagens.filter((item) => {

      const correspondePais = paisFiltro === "Tudo" || item.pais === paisFiltro;
      const correspondeLugar = lugarFiltro === "Todos" || item.lugar === lugarFiltro;



      const termo = busca.toLowerCase().trim();



      const correspondeBusca =

        item.titulo.toLowerCase().includes(termo) ||

        item.destino.toLowerCase().includes(termo) ||

        item.historia.toLowerCase().includes(termo) ||
        item.pais.toLowerCase().includes(termo) ||
        item.lugar.toLowerCase().includes(termo);



      return correspondePais && correspondeLugar && correspondeBusca;

    });

  }, [viagens, paisFiltro, lugarFiltro, busca]);



  function curtir(id) {

    setCurtidas((atual) =>

      atual.includes(id)

        ? atual.filter((item) => item !== id)

        : [...atual, id]

    );

  }



  function salvar(id) {

    setSalvos((atual) =>

      atual.includes(id)

        ? atual.filter((item) => item !== id)

        : [...atual, id]

    );

  }



  async function escolherFoto() {

    try {

      const resultado = await ImagePicker.launchImageLibraryAsync({

        mediaTypes: ["images"],

        allowsEditing: true,

        quality: 0.7,

        aspect: [4, 3],

      });



      if (!resultado.canceled && resultado.assets.length > 0) {

        setFoto(resultado.assets[0].uri);

      }

    } catch (erro) {

      Alert.alert("Erro", "Não foi possível abrir a galeria.");

    }

  }



  async function publicar() {

    if (!titulo.trim() || !destino.trim() || !historia.trim() || (paisViagem === "Outro país" && !paisPersonalizado.trim())) {

      Alert.alert(

        "Atenção",

        "Preencha o título, o lugar visitado, o país e sua história."

      );

      return;

    }



    let session;
    try {
      const savedSession = await AsyncStorage.getItem("@vooa_usuario");
      session = savedSession ? JSON.parse(savedSession) : null;
    } catch (error) {
      console.error("Não foi possível ler a sessão antes de publicar:", error);
      Alert.alert("Aviso", "Não foi possível verificar sua sessão. Entre novamente.");
      return;
    }

    if (session?.role !== "client" || !session.accessToken) {
      Alert.alert("Entre para publicar", "Faça login como cliente para compartilhar uma história.");
      return;
    }

    let novaViagem;
    try {
      novaViagem = normalizarViagem(
        await publishStory(
          {
            titulo: titulo.trim(),
            destino: destino.trim(),
            historia: historia.trim(),
            pais: paisViagem === "Outro país" ? paisPersonalizado.trim() : paisViagem,
            lugar: lugarViagem,
            dias: dias || "1",
            gastos: gastos || "0",
            imagem: typeof foto === "string" && foto.startsWith("http") ? foto : null,
          },
          session.accessToken
        )
      );
    } catch (error) {
      Alert.alert(
        "Não foi possível publicar",
        error instanceof Error ? error.message : "Tente novamente."
      );
      return;
    }



    setViagens((atual) => [novaViagem, ...atual]);



    setTitulo("");

    setDestino("");

    setHistoria("");

    setDias("");

    setGastos("");

    setFoto(null);
    setPaisViagem("Brasil");
    setLugarViagem("São Paulo");
    setPaisPersonalizado("");

    setTela("perfil");



    Alert.alert("Publicado!", "Sua história foi adicionada ao diário.");

  }



  function selecaoHorizontal(opcoes, selecionado, aoSelecionar) {

    return (

      <ScrollView

        horizontal

        showsHorizontalScrollIndicator={false}

        contentContainerStyle={styles.listaCategorias}

      >

        {opcoes.map((item, indice) => (

          <TouchableOpacity

            key={item}

            onPress={() => aoSelecionar(item)}

            style={[

              styles.botaoCategoria,

              {

                backgroundColor:

                  indice % 3 === 0

                    ? cores.claro

                    : indice % 3 === 1

                    ? cores.verde

                    : cores.lilas,

              },

              selecionado === item && { backgroundColor: cores.azul },

            ]}

          >

            <Text

              style={[

                styles.textoCategoria,

                selecionado === item && { color: cores.branco },

              ]}

            >

              {item}

            </Text>

          </TouchableOpacity>

        ))}

      </ScrollView>

    );

  }



  function inicio() {

    return (

      <>

        <View style={styles.hero}>

          <View style={styles.selo}>

            <Text style={styles.textoSelo}>DIÁRIO COLETIVO</Text>

          </View>



          <Text style={styles.tituloHero}>

            O mundo é feito de histórias.

          </Text>



          <Text style={styles.subtituloHero}>

            Viaje através dos olhos de quem já esteve lá.

          </Text>



          <View style={styles.colagem}>

            <View style={styles.polaroidEsquerda}>

              <Image

                source={{ uri: imagens.natureza }}

                style={styles.imagemPolaroid}

              />

            </View>



            <View style={styles.polaroidDireita}>

              <Image

                source={{ uri: imagens.praia }}

                style={styles.imagemPolaroid}

              />

            </View>



            <View style={styles.adesivoRedondo}>

              <Text style={styles.textoAdesivo}>

                vamos{"\n"}explorar?

              </Text>

            </View>

          </View>

        </View>



        <View style={styles.conteudo}>

          <View style={styles.caixaBusca}>

            <Text style={{ fontSize: 24, color: cores.marinho }}>⌕</Text>

            <TextInput

              style={styles.inputBusca}

              placeholder="Para onde você quer ir?"

              placeholderTextColor={cores.cinza}

              value={busca}

              onChangeText={setBusca}

            />

          </View>



          <Titulo

            etiqueta="EXPLORE POR PAÍS"

            texto="Para onde você quer viajar?"

          />

        </View>



        {selecaoHorizontal(["Tudo", ...new Set([...paises.filter(p => p !== "Outro país"), ...viagens.map(v => v.pais)])], paisFiltro, (pais) => { setPaisFiltro(pais); setLugarFiltro("Todos"); })}

        {paisFiltro !== "Tudo" && (
          <View style={styles.conteudo}>
            <Text style={styles.label}>{paisFiltro === "Brasil" ? "Escolha um estado" : "Escolha o tipo de lugar"}</Text>
            {selecaoHorizontal(["Todos", ...opcoesLugar(paisFiltro)], lugarFiltro, setLugarFiltro)}
          </View>
        )}



        <View style={styles.conteudo}>

          <Titulo

            etiqueta="PÁGINAS DE OUTROS VIAJANTES"

            texto="Histórias de verdade"

          />



          {viagensFiltradas.length === 0 ? (

            <Text style={styles.vazio}>Nenhuma história encontrada.</Text>

          ) : (

            viagensFiltradas.map((viagem) => (

              <Cartao

                key={viagem.id}

                viagem={viagem}

                curtido={curtidas.includes(viagem.id)}

                salvo={salvos.includes(viagem.id)}

                aoCurtir={() => curtir(viagem.id)}

                aoSalvar={() => salvar(viagem.id)}

              />

            ))

          )}



          <Titulo

            etiqueta="ENCONTRE SUA TURMA"

            texto="Pessoas que viajam como você"

          />



          {[

            ["Marina", "ama praias"],

            ["João", "viaja gastando pouco"],

            ["Ana", "ama a natureza"],

          ].map(([nome, bio], indice) => (

            <View

              key={nome}

              style={[

                styles.pessoa,

                {

                  backgroundColor:

                    indice % 2 ? cores.verde : cores.claro,

                },

              ]}

            >

              <View style={styles.avatar}>

                <Text style={styles.inicial}>{nome[0]}</Text>

              </View>



              <View style={{ flex: 1 }}>

                <Text style={styles.nomePessoa}>{nome}</Text>

                <Text style={styles.bioPessoa}>{bio}</Text>

              </View>



              <TouchableOpacity

                style={styles.botaoSeguir}

                onPress={() =>

                  setSeguindo((atual) =>

                    atual.includes(nome)

                      ? atual.filter((n) => n !== nome)

                      : [...atual, nome]

                  )

                }

              >

                <Text style={styles.textoSeguir}>

                  {seguindo.includes(nome) ? "Seguindo" : "+ Seguir"}

                </Text>

              </TouchableOpacity>

            </View>

          ))}

        </View>

      </>

    );

  }



  function explorar() {

    const destinos = [

      ["Brasil", imagens.praia, cores.ceu],

      ["Argentina", imagens.natureza, cores.verde],

      ["Portugal", imagens.cidade, cores.lilas],

      ["Chile", imagens.montanha, cores.amarelo],

      ["França", imagens.cafe, cores.claro],

    ];



    return (

      <View style={styles.conteudo}>

        <Titulo

          etiqueta="UM MURAL DE DESCOBERTAS"

          texto="Descubra o mundo"

        />



        <Text style={styles.descricaoPagina}>

          Sua próxima viagem pode começar com a história de outra pessoa.

        </Text>



        <View style={styles.mural}>

          {destinos.map(([nome, imagem, cor], indice) => (

            <TouchableOpacity

              key={nome}

              style={[

                styles.destinoCard,

                {

                  backgroundColor: cor,

                  width: indice === 0 ? "100%" : "47%",

                },

              ]}

              onPress={() => {

                setPaisFiltro(nome);
                setLugarFiltro("Todos");

                setBusca("");

                setTela("inicio");

              }}

            >

              <Image

                source={{ uri: imagem }}

                style={styles.imagemDestino}

              />



              <View style={styles.etiquetaDestino}>

                <Text style={styles.textoDestino}>{nome}</Text>

              </View>

            </TouchableOpacity>

          ))}

        </View>

      </View>

    );

  }



  function compartilhar() {

    return (

      <View style={styles.conteudo}>

        <Titulo

          etiqueta="VOCÊ ESTEVE LÁ. AGORA CONTE!"

          texto="Compartilhe sua viagem"

        />



        <View style={styles.pergunta}>

          <Text style={styles.textoPergunta}>

            O que você gostaria de contar para alguém que vai para esse lugar?

          </Text>

        </View>



        <TouchableOpacity

          style={styles.seletorFoto}

          onPress={escolherFoto}

        >

          {foto ? (

            <Image

              source={{ uri: foto }}

              style={styles.fotoSelecionada}

            />

          ) : (

            <>

              <Text style={styles.maisFoto}>+</Text>

              <Text style={styles.textoFoto}>

                Adicionar foto de capa

              </Text>

            </>

          )}

        </TouchableOpacity>



        <Text style={styles.label}>Título da história *</Text>

        <TextInput

          style={styles.input}

          value={titulo}

          onChangeText={setTitulo}

          placeholder="Meu fim de semana inesquecível..."

          placeholderTextColor={cores.cinza}

        />



        <Text style={styles.label}>País *</Text>

        {selecaoHorizontal(paises, paisViagem, (pais) => { setPaisViagem(pais); setLugarViagem(pais === "Brasil" ? "São Paulo" : "Praias"); })}

        {paisViagem === "Outro país" && (
          <TextInput style={styles.input} value={paisPersonalizado} onChangeText={setPaisPersonalizado} placeholder="Digite o nome do país" placeholderTextColor={cores.cinza} />
        )}

        <Text style={styles.label}>{paisViagem === "Brasil" ? "Estado *" : "Tipo de lugar *"}</Text>

        {selecaoHorizontal(opcoesLugar(paisViagem), lugarViagem, setLugarViagem)}

        <Text style={styles.label}>Lugar específico visitado *</Text>

        <TextInput

          style={styles.input}

          value={destino}

          onChangeText={setDestino}

          placeholder="Ex.: Praia do Forte, Torre Eiffel, Cristo Redentor"

          placeholderTextColor={cores.cinza}

        />



        <Text style={styles.label}>Sua história *</Text>

        <TextInput

          style={[styles.input, styles.textarea]}

          value={historia}

          onChangeText={setHistoria}

          multiline

          textAlignVertical="top"

          placeholder="Conte seus momentos, descobertas e dicas..."

          placeholderTextColor={cores.cinza}

        />



        <View style={styles.linhaFormulario}>

          <View style={{ flex: 1 }}>

            <Text style={styles.label}>Duração (dias)</Text>

            <TextInput

              style={styles.input}

              value={dias}

              onChangeText={setDias}

              keyboardType="numeric"

              placeholder="3"

            />

          </View>



          <View style={{ flex: 1 }}>

            <Text style={styles.label}>Gastos (R$)</Text>

            <TextInput

              style={styles.input}

              value={gastos}

              onChangeText={setGastos}

              keyboardType="numeric"

              placeholder="850"

            />

          </View>

        </View>



        <TouchableOpacity

          style={styles.botaoPublicar}

          onPress={publicar}

        >

          <Text style={styles.textoPublicar}>

            PUBLICAR MINHA HISTÓRIA

          </Text>

        </TouchableOpacity>

      </View>

    );

  }



  function mapa() {

    const lugares = [...new Set([...paises.filter(p => p !== "Outro país"), ...viagens.map(v => v.pais)])].map((nome) => {
      const quantidade = viagens.filter(v => v.pais === nome).length;
      return [nome, `${quantidade} ${quantidade === 1 ? "experiência" : "experiências"}`];
    });



    return (

      <View style={styles.conteudo}>

        <Titulo

          etiqueta="UM MAPA FEITO DE MEMÓRIAS"

          texto="Onde as pessoas estiveram"

        />



        <Text style={styles.descricaoPagina}>

          Descubra os destinos que aparecem nas histórias da comunidade.

        </Text>



        <View style={styles.mapaIlustrativo}>

          <Text style={styles.mapaTitulo}>MUNDO</Text>

          <Text style={styles.mapaSubtitulo}>

            lugares para descobrir

          </Text>



          {lugares.map(([nome, quantidade], indice) => (

            <TouchableOpacity

              key={nome}

              style={[

                styles.lugarMapa,

                {

                  backgroundColor:

                    indice % 2 ? cores.verde : cores.branco,

                },

              ]}

              onPress={() => {

                setBusca("");
                setPaisFiltro(nome);
                setLugarFiltro("Todos");

                setTela("inicio");

              }}

            >

              <Text style={styles.nomeLugar}>⌖ {nome}</Text>

              <Text style={styles.quantidadeLugar}>

                {quantidade}

              </Text>

            </TouchableOpacity>

          ))}

        </View>



        <Text style={styles.avisoMapa}>

          Selecione um país para explorar suas experiências por estados ou tipos de lugares.

        </Text>

      </View>

    );

  }



  function perfil() {

    const minhasViagens = viagens.filter(

      (item) => item.autor === "Você"

    );



    const favoritos = viagens.filter(

      (item) => salvos.includes(item.id)

    );



    return (

      <>

        <View style={styles.capaPerfil}>

          <View style={styles.fotoPerfil}>

            <Text style={styles.letraPerfil}>V</Text>

          </View>

        </View>



        <View style={styles.conteudo}>

          <Text style={styles.nomePerfil}>Meu diário</Text>

          <Text style={styles.bioPerfil}>

            Colecionando histórias, não apenas destinos.

          </Text>



          <View style={styles.estatisticas}>

            {[

              [minhasViagens.length, "viagens"],

              [salvos.length, "salvos"],

              [seguindo.length, "seguindo"],

            ].map(([numero, nome]) => (

              <View key={nome} style={styles.estatistica}>

                <Text style={styles.numeroEstatistica}>

                  {numero}

                </Text>

                <Text style={styles.nomeEstatistica}>

                  {nome}

                </Text>

              </View>

            ))}

          </View>



          <Titulo

            etiqueta="MINHAS MEMÓRIAS"

            texto="Minhas histórias"

          />



          {minhasViagens.length ? (

            minhasViagens.map((viagem) => (

              <Cartao

                key={viagem.id}

                viagem={viagem}

                curtido={curtidas.includes(viagem.id)}

                salvo={salvos.includes(viagem.id)}

                aoCurtir={() => curtir(viagem.id)}

                aoSalvar={() => salvar(viagem.id)}

              />

            ))

          ) : (

            <View style={styles.caixaVazia}>

              <Text style={styles.vazio}>

                Seu diário ainda está em branco.

              </Text>



              <TouchableOpacity

                style={styles.botaoPrimeira}

                onPress={() => setTela("compartilhar")}

              >

                <Text style={styles.textoPrimeira}>

                  Escrever minha primeira história

                </Text>

              </TouchableOpacity>

            </View>

          )}



          <Titulo

            etiqueta="GUARDADO PARA DEPOIS"

            texto="Minhas coleções"

          />



          <View style={styles.colecao}>

            <Text style={styles.tituloColecao}>

              Lugares que quero conhecer

            </Text>



            <Text style={styles.quantidadeColecao}>

              {favoritos.length} histórias salvas

            </Text>

          </View>



          {favoritos.map((viagem) => (

            <Cartao

              key={viagem.id}

              viagem={viagem}

              curtido={curtidas.includes(viagem.id)}

              salvo={true}

              aoCurtir={() => curtir(viagem.id)}

              aoSalvar={() => salvar(viagem.id)}

            />

          ))}

        </View>

      </>

    );

  }



  if (!carregado) {

    return (

      <SafeAreaView style={styles.carregando}>

        <ActivityIndicator

          size="large"

          color={cores.azul}

        />

      </SafeAreaView>

    );

  }



  const navegacao = [

    ["inicio", "⌂", "Início"],

    ["explorar", "✧", "Explorar"],

    ["compartilhar", "+", "Criar"],

    ["mapa", "⌖", "Mapa"],

    ["perfil", "◉", "Perfil"],

  ];



  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <View>

          <Text style={styles.logo}>vooa</Text>

          <Text style={styles.subLogo}>HISTÓRIAS</Text>

        </View>



        <View style={styles.headerAdesivo}>

          <Text style={styles.headerAdesivoTexto}>

            ✳ descubra

          </Text>

        </View>

      </View>



      <KeyboardAvoidingView

        style={{ flex: 1 }}

        behavior={

          Platform.OS === "ios" ? "padding" : undefined

        }

      >

        <ScrollView

          key={tela}

          contentContainerStyle={{ paddingBottom: 45 }}

          showsVerticalScrollIndicator={false}

          keyboardShouldPersistTaps="handled"

        >

          {tela === "inicio" && inicio()}

          {tela === "explorar" && explorar()}

          {tela === "compartilhar" && compartilhar()}

          {tela === "mapa" && mapa()}

          {tela === "perfil" && perfil()}

        </ScrollView>

      </KeyboardAvoidingView>



      <View style={styles.navegacao}>

        {navegacao.map(([id, simbolo, nome]) => {

          const selecionado = tela === id;

          const central = id === "compartilhar";



          return (

            <TouchableOpacity

              key={id}

              style={styles.itemNavegacao}

              onPress={() => setTela(id)}

            >

              <View

                style={[

                  styles.fundoIcone,

                  central && styles.botaoCentral,

                  selecionado &&

                    !central && {

                      backgroundColor: cores.claro,

                    },

                ]}

              >

                <Text

                  style={[

                    styles.simboloNavegacao,

                    central && { fontSize: 30 },

                  ]}

                >

                  {simbolo}

                </Text>

              </View>



              <Text

                style={[

                  styles.textoNavegacao,

                  selecionado && {

                    color: cores.azul,

                    fontWeight: "900",

                  },

                ]}

              >

                {nome}

              </Text>

            </TouchableOpacity>

          );

        })}

      </View>

    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: cores.gelo,

  },

  carregando: {

    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: cores.gelo,

  },

  header: {

    height: 73,

    backgroundColor: cores.gelo,

    borderBottomWidth: 2,

    borderColor: cores.marinho,

    paddingHorizontal: 22,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },

  logo: {

    color: cores.azul,

    fontSize: 37,

    fontWeight: "900",

    fontStyle: "italic",

    letterSpacing: -3,

    lineHeight: 40,

  },

  subLogo: {

    color: cores.marinho,

    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 3,

    marginLeft: 21,

  },

  headerAdesivo: {

    backgroundColor: cores.amarelo,

    paddingHorizontal: 13,

    paddingVertical: 9,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 20,

    transform: [{ rotate: "5deg" }],

  },

  headerAdesivoTexto: {

    color: cores.marinho,

    fontSize: 12,

    fontWeight: "900",

  },

  hero: {

    backgroundColor: cores.azul,

    padding: 24,

    paddingTop: 35,

    borderBottomLeftRadius: 35,

    borderBottomRightRadius: 35,

    overflow: "hidden",

  },

  selo: {

    alignSelf: "flex-start",

    backgroundColor: cores.amarelo,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 10,

    paddingVertical: 8,

    paddingHorizontal: 13,

    transform: [{ rotate: "-4deg" }],

  },

  textoSelo: {

    color: cores.marinho,

    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1,

  },

  tituloHero: {

    fontSize: 45,

    lineHeight: 48,

    fontWeight: "900",

    color: cores.branco,

    marginTop: 28,

    letterSpacing: -2,

  },

  subtituloHero: {

    fontSize: 17,

    lineHeight: 25,

    color: cores.branco,

    fontWeight: "600",

    marginTop: 14,

  },

  colagem: {

    height: 280,

    marginTop: 25,

    position: "relative",

    justifyContent: "center",

    alignItems: "center",

  },

  polaroidEsquerda: {

    position: "absolute",

    left: "8%",

    top: 35,

    width: "53%",

    height: 195,

    padding: 9,

    paddingBottom: 26,

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    transform: [{ rotate: "-12deg" }],

    elevation: 5,

  },

  polaroidDireita: {

    position: "absolute",

    right: "7%",

    top: 4,

    width: "53%",

    height: 210,

    padding: 9,

    paddingBottom: 29,

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    transform: [{ rotate: "10deg" }],

    elevation: 6,

  },

  imagemPolaroid: {

    width: "100%",

    height: "100%",

  },

  adesivoRedondo: {

    position: "absolute",

    right: 2,

    bottom: 7,

    width: 96,

    height: 96,

    borderRadius: 48,

    backgroundColor: cores.amarelo,

    borderWidth: 3,

    borderColor: cores.marinho,

    alignItems: "center",

    justifyContent: "center",

    transform: [{ rotate: "13deg" }],

    elevation: 8,

  },

  textoAdesivo: {

    color: cores.marinho,

    fontWeight: "900",

    fontSize: 15,

    textAlign: "center",

  },

  conteudo: {

    width: "100%",

    maxWidth: 520,

    alignSelf: "center",

    paddingHorizontal: 18,

  },

  caixaBusca: {

    marginTop: 28,

    height: 58,

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 17,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 17,

    gap: 12,

    elevation: 3,

  },

  inputBusca: {

    flex: 1,

    color: cores.marinho,

    fontSize: 14,

    fontWeight: "600",

  },

  areaTitulo: {

    marginTop: 36,

    marginBottom: 20,

  },

  etiqueta: {

    color: cores.azul,

    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 2,

    marginBottom: 8,

  },

  tituloSecao: {

    color: cores.marinho,

    fontSize: 31,

    fontWeight: "900",

    letterSpacing: -1.4,

    lineHeight: 36,

  },

  listaCategorias: {

    paddingHorizontal: 18,

    paddingBottom: 14,

    gap: 10,

  },

  botaoCategoria: {

    paddingHorizontal: 16,

    paddingVertical: 11,

    borderRadius: 12,

    borderWidth: 2,

    borderColor: cores.marinho,

  },

  textoCategoria: {

    color: cores.marinho,

    fontWeight: "800",

    fontSize: 12,

  },

  cartao: {

    borderRadius: 14,

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    padding: 12,

    marginBottom: 26,

    elevation: 4,

  },

  fotoCartao: {

    height: 230,

    width: "100%",

    borderTopLeftRadius: 7,

    borderTopRightRadius: 7,

    borderBottomRightRadius: 28,

  },

  fita: {

    position: "absolute",

    left: "39%",

    top: -16,

    width: 80,

    height: 22,

    backgroundColor: cores.amarelo,

    opacity: 0.9,

    transform: [{ rotate: "-5deg" }],

  },

  tagFoto: {

    position: "absolute",

    bottom: 12,

    left: 10,

    backgroundColor: cores.claro,

    borderWidth: 2,

    borderColor: cores.marinho,

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 8,

    transform: [{ rotate: "-3deg" }],

  },

  tagFotoTexto: {

    color: cores.marinho,

    fontSize: 11,

    fontWeight: "900",

  },

  corpoCartao: {

    padding: 8,

    paddingTop: 17,

  },

  local: {

    fontSize: 12,

    color: cores.azul,

    fontWeight: "900",

  },

  tituloCartao: {

    color: cores.marinho,

    fontSize: 24,

    lineHeight: 29,

    fontWeight: "900",

    letterSpacing: -0.7,

    marginTop: 9,

    marginBottom: 9,

  },

  historia: {

    color: cores.cinza,

    fontSize: 13,

    lineHeight: 21,

    fontWeight: "500",

  },

  detalhes: {

    flexDirection: "row",

    gap: 12,

    borderBottomWidth: 1,

    borderBottomColor: cores.claro,

    paddingVertical: 15,

  },

  detalheTexto: {

    color: cores.marinho,

    fontSize: 12,

    fontWeight: "800",

  },

  rodapeCartao: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 10,

  },

  autor: {

    fontSize: 12,

    fontWeight: "900",

    color: cores.marinho,

  },

  acoes: {

    flexDirection: "row",

    gap: 10,

    alignItems: "center",

  },

  acao: {

    color: cores.marinho,

    fontSize: 13,

    fontWeight: "800",

  },

  acaoAtiva: {

    color: cores.azul,

  },

  vazio: {

    color: cores.cinza,

    fontSize: 14,

    textAlign: "center",

    paddingVertical: 30,

  },

  pessoa: {

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 18,

    padding: 13,

    marginBottom: 14,

    flexDirection: "row",

    alignItems: "center",

    gap: 13,

  },

  avatar: {

    width: 49,

    height: 49,

    borderRadius: 25,

    backgroundColor: cores.azul,

    borderWidth: 2,

    borderColor: cores.marinho,

    justifyContent: "center",

    alignItems: "center",

  },

  inicial: {

    color: cores.branco,

    fontSize: 25,

    fontWeight: "900",

  },

  nomePessoa: {

    fontSize: 16,

    color: cores.marinho,

    fontWeight: "900",

  },

  bioPessoa: {

    fontSize: 12,

    color: cores.cinza,

    marginTop: 3,

  },

  botaoSeguir: {

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 20,

    paddingVertical: 8,

    paddingHorizontal: 10,

  },

  textoSeguir: {

    fontSize: 11,

    color: cores.marinho,

    fontWeight: "900",

  },

  descricaoPagina: {

    fontSize: 15,

    lineHeight: 23,

    color: cores.cinza,

    marginBottom: 22,

  },

  mural: {

    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    gap: 16,

  },

  destinoCard: {

    padding: 8,

    borderRadius: 24,

    borderWidth: 2,

    borderColor: cores.marinho,

    marginBottom: 5,

  },

  imagemDestino: {

    height: 150,

    width: "100%",

    borderRadius: 15,

  },

  etiquetaDestino: {

    alignSelf: "flex-start",

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 9,

    paddingVertical: 7,

    paddingHorizontal: 12,

    marginTop: 9,

  },

  textoDestino: {

    color: cores.marinho,

    fontSize: 13,

    fontWeight: "900",

  },

  pergunta: {

    backgroundColor: cores.claro,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 15,

    padding: 17,

    marginBottom: 20,

  },

  textoPergunta: {

    color: cores.marinho,

    fontSize: 19,

    lineHeight: 26,

    fontWeight: "900",

  },

  seletorFoto: {

    height: 185,

    backgroundColor: cores.branco,

    borderRadius: 16,

    borderWidth: 2,

    borderColor: cores.azul,

    borderStyle: "dashed",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    marginBottom: 20,

  },

  fotoSelecionada: {

    width: "100%",

    height: "100%",

  },

  maisFoto: {

    color: cores.azul,

    fontSize: 40,

  },

  textoFoto: {

    color: cores.marinho,

    fontSize: 14,

    fontWeight: "800",

  },

  label: {

    fontSize: 13,

    color: cores.marinho,

    fontWeight: "900",

    marginBottom: 8,

    marginTop: 15,

  },

  input: {

    borderWidth: 2,

    borderColor: "#B9D8E7",

    backgroundColor: cores.branco,

    borderRadius: 12,

    padding: 14,

    fontSize: 14,

    color: cores.marinho,

    minHeight: 51,

  },

  textarea: {

    minHeight: 140,

  },

  categoriaFormulario: {

    marginRight: 9,

    borderRadius: 12,

    borderWidth: 2,

    borderColor: cores.marinho,

    backgroundColor: cores.branco,

    padding: 12,

  },

  linhaFormulario: {

    flexDirection: "row",

    justifyContent: "space-between",

    gap: 13,

  },

  botaoPublicar: {

    marginTop: 30,

    marginBottom: 28,

    backgroundColor: cores.azul,

    borderRadius: 15,

    borderWidth: 2,

    borderColor: cores.marinho,

    paddingVertical: 19,

    alignItems: "center",

  },

  textoPublicar: {

    color: cores.branco,

    fontWeight: "900",

    fontSize: 14,

    letterSpacing: 0.6,

  },

  mapaIlustrativo: {

    backgroundColor: cores.claro,

    borderWidth: 3,

    borderColor: cores.marinho,

    borderRadius: 25,

    padding: 20,

    marginTop: 10,

  },

  mapaTitulo: {

    color: cores.azul,

    fontSize: 40,

    fontWeight: "900",

    textAlign: "center",

    letterSpacing: 4,

  },

  mapaSubtitulo: {

    color: cores.marinho,

    fontSize: 14,

    textAlign: "center",

    fontWeight: "700",

    marginBottom: 27,

  },

  lugarMapa: {

    padding: 15,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 13,

    marginBottom: 13,

  },

  nomeLugar: {

    color: cores.marinho,

    fontSize: 17,

    fontWeight: "900",

  },

  quantidadeLugar: {

    color: cores.azul,

    fontSize: 12,

    fontWeight: "800",

    marginTop: 5,

  },

  avisoMapa: {

    color: cores.cinza,

    fontSize: 12,

    textAlign: "center",

    lineHeight: 20,

    marginTop: 15,

  },

  capaPerfil: {

    height: 155,

    backgroundColor: cores.ceu,

    borderBottomWidth: 3,

    borderColor: cores.marinho,

    justifyContent: "flex-end",

    paddingLeft: 25,

  },

  fotoPerfil: {

    height: 100,

    width: 100,

    borderRadius: 50,

    backgroundColor: cores.azul,

    borderWidth: 5,

    borderColor: cores.branco,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: -43,

  },

  letraPerfil: {

    color: cores.branco,

    fontSize: 48,

    fontWeight: "900",

  },

  nomePerfil: {

    marginTop: 55,

    fontSize: 34,

    fontWeight: "900",

    color: cores.marinho,

  },

  bioPerfil: {

    marginTop: 5,

    color: cores.cinza,

    fontSize: 13,

  },

  estatisticas: {

    marginTop: 24,

    flexDirection: "row",

    justifyContent: "space-around",

    borderBottomWidth: 1,

    borderBottomColor: cores.ceu,

    paddingBottom: 25,

  },

  estatistica: {

    alignItems: "center",

  },

  numeroEstatistica: {

    fontSize: 32,

    color: cores.azul,

    fontWeight: "900",

  },

  nomeEstatistica: {

    fontSize: 12,

    color: cores.cinza,

    marginTop: 3,

  },

  caixaVazia: {

    backgroundColor: cores.branco,

    borderWidth: 2,

    borderColor: cores.marinho,

    borderRadius: 18,

    padding: 22,

    alignItems: "center",

  },

  botaoPrimeira: {

    padding: 12,

    borderRadius: 12,

    backgroundColor: cores.amarelo,

    borderWidth: 2,

    borderColor: cores.marinho,

  },

  textoPrimeira: {

    color: cores.marinho,

    fontSize: 12,

    fontWeight: "900",

  },

  colecao: {

    backgroundColor: cores.lilas,

    padding: 25,

    borderRadius: 20,

    borderWidth: 2,

    borderColor: cores.marinho,

    marginBottom: 20,

  },

  tituloColecao: {

    color: cores.marinho,

    fontSize: 22,

    fontWeight: "900",

  },

  quantidadeColecao: {

    color: cores.marinho,

    fontSize: 12,

    marginTop: 8,

  },

  navegacao: {

    height: 77,

    backgroundColor: cores.branco,

    borderTopWidth: 2,

    borderColor: cores.marinho,

    flexDirection: "row",

    justifyContent: "space-around",

    alignItems: "center",

    paddingHorizontal: 5,

  },

  itemNavegacao: {

    flex: 1,

    alignItems: "center",

    justifyContent: "center",

  },

  fundoIcone: {

    height: 35,

    width: 42,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 13,

  },

  botaoCentral: {

    backgroundColor: cores.ceu,

    borderWidth: 2,

    borderColor: cores.marinho,

    height: 53,

    width: 53,

    borderRadius: 27,

    marginTop: -24,

  },

  simboloNavegacao: {

    color: cores.marinho,

    fontSize: 25,

    fontWeight: "900",

  },

  textoNavegacao: {

    marginTop: 3,

    fontSize: 10,

    color: cores.cinza,

    fontWeight: "700",

  },

});
