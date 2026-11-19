
import React, { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Polygon,
  Rect,
} from 'react-native-svg';

const AZUL = '#092857';
const FUNDO = '#EBF7FF';
const AMARELO = '#FFD64C';

const PARTIDAS = [
  {
    sigla: 'FLN',
    cidade: 'Florianópolis',
    preco: 389,
    chamada: '-32%',
    corChamada: '#FF6C70',
  },
  {
    sigla: 'SSA',
    cidade: 'Salvador',
    preco: 459,
    chamada: 'EMBARQUE',
    corChamada: '#1BD1B6',
  },
  {
    sigla: 'REC',
    cidade: 'Recife',
    preco: 512,
    chamada: 'RESTAM 4',
    corChamada: '#FFD64C',
  },
  {
    sigla: 'IGU',
    cidade: 'Foz do Iguaçu',
    preco: 298,
    chamada: '-24%',
    corChamada: '#FF6C70',
  },
  {
    sigla: 'MCZ',
    cidade: 'Maceió',
    preco: 574,
    chamada: 'EMBARQUE',
    corChamada: '#1BD1B6',
  },
];

const BILHETES = [
  {
    numero: '01',
    origem: 'GRU',
    destino: 'FLN',
    nome: 'FLORIPA',
    duracao: '4 dias',
    preco: 389,
    desconto: '-32%',
    fundo: '#22C9B7',
  },
  {
    numero: '02',
    origem: 'CGH',
    destino: 'NAT',
    nome: 'NATAL',
    duracao: '7 dias',
    preco: 612,
    desconto: '-18%',
    fundo: '#82B6FF',
  },
  {
    numero: '03',
    origem: 'GIG',
    destino: 'MCZ',
    nome: 'MACEIÓ',
    duracao: '5 dias',
    preco: 574,
    desconto: '-24%',
    fundo: '#B9EDFA',
  },
  {
    numero: '04',
    origem: 'GRU',
    destino: 'SSA',
    nome: 'SALVADOR',
    duracao: '6 dias',
    preco: 459,
    desconto: '-20%',
    fundo: '#FFE18B',
  },
  {
    numero: '05',
    origem: 'VCP',
    destino: 'IGU',
    nome: 'FOZ DO IGUAÇU',
    duracao: '3 dias',
    preco: 298,
    desconto: '-24%',
    fundo: '#BCE6CB',
  },
];

const SURPRESAS = [
  { nome: 'JERICOACOARA', preco: 799 },
  { nome: 'BELO HORIZONTE', preco: 298 },
  { nome: 'CURITIBA', preco: 356 },
  { nome: 'PORTO SEGURO', preco: 742 },
  { nome: 'FLORIANÓPOLIS', preco: 389 },
  { nome: 'MACEIÓ', preco: 574 },
];

const moeda = (numero) =>
  `R$ ${numero.toLocaleString('pt-BR')}`;

function Nuvem({
  x,
  y,
  scale = 1,
}) {
  return (
    <>
      <Ellipse
        cx={x + 34 * scale}
        cy={y + 22 * scale}
        rx={35 * scale}
        ry={17 * scale}
        fill="#FFFFFF"
      />
      <Circle
        cx={x + 20 * scale}
        cy={y + 14 * scale}
        r={17 * scale}
        fill="#FFFFFF"
      />
      <Circle
        cx={x + 46 * scale}
        cy={y + 8 * scale}
        r={20 * scale}
        fill="#FFFFFF"
      />
    </>
  );
}

