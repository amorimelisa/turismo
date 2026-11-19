import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CORES = {
  azul: "#168DB9",
  marinho: "#143252",
  claro: "#D9EFFC",
  verde: "#C6EEF0",
  amarelo: "#FFED92",
  branco: "#FFFFFF",
  gelo: "#F5FAFF",
  cinza: "#627987",
  borda: "#D7E5EE",
};

const VIAGENS_INICIAIS = [
  {
    id: "morro-de-sao-paulo",
    titulo: "O lugar mais bonito que encontrei na Bahia",
    destino: "Morro de São Paulo, Bahia",
    autor: "Marina",
    imagem: require("../../assets/images/Memórias de viagem com arara azul e amarela.png"),
    historia:
      "Não estava no meu roteiro, mas acabou sendo minha parte favorita da viagem.",
    pais: "Brasil",
    lugar: "Bahia",
    dias: "5",
    gastos: "1200",
    curtidas: 127,
  },
  {
    id: "chapada-dos-veadeiros",
    titulo: "Uma aventura sem pressa pela natureza",
    destino: "Chapada dos Veadeiros, Goiás",
    autor: "Ana",
    imagem: require("../../assets/images/arara.png"),
    historia:
      "Fui sozinha, conheci pessoas incríveis e aprendi a aproveitar cada momento.",
    pais: "Brasil",
    lugar: "Goiás",
    dias: "4",
    gastos: "940",
    curtidas: 89,
  },
  {
    id: "paraty",
    titulo: "Pequenos lugares, grandes histórias",
    destino: "Paraty, Rio de Janeiro",
    autor: "João",
    imagem: require("../../assets/images/malaaberta.png"),
    historia:
      "As melhores descobertas aconteceram quando deixei o roteiro de lado.",
    pais: "Brasil",
    lugar: "Rio de Janeiro",
    dias: "3",
    gastos: "680",
    curtidas: 64,
  },
];

const DESTINOS = [
  {
    nome: "Brasil",
    imagem: require("../../assets/images/Memórias de viagem com arara azul e amarela.png"),
    cor: CORES.claro,
  },
  {
    nome: "Portugal",
    imagem: require("../../assets/images/malafechada.png"),
    cor: CORES.verde,
  },
  {
    nome: "Chile",
    imagem: require("../../assets/images/arara.png"),
    cor: CORES.amarelo,
  },
  {
    nome: "Itália",
    imagem: require("../../assets/images/malaaberta.png"),
    cor: "#CBDFFA",
  },
];

const VIAJANTES = [
  { nome: "Marina", bio: "ama praias" },
  { nome: "João", bio: "viaja gastando pouco" },
  { nome: "Ana", bio: "ama a natureza" },
];

const NAVEGACAO = [
  { id: "mural", titulo: "Histórias" },
  { id: "explorar", titulo: "Destinos" },
  { id: "criar", titulo: "Criar" },
  { id: "mapa", titulo: "Mapa" },
  { id: "perfil", titulo: "Meu perfil" },
];

