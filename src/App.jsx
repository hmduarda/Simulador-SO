import React, { useRef, useState } from "react";
import GeradorDeProcessos from "./simulador-core/src/core/geradorDeProcessos.js";
import EscalonadorFCFS from "./simulador-core/src/scheduler/escalonadorFCFS.js";
import EscalonadorSJF from "./simulador-core/src/scheduler/escalonadorSJF.js";
import "./index.css";

const TICK_MS = 200;

export default function App() {
  const [algoritmo, setAlgoritmo] = useState("FCFS");
  const [quantum, setQuantum] = useState(3);
  const [processos, setProcessos] = useState([]);
  const [executando, setExecutando] = useState(null);
  const [rodando, setRodando] = useState(false);

  const intervalRef = useRef(null);
  const filaRef = useRef([]);
  const quantumRestRef = useRef(0);
  const processosIniciaisRef = useRef([]);

  function limparSimulacao() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setExecutando(null);
    setRodando(false);
    filaRef.current = [];
    quantumRestRef.current = 0;
    processosIniciaisRef.current = [];
  }

  function gerarProcessos() {
    limparSimulacao();
    const gerador = new GeradorDeProcessos();
    const gerados = gerador.gerarProcessosAleatorios(5);
    const adaptados = gerados.map((p) => ({
      id: p.id,
      instrucoes: p.burstTime,
    }));
    setProcessos(adaptados);
    processosIniciaisRef.current = adaptados; 
  }

  function executar() {
    if (processos.length === 0 || rodando) return;

    let fila = processos.map((p) => ({ id: p.id, restante: p.instrucoes }));

    if (algoritmo === "SJF") {
      const scheduler = new EscalonadorSJF();
      processos.forEach((p) =>
        scheduler.adicionarProcesso({ id: p.id, burstTime: p.instrucoes })
      );
      const ordered = scheduler.escalonar();
      const idsOrdenados = ordered.map((p) => p.id);
      fila.sort((a, b) => idsOrdenados.indexOf(a.id) - idsOrdenados.indexOf(b.id));
    }

    if (algoritmo === "FCFS") {
      const scheduler = new EscalonadorFCFS();
      processos.forEach((p) =>
        scheduler.addProcess({ id: p.id, burstTime: p.instrucoes })
      );
      const ordered = scheduler.schedule();
      const idsOrdenados = ordered.map((p) => p.id);
      fila.sort((a, b) => idsOrdenados.indexOf(a.id) - idsOrdenados.indexOf(b.id));
    }

    filaRef.current = fila;
    setRodando(true);
    if (algoritmo === "RR") {
      quantumRestRef.current = Math.max(1, Number(quantum) || 1);
    }
    tickLoop();
  }

  function tickLoop() {
    const fila = filaRef.current;
    if (fila.length === 0) {
      setExecutando(null);
      setRodando(false);
      intervalRef.current = null;
      return;
    }

    let atual = fila[0];
    setExecutando({ id: atual.id });

    intervalRef.current = setInterval(() => {
      atual.restante = Math.max(0, atual.restante - 1);

      setProcessos((prev) =>
        prev.map((p) =>
          p.id === atual.id ? { ...p, instrucoes: atual.restante } : p
        )
      );

      if (algoritmo === "RR") {
        quantumRestRef.current -= 1;
      }

      const terminou = atual.restante === 0;
      const acabouQuantum = algoritmo === "RR" && quantumRestRef.current === 0;

      if (terminou || acabouQuantum) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        if (terminou) {
          fila.shift();
        } else if (acabouQuantum) {
          fila.shift();
          fila.push(atual);
        }

        if (algoritmo === "RR") {
          quantumRestRef.current = Math.max(1, Number(quantum) || 1);
        }

        if (fila.length > 0) {
          setTimeout(tickLoop, 0);
        } else {
          setExecutando(null);
          setRodando(false);
        }
      }
    }, TICK_MS);
  }

  function getProgress(id, restante) {
    const inicial = processosIniciaisRef.current.find((p) => p.id === id)?.instrucoes || restante;
    return ((inicial - restante) / inicial) * 100;
  }

  return (
    <div className="app-container">
      <h1 className="title">SIMULADOR DE PROCESSOS</h1>

      <div className="controls">
        <label>Algoritmo:</label>
        <select
          value={algoritmo}
          onChange={(e) => {
            setAlgoritmo(e.target.value);
            limparSimulacao();
          }}
        >
          <option value="FCFS">FCFS</option>
          <option value="SJF">SJF</option>
          <option value="RR">Round Robin</option>
        </select>

        {algoritmo === "RR" && (
          <div className="quantum">
            <label>Quantum:</label>
            <input
              type="number"
              value={quantum}
              onChange={(e) => setQuantum(Number(e.target.value))}
              min={1}
            />
          </div>
        )}
      </div>

      <div className="buttons">
        <button onClick={gerarProcessos} disabled={rodando}>
          Gerar Processos
        </button>
        <button onClick={executar} disabled={rodando || processos.length === 0}>
          Executar
        </button>
        {rodando && (
          <button onClick={limparSimulacao} className="stop-btn">
            Parar
          </button>
        )}
      </div>

      <h2 className="subtitle">Fila de Processos</h2>
      <ul className="process-list">
        {processos.map((p) => {
          const progress = getProgress(p.id, p.instrucoes);
          return (
            <li key={p.id} className={executando?.id === p.id ? "executando" : ""}>
              <div className="process-header">
                <span>Processo {p.id}</span>
                <span>{p.instrucoes} instruções restantes</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
            </li>
          );
        })}
      </ul>

      {executando && (
        <h3 className="running">Executando processo {executando.id}…</h3>
      )}
      {!rodando && processos.length > 0 && executando === null && (
        <p className="ready">Pronto para executar.</p>
      )}
    </div>
  );
}