function Banner() {
  return (
    <View style={s.banner}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 390 350"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Rect width="390" height="350" fill="#6BC9F4" />

        <Nuvem x={6} y={22} scale={1.0} />
        <Nuvem x={329} y={82} scale={0.6} />

        <Path
          d="M32 111 Q150 -12 275 100 T426 77"
          stroke={AZUL}
          strokeWidth="2.5"
          strokeDasharray="6 8"
          fill="none"
        />

        <Polygon
          points="0,281 68,184 119,245 187,141 262,261 340,196 390,270 390,350 0,350"
          fill={AZUL}
        />

        <Polygon
          points="6,279 68,191 119,250 187,149 262,269 340,204 390,278 390,350 0,350"
          fill="#2E8A69"
        />

        <Polygon
          points="165,180 187,149 207,196 189,182 184,192"
          fill="white"
        />

        <Path
          d="M0 319 C52 285 109 326 166 322 C220 319 237 288 283 305 C327 321 347 336 390 309 L390 350 L0 350Z"
          fill="#25D2BD"
          stroke={AZUL}
          strokeWidth="5"
        />

        <Path
          d="M0 331 C56 307 104 330 161 336 C217 339 229 312 279 319 C332 326 350 345 390 324 L390 350 L0 350Z"
          fill="#13478E"
          stroke={AZUL}
          strokeWidth="3"
        />
      </Svg>

      <View style={s.bannerTop}>
        <View style={s.bannerPill}>
          <Text style={s.bannerPillText}>
            ✈ AEROVIVA
          </Text>
        </View>

        <View style={s.bannerPill}>
          <Text style={s.bannerPillText}>
            SEX · 06 NOV
          </Text>
        </View>
      </View>

      <View style={s.bannerTitleClip}>
        <Text numberOfLines={1} style={s.bannerTitle}>
          OFERTAS
        </Text>
      </View>

      <View style={s.descontoHero}>
        <Text style={s.descontoAte}>ATÉ</Text>
        <Text style={s.descontoNumero}>-32%</Text>
      </View>

      <View style={s.faixaHero}>
        <Text numberOfLines={1} style={s.faixaTexto}>
          ÚLTIMOS ASSENTOS • PREÇO RELÂMPAGO • VOE MAIS,
          PAGUE MENOS • ÚLTIMOS ASSENTOS
        </Text>
      </View>
    </View>
  );
}