function CartaoViagem({
  viagem,
  curtido,
  salvo,
  aoCurtir,
  aoSalvar,
}) {
  return (
    <View style={styles.cartao}>
      <Image source={viagem.imagem} style={styles.fotoCartao} />
      <View style={styles.etiquetaFoto}>
        <Text style={styles.textoEtiquetaFoto}>
          {viagem.pais} · {viagem.lugar}
        </Text>
      </View>

      <View style={styles.corpoCartao}>
        <Text style={styles.destino}>
          {viagem.destino}, {viagem.pais}
        </Text>
        <Text style={styles.tituloCartao}>{viagem.titulo}</Text>
        <Text style={styles.historia}>“{viagem.historia}”</Text>

        <View style={styles.detalhes}>
          <Text style={styles.textoDetalhe}>{viagem.dias} dias</Text>
          <Text style={styles.textoDetalhe}>
            R$ {Number(viagem.gastos || 0).toLocaleString("pt-BR")}
          </Text>
        </View>

        <View style={styles.rodapeCartao}>
          <Text style={styles.autor}>por {viagem.autor}</Text>
          <View style={styles.acoes}>
            <Pressable
              onPress={aoCurtir}
              accessibilityRole="button"
              accessibilityLabel={curtido ? "Remover curtida" : "Curtir história"}
            >
              <Text style={[styles.acao, curtido && styles.acaoAtiva]}>
                {curtido ? "♥" : "♡"} {viagem.curtidas + (curtido ? 1 : 0)}
              </Text>
            </Pressable>
            <Pressable
              onPress={aoSalvar}
              accessibilityRole="button"
              accessibilityLabel={salvo ? "Remover dos salvos" : "Salvar história"}
            >
              <Text style={[styles.acao, salvo && styles.acaoAtiva]}>
                {salvo ? "Salvo" : "Salvar"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void Share.share({
                  message: `${viagem.titulo} — ${viagem.destino}`,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Compartilhar história"
            >
              <Text style={styles.acao}>↗</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function TituloSecao({
  etiqueta,
  titulo,
}) {
  return (
    <View style={styles.tituloSecao}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

export default function ViagensComunidade() {
  const [secao, setSecao] = useState("mural");
  const [viagens, setViagens] = useState(VIAGENS_INICIAIS);
  const [curtidas, setCurtidas] = useState([]);
  const [salvos, setSalvos] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [paisFiltro, setPaisFiltro] = useState("Tudo");
  const [lugarFiltro, setLugarFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const [titulo, setTitulo] = useState("");
  const [destino, setDestino] = useState("");
  const [historia, setHistoria] = useState("");
  const [paisNovo, setPaisNovo] = useState("Brasil");
  const [lugarNovo, setLugarNovo] = useState("");
  const [dias, setDias] = useState("");
  const [gastos, setGastos] = useState("");
  const [mensagem, setMensagem] = useState("");

  const paises = useMemo(
    () => [...new Set(viagens.map((viagem) => viagem.pais))],
    [viagens]
  );

  const lugares = useMemo(
    () => [
      ...new Set(
        viagens
          .filter((viagem) => paisFiltro === "Tudo" || viagem.pais === paisFiltro)
          .map((viagem) => viagem.lugar)
      ),
    ],
    [viagens, paisFiltro]
  );

  const viagensFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return viagens.filter((viagem) => {
      const combinaPais =
        paisFiltro === "Tudo" || viagem.pais === paisFiltro;
      const combinaLugar =
        lugarFiltro === "Todos" || viagem.lugar === lugarFiltro;
      const combinaBusca =
        !termo ||
        [
          viagem.titulo,
          viagem.destino,
          viagem.historia,
          viagem.pais,
          viagem.lugar,
          viagem.autor,
        ].some((campo) => campo.toLocaleLowerCase("pt-BR").includes(termo));

      return combinaPais && combinaLugar && combinaBusca;
    });
  }, [viagens, paisFiltro, lugarFiltro, busca]);

  function alternarItem(lista, setLista, id) {
    setLista(
      lista.includes(id)
        ? lista.filter((item) => item !== id)
        : [...lista, id]
    );
  }

  function selecionarPais(pais) {
    setPaisFiltro(pais);
    setLugarFiltro("Todos");
  }

  function publicarHistoria() {
    if (!titulo.trim() || !destino.trim() || !historia.trim() || !lugarNovo.trim()) {
      setMensagem("Preencha o título, o destino, o lugar e sua história.");
      return;
    }

    const novaViagem = {
      id: `demo-${Date.now()}`,
      titulo: titulo.trim(),
      destino: destino.trim(),
      autor: "Você",
      imagem: require("../../assets/images/arara.png"),
      historia: historia.trim(),
      pais: paisNovo.trim(),
      lugar: lugarNovo.trim(),
      dias: dias.trim() || "1",
      gastos: gastos.trim() || "0",
      curtidas: 0,
    };

    setViagens((atuais) => [novaViagem, ...atuais]);
    setTitulo("");
    setDestino("");
    setHistoria("");
    setLugarNovo("");
    setDias("");
    setGastos("");
    setPaisFiltro("Tudo");
    setLugarFiltro("Todos");
    setMensagem("História adicionada nesta sessão de demonstração.");
    setSecao("perfil");
  }

  function mural() {
    return (
      <>
        <View style={styles.heroMural}>
          <Text style={styles.seloHero}>DIÁRIO COLETIVO</Text>
          <Text style={styles.tituloHero}>
            O mundo é feito de histórias.
          </Text>
          <Text style={styles.subtituloHero}>
            Viaje através dos olhos de quem já esteve lá.
          </Text>
          <View style={styles.colagem}>
            <Image
              source={require("../../assets/images/arara.png")}
              style={[styles.imagemColagem, styles.imagemColagemEsquerda]}
            />
            <Image
              source={require("../../assets/images/Memórias de viagem com arara azul e amarela.png")}
              style={[styles.imagemColagem, styles.imagemColagemDireita]}
            />
            <View style={styles.adesivoHero}>
              <Text style={styles.textoAdesivoHero}>
                vamos{"\n"}explorar?
              </Text>
            </View>
          </View>
        </View>

        <TituloSecao etiqueta="DIÁRIO COLETIVO" titulo="Histórias de viagem" />
        <Text style={styles.descricao}>
          Viaje através das experiências de outras pessoas. Curtidas, filtros e
          novos relatos ficam apenas nesta sessão.
        </Text>

        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar destino ou história"
          placeholderTextColor={CORES.cinza}
          style={styles.inputBusca}
          accessibilityLabel="Buscar histórias"
        />

        <Text style={styles.rotuloFiltro}>EXPLORE POR PAÍS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {["Tudo", ...paises].map((pais) => (
            <Pressable
              key={pais}
              onPress={() => selecionarPais(pais)}
              style={[
                styles.chip,
                paisFiltro === pais && styles.chipAtivo,
              ]}
            >
              <Text
                style={[
                  styles.textoChip,
                  paisFiltro === pais && styles.textoChipAtivo,
                ]}
              >
                {pais}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {paisFiltro !== "Tudo" && (
          <>
            <Text style={styles.rotuloFiltro}>ESTADO OU REGIÃO</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {["Todos", ...lugares].map((lugar) => (
                <Pressable
                  key={lugar}
                  onPress={() => setLugarFiltro(lugar)}
                  style={[
                    styles.chip,
                    lugarFiltro === lugar && styles.chipAtivo,
                  ]}
                >
                  <Text
                    style={[
                      styles.textoChip,
                      lugarFiltro === lugar && styles.textoChipAtivo,
                    ]}
                  >
                    {lugar}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <TituloSecao
          etiqueta="PÁGINAS DE OUTROS VIAJANTES"
          titulo="Histórias de verdade"
        />
        {viagensFiltradas.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma história encontrada.</Text>
        ) : (
          viagensFiltradas.map((viagem) => (
            <CartaoViagem
              key={viagem.id}
              viagem={viagem}
              curtido={curtidas.includes(viagem.id)}
              salvo={salvos.includes(viagem.id)}
              aoCurtir={() =>
                alternarItem(curtidas, setCurtidas, viagem.id)
              }
              aoSalvar={() => alternarItem(salvos, setSalvos, viagem.id)}
            />
          ))
        )}

        <TituloSecao
          etiqueta="ENCONTRE SUA TURMA"
          titulo="Pessoas que viajam como você"
        />
        {VIAJANTES.map((viajante, indice) => (
          <View
            key={viajante.nome}
            style={[
              styles.pessoa,
              indice % 2 === 0 && styles.pessoaAlternada,
            ]}
          >
            <View style={styles.avatar}>
              <Text style={styles.inicial}>{viajante.nome[0]}</Text>
            </View>
            <View style={styles.dadosPessoa}>
              <Text style={styles.nomePessoa}>{viajante.nome}</Text>
              <Text style={styles.bioPessoa}>{viajante.bio}</Text>
            </View>
            <Pressable
              onPress={() =>
                alternarItem(seguindo, setSeguindo, viajante.nome)
              }
              style={styles.botaoSeguir}
            >
              <Text style={styles.textoSeguir}>
                {seguindo.includes(viajante.nome) ? "Seguindo" : "+ Seguir"}
              </Text>
            </Pressable>
          </View>
        ))}
      </>
    );
  }

  function explorar() {
    return (
      <>
        <TituloSecao etiqueta="UM MURAL DE DESCOBERTAS" titulo="Descubra o mundo" />
        <Text style={styles.descricao}>
          Escolha um destino para ver as histórias de quem já esteve lá.
        </Text>
        <View style={styles.gradeDestinos}>
          {DESTINOS.map((destinoItem, indice) => (
            <Pressable
              key={destinoItem.nome}
              onPress={() => {
                selecionarPais(destinoItem.nome);
                setBusca("");
                setSecao("mural");
              }}
              style={[
                styles.cartaoDestino,
                { backgroundColor: destinoItem.cor },
                indice === 0 && styles.destinoLargo,
              ]}
            >
              <Image
                source={destinoItem.imagem}
                style={styles.fotoDestino}
              />
              <Text style={styles.nomeDestino}>{destinoItem.nome}</Text>
            </Pressable>
          ))}
        </View>
      </>
    );
  }

  function criar() {
    return (
      <>
        <TituloSecao
          etiqueta="VOCÊ ESTEVE LÁ. AGORA CONTE!"
          titulo="Compartilhe sua viagem"
        />
        <Text style={styles.descricao}>
          Este formulário cria um relato local de demonstração; nada é enviado
          ou mantido depois que o app é fechado.
        </Text>

        <Text style={styles.rotuloCampo}>TÍTULO DA HISTÓRIA *</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Meu fim de semana inesquecível"
          placeholderTextColor={CORES.cinza}
          style={styles.campo}
        />

        <Text style={styles.rotuloCampo}>PAÍS *</Text>
        <TextInput
          value={paisNovo}
          onChangeText={setPaisNovo}
          placeholder="Brasil"
          placeholderTextColor={CORES.cinza}
          style={styles.campo}
        />

        <Text style={styles.rotuloCampo}>ESTADO OU TIPO DE LUGAR *</Text>
        <TextInput
          value={lugarNovo}
          onChangeText={setLugarNovo}
          placeholder="Bahia, praias, natureza..."
          placeholderTextColor={CORES.cinza}
          style={styles.campo}
        />

        <Text style={styles.rotuloCampo}>DESTINO VISITADO *</Text>
        <TextInput
          value={destino}
          onChangeText={setDestino}
          placeholder="Ex.: Praia do Forte"
          placeholderTextColor={CORES.cinza}
          style={styles.campo}
        />

        <Text style={styles.rotuloCampo}>SUA HISTÓRIA *</Text>
        <TextInput
          value={historia}
          onChangeText={setHistoria}
          placeholder="Conte seus momentos, descobertas e dicas"
          placeholderTextColor={CORES.cinza}
          multiline
          textAlignVertical="top"
          style={[styles.campo, styles.textarea]}
        />

        <View style={styles.linhaCampos}>
          <View style={styles.campoMetade}>
            <Text style={styles.rotuloCampo}>DURAÇÃO (DIAS)</Text>
            <TextInput
              value={dias}
              onChangeText={setDias}
              keyboardType="numeric"
              placeholder="3"
              placeholderTextColor={CORES.cinza}
              style={styles.campo}
            />
          </View>
          <View style={styles.campoMetade}>
            <Text style={styles.rotuloCampo}>GASTOS (R$)</Text>
            <TextInput
              value={gastos}
              onChangeText={setGastos}
              keyboardType="numeric"
              placeholder="850"
              placeholderTextColor={CORES.cinza}
              style={styles.campo}
            />
          </View>
        </View>

        {!!mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
        <Pressable onPress={publicarHistoria} style={styles.botaoPrimario}>
          <Text style={styles.textoBotaoPrimario}>
            PUBLICAR MINHA HISTÓRIA
          </Text>
        </Pressable>
      </>
    );
  }

  function mapa() {
    const contagem = viagens.reduce((resultado, viagem) => {
      resultado[viagem.pais] = (resultado[viagem.pais] ?? 0) + 1;
      return resultado;
    }, {});

    return (
      <>
        <TituloSecao
          etiqueta="UM MAPA FEITO DE MEMÓRIAS"
          titulo="Onde as pessoas estiveram"
        />
        <Text style={styles.descricao}>
          Um resumo dos países presentes nas histórias de demonstração.
        </Text>
        <View style={styles.cartaoMapa}>
          <Text style={styles.tituloMapa}>MUNDO</Text>
          <Text style={styles.subtituloMapa}>lugares para descobrir</Text>
          {Object.entries(contagem).map(([pais, quantidade], indice) => (
            <Pressable
              key={pais}
              onPress={() => {
                selecionarPais(pais);
                setSecao("mural");
              }}
              style={[
                styles.linhaMapa,
                indice % 2 === 0 && styles.pessoaAlternada,
              ]}
            >
              <Text style={styles.nomeLugar}>⌖ {pais}</Text>
              <Text style={styles.quantidadeLugar}>
                {quantidade} {quantidade === 1 ? "experiência" : "experiências"}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.notaMapa}>
          Selecione um país para filtrar as histórias do mural.
        </Text>
      </>
    );
  }

  function perfil() {
    const minhasViagens = viagens.filter((viagem) => viagem.autor === "Você");
    const favoritas = viagens.filter((viagem) => salvos.includes(viagem.id));

    return (
      <>
        <View style={styles.perfilTopo}>
          <View style={styles.avatarPerfil}>
            <Text style={styles.letraPerfil}>V</Text>
          </View>
          <Text style={styles.tituloPerfil}>Meu diário</Text>
          <Text style={styles.descricao}>
            Colecionando histórias, não apenas destinos.
          </Text>
          <View style={styles.estatisticas}>
            <Text style={styles.estatistica}>
              {minhasViagens.length} viagens
            </Text>
            <Text style={styles.estatistica}>{salvos.length} salvos</Text>
            <Text style={styles.estatistica}>{seguindo.length} seguindo</Text>
          </View>
        </View>

        <TituloSecao etiqueta="MINHAS MEMÓRIAS" titulo="Minhas histórias" />
        {minhasViagens.length ? (
          minhasViagens.map((viagem) => (
            <CartaoViagem
              key={viagem.id}
              viagem={viagem}
              curtido={curtidas.includes(viagem.id)}
              salvo={salvos.includes(viagem.id)}
              aoCurtir={() =>
                alternarItem(curtidas, setCurtidas, viagem.id)
              }
              aoSalvar={() => alternarItem(salvos, setSalvos, viagem.id)}
            />
          ))
        ) : (
          <View style={styles.vazioCartao}>
            <Text style={styles.vazio}>
              Seu diário de demonstração ainda está em branco.
            </Text>
            <Pressable
              onPress={() => {
                setMensagem("");
                setSecao("criar");
              }}
              style={styles.botaoSecundario}
            >
              <Text style={styles.textoBotaoSecundario}>
                Escrever minha primeira história
              </Text>
            </Pressable>
          </View>
        )}

        <TituloSecao
          etiqueta="GUARDADO PARA DEPOIS"
          titulo="Minhas coleções"
        />
        <Text style={styles.descricao}>
          {favoritas.length} {favoritas.length === 1 ? "história salva" : "histórias salvas"}
        </Text>
        {favoritas.map((viagem) => (
          <CartaoViagem
            key={viagem.id}
            viagem={viagem}
            curtido={curtidas.includes(viagem.id)}
            salvo
            aoCurtir={() => alternarItem(curtidas, setCurtidas, viagem.id)}
            aoSalvar={() => alternarItem(salvos, setSalvos, viagem.id)}
          />
        ))}
      </>
    );
  }

  return (
    <View style={styles.container}>
      <TituloSecao
        etiqueta="VOOA · COMUNIDADE"
        titulo="Inspire-se com outras viagens"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navegacao}
      >
        {NAVEGACAO.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              setMensagem("");
              setSecao(item.id);
            }}
            style={[
              styles.itemNavegacao,
              secao === item.id && styles.itemNavegacaoAtivo,
            ]}
          >
            <Text
              style={[
                styles.textoNavegacao,
                secao === item.id && styles.textoNavegacaoAtivo,
              ]}
            >
              {item.titulo}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {secao === "mural" && mural()}
      {secao === "explorar" && explorar()}
      {secao === "criar" && criar()}
      {secao === "mapa" && mapa()}
      {secao === "perfil" && perfil()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  tituloSecao: {
    marginTop: 28,
    marginBottom: 16,
  },
  etiqueta: {
    color: CORES.azul,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 7,
  },
  titulo: {
    color: CORES.marinho,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
  },
  heroMural: {
    overflow: "hidden",
    padding: 20,
    marginTop: 12,
    borderRadius: 22,
    backgroundColor: CORES.azul,
  },
  seloHero: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: CORES.amarelo,
    color: CORES.marinho,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tituloHero: {
    color: CORES.branco,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36,
    marginTop: 18,
  },
  subtituloHero: {
    color: CORES.branco,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  colagem: {
    height: 190,
    marginTop: 18,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imagemColagem: {
    position: "absolute",
    width: "56%",
    height: 150,
    padding: 7,
    borderWidth: 3,
    borderColor: CORES.branco,
    backgroundColor: CORES.branco,
  },
  imagemColagemEsquerda: {
    left: "3%",
    top: 24,
    transform: [{ rotate: "-9deg" }],
  },
  imagemColagemDireita: {
    right: "3%",
    top: 7,
    transform: [{ rotate: "8deg" }],
  },
  adesivoHero: {
    position: "absolute",
    right: 2,
    bottom: 1,
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: CORES.marinho,
    backgroundColor: CORES.amarelo,
    transform: [{ rotate: "8deg" }],
  },
  textoAdesivoHero: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  descricao: {
    color: CORES.cinza,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  navegacao: {
    gap: 8,
    paddingBottom: 6,
  },
  itemNavegacao: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
  },
  itemNavegacaoAtivo: {
    backgroundColor: CORES.azul,
    borderColor: CORES.marinho,
  },
  textoNavegacao: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "700",
  },
  textoNavegacaoAtivo: {
    color: CORES.branco,
  },
  inputBusca: {
    color: CORES.marinho,
    backgroundColor: CORES.branco,
    borderColor: CORES.borda,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginVertical: 12,
  },
  rotuloFiltro: {
    color: CORES.azul,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  chips: {
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
  },
  chipAtivo: {
    borderColor: CORES.marinho,
    backgroundColor: CORES.claro,
  },
  textoChip: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "700",
  },
  textoChipAtivo: {
    color: CORES.azul,
  },
  cartao: {
    overflow: "hidden",
    marginBottom: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.branco,
  },
  fotoCartao: {
    width: "100%",
    height: 210,
    backgroundColor: CORES.claro,
  },
  etiquetaFoto: {
    alignSelf: "flex-start",
    marginTop: -38,
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: CORES.claro,
  },
  textoEtiquetaFoto: {
    color: CORES.marinho,
    fontSize: 11,
    fontWeight: "800",
  },
  corpoCartao: {
    padding: 16,
  },
  destino: {
    color: CORES.azul,
    fontSize: 12,
    fontWeight: "800",
  },
  tituloCartao: {
    color: CORES.marinho,
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 27,
    marginTop: 8,
  },
  historia: {
    color: CORES.cinza,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  detalhes: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 12,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  textoDetalhe: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "700",
  },
  rodapeCartao: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  autor: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "800",
  },
  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  acao: {
    color: CORES.marinho,
    fontSize: 13,
    fontWeight: "700",
  },
  acaoAtiva: {
    color: CORES.azul,
  },
  pessoa: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  pessoaAlternada: {
    backgroundColor: CORES.gelo,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.azul,
  },
  inicial: {
    color: CORES.branco,
    fontSize: 20,
    fontWeight: "800",
  },
  dadosPessoa: {
    flex: 1,
  },
  nomePessoa: {
    color: CORES.marinho,
    fontSize: 14,
    fontWeight: "800",
  },
  bioPessoa: {
    color: CORES.cinza,
    fontSize: 12,
    marginTop: 3,
  },
  botaoSeguir: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: CORES.claro,
  },
  textoSeguir: {
    color: CORES.marinho,
    fontSize: 11,
    fontWeight: "800",
  },
  vazio: {
    color: CORES.cinza,
    textAlign: "center",
    paddingVertical: 24,
  },
  gradeDestinos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cartaoDestino: {
    width: "48%",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  destinoLargo: {
    width: "100%",
  },
  fotoDestino: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  nomeDestino: {
    color: CORES.marinho,
    fontWeight: "800",
    paddingTop: 9,
    paddingHorizontal: 4,
  },
  rotuloCampo: {
    color: CORES.azul,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  campo: {
    color: CORES.marinho,
    backgroundColor: CORES.branco,
    borderColor: CORES.borda,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  textarea: {
    minHeight: 110,
  },
  linhaCampos: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  campoMetade: {
    flex: 1,
  },
  mensagem: {
    color: CORES.azul,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  botaoPrimario: {
    alignItems: "center",
    padding: 14,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: CORES.marinho,
  },
  textoBotaoPrimario: {
    color: CORES.branco,
    fontSize: 12,
    fontWeight: "800",
  },
  cartaoMapa: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: CORES.claro,
  },
  tituloMapa: {
    color: CORES.marinho,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  subtituloMapa: {
    color: CORES.cinza,
    fontSize: 12,
    marginTop: 3,
    marginBottom: 12,
  },
  linhaMapa: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    backgroundColor: CORES.branco,
    marginTop: 8,
  },
  nomeLugar: {
    color: CORES.marinho,
    fontWeight: "800",
  },
  quantidadeLugar: {
    color: CORES.cinza,
    fontSize: 12,
  },
  notaMapa: {
    color: CORES.cinza,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  perfilTopo: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: CORES.claro,
  },
  avatarPerfil: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.azul,
  },
  letraPerfil: {
    color: CORES.branco,
    fontSize: 30,
    fontWeight: "900",
  },
  tituloPerfil: {
    color: CORES.marinho,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 10,
  },
  estatisticas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 14,
  },
  estatistica: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "800",
  },
  vazioCartao: {
    alignItems: "center",
    padding: 18,
    borderRadius: 14,
    backgroundColor: CORES.gelo,
  },
  botaoSecundario: {
    padding: 11,
    borderRadius: 10,
    backgroundColor: CORES.verde,
  },
  textoBotaoSecundario: {
    color: CORES.marinho,
    fontSize: 12,
    fontWeight: "800",
  },
});
