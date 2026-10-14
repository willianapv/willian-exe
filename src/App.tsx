
import { useEffect, useState } from "react";
import "./App.css";

type PlayerPosition = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function App() {
  const [player, setPlayer] = useState<PlayerPosition>({ x: 12, y: 63 });
  const [facing, setFacing] = useState<"up" | "down" | "left" | "right">("down");
  const [isMoving, setIsMoving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState(
    "Use WASD ou as setas para explorar."
  );

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
        setDialogOpen((open) => !open);
        setMessage("Você encontrou uma mensagem no mundo!");
        return;
      }

      if (key === "escape") {
        setDialogOpen(false);
        return;
      }

      const directions: Record<
        string,
        { x: number; y: number; facing: "up" | "down" | "left" | "right" }
      > = {
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

      setPlayer((current) => ({
        x: clamp(current.x + direction.x, 5, 95),
        y: clamp(current.y + direction.y, 18, 80),
      }));

      setMessage("Boa! Continue explorando o portfólio.");

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

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="prompt-symbol">&gt;</span> PORTFÓLIO / PLAYER 01
          </p>

          <h1 id="hero-title">
            Olá, eu sou
            <br />
            <span className="name-highlight">Willian Almeida</span>
          </h1>

          <p className="hero-role">
            Estudante de Análise e Desenvolvimento de Sistemas
          </p>

          <p className="hero-description">
            Transformando curiosidade em código e ideias em soluções digitais.
            Estou em busca de uma oportunidade para aprender, colaborar e
            evoluir na área de tecnologia.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={goToProjects}
              type="button"
            >
              <span aria-hidden="true">▶</span> VER PROJETOS
            </button>

            <a className="secondary-button" href="#sobre">
              CONHEÇA-ME <span aria-hidden="true">↘</span>
            </a>
          </div>

          <div className="quick-stats" aria-label="Resumo">
            <div>
              <strong>01</strong>
              <span>PLAYER</span>
            </div>
            <div>
              <strong>ADS</strong>
              <span>FORMAÇÃO</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>CURIOSIDADE</span>
            </div>
          </div>
        </div>

        <div className="game-panel" aria-label="Área interativa de jogo">
          <div className="game-panel-header">
            <span>
              <span className="tiny-dot" /> WORLD_01
            </span>
            <span>EXPLORAR.exe</span>
          </div>

          <div className="game-world">
            <div className="sky-glow" aria-hidden="true" />
            <div className="sun-pixel" aria-hidden="true" />
            <div className="cloud cloud-one" aria-hidden="true" />
            <div className="cloud cloud-two" aria-hidden="true" />

            <div className="mountain mountain-back" aria-hidden="true" />
            <div className="mountain mountain-front" aria-hidden="true" />

            <div className="distant-trees" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="ground" aria-hidden="true" />
            <div className="path" aria-hidden="true" />

            <div className="world-decoration grass-patches" aria-hidden="true">
              <i className="grass grass-1" />
              <i className="grass grass-2" />
              <i className="grass grass-3" />
              <i className="grass grass-4" />
              <i className="grass grass-5" />
              <i className="grass grass-6" />
              <i className="grass grass-7" />
              <i className="grass grass-8" />
            </div>

            <div className="world-decoration flowers" aria-hidden="true">
              <i className="flower flower-1" />
              <i className="flower flower-2" />
              <i className="flower flower-3" />
              <i className="flower flower-4" />
              <i className="flower flower-5" />
              <i className="flower flower-6" />
            </div>

            <div className="world-decoration rocks" aria-hidden="true">
              <i className="rock rock-1" />
              <i className="rock rock-2" />
              <i className="rock rock-3" />
            </div>

            <div className="world-decoration bushes" aria-hidden="true">
              <i className="bush bush-1" />
              <i className="bush bush-2" />
              <i className="bush bush-3" />
              <i className="bush bush-4" />
            </div>

            <div className="world-decoration trees" aria-hidden="true">
              <div className="pixel-tree tree-1">
                <span className="tree-trunk" />
                <span className="tree-crown" />
              </div>
              <div className="pixel-tree tree-2">
                <span className="tree-trunk" />
                <span className="tree-crown" />
              </div>
              <div className="pixel-tree tree-3">
                <span className="tree-trunk" />
                <span className="tree-crown" />
              </div>
            </div>

            <div className="world-sign">
              HELLO
              <br />
              WORLD!
              <span className="sign-prompt">E</span>
            </div>

            <div
              className={`player-sprite facing-${facing}${isMoving ? " is-moving" : ""}`}
              style={{
                left: `${player.x}%`,
                top: `${player.y}%`,
              }}
              aria-label="Personagem controlado pelo teclado"
              role="img"
            >
              <span className="sprite-shadow" />
              <span className="sprite-hair" />
              <span className="sprite-face">
                <i className="sprite-eyes" />
                <i className="sprite-nose" />
              </span>
              <span className="sprite-neck" />
              <span className="sprite-body" />
              <span className="sprite-arm arm-left" />
              <span className="sprite-arm arm-right" />
              <span className="sprite-legs" />
              <span className="sprite-shoes" />
            </div>

            {dialogOpen && (
              <div
                className="game-dialog"
                role="dialog"
                aria-label="Mensagem da placa"
              >
                <p className="eyebrow">MENSAGEM ENCONTRADA</p>
                <p className="dialog-title">Olá, explorador!</p>
                <p>
                  Eu sou Willian, estudante de ADS e desenvolvedor em formação.
                </p>
                <p>
                  Minha próxima missão é transformar ideias em projetos reais.
                </p>
                <small>Pressione E ou ESC para fechar.</small>
              </div>
            )}

            <div className="game-hint" aria-live="polite">
              <span>▲</span> {message}
            </div>
          </div>

          <div className="game-controls">
            <span>
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd> MOVER
            </span>
            <span className="control-arrows">↑ ↓ ← →</span>
            <span className="interact-hint">
              <kbd>E</kbd> INTERAGIR
            </span>
          </div>
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
