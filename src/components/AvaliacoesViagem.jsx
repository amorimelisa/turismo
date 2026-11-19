
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const CORES = {
  fundo: "#F7F2E9",
  papel: "#FFFDF9",
  azul: "#303B59",
  turquesa: "#4BAFB3",
  verde: "#B8D5CD",
  linha: "#B7CBDA",
  cinza: "#8592A7",
  vermelho: "#A85660",
  branco: "#FFFFFF",
};

const FONTE = Platform.OS === "ios" ? "Georgia" : "serif";

const AVALIACOES_INICIAIS = [
  {
    id: "lisboa",
    destino: "Lisboa",
    pais: "Portugal",
    nota: 5,
    comentario:
      "Caminhar pelas ruas antigas e ver o pôr do sol no Tejo foi inesquecível.",
    data: "12/06/2026",
  },
  {
    id: "rio-de-janeiro",
    destino: "Rio de Janeiro",
    pais: "Brasil",
    nota: 4,
    comentario:
      "Dias cheios de paisagens bonitas, passeios e boas lembranças.",
    data: "03/02/2026",
  },
  {
    id: "foz-do-iguacu",
    destino: "Foz do Iguaçu",
    pais: "Brasil",
    nota: 5,
    comentario:
      "As cataratas são impressionantes. Quero voltar com mais tempo para explorar a região.",
    data: "18/11/2025",
  },
];

const DESCRICOES = [
  "Toque para avaliar",
  "Pouca coisa",
  "Razoável",
  "Boa",
  "Memorável",
  "Inesquecível",
];

const FOCO_WEB =
  Platform.OS === "web"
    ? { outlineStyle: "none", outlineWidth: 0 }
    : {};

function dataHoje() {
  const d = new Date();

  return (
    String(d.getDate()).padStart(2, "0") +
    "/" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "/" +
    d.getFullYear()
  );
}

function formatarData(data) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return data;
}

function alturaComentario(texto, largura) {
  const quantidadePorLinha = Math.max(
    16,
    Math.floor((largura - 75) / 9)
  );

  const linhas = texto.split("\n").reduce(
    (total, linha) =>
      total +
      Math.max(
        1,
        Math.ceil(linha.length / quantidadePorLinha)
      ),
    0
  );

  return Math.min(165, Math.max(36, linhas * 25 + 8));
}

// ILUSTRAÇÃO ORIGINAL DO VOOA
// Não utiliza nenhuma imagem da pasta assets.
function IlustracaoOriginal() {
  return (
    <View style={styles.ilustracao}>
      {/* CARTÃO POSTAL */}
      <View style={styles.postal}>
        <Text style={styles.postalTitulo}>
          Querida memória,
        </Text>

        <View style={styles.postalLinha} />
        <View style={styles.postalLinha} />
      </View>

      {/* FOTO POLAROID */}
      <View style={styles.polaroid}>
        <View style={styles.cenario}>
          <View style={styles.sol} />
          <View style={styles.montanha} />
          <View style={styles.montanhaFrente} />
        </View>

        <Text style={styles.legendaFoto}>
          keep wandering
        </Text>
      </View>

      {/* PASSAGEM AÉREA */}
      <View style={styles.bilhete}>
        <Text style={styles.bilheteMicro}>
          VOOA · BOARDING MEMORY
        </Text>

        <View style={styles.bilheteRota}>
          <Text style={styles.bilheteCodigo}>VOA</Text>

          <View style={styles.bilheteLinha} />

          <Text style={styles.bilheteCodigo}>LIS</Text>
        </View>

        <Text style={styles.bilheteDetalhe}>
          PASSAGEIRO: VOCÊ · MEMORY CLASS
        </Text>
      </View>

      {/* CARIMBO */}
      <View style={styles.carimbo}>
        <Text style={styles.carimboTitulo}>VOOA</Text>
        <Text style={styles.carimboTexto}>
          TRAVEL CLUB
        </Text>
      </View>
    </View>
  );
}