function Partidas() {
  return (
    <View style={s.secaoPartidas}>
      <View style={s.sectionTitleRow}>
        <View style={s.pontoVermelho} />

        <Text style={s.tituloSecao}>
          PARTIDAS · AO VIVO
        </Text>
      </View>

      <View style={s.quadro}>
        <View style={s.quadroCabecalho}>
          <Text style={s.quadroColSigla}>DESTINO</Text>
          <Text style={s.quadroColCidade}>CIDADE</Text>
          <Text style={s.quadroColPreco}>A PARTIR</Text>
        </View>

        {PARTIDAS.map((item) => (
          <View key={item.sigla} style={s.linhaVoo}>
            <View style={s.siglas}>
              {item.sigla.split('').map((letra, i) => (
                <View
                  style={s.siglaQuadrado}
                  key={`${item.sigla}-${i}`}
                >
                  <Text style={s.siglaLetra}>
                    {letra}
                  </Text>
                </View>
              ))}
            </View>

            <View style={s.linhaCidade}>
              <Text style={s.nomeCidade}>
                {item.cidade}
              </Text>

              <Text
                style={[
                  s.linhaChamada,
                  { color: item.corChamada },
                ]}
              >
                {item.chamada}
              </Text>
            </View>

            <Text style={s.linhaPreco}>
              {moeda(item.preco)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CodigoBarras() {
  return (
    <View style={s.barras}>
      {Array.from({ length: 25 }, (_, i) => (
        <View
          key={i}
          style={{
            width:
              i % 4 === 0
                ? 3
                : i % 3 === 0
                ? 2
                : 1,
            height: 29,
            backgroundColor: AZUL,
            marginRight: i % 3 === 1 ? 2 : 1,
          }}
        />
      ))}
    </View>
  );
}

function Cartao({ item }) {
  return (
    <View style={s.cartaoArea}>
      <View style={s.corda} />
      <View style={s.aro} />

      <View
        style={[
          s.cartaoSombra,
          { backgroundColor: AZUL },
        ]}
      />

      <View
        style={[
          s.cartao,
          { backgroundColor: item.fundo },
        ]}
      >
        <View style={s.cartaoCabecalho}>
          <View style={s.numeroBilhete}>
            <Text style={s.numeroBilheteTexto}>
              Nº {item.numero}
            </Text>
          </View>

          <View style={s.seloDesconto}>
            <Text style={s.seloTexto}>
              {item.desconto}
            </Text>
          </View>
        </View>

        <Text style={s.codigoRota}>
          {item.origem} → {item.destino}
        </Text>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={s.nomeBilhete}
        >
          {item.nome}
        </Text>

        <Text style={s.duracao}>
          ida e volta · {item.duracao}
        </Text>

        <View style={s.divisoriaBilhete} />

        <View style={s.inferiorBilhete}>
          <View>
            <Text style={s.moedaBilhete}>
              R${' '}
              <Text style={s.valorBilhete}>
                {item.preco}
              </Text>
            </Text>

            <Text style={s.porPessoa}>
              por pessoa
            </Text>
          </View>

          <CodigoBarras />
        </View>

        <View style={s.furoEsquerdo} />
        <View style={s.furoDireito} />
      </View>
    </View>
  );
}

function Destaques() {
  return (
    <View style={s.secaoDestaques}>
      <Text style={s.tituloSecao}>
        DESTAQUES DA SEMANA
      </Text>

      <View style={s.varal}>
        <View style={s.varalLinha} />

        <View
          style={[
            s.pino,
            { left: '22%' },
          ]}
        />

        <View
          style={[
            s.pino,
            { left: '71%' },
          ]}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.carrossel}
        snapToInterval={228}
        decelerationRate="fast"
      >
        {BILHETES.map((item) => (
          <Cartao
            key={item.numero}
            item={item}
          />
        ))}
      </ScrollView>

      <Text style={s.deslize}>
        deslize para ver mais →
      </Text>
    </View>
  );
}

function Carimbo({
  cor,
  principal,
  secundario,
}) {
  return (
    <View
      style={[
        s.carimbo,
        { borderColor: cor },
      ]}
    >
      <View
        style={[
          s.carimboInterno,
          { borderColor: cor },
        ]}
      >
        <Text
          style={[
            s.carimboPrincipal,
            { color: cor },
          ]}
        >
          {principal}
        </Text>

        <Text
          style={[
            s.carimboSecundario,
            { color: cor },
          ]}
        >
          {secundario}
        </Text>
      </View>
    </View>
  );
}

export default function Ofertas() {
  const { width } = useWindowDimensions();

  const largura = Math.min(width, 520);

  const [sorte, setSorte] = useState(null);

  const anterior = useRef(-1);

  function surpreender() {
    let indice = Math.floor(
      Math.random() * SURPRESAS.length
    );

    if (indice === anterior.current) {
      indice = (indice + 1) % SURPRESAS.length;
    }

    anterior.current = indice;
    setSorte(SURPRESAS[indice]);
  }

  return (
    <View style={s.tela}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <View
          style={[
            s.corpo,
            { width: largura },
          ]}
        >
          <Banner />

          <Partidas />

          <Destaques />

          <View style={s.secaoBeneficios}>
            <Text style={s.tituloSecao}>
              CARIMBOS DE BENEFÍCIOS
            </Text>

            <View style={s.carimbos}>
              <Carimbo
                cor="#426F9E"
                principal="30%"
                secundario="OFF NO APP"
              />

              <Carimbo
                cor="#31A995"
                principal="2X"
                secundario="MILHAS"
              />

              <Carimbo
                cor="#398C73"
                principal="1ª"
                secundario="MALA GRÁTIS"
              />
            </View>

            <Pressable
              onPress={surpreender}
              style={({ pressed }) => [
                s.surpreendaSombra,
                pressed && {
                  transform: [
                    { translateY: 2 },
                  ],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Surpreenda-me com um destino"
            >
              <View style={s.surpreendaBotao}>
                <Text style={s.surpreendaTexto}>
                  SURPREENDA-ME
                </Text>

                <Text style={s.surpreendaSeta}>
                  →
                </Text>
              </View>
            </Pressable>

            {sorte !== null && (
              <View style={s.resultadoSorte}>
                <Text style={s.sorteLegenda}>
                  SUA SORTE É
                </Text>

                <Text style={s.sorteNome}>
                  {sorte.nome}
                </Text>

                <Text style={s.sorteLegenda}>
                  a partir de
                </Text>

                <Text style={s.sortePreco}>
                  {moeda(sorte.preco)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  scroll: {
    alignItems: 'center',
    paddingBottom: 40,
  },

  corpo: {
    maxWidth: 520,
    backgroundColor: FUNDO,
  },

  // BANNER
  banner: {
    height: 350,
    overflow: 'hidden',
    backgroundColor: '#6BC9F4',
    borderBottomWidth: 4,
    borderBottomColor: AZUL,
  },

  bannerTop: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bannerPill: {
    backgroundColor: AZUL,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  bannerPillText: {
    color: 'white',
    fontFamily: 'monospace',
    fontWeight: '900',
    fontSize: 11,
  },

  bannerTitleClip: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: -18,
    height: 112,
    overflow: 'hidden',
  },

  bannerTitle: {
    fontSize: 76,
    lineHeight: 100,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -3,
    textShadowColor: AZUL,
    textShadowOffset: {
      width: 4,
      height: 5,
    },
    textShadowRadius: 0,
  },

  descontoHero: {
    position: 'absolute',
    right: 17,
    bottom: 68,
    borderWidth: 3,
    borderColor: AZUL,
    backgroundColor: AMARELO,
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      { rotate: '-12deg' },
    ],
  },

  descontoAte: {
    fontSize: 12,
    fontWeight: '900',
    color: AZUL,
  },

  descontoNumero: {
    fontSize: 25,
    fontWeight: '900',
    color: AZUL,
  },

  faixaHero: {
    position: 'absolute',
    bottom: 40,
    left: -12,
    right: -12,
    backgroundColor: AZUL,
    paddingVertical: 8,
    transform: [
      { rotate: '-4deg' },
    ],
  },

  faixaTexto: {
    color: AMARELO,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  // PARTIDAS
  secaoPartidas: {
    marginTop: 23,
    paddingHorizontal: 16,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 13,
  },

  pontoVermelho: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF686A',
  },

  tituloSecao: {
    color: AZUL,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  quadro: {
    borderRadius: 14,
    backgroundColor: AZUL,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 5,
    borderBottomColor: '#072049',
  },

  quadroCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 26,
    borderBottomWidth: 1,
    borderBottomColor: '#28436A',
  },

  quadroColSigla: {
    width: 72,
    color: '#87A6D6',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },

  quadroColCidade: {
    flex: 1,
    color: '#87A6D6',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },

  quadroColPreco: {
    color: '#87A6D6',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },

  linhaVoo: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 49,
    borderBottomWidth: 1,
    borderBottomColor: '#24436D',
  },

  siglas: {
    flexDirection: 'row',
    width: 72,
    gap: 2,
  },

  siglaQuadrado: {
    backgroundColor: '#154B98',
    width: 22,
    height: 25,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00193B',
  },

  siglaLetra: {
    color: '#D8EBFF',
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'monospace',
  },

  linhaCidade: {
    flex: 1,
    paddingHorizontal: 1,
    gap: 2,
  },

  nomeCidade: {
    color: 'white',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },

  linhaChamada: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '900',
  },

  linhaPreco: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },

  // BILHETES
  secaoDestaques: {
    marginTop: 30,
  },

  varal: {
    height: 31,
    marginHorizontal: 15,
    justifyContent: 'center',
  },

  varalLinha: {
    height: 2,
    backgroundColor: AZUL,
  },

  pino: {
    position: 'absolute',
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: AMARELO,
    borderWidth: 2,
    borderColor: AZUL,
    top: 10,
  },

  carrossel: {
    paddingLeft: 16,
    paddingRight: 20,
    paddingTop: 9,
    paddingBottom: 10,
    gap: 14,
  },

  cartaoArea: {
    width: 214,
    height: 214,
    paddingTop: 12,
  },

  corda: {
    position: 'absolute',
    top: -16,
    left: 99,
    width: 2,
    height: 28,
    backgroundColor: AZUL,
    transform: [
      { rotate: '11deg' },
    ],
  },

  aro: {
    position: 'absolute',
    zIndex: 5,
    top: 6,
    left: 95,
    height: 16,
    width: 16,
    borderWidth: 2,
    borderColor: AZUL,
    backgroundColor: FUNDO,
    borderRadius: 9,
  },

  cartaoSombra: {
    position: 'absolute',
    left: 4,
    right: -4,
    top: 16,
    bottom: 1,
    borderRadius: 19,
  },

  cartao: {
    flex: 1,
    borderWidth: 2,
    borderColor: AZUL,
    borderRadius: 19,
    padding: 12,
    overflow: 'hidden',
  },

  cartaoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  numeroBilhete: {
    backgroundColor: AZUL,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  numeroBilheteTexto: {
    color: 'white',
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: '900',
  },

  seloDesconto: {
    borderRadius: 30,
    backgroundColor: '#FA7773',
    borderWidth: 1,
    borderColor: AZUL,
    paddingHorizontal: 9,
    paddingVertical: 4,
    transform: [
      { rotate: '8deg' },
    ],
  },

  seloTexto: {
    color: 'white',
    fontWeight: '900',
    fontSize: 11,
  },

  codigoRota: {
    color: AZUL,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  nomeBilhete: {
    fontSize: 24,
    color: AZUL,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 5,
  },

  duracao: {
    color: AZUL,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 10,
    marginTop: 2,
  },

  divisoriaBilhete: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 107,
    borderTopWidth: 1.5,
    borderColor: AZUL,
    borderStyle: 'dashed',
  },

  inferiorBilhete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: 2,
  },

  moedaBilhete: {
    color: AZUL,
    fontSize: 11,
    fontWeight: '900',
  },

  valorBilhete: {
    fontSize: 29,
    fontWeight: '900',
  },

  porPessoa: {
    color: AZUL,
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },

  barras: {
    flexDirection: 'row',
    height: 31,
    alignItems: 'flex-end',
    overflow: 'hidden',
    maxWidth: 75,
  },

  furoEsquerdo: {
    width: 16,
    height: 16,
    backgroundColor: FUNDO,
    borderRadius: 8,
    position: 'absolute',
    left: -10,
    top: 99,
  },

  furoDireito: {
    width: 16,
    height: 16,
    backgroundColor: FUNDO,
    borderRadius: 8,
    position: 'absolute',
    right: -10,
    top: 99,
  },

  deslize: {
    textAlign: 'center',
    color: '#4C6587',
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 9,
    fontWeight: 'bold',
  },

  // BENEFÍCIOS
  secaoBeneficios: {
    marginHorizontal: 16,
    marginTop: 26,
  },

  carimbos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 24,
    gap: 8,
  },

  carimbo: {
    width: 87,
    height: 87,
    borderWidth: 2,
    borderRadius: 44,
    padding: 3,
  },

  carimboInterno: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      { rotate: '-10deg' },
    ],
  },

  carimboPrincipal: {
    fontSize: 19,
    fontWeight: '900',
  },

  carimboSecundario: {
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },

  // SURPREENDA-ME
  surpreendaSombra: {
    backgroundColor: AZUL,
    borderRadius: 10,
    paddingBottom: 4,
  },

  surpreendaBotao: {
    backgroundColor: AMARELO,
    borderWidth: 2,
    borderColor: AZUL,
    borderRadius: 9,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  surpreendaTexto: {
    color: AZUL,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  surpreendaSeta: {
    color: AZUL,
    fontSize: 18,
    fontWeight: '900',
  },

  resultadoSorte: {
    backgroundColor: 'white',
    borderColor: AZUL,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 9,
    marginTop: 12,
    alignItems: 'center',
    padding: 14,
  },

  sorteLegenda: {
    color: AZUL,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 10,
  },

  sorteNome: {
    color: AZUL,
    fontWeight: '900',
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 2,
  },

  sortePreco: {
    color: AZUL,
    fontWeight: '900',
    fontSize: 20,
    marginTop: 2,
  },
});
