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

  function limparSimulacao() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setExecutando(null);
    setRodando(false);
    filaRef.current = [];
    quantumRestRef.current = 0;
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "#eaeaea", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 48, marginBottom: 16 }}>Simulador de Escalonamento</h1>

      <label>Algoritmo: </label>
      <select
        value={algoritmo}
        onChange={(e) => {
          setAlgoritmo(e.target.value);
          limparSimulacao();
        }}
        style={{ marginLeft: 8 }}
      >
        <option value="FCFS">FCFS</option>
        <option value="SJF">SJF</option>
        <option value="RR">Round Robin</option>
      </select>

      {algoritmo === "RR" && (
        <span style={{ marginLeft: 16 }}>
          <label>Quantum: </label>
          <input
            type="number"
            value={quantum}
            onChange={(e) => setQuantum(Number(e.target.value))}
            min={1}
            style={{ width: 60, marginLeft: 6 }}
          />
        </span>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={gerarProcessos} disabled={rodando} style={{ padding: "10px 16px", marginRight: 12 }}>
          Gerar Processos
        </button>
        <button onClick={executar} disabled={rodando || processos.length === 0} style={{ padding: "10px 16px" }}>
          Executar
        </button>
        {rodando && (
          <button
            onClick={limparSimulacao}
            style={{ padding: "10px 16px", marginLeft: 12, background: "#333", color: "#fff", borderRadius: 6 }}
          >
            Parar
          </button>
        )}
      </div>

      <h2 style={{ marginTop: 28 }}>Fila de Processos</h2>
      <ul>
        {processos.map((p) => (
          <li key={p.id}>
            Processo {p.id} — Instruções restantes: {p.instrucoes}
          </li>
        ))}
      </ul>

      {executando && (
        <h3 style={{ color: "limegreen" }}>Executando processo {executando.id}…</h3>
      )}
      {!rodando && processos.length > 0 && executando === null && (
        <p style={{ color: "#aaa" }}><i>Pronto para executar.</i></p>
      )}
    </div>
  );
}
