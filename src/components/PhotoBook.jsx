
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const AZUL = "#303B59";
const PAPEL = "#F7F2E9";
const RAIO = 18;
const CAMADAS = 4;

const FOTOS_INICIAIS = [
  {
    id: "arara",
    source: require("../../assets/images/arara.png"),
  },
  {
    id: "memorias",
    source: require("../../assets/images/Memórias de viagem com arara azul e amarela.png"),
  },
  {
    id: "mala-aberta",
    source: require("../../assets/images/malaaberta.png"),
  },
  {
    id: "mala-fechada",
    source: require("../../assets/images/malafechada.png"),
  },
];

function FotoInteira({ source }) {
  return (
    <Image
      source={source}
      resizeMode="cover"
      style={styles.imagem}
    />
  );
}

function MeiaFoto({
  source,
  lado,
  largura,
  altura,
}) {
  const metade = largura / 2;

  return (
    <View
      style={{
        width: metade,
        height: altura,
        overflow: "hidden",
      }}
    >
      <Image
        source={source}
        resizeMode="cover"
        style={{
          position: "absolute",
          width: largura,
          height: altura,
          top: 0,
          left: lado === "esquerda" ? 0 : -metade,
        }}
      />
    </View>
  );
}

export default function PhotoBook() {
  const { width } = useWindowDimensions();

  const mobile = width < 600;

  const larguraArea = Math.max(
    260,
    Math.min(width - 24, 1080)
  );

  const larguraPagina =
    larguraArea * (mobile ? 0.70 : 0.68);

  const alturaPagina = larguraPagina * 0.76;
  const meiaLargura = larguraPagina / 2;
  const margem = (larguraArea - larguraPagina) / 2;
  const distanciaLateral = mobile ? 10 : 23;

  const [fotos, setFotos] = useState(
    FOTOS_INICIAIS
  );

  const [indice, setIndice] = useState(0);

  const [virada, setVirada] = useState(null);

  const [miniaturas, setMiniaturas] = useState(false);

  const indiceRef = useRef(0);
  const ocupadoRef = useRef(false);

  const [progresso] = useState(() => new Animated.Value(0));


  function virarPagina(sentido) {
    if (ocupadoRef.current) return;

    const origem = indiceRef.current;
    const destino = origem + sentido;

    if (destino < 0 || destino >= fotos.length) {
      return;
    }

    ocupadoRef.current = true;

    setVirada({ origem, destino, sentido });
    progresso.setValue(0);

    Animated.timing(progresso, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start(({ finished }) => {
      if (finished) {
        indiceRef.current = destino;
        setIndice(destino);
      }

      setVirada(null);
      progresso.setValue(0);
      ocupadoRef.current = false;
    });
  }

  const toqueInicial = useRef(null);

  function restaurarFotosDeExemplo() {
    if (ocupadoRef.current) return;

    setFotos(FOTOS_INICIAIS);
    indiceRef.current = 0;
    setIndice(0);
    setVirada(null);
    setMiniaturas(false);
  }

  function selecionarFoto(posicao) {
    if (ocupadoRef.current) return;

    indiceRef.current = posicao;
    setIndice(posicao);
    setVirada(null);
  }

  // Excluir uma foto do álbum
  function excluirFoto(posicao) {
    if (ocupadoRef.current) return;

    const novasFotos = fotos.filter(
      (_, i) => i !== posicao
    );

    const novoIndice =
      novasFotos.length === 0
        ? 0
        : Math.min(
            posicao < indice ? indice - 1 : indice,
            novasFotos.length - 1
          );

    setFotos(novasFotos);
    indiceRef.current = novoIndice;
    setIndice(novoIndice);
    setVirada(null);
  }

  // Excluir todas as fotografias
  function limparAlbum() {
    if (ocupadoRef.current || fotos.length === 0) {
      return;
    }

    Alert.alert(
      "Limpar álbum",
      "Deseja remover todas as fotos deste álbum?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover todas",
          style: "destructive",
          onPress: () => {
            setFotos([]);
            setIndice(0);
            indiceRef.current = 0;
            setVirada(null);
            setMiniaturas(false);
          },
        },
      ]
    );
  }

  const indiceBase = virada ? virada.destino : indice;

  const fotoBase = fotos[indiceBase];

  const fotoAntiga = virada
    ? fotos[virada.origem]
    : fotoBase;

  const sentido = virada?.sentido ?? 1;

  const ladoFrente =
    sentido === 1 ? "direita" : "esquerda";

  const ladoVerso =
    sentido === 1 ? "esquerda" : "direita";

  const ladoParado =
    sentido === 1 ? "esquerda" : "direita";

  const rotacao = progresso.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange:
      sentido === 1
        ? ["0deg", "-90deg", "-180deg"]
        : ["0deg", "90deg", "180deg"],
  });

  const elevacao = progresso.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -6, 0],
  });

  const escalaVertical = progresso.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.025, 1],
  });

  const opacidadeParada = progresso.interpolate({
    inputRange: [0, 0.36, 0.64, 1],
    outputRange: [1, 1, 0, 0],
    easing: Easing.inOut(Easing.cubic),
  });

  const sombraFrente = progresso.interpolate({
    inputRange: [0, 0.25, 0.5, 1],
    outputRange: [0, 0.08, 0.31, 0],
  });

  const sombraVerso = progresso.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [0, 0.28, 0.12, 0],
  });

  const sombraFundo = progresso.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.11, 0],
  });

  const opacidadeFotoNova = progresso.interpolate({
    inputRange: [0, 0.16, 0.84, 1],
    outputRange: [0, 0, 1, 1],
    easing: Easing.inOut(Easing.cubic),
  });

  function renderizarLateral(lado) {
    const sinal = lado === "esquerda" ? -1 : 1;

    return Array.from(
      { length: CAMADAS },
      (_, i) => {
        const nivel = CAMADAS - i;
        const posicao = indiceBase + sinal * nivel;

        if (
          posicao < 0 ||
          posicao >= fotos.length
        ) {
          return null;
        }

        const deslocamento =
          sinal * (12 + nivel * distanciaLateral);

        const escala = 1 - nivel * 0.045;
        const angulo = sinal * nivel * 2.2;

        return (
          <Pressable
            key={`${lado}-${nivel}`}
            onPress={() =>
              virarPagina(sinal)
            }
            style={[
              styles.paginaLateral,
              {
                left: margem,
                top: 12 + nivel * 2,
                width: larguraPagina,
                height: alturaPagina,
                zIndex: 10 - nivel,
                transform: [
                  { perspective: 1400 },
                  { translateX: deslocamento },
                  { scale: escala },
                  { rotateY: `${angulo}deg` },
                ],
              },
            ]}
          >
            <FotoInteira source={fotos[posicao].source} />
          </Pressable>
        );
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.contadorSuperior}>
        {fotos.length} Pages
      </Text>

      <View
        onStartShouldSetResponder={() => true}
        onResponderGrant={(evento) => {
          toqueInicial.current = {
            x: evento.nativeEvent.locationX,
            y: evento.nativeEvent.locationY,
          };
        }}
        onResponderRelease={(evento) => {
          if (!toqueInicial.current) return;

          const dx = evento.nativeEvent.locationX - toqueInicial.current.x;
          if (dx < -45) virarPagina(1);
          else if (dx > 45) virarPagina(-1);
          toqueInicial.current = null;
        }}
        style={[
          styles.palco,
          {
            width: larguraArea,
            height: alturaPagina + 38,
          },
        ]}
      >
        {fotoBase ? (
          <>
            {renderizarLateral("esquerda")}
            {renderizarLateral("direita")}

            <View
              pointerEvents="none"
              style={[
                styles.paginaCentral,
                {
                  left: margem,
                  top: 8,
                  width: larguraPagina,
                  height: alturaPagina,
                },
              ]}
            >
              {virada && fotoAntiga && (
                <>
                  <FotoInteira source={fotoAntiga.source} />
                  <Animated.Image
                    source={fotoBase.source}
                    resizeMode="cover"
                    style={[
                      styles.imagem,
                      styles.fotoSobreposta,
                      { opacity: opacidadeFotoNova },
                    ]}
                  />
                </>
              )}
              {(!virada || !fotoAntiga) && (
                <FotoInteira source={fotoBase.source} />
              )}

              {virada && (
                <Animated.View
                  style={[
                    styles.sombraCompleta,
                    { opacity: sombraFundo },
                  ]}
                />
              )}
            </View>

            {virada && fotoAntiga && (
              <>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.metadeParada,
                    {
                      left:
                        margem +
                        (sentido === 1
                          ? 0
                          : meiaLargura),
                      top: 8,
                      width: meiaLargura,
                      height: alturaPagina,
                      opacity: opacidadeParada,
                    },
                  ]}
                >
                  <MeiaFoto
                    source={fotoAntiga.source}
                    lado={ladoParado}
                    largura={larguraPagina}
                    altura={alturaPagina}
                  />
                </Animated.View>

                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.folhaGiratoria,
                    {
                      left:
                        margem +
                        (sentido === 1
                          ? meiaLargura
                          : 0),
                      top: 8,
                      width: meiaLargura,
                      height: alturaPagina,
                      transform: [
                        { perspective: 1250 },
                        {
                          translateX:
                            sentido === 1
                              ? -meiaLargura / 2
                              : meiaLargura / 2,
                        },
                        { rotateY: rotacao },
                        {
                          translateX:
                            sentido === 1
                              ? meiaLargura / 2
                              : -meiaLargura / 2,
                        },
                        { translateY: elevacao },
                        { scaleY: escalaVertical },
                      ],
                    },
                  ]}
                >
                  <View style={styles.face}>
                    <MeiaFoto
                      source={fotoAntiga.source}
                      lado={ladoFrente}
                      largura={larguraPagina}
                      altura={alturaPagina}
                    />
                    <Animated.View
                      style={[
                        styles.sombraFace,
                        { opacity: sombraFrente },
                      ]}
                    />
                  </View>

                  <View
                    style={[
                      styles.face,
                      styles.verso,
                    ]}
                  >
                    <MeiaFoto
                      source={fotoBase.source}
                      lado={ladoVerso}
                      largura={larguraPagina}
                      altura={alturaPagina}
                    />
                    <Animated.View
                      style={[
                        styles.sombraFace,
                        { opacity: sombraVerso },
                      ]}
                    />
                  </View>
                </Animated.View>
              </>
            )}
          </>
        ) : (
          <View
            style={[
              styles.albumVazio,
              {
                width: larguraPagina,
                height: alturaPagina,
                left: margem,
                top: 8,
              },
            ]}
          >
            <Text style={styles.tituloVazio}>
              Seu diário de viagens
            </Text>

            <Text style={styles.descricaoVazia}>
              Adicione as fotos de exemplo para
              folhear seu álbum.
            </Text>

            <Pressable
              onPress={restaurarFotosDeExemplo}
              style={styles.botaoImportar}
            >
              <Text style={styles.textoImportar}>
                Restaurar fotos de exemplo
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Navegação e galeria */}
      <View style={styles.controles}>
        <Pressable
          onPress={() => virarPagina(-1)}
          disabled={indice === 0 || !!virada}
          style={[
            styles.botao,
            (indice === 0 || !!virada) &&
              styles.desativado,
          ]}
          accessibilityLabel="Página anterior"
        >
          <Text style={styles.seta}>‹</Text>
        </Pressable>

        <Pressable
          onPress={restaurarFotosDeExemplo}
          disabled={!!virada}
          style={[
            styles.botao,
            !!virada && styles.desativado,
          ]}
          accessibilityLabel="Restaurar fotos de exemplo"
        >
          <Text style={styles.mais}>+</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setMiniaturas((valor) => !valor)
          }
          style={styles.botao}
          accessibilityLabel="Ver todas as fotos"
        >
          <Text style={styles.grade}>▦</Text>
        </Pressable>

        <Pressable
          onPress={() => virarPagina(1)}
          disabled={
            indice >= fotos.length - 1 ||
            !!virada
          }
          style={[
            styles.botao,
            (indice >= fotos.length - 1 ||
              !!virada) &&
              styles.desativado,
          ]}
          accessibilityLabel="Próxima página"
        >
          <Text style={styles.seta}>›</Text>
        </Pressable>
      </View>

      {/* Miniaturas com opção de excluir */}
      {miniaturas && fotos.length > 0 && (
        <View style={styles.areaMiniaturas}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.conteudoMiniaturas
            }
          >
            {fotos.map((foto, posicao) => (
              <View
                key={foto.id}
                style={styles.itemMiniatura}
              >
                <Pressable
                  onPress={() =>
                    selecionarFoto(posicao)
                  }
                  style={[
                    styles.miniatura,
                    indice === posicao &&
                      styles.miniaturaAtiva,
                  ]}
                >
                  <Image
                    source={foto.source}
                    resizeMode="cover"
                    style={styles.imagemMiniatura}
                  />
                </Pressable>

                <Pressable
                  onPress={() =>
                    excluirFoto(posicao)
                  }
                  style={styles.botaoExcluir}
                  accessibilityLabel="Excluir fotografia"
                >
                  <Text style={styles.textoExcluir}>
                    ×
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <Pressable
            onPress={limparAlbum}
            style={styles.limparAlbum}
          >
            <Text style={styles.textoLimpar}>
              Limpar álbum inteiro
            </Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.instrucao}>
        {fotos.length === 0
          ? "Use o botão + para importar suas fotos"
          : "Deslize ou use as setas para folhear"}
      </Text>

      {fotos.length > 0 && (
        <Text style={styles.contadorInferior}>
          {indice + 1} / {fotos.length}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: AZUL,
    paddingTop: 4,
    paddingBottom: 28,
  },

  contadorSuperior: {
    color: "#E1E6EE",
    fontSize: 10,
    letterSpacing: 0.7,
    marginBottom: 18,
  },

  palco: {
    position: "relative",
    alignSelf: "center",
    overflow: "visible",
    marginBottom: 15,
  },

  paginaLateral: {
    position: "absolute",
    borderRadius: RAIO,
    overflow: "hidden",
    backgroundColor: "#AEBBC6",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  paginaCentral: {
    position: "absolute",
    zIndex: 20,
    borderRadius: RAIO,
    overflow: "hidden",
    backgroundColor: "#B6C2CC",
    shadowColor: "#000",
    shadowOpacity: 0.29,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    elevation: 8,
  },

  imagem: {
    width: "100%",
    height: "100%",
  },

  fotoSobreposta: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  sombraCompleta: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#101827",
  },

  metadeParada: {
    position: "absolute",
    zIndex: 22,
    overflow: "hidden",
  },

  folhaGiratoria: {
    position: "absolute",
    zIndex: 28,
  },

  face: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    backgroundColor: PAPEL,
  },

  verso: {
    transform: [{ rotateY: "180deg" }],
  },

  sombraFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#101827",
  },

  albumVazio: {
    position: "absolute",
    borderRadius: RAIO,
    backgroundColor: "#E8E4DC",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  tituloVazio: {
    fontSize: 17,
    fontWeight: "700",
    color: AZUL,
    textAlign: "center",
  },

  descricaoVazia: {
    fontSize: 11,
    color: "#5E6981",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  botaoImportar: {
    backgroundColor: AZUL,
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 20,
  },

  textoImportar: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  controles: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  botao: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: PAPEL,
    alignItems: "center",
    justifyContent: "center",
  },

  desativado: {
    opacity: 0.35,
  },

  seta: {
    color: AZUL,
    fontSize: 29,
    lineHeight: 33,
  },

  mais: {
    color: AZUL,
    fontSize: 23,
    lineHeight: 28,
  },

  grade: {
    color: AZUL,
    fontSize: 21,
    lineHeight: 26,
  },

  areaMiniaturas: {
    width: "94%",
    marginTop: 16,
    alignItems: "center",
  },

  conteudoMiniaturas: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 12,
  },

  itemMiniatura: {
    alignItems: "center",
    gap: 6,
  },

  miniatura: {
    width: 70,
    height: 55,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },

  miniaturaAtiva: {
    borderColor: PAPEL,
  },

  imagemMiniatura: {
    width: "100%",
    height: "100%",
  },

  botaoExcluir: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F7F2E9",
    alignItems: "center",
    justifyContent: "center",
  },

  textoExcluir: {
    color: "#A73F4B",
    fontSize: 20,
    lineHeight: 23,
    fontWeight: "700",
  },

  limparAlbum: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  textoLimpar: {
    color: "#F7F2E9",
    fontSize: 12,
    textDecorationLine: "underline",
  },

  instrucao: {
    color: "#CDD5E3",
    fontSize: 10,
    marginTop: 13,
    textAlign: "center",
  },

  contadorInferior: {
    color: "#DDE3ED",
    fontSize: 11,
    marginTop: 7,
  },
});