function Estrelas({
  nota,
  onChange,
}) {
  return (
    <View style={styles.estrelas}>
      {[1, 2, 3, 4, 5].map((valor) => (
        <Pressable
          key={valor}
          onPress={() => onChange(valor)}
          accessibilityRole="button"
          accessibilityLabel={`${valor} estrelas, ${DESCRICOES[valor]}`}
          style={styles.botaoEstrela}
        >
          <Text
            style={[
              styles.estrela,
              {
                color:
                  valor <= nota
                    ? CORES.turquesa
                    : "#CBD5DF",
              },
            ]}
          >
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Picote({
  fundo = CORES.fundo,
}) {
  return (
    <View style={styles.picote}>
      <View style={styles.picoteLinha} />

      <View
        style={[
          styles.recorte,
          { left: -12, backgroundColor: fundo },
        ]}
      />

      <View
        style={[
          styles.recorte,
          { right: -12, backgroundColor: fundo },
        ]}
      />
    </View>
  );
}

export default function AvaliacoesViagem() {
  const { width, height } = useWindowDimensions();

  const [larguraReal, setLarguraReal] = useState(0);

  const larguraDisponivel =
    larguraReal > 0 ? larguraReal : width;

  const larguraConteudo = Math.min(
    Math.max(larguraDisponivel - 24, 230),
    1060
  );

  const larguraModal = Math.min(
    Math.max(width - 24, 240),
    480
  );

  const compacto = larguraConteudo < 700;

  const [avaliacoes, setAvaliacoes] = useState(AVALIACOES_INICIAIS);

  const [formAberto, setFormAberto] = useState(false);

  const [editandoId, setEditandoId] = useState(null);

  const [destino, setDestino] = useState("");
  const [pais, setPais] = useState("");
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [data, setData] = useState("");

  const [erro, setErro] = useState("");

  const [expandido, setExpandido] = useState(null);

  const [excluirId, setExcluirId] = useState(null);

  const [sucessoAberto, setSucessoAberto] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] =
    useState("");

  const bloqueado = useRef(false);

  const [papelY] = useState(() => new Animated.Value(0));
  const [papelScale] = useState(() => new Animated.Value(1));
  const [carimboAnimado] = useState(() => new Animated.Value(0));

  function limparFormulario() {
    setDestino("");
    setPais("");
    setNota(0);
    setComentario("");
    setData("");
    setEditandoId(null);
    setErro("");
  }

  function abrirNovo() {
    if (bloqueado.current) return;

    limparFormulario();
    setFormAberto(true);
  }

  function editar(item) {
    if (bloqueado.current) return;

    setDestino(item.destino);
    setPais(item.pais);
    setNota(item.nota);
    setComentario(item.comentario);
    setData(formatarData(item.data));
    setEditandoId(item.id);
    setErro("");
    setFormAberto(true);
  }

  function cancelarFormulario() {
    if (bloqueado.current) return;

    setFormAberto(false);
    limparFormulario();
  }

  function salvar() {
    if (bloqueado.current) return;

    if (!destino.trim()) {
      setErro("Informe o destino visitado.");
      return;
    }

    if (nota === 0) {
      setErro("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    if (!comentario.trim()) {
      setErro("Escreva um comentário sobre sua viagem.");
      return;
    }

    bloqueado.current = true;
    setErro("");

    const editando = editandoId !== null;

    const nova = {
      id:
        editandoId ??
        `vooa-${Date.now()}-${Math.random()}`,
      destino: destino.trim(),
      pais: pais.trim(),
      nota,
      comentario: comentario.trim(),
      data: data.trim() || dataHoje(),
    };

    const lista = editando
      ? avaliacoes.map((item) =>
          item.id === editandoId ? nova : item
        )
      : [nova, ...avaliacoes];

    setAvaliacoes(lista);
    setFormAberto(false);
    limparFormulario();

    setMensagemSucesso(
      editando
        ? "Sua memória foi atualizada!"
        : "Mais uma memória guardada!"
    );

    setSucessoAberto(true);
  }

  function excluir() {
    if (!excluirId || bloqueado.current) return;

    bloqueado.current = true;

    const lista = avaliacoes.filter(
      (item) => item.id !== excluirId
    );

    setAvaliacoes(lista);
    setExpandido(null);
    setExcluirId(null);
    setErro("");
    bloqueado.current = false;
  }

  // ANIMAÇÃO DE SALVAR
  useEffect(() => {
    if (!sucessoAberto) return;

    papelY.setValue(0);
    papelScale.setValue(1);
    carimboAnimado.setValue(0);

    const animacao = Animated.sequence([
      Animated.spring(carimboAnimado, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: Platform.OS !== "web",
      }),

      Animated.delay(150),

      Animated.parallel([
        Animated.timing(papelY, {
          toValue: 105,
          duration: 700,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),

        Animated.timing(papelScale, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    ]);

    animacao.start(({ finished }) => {
      if (finished) {
        bloqueado.current = false;
        setSucessoAberto(false);
      }
    });

    return () => {
      animacao.stop();
    };
  }, [
    sucessoAberto,
    papelY,
    papelScale,
    carimboAnimado,
  ]);

  const escalaCarimbo = carimboAnimado.interpolate({
    inputRange: [0, 1],
    outputRange: [1.7, 1],
  });

  return (
    <View
      style={styles.container}
      onLayout={(evento) => {
        const largura = evento.nativeEvent.layout.width;

        if (
          largura > 0 &&
          Math.abs(largura - larguraReal) > 1
        ) {
          setLarguraReal(largura);
        }
      }}
    >
      <View
        style={{
          width: larguraConteudo,
          maxWidth: "100%",
        }}
      >
        {/*
          ESTRUTURA CORRIGIDA:
          ilustração -> título -> descrição -> botão.
          Nada fica sobre a imagem.
        */}
        <View style={styles.hero}>
          <View style={styles.blocoIlustracao}>
            <IlustracaoOriginal />
          </View>

          <View style={styles.blocoTexto}>
            <View style={styles.detalheHero} />

            <Text
              style={[
                styles.tituloHero,
                compacto && styles.tituloHeroCompacto,
              ]}
            >
              Cada destino deixa
              {"\n"}
              <Text style={styles.destaqueHero}>
                um pedaço de si.
              </Text>
            </Text>

            <Text style={styles.descricaoHero}>
              Transforme os momentos especiais das
              suas viagens em lembranças para sempre.
            </Text>

            <Pressable
              style={styles.botaoRegistrar}
              onPress={abrirNovo}
              accessibilityRole="button"
              accessibilityLabel="Registrar nova experiência"
            >
              <View style={styles.circuloMais}>
                <Text style={styles.mais}>+</Text>
              </View>

              <Text style={styles.textoRegistrar}>
                Registrar nova experiência
              </Text>
            </Pressable>
          </View>
        </View>

        {/* COLEÇÃO DE MEMÓRIAS */}
        <View style={styles.colecao}>
          <View style={styles.etiquetaCentral}>
            <View style={styles.linhaPequena} />

            <Text style={styles.etiquetaTexto}>
              SUA COLEÇÃO
            </Text>

            <View style={styles.linhaPequena} />
          </View>

          <Text
            style={[
              styles.tituloColecao,
              compacto && styles.tituloColecaoCompacto,
            ]}
          >
            Pequenos capítulos
            {"\n"}
            <Text style={styles.turquesaItalico}>
              de uma grande jornada.
            </Text>
          </Text>

          <Text style={styles.subtituloColecao}>
            Exemplos locais; alterações não são salvas após
            sair da tela.
          </Text>

          {!!erro && !formAberto && (
            <Text style={styles.mensagemErro}>
              {erro}
            </Text>
          )}

          {avaliacoes.length === 0 ? (
            <View style={styles.colecaoVazia}>
              <Text style={styles.vazioTitulo}>
                Sua coleção começa aqui.
              </Text>

              <Text style={styles.vazioDescricao}>
                Registre sua primeira experiência
                para guardar uma memória especial.
              </Text>

              <Pressable
                onPress={abrirNovo}
                style={styles.botaoPrimeira}
              >
                <Text style={styles.textoPrimeira}>
                  + Registrar primeira viagem
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.grade}>
              {avaliacoes.map((item, indice) => {
                const codigo =
                  item.destino
                    .slice(0, 3)
                    .toUpperCase() || "VOA";

                const aberto = expandido === item.id;

                return (
                  <View
                    key={item.id}
                    style={{
                      width: compacto ? "100%" : "48.7%",
                      marginBottom: 18,
                    }}
                  >
                    <View style={styles.passagem}>
                      <View
                        style={[
                          styles.passagemTopo,
                          {
                            backgroundColor:
                              indice % 2 === 0
                                ? CORES.turquesa
                                : CORES.verde,
                          },
                        ]}
                      >
                        <Text style={styles.passagemMicro}>
                          VOOA · MEMORY PASS
                        </Text>

                        <Text style={styles.passagemMicro}>
                          VM {indice + 456}
                        </Text>
                      </View>

                      <View style={styles.passagemSuperior}>
                        <View style={styles.destinoLinha}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.rotulo}>
                              DESTINO
                            </Text>

                            <Text style={styles.destinoSalvo}>
                              {item.destino}
                            </Text>

                            <Text style={styles.paisSalvo}>
                              {item.pais ||
                                "Viagem especial"}
                            </Text>
                          </View>

                          <Text style={styles.codigoDestino}>
                            {codigo}
                          </Text>
                        </View>

                        <View style={styles.rota}>
                          <Text style={styles.rotaTexto}>
                            VOA
                          </Text>

                          <View style={styles.rotaLinha}>
                            <View style={styles.rotaPonto} />
                          </View>

                          <Text style={styles.rotaTexto}>
                            {codigo}
                          </Text>
                        </View>

                        <View style={styles.informacoes}>
                          <View>
                            <Text style={styles.rotulo}>
                              NOTA
                            </Text>

                            <Text style={styles.notaSalva}>
                              {"★".repeat(item.nota)}
                              <Text style={styles.estrelaVazia}>
                                {"★".repeat(5 - item.nota)}
                              </Text>
                            </Text>
                          </View>

                          <View>
                            <Text style={styles.rotulo}>
                              DATA
                            </Text>

                            <Text style={styles.dataSalva}>
                              {formatarData(item.data)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Picote />

                      <View style={styles.passagemInferior}>
                        <Text
                          numberOfLines={
                            aberto ? undefined : 2
                          }
                          style={styles.comentarioSalvo}
                        >
                          {item.comentario}
                        </Text>

                        <View style={styles.acoes}>
                          <Pressable
                            onPress={() =>
                              setExpandido(
                                aberto ? null : item.id
                              )
                            }
                            style={styles.botaoLer}
                          >
                            <Text style={styles.textoLer}>
                              {aberto
                                ? "Recolher ↑"
                                : "Ler tudo ↓"}
                            </Text>
                          </Pressable>

                          <View style={styles.acoesDireita}>
                            <Pressable
                              onPress={() => editar(item)}
                              style={styles.botaoEditar}
                            >
                              <Text style={styles.textoEditar}>
                                Editar
                              </Text>
                            </Pressable>

                            <Pressable
                              onPress={() =>
                                setExcluirId(item.id)
                              }
                              style={styles.botaoExcluir}
                            >
                              <Text style={styles.textoExcluir}>
                                Excluir
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* FORMULÁRIO DE AVALIAÇÃO */}
      <Modal
        visible={formAberto}
        transparent
        animationType="fade"
        onRequestClose={cancelarFormulario}
      >
        <KeyboardAvoidingView
          style={styles.fundoModal}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
          <View
            style={[
              styles.modalPassagem,
              {
                width: larguraModal,
                maxHeight: height * 0.82,
              },
            ]}
          >
            <View style={styles.formTopo}>
              <Text style={styles.marca}>Vooa</Text>

              <Text style={styles.formTopoLegenda}>
                BOARDING PASS
              </Text>

              <Text style={styles.formClasse}>
                MEMORY CLASS
              </Text>

              <Pressable
                onPress={cancelarFormulario}
                style={styles.botaoFechar}
                accessibilityLabel="Fechar formulário"
              >
                <Text style={styles.fecharX}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formCorpo}>
                <Text style={styles.formTitulo}>
                  {editandoId
                    ? "Editar experiência"
                    : "Nova experiência"}
                </Text>

                <Text style={styles.formDescricao}>
                  Preencha os detalhes da sua viagem.
                </Text>

                <Text style={styles.rotuloForm}>
                  DESTINO VISITADO
                </Text>

                <TextInput
                  value={destino}
                  onChangeText={setDestino}
                  placeholder="Lisboa"
                  placeholderTextColor="#B8C2D0"
                  selectionColor={CORES.azul}
                  cursorColor={CORES.azul}
                  maxLength={100}
                  style={styles.inputGrande}
                />

                <Text style={styles.rotuloForm}>
                  PAÍS OU CIDADE
                </Text>

                <TextInput
                  value={pais}
                  onChangeText={setPais}
                  placeholder="Portugal"
                  placeholderTextColor="#B8C2D0"
                  selectionColor={CORES.azul}
                  cursorColor={CORES.azul}
                  maxLength={100}
                  style={styles.input}
                />

                <Text style={styles.rotuloForm}>
                  NOTA
                </Text>

                <View style={styles.areaNota}>
                  <Estrelas
                    nota={nota}
                    onChange={setNota}
                  />

                  <Text
                    style={styles.descricaoNota}
                    accessibilityLiveRegion="polite"
                  >
                    {DESCRICOES[nota]}
                  </Text>
                </View>

                <Text style={styles.rotuloForm}>
                  COMENTÁRIO SOBRE A EXPERIÊNCIA
                </Text>

                <TextInput
                  value={comentario}
                  onChangeText={setComentario}
                  placeholder="O que você quer lembrar desse lugar?"
                  placeholderTextColor="#B8C2D0"
                  selectionColor={CORES.azul}
                  cursorColor={CORES.azul}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                  scrollEnabled={
                    comentario.length > 340
                  }
                  style={[
                    styles.inputComentario,
                    {
                      height: alturaComentario(
                        comentario,
                        larguraModal
                      ),
                    },
                  ]}
                />

                <Text style={styles.contagem}>
                  {comentario.length}/500
                </Text>

                <Text style={styles.rotuloForm}>
                  DATA DA VIAGEM · OPCIONAL
                </Text>

                <TextInput
                  value={data}
                  onChangeText={setData}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#B8C2D0"
                  selectionColor={CORES.azul}
                  cursorColor={CORES.azul}
                  maxLength={10}
                  style={styles.input}
                />

                {!!erro && (
                  <Text style={styles.mensagemErro}>
                    {erro}
                  </Text>
                )}
              </View>

              <Picote fundo={CORES.fundo} />

              <View style={styles.formRodape}>
                <Pressable
                  onPress={salvar}
                  style={styles.botaoSalvar}
                >
                  <Text style={styles.textoSalvar}>
                    {editandoId
                      ? "Salvar alterações"
                      : "Guardar lembrança"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={cancelarFormulario}
                  style={styles.botaoCancelar}
                >
                  <Text style={styles.textoCancelar}>
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* CONFIRMAR EXCLUSÃO */}
      <Modal
        visible={excluirId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setExcluirId(null)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.confirmacao}>
            <Text style={styles.confirmacaoTitulo}>
              Excluir lembrança?
            </Text>

            <Text style={styles.confirmacaoDescricao}>
              Essa avaliação será removida do seu
              diário de viagens.
            </Text>

            <View style={styles.botoesConfirmacao}>
              <Pressable
                onPress={() => setExcluirId(null)}
                style={styles.cancelarExclusao}
              >
                <Text style={styles.textoEditar}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={excluir}
                style={styles.confirmarExclusao}
              >
                <Text style={styles.textoConfirmar}>
                  Excluir
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ANIMAÇÃO AUTOMÁTICA DE SALVAMENTO */}
      <Modal
        visible={sucessoAberto}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.fundoModal}>
          <View style={styles.modalSucesso}>
            <Text style={styles.sucessoMicro}>
              VOOA MEMORY CLUB
            </Text>

            <Text style={styles.sucessoTitulo}>
              {mensagemSucesso}
            </Text>

            <View style={styles.palco}>
              <View style={styles.pastaAtras} />

              <Animated.View
                style={[
                  styles.folha,
                  {
                    transform: [
                      { translateY: papelY },
                      { scale: papelScale },
                    ],
                  },
                ]}
              >
                <View style={styles.faixaFolha}>
                  <Text style={styles.textoFolhaTopo}>
                    VOOA PASS
                  </Text>
                </View>

                <Text style={styles.textoFolha}>
                  Uma nova memória
                </Text>

                <View style={styles.linhaFolha} />

                <Animated.View
                  style={[
                    styles.carimboSalvo,
                    {
                      opacity: carimboAnimado,
                      transform: [
                        { scale: escalaCarimbo },
                        { rotate: "-12deg" },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.textoCarimbo}>
                    MEMORY
                    {"\n"}
                    SAVED
                  </Text>
                </Animated.View>
              </Animated.View>

              <View style={styles.pastaFrente}>
                <Text style={styles.nomePasta}>
                  VOOA
                </Text>

                <Text style={styles.subtituloPasta}>
                  TRAVEL ARCHIVE
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: CORES.fundo,
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 36,
  },

  // NOVA ESTRUTURA SEM SOBREPOSIÇÃO
  hero: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingBottom: 26,
  },

  // Esta área reserva toda a altura da imagem.
  blocoIlustracao: {
    width: "100%",
    height: 272,
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 0,
    position: "relative",
  },

  ilustracao: {
    width: 290,
    height: 260,
    position: "relative",
  },

  // POSTAL
  postal: {
    position: "absolute",
    width: 160,
    height: 145,
    left: 12,
    top: 24,
    padding: 17,
    backgroundColor: CORES.papel,
    borderRadius: 6,
    transform: [{ rotate: "-9deg" }],
    elevation: 3,
    shadowColor: CORES.azul,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  postalTitulo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontStyle: "italic",
    fontSize: 15,
  },

  postalLinha: {
    height: 1,
    width: "82%",
    backgroundColor: CORES.linha,
    marginTop: 18,
  },

  // POLAROID
  polaroid: {
    position: "absolute",
    width: 145,
    height: 176,
    top: 0,
    left: 135,
    padding: 8,
    backgroundColor: CORES.papel,
    transform: [{ rotate: "8deg" }],
    elevation: 5,
    shadowColor: CORES.azul,
    shadowOpacity: 0.17,
    shadowRadius: 10,
  },

  cenario: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#C9DFE9",
  },

  sol: {
    position: "absolute",
    right: 14,
    top: 16,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#E58E7B",
  },

  montanha: {
    position: "absolute",
    bottom: -30,
    left: -18,
    width: 170,
    height: 95,
    borderRadius: 50,
    backgroundColor: CORES.turquesa,
  },

  montanhaFrente: {
    position: "absolute",
    bottom: -39,
    right: -30,
    width: 112,
    height: 73,
    borderRadius: 40,
    backgroundColor: CORES.azul,
  },

  legendaFoto: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontStyle: "italic",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },

  // PASSAGEM AÉREA
  bilhete: {
    position: "absolute",
    width: 215,
    height: 104,
    top: 139,
    left: 35,
    padding: 13,
    borderRadius: 9,
    backgroundColor: CORES.papel,
    elevation: 7,
    shadowColor: CORES.azul,
    shadowOpacity: 0.17,
    shadowRadius: 10,
  },

  bilheteMicro: {
    color: CORES.turquesa,
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: "700",
  },

  bilheteRota: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginVertical: 10,
  },

  bilheteCodigo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 23,
  },

  bilheteLinha: {
    flex: 1,
    height: 1,
    backgroundColor: CORES.linha,
  },

  bilheteDetalhe: {
    color: CORES.azul,
    fontSize: 8,
  },

  carimbo: {
    position: "absolute",
    right: 1,
    top: 93,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: CORES.turquesa,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-12deg" }],
  },

  carimboTitulo: {
    color: CORES.turquesa,
    fontWeight: "800",
    fontSize: 13,
  },

  carimboTexto: {
    color: CORES.turquesa,
    fontSize: 8,
  },

  // TEXTO INDEPENDENTE DA ILUSTRAÇÃO
  blocoTexto: {
    width: "100%",
    maxWidth: 440,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 0,
    position: "relative",
  },

  detalheHero: {
    width: 42,
    height: 2,
    backgroundColor: CORES.turquesa,
    marginBottom: 14,
  },

  tituloHero: {
    width: "100%",
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 33,
    lineHeight: 43,
    fontStyle: "italic",
    textAlign: "center",
  },

  tituloHeroCompacto: {
    fontSize: 27,
    lineHeight: 36,
  },

  destaqueHero: {
    color: CORES.turquesa,
  },

  descricaoHero: {
    color: CORES.cinza,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 335,
    marginTop: 13,
    marginBottom: 20,
  },

  botaoRegistrar: {
    backgroundColor: CORES.azul,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
    padding: 6,
    paddingRight: 18,
  },

  circuloMais: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CORES.turquesa,
    alignItems: "center",
    justifyContent: "center",
  },

  mais: {
    color: CORES.azul,
    fontSize: 24,
  },

  textoRegistrar: {
    color: CORES.branco,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  // COLEÇÃO
  colecao: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#DCD9D2",
    paddingTop: 30,
    alignItems: "center",
  },

  etiquetaCentral: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 14,
  },

  linhaPequena: {
    width: 27,
    height: 1,
    backgroundColor: CORES.turquesa,
  },

  etiquetaTexto: {
    color: CORES.cinza,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },

  tituloColecao: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 41,
    lineHeight: 50,
    textAlign: "center",
  },

  tituloColecaoCompacto: {
    fontSize: 29,
    lineHeight: 38,
  },

  turquesaItalico: {
    color: CORES.turquesa,
    fontStyle: "italic",
  },

  subtituloColecao: {
    color: CORES.cinza,
    textAlign: "center",
    fontSize: 13,
    marginTop: 9,
    marginBottom: 25,
  },

  mensagemErro: {
    color: CORES.vermelho,
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
  },

  colecaoVazia: {
    backgroundColor: CORES.papel,
    width: "100%",
    borderRadius: 17,
    padding: 25,
    alignItems: "center",
  },

  vazioTitulo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 23,
    textAlign: "center",
  },

  vazioDescricao: {
    color: CORES.cinza,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    marginVertical: 14,
  },

  botaoPrimeira: {
    backgroundColor: CORES.azul,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 23,
  },

  textoPrimeira: {
    color: CORES.branco,
    fontSize: 12,
    fontWeight: "700",
  },

  grade: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // PASSAGENS SALVAS
  passagem: {
    backgroundColor: CORES.papel,
    borderRadius: 19,
    shadowColor: CORES.azul,
    shadowOpacity: 0.13,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 9 },
    elevation: 5,
  },

  passagemTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 17,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },

  passagemMicro: {
    color: CORES.azul,
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "700",
  },

  passagemSuperior: {
    paddingHorizontal: 19,
    paddingTop: 17,
    paddingBottom: 15,
  },

  destinoLinha: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  rotulo: {
    color: CORES.turquesa,
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: "700",
    marginBottom: 6,
  },

  destinoSalvo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 25,
  },

  paisSalvo: {
    color: CORES.cinza,
    fontFamily: FONTE,
    fontStyle: "italic",
    fontSize: 15,
    marginTop: 3,
  },

  codigoDestino: {
    color: CORES.azul,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 3,
  },

  rota: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 17,
  },

  rotaTexto: {
    color: CORES.azul,
    fontSize: 10,
    letterSpacing: 1,
  },

  rotaLinha: {
    flex: 1,
    height: 1,
    backgroundColor: CORES.linha,
    alignItems: "center",
    justifyContent: "center",
  },

  rotaPonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: CORES.turquesa,
  },

  informacoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },

  notaSalva: {
    fontSize: 18,
    color: CORES.turquesa,
  },

  estrelaVazia: {
    color: "#CBD5DF",
  },

  dataSalva: {
    color: CORES.azul,
    fontSize: 12,
    fontWeight: "700",
  },

  picote: {
    height: 24,
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
    zIndex: 3,
  },

  picoteLinha: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: CORES.linha,
    marginHorizontal: 18,
  },

  recorte: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  passagemInferior: {
    paddingHorizontal: 19,
    paddingTop: 9,
    paddingBottom: 19,
  },

  comentarioSalvo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 25,
  },

  acoes: {
    marginTop: 17,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  botaoLer: {
    paddingVertical: 9,
  },

  textoLer: {
    color: CORES.turquesa,
    fontSize: 12,
    fontStyle: "italic",
  },

  acoesDireita: {
    flexDirection: "row",
    gap: 8,
  },

  botaoEditar: {
    backgroundColor: "#E0F0EC",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9,
  },

  textoEditar: {
    color: CORES.azul,
    fontWeight: "700",
    fontSize: 12,
  },

  botaoExcluir: {
    backgroundColor: "#F7E7E7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9,
  },

  textoExcluir: {
    color: CORES.vermelho,
    fontWeight: "700",
    fontSize: 12,
  },

  // FORMULÁRIO
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(22,30,50,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  modalPassagem: {
    backgroundColor: CORES.papel,
    borderRadius: 19,
    shadowColor: "#111827",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  formTopo: {
    backgroundColor: CORES.azul,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 9,
  },

  marca: {
    color: CORES.branco,
    fontFamily: FONTE,
    fontStyle: "italic",
    fontSize: 19,
  },

  formTopoLegenda: {
    color: CORES.branco,
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "700",
    flex: 1,
  },

  formClasse: {
    color: CORES.turquesa,
    fontSize: 8,
    fontWeight: "700",
  },

  botaoFechar: {
    paddingHorizontal: 4,
    paddingVertical: 3,
  },

  fecharX: {
    color: CORES.branco,
    fontSize: 25,
    lineHeight: 25,
  },

  formCorpo: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },

  formTitulo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 23,
    marginBottom: 6,
    textAlign: "center",
  },

  formDescricao: {
    color: CORES.cinza,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },

  rotuloForm: {
    color: CORES.turquesa,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 14,
    marginBottom: 7,
  },

  inputGrande: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 23,
    borderBottomWidth: 1,
    borderBottomColor: CORES.azul,
    paddingVertical: 5,
    ...FOCO_WEB,
  },

  input: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 17,
    borderBottomWidth: 1,
    borderBottomColor: CORES.azul,
    paddingVertical: 6,
    ...FOCO_WEB,
  },

  areaNota: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 9,
    minHeight: 40,
  },

  estrelas: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  botaoEstrela: {
    paddingVertical: 2,
  },

  estrela: {
    fontSize: 29,
  },

  descricaoNota: {
    color: CORES.cinza,
    fontFamily: FONTE,
    fontStyle: "italic",
    fontSize: 14,
  },

  inputComentario: {
    width: "100%",
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 15,
    lineHeight: 25,
    borderBottomWidth: 1,
    borderBottomColor: CORES.azul,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 4,
    ...FOCO_WEB,
  },

  contagem: {
    color: CORES.cinza,
    fontSize: 10,
    textAlign: "right",
    marginTop: 6,
  },

  formRodape: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
  },

  botaoSalvar: {
    backgroundColor: CORES.turquesa,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  textoSalvar: {
    color: CORES.azul,
    fontSize: 14,
    fontWeight: "700",
  },

  botaoCancelar: {
    paddingVertical: 12,
    alignItems: "center",
  },

  textoCancelar: {
    color: CORES.cinza,
    fontFamily: FONTE,
    fontStyle: "italic",
    textDecorationLine: "underline",
    fontSize: 13,
  },

  confirmacao: {
    width: "100%",
    maxWidth: 345,
    backgroundColor: CORES.papel,
    borderRadius: 19,
    padding: 24,
    alignItems: "center",
  },

  confirmacaoTitulo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 24,
    textAlign: "center",
  },

  confirmacaoDescricao: {
    color: CORES.cinza,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    marginVertical: 18,
  },

  botoesConfirmacao: {
    flexDirection: "row",
    gap: 11,
  },

  cancelarExclusao: {
    backgroundColor: "#E8EDF0",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  confirmarExclusao: {
    backgroundColor: CORES.vermelho,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  textoConfirmar: {
    color: CORES.branco,
    fontWeight: "700",
  },

  // ANIMAÇÃO DE GUARDAR
  modalSucesso: {
    backgroundColor: CORES.papel,
    width: "100%",
    maxWidth: 320,
    borderRadius: 19,
    alignItems: "center",
    paddingTop: 27,
    paddingBottom: 15,
  },

  sucessoMicro: {
    color: CORES.turquesa,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
  },

  sucessoTitulo: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 23,
    textAlign: "center",
  },

  palco: {
    width: 220,
    height: 205,
    position: "relative",
    marginTop: 10,
  },

  pastaAtras: {
    position: "absolute",
    left: 25,
    bottom: 29,
    width: 170,
    height: 98,
    borderRadius: 10,
    backgroundColor: "#88C9CD",
  },

  folha: {
    position: "absolute",
    left: 35,
    top: 10,
    width: 150,
    height: 108,
    borderRadius: 8,
    backgroundColor: CORES.papel,
    zIndex: 2,
    elevation: 3,
  },

  faixaFolha: {
    height: 24,
    backgroundColor: CORES.azul,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  textoFolhaTopo: {
    color: CORES.branco,
    fontSize: 9,
    fontWeight: "700",
  },

  textoFolha: {
    color: CORES.azul,
    fontFamily: FONTE,
    fontSize: 14,
    margin: 10,
  },

  linhaFolha: {
    height: 3,
    width: 90,
    backgroundColor: CORES.linha,
    marginLeft: 10,
  },

  carimboSalvo: {
    position: "absolute",
    top: 32,
    right: -6,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: CORES.turquesa,
    backgroundColor: "rgba(255,255,255,0.83)",
    alignItems: "center",
    justifyContent: "center",
  },

  textoCarimbo: {
    color: CORES.turquesa,
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },

  pastaFrente: {
    position: "absolute",
    bottom: 22,
    left: 20,
    width: 180,
    height: 79,
    borderRadius: 11,
    backgroundColor: CORES.turquesa,
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  nomePasta: {
    color: CORES.branco,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 2,
  },

  subtituloPasta: {
    color: CORES.branco,
    fontSize: 8,
    letterSpacing: 1,
  },
});
