
import { useEffect, useRef, useState } from "react";
import "./App.css";

type PlayerPosition = {
  x: number;
  y: number;
};

type Direction = {
  x: number;
  y: number;
  facing: "up" | "down" | "left" | "right";
};

type CollisionArea = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type DialogType =
  | "barbershop"
  | "sign"
  | "study"
  | "projects"
  | "experience"
  | "home"
  | "market";

type InteractionPoint = {
  type: DialogType;
  x: number;
  y: number;
  label: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const collisionAreas: CollisionArea[] = [
  // Colisões apenas nas bases das construções. Caminhos, praça e ponte ficam livres.
  { xMin: 7, xMax: 25, yMin: 5, yMax: 29 },   // Estudos / casa azul
  { xMin: 38, xMax: 61, yMin: 4, yMax: 29 },  // Vibe Mais Barbershop
  { xMin: 72, xMax: 93, yMin: 6, yMax: 30 },  // Projetos
  { xMin: 8, xMax: 27, yMin: 43, yMax: 59 },  // Mercado
  { xMin: 66, xMax: 91, yMin: 66, yMax: 88 }, // Casa
  // Margem extrema direita: água fora da área jogável.
  { xMin: 98, xMax: 100, yMin: 0, yMax: 100 },
];

const hasCollision = (x: number, y: number) => {
  const footY = y + 2;

  return collisionAreas.some(
    (area) =>
      x >= area.xMin &&
      x <= area.xMax &&
      footY >= area.yMin &&
      footY <= area.yMax
  );
};

// Pontos de interação ficam nas áreas livres ao redor das construções,
// para que o jogador consiga se aproximar sem atravessar as colisões.
const interactionPoints: InteractionPoint[] = [
  { type: "study", x: 16, y: 33, label: "estudos" },
  { type: "barbershop", x: 49, y: 34, label: "Vibe Mais Barbershop" },
  { type: "projects", x: 80, y: 34, label: "projetos" },
  { type: "experience", x: 16, y: 63, label: "mercado e café" },
  { type: "home", x: 79, y: 63, label: "casa" },
  { type: "sign", x: 72, y: 49, label: "placa Bem-vindo" },
];

const getNearbyInteraction = (position: PlayerPosition) =>
  interactionPoints.find(
    (point) =>
      Math.abs(position.x - point.x) <= 12 &&
      Math.abs(position.y - point.y) <= 11
  ) ?? null;

const dialogContent: Record<DialogType, { title: string; text: string }> = {
  barbershop: {
    title: "V+ — Vibe Mais Barbershop",
    text: "Depois de cinco anos trabalhando em barbearias parceiras, decidi dar um passo importante: construir meu próprio espaço. Assim nasceu a Vibe Mais Barbershop, um projeto feito com dedicação, atendimento próximo e vontade de crescer. Empreender me ensinou na prática sobre responsabilidade, organização, relacionamento com clientes e resolução de problemas.",
  },
  home: {
    title: "Minha base: família",
    text: "Sou casado, e minha esposa também trabalha na área de tecnologia. Juntos construímos nossa família e compartilhamos os desafios e aprendizados da vida. Tenho duas filhas, de 10 e 14 anos, que são uma grande motivação para eu continuar evoluindo, estudar e buscar novas oportunidades.",
  },
  study: {
    title: "Estudos — Análise e Desenvolvimento de Sistemas",
    text: "Estou cursando Análise e Desenvolvimento de Sistemas e transformando teoria em prática. Venho estudando lógica de programação, desenvolvimento web, banco de dados, APIs, fundamentos de engenharia de software e métodos ágeis. Meu objetivo é construir uma base sólida, aprender com profissionais experientes e evoluir projeto por projeto, com curiosidade, disciplina e disposição para receber feedback.",
  },
  projects: {
    title: "Missões de desenvolvimento",
    text: "Cada projeto é uma oportunidade de aprender fazendo. No Controle de Gastos, pratiquei a integração entre uma interface web e uma API. No Barber Fidelity, estou planejando um sistema de fidelidade digital para barbearias, com progressão e recompensas. E este próprio Willian.exe transforma meu portfólio em uma experiência interativa. Quero continuar criando soluções úteis, documentando minhas decisões e melhorando a cada versão.",
  },
  experience: {
    title: "Mercado — uma pausa para recarregar",
    text: "Vai explorar a vila inteira? Que tal comprar um café para recarregar as energias? ☕ Minha trajetória também foi construída no contato com pessoas, na rotina de trabalho e na prática de resolver problemas reais. Essas experiências me trouxeram disciplina, comunicação, senso de responsabilidade e uma visão de produto que quero levar comigo para a tecnologia.",
  },
  sign: {
    title: "BEM-VINDO AO WILLIAN.EXE!",
    text: "Você chegou à minha vila. Por aqui, cada construção conta uma parte da minha história: a barbearia representa o empreendedorismo, a casa representa minha família, os estudos mostram minha evolução e os projetos são os próximos níveis. Use WASD ou as setas para explorar e pressione E perto de uma construção para interagir. Bora para a próxima fase!",
  },
};

function App() {
  const [player, setPlayer] = useState<PlayerPosition>({
    x: 50,
    y: 43,
  });

  const [facing, setFacing] = useState<
    "up" | "down" | "left" | "right"
  >("down");

  const [isMoving, setIsMoving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("sign");
  const [message, setMessage] = useState(
    "Use WASD ou as setas para explorar."
  );

  const playerRef = useRef(player);
  const dialogOpenRef = useRef(dialogOpen);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    dialogOpenRef.current = dialogOpen;
  }, [dialogOpen]);

  useEffect(() => {
    let movementTimer: number | undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "e" || key === "enter") {
        event.preventDefault();

        if (dialogOpenRef.current) {
          setDialogOpen(false);
          setMessage("Continue explorando o portfólio.");
          return;
        }

        const nearby = getNearbyInteraction(playerRef.current);
        if (nearby) {
          setDialogType(nearby.type);
          setDialogOpen(true);
          setMessage(`Você interagiu com ${nearby.label}.`);
        } else {
          setMessage("Aproxime-se de uma construção e pressione E para interagir.");
        }

        return;
      }

      if (key === "escape") {
        setDialogOpen(false);
        setMessage("Continue explorando o portfólio.");
        return;
      }

      const directions: Record<string, Direction> = {
        arrowup: { x: 0, y: -3, facing: "up" },
        w: { x: 0, y: -3, facing: "up" },
        arrowdown: { x: 0, y: 3, facing: "down" },
        s: { x: 0, y: 3, facing: "down" },
        arrowleft: { x: -3, y: 0, facing: "left" },
        a: { x: -3, y: 0, facing: "left" },
        arrowright: { x: 3, y: 0, facing: "right" },
        d: { x: 3, y: 0, facing: "right" },
      };

      const direction = directions[key];

      if (!direction) return;

      event.preventDefault();

      setFacing(direction.facing);
      setIsMoving(true);
      setDialogOpen(false);

      const current = playerRef.current;

      const nextPosition: PlayerPosition = {
        x: clamp(current.x + direction.x, 5, 95),
        y: clamp(current.y + direction.y, 5, 96),
      };

      if (hasCollision(nextPosition.x, nextPosition.y)) {
        setMessage("Ops! Tem um obstáculo no caminho.");
      } else {
        playerRef.current = nextPosition;
        setPlayer(nextPosition);

        const nearby = getNearbyInteraction(nextPosition);
        if (nearby) {
          setMessage(`Pressione E para conhecer ${nearby.label}.`);
        } else {
          setMessage("Boa! Continue explorando o portfólio.");
        }
      }

      window.clearTimeout(movementTimer);

      movementTimer = window.setTimeout(() => {
        setIsMoving(false);
      }, 130);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(movementTimer);
    };
  }, []);

  const nearbyInteraction = getNearbyInteraction(player);

  const goToProjects = () => {
    document.getElementById("projetos")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="site-shell" id="inicio">
      <nav className="topbar" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="Willian.exe, início">
          <span className="brand-mark">W</span>
          <span>
            WILLIAN<span className="accent">.EXE</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#sobre">SOBRE</a>
          <a href="#projetos">PROJETOS</a>
          <a href="#contato">CONTATO</a>
        </div>

        <span className="status-pill">
          <span className="status-dot" /> DISPONÍVEL
        </span>
      </nav>

      <section className="hero hero-rpg" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="prompt-symbol">&gt;</span> PORTFÓLIO / PLAYER 01</p>
          <h1 id="hero-title">Olá, eu sou<br /><span className="name-highlight">Willian Almeida</span></h1>
          <p className="hero-role">Estudante de Análise e Desenvolvimento de Sistemas</p>
          <p className="hero-description">Transformando curiosidade em código e ideias em soluções digitais. Estou em busca de uma oportunidade para aprender, colaborar e evoluir na área de tecnologia.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={goToProjects} type="button"><span aria-hidden="true">▶</span> VER PROJETOS</button>
            <a className="secondary-button" href="#sobre">CONHEÇA-ME <span aria-hidden="true">↘</span></a>
          </div>
          <div className="quick-stats" aria-label="Resumo">
            <div><strong>01</strong><span>PLAYER</span></div><div><strong>ADS</strong><span>FORMAÇÃO</span></div><div><strong>∞</strong><span>CURIOSIDADE</span></div>
          </div>
        </div>

        <div className="game-panel game-panel-rpg" aria-label="Vila principal interativa">
          <div className="game-panel-header"><span><span className="tiny-dot" /> WORLD_01 <i>|</i> VILA PRINCIPAL</span><span>EXPLORAR.EXE</span></div>
          <div className="game-world game-world-rpg">
            <img className="village-art" src="/vila-principal.png" alt="Mapa pixel art da vila principal, com casas, barbearia, mercado, jardins e cachoeira" draggable="false" />
            <div className="map-hotspot hotspot-study" aria-hidden="true">ESTUDOS<br />ADS</div>
            <div className="map-hotspot hotspot-barber" aria-hidden="true"><b>V+</b><span>VIBE MAIS</span><small>BARBERSHOP</small></div>
            <div className="map-hotspot hotspot-projects" aria-hidden="true">▣<br />PROJETOS</div>
            <div className="map-hotspot hotspot-market" aria-hidden="true">MERCADO</div>
            <div className="map-hotspot hotspot-home" aria-hidden="true">CASA</div>
            <div className="map-hotspot hotspot-sign" aria-hidden="true">BEM<br />VINDO</div>
            <div className={`player-sprite facing-${facing}${isMoving ? " is-moving" : ""}`} style={{ left: `${player.x}%`, top: `${player.y}%` }} aria-label="Personagem Willian controlado pelo teclado" role="img">
              <span className="sprite-shadow" /><span className="sprite-hair" /><span className="sprite-cap" /><span className="sprite-face"><i className="sprite-eyes" /><i className="sprite-nose" /></span><span className="sprite-beard" /><span className="sprite-neck" /><span className="sprite-body" /><span className="sprite-arm arm-left" /><span className="sprite-arm arm-right" /><span className="sprite-legs" /><span className="sprite-shoes" />
            </div>
            {nearbyInteraction && !dialogOpen && (
              <div className="interaction-prompt" role="status" aria-live="polite">
                <kbd>E</kbd> PRESSIONE PARA INTERAGIR
                <span>{nearbyInteraction.label}</span>
              </div>
            )}
            {dialogOpen && (
              <div className="game-dialog game-dialog-docked dialog-expanded" role="dialog" aria-live="polite" aria-modal="false">
                <div className="dialog-copy">
                  <p className="dialog-title">{dialogContent[dialogType].title}</p>
                  <p>{dialogContent[dialogType].text}</p>
                  <small>Pressione E ou ESC para fechar.</small>
                </div>
              </div>
            )}
          </div>
          <div className="game-controls"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVER</span><span className="control-arrows"><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> MOVER</span><span className="interact-hint"><kbd>E</kbd> INTERAGIR</span><span className="menu-hint"><kbd>ESC</kbd> MENU</span></div>
        </div>
      </section>

      <section className="about-section section-block" id="sobre">
        <div className="section-heading">
          <p className="eyebrow">01 / SOBRE MIM</p>
          <h2>
            Um pouco sobre <span className="accent">o player.</span>
          </h2>
        </div>

        <div className="about-grid">
          <div className="terminal-card">
            <div className="terminal-title">
              <span />
              <span />
              <span />
              <b>perfil.txt</b>
            </div>

            <div className="terminal-content">
              <p>
                <span className="terminal-green">const</span> desenvolvedor ={" "}
                {"{"}
              </p>
              <p className="indent">
                nome: <span className="terminal-yellow">"Willian Almeida"</span>,
              </p>
              <p className="indent">
                curso: <span className="terminal-yellow">"ADS"</span>,
              </p>
              <p className="indent">
                foco: <span className="terminal-yellow">"Tecnologia"</span>,
              </p>
              <p className="indent">
                status:{" "}
                <span className="terminal-yellow">"Aprendendo sempre"</span>
              </p>
              <p>{"};"}</p>
              <p className="terminal-comment">
                // Todo projeto é uma nova fase.
              </p>
            </div>
          </div>

          <div className="about-copy">
            <h3>Aprender. Construir. Evoluir.</h3>
            <p>
              Sou estudante de Análise e Desenvolvimento de Sistemas e estou
              construindo minha jornada na tecnologia com dedicação, prática e
              vontade de aprender.
            </p>
            <p>
              Busco uma oportunidade de estágio em TI para aplicar meus
              conhecimentos, aprender com uma equipe e contribuir com soluções
              úteis.
            </p>
            <a className="text-link" href="#contato">
              VAMOS CONVERSAR <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="projects-section section-block" id="projetos">
        <div className="section-heading">
          <p className="eyebrow">02 / MISSÕES CONCLUÍDAS</p>
          <h2>
            Projetos em <span className="accent">destaque.</span>
          </h2>
          <p className="section-intro">
            Alguns projetos que fazem parte da minha evolução prática.
          </p>
        </div>

        <div className="project-grid">
          <article className="project-card">
            <div className="project-icon" aria-hidden="true">
              ▤
            </div>
            <p className="project-index">MISSÃO 001</p>
            <h3>Controle de Gastos</h3>
            <p>
              Aplicação para cadastrar pessoas e acompanhar despesas, praticando
              integração entre frontend e API.
            </p>
            <div className="tag-list">
              <span>React</span>
              <span>TypeScript</span>
              <span>API</span>
            </div>
          </article>

          <article className="project-card">
            <div className="project-icon" aria-hidden="true">
              ✦
            </div>
            <p className="project-index">MISSÃO 002</p>
            <h3>Barber Fidelity</h3>
            <p>
              Ideia de sistema de fidelidade digital para barbearias, com
              pontos, recompensas e evolução dos clientes.
            </p>
            <div className="tag-list">
              <span>Produto</span>
              <span>UX/UI</span>
              <span>MVP</span>
            </div>
          </article>

          <article className="project-card">
            <div className="project-icon" aria-hidden="true">
              ⌘
            </div>
            <p className="project-index">MISSÃO 003</p>
            <h3>Willian.exe</h3>
            <p>
              Portfólio interativo inspirado em jogos retrô para apresentar
              minha trajetória e meus projetos.
            </p>
            <div className="tag-list">
              <span>React</span>
              <span>CSS</span>
              <span>Vite</span>
            </div>
          </article>
        </div>
      </section>

      <section className="contact-section section-block" id="contato">
        <p className="eyebrow">03 / PRÓXIMA FASE</p>
        <h2>
          Vamos construir algo <span className="accent">juntos?</span>
        </h2>
        <p>Estou em busca de uma oportunidade de estágio em tecnologia.</p>
        <a
          className="primary-button contact-button"
          href="mailto:seu-email@exemplo.com"
        >
          <span aria-hidden="true">✉</span> ENTRAR EM CONTATO
        </a>
        <p className="contact-note">
          Lembre-se de trocar o e-mail de exemplo pelo seu endereço real.
        </p>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} WILLIAN.EXE</span>
        <span>
          DESENVOLVIDO COM CURIOSIDADE E CAFÉ{" "}
          <span className="accent">♥</span>
        </span>
        <a href="#inicio">VOLTAR AO TOPO ↑</a>
      </footer>
    </main>
  );
}

export default App;
