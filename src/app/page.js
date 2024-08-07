"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [paises, setPaises] = useState([]);
  const [todos, setTodos] = useState([]);
  const [paisActual, setPaisActual] = useState(null);
  const [valor, setValor] = useState("");
  const [puntaje, setPuntaje] = useState(0);
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    const puntajeGuardado = localStorage.getItem("puntaje");
    if (puntajeGuardado) {
      setPuntaje(parseInt(puntajeGuardado, 10));
    }

    const consultarAPI = async () => {
      const url = "https://countriesnow.space/api/v0.1/countries/flag/images";
      try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        if (resultado.data && resultado.data.length > 0) {
          setPaises(resultado.data);
          setTodos(resultado.data); // Guarda la lista original
          seleccionarPaisAleatorio(resultado.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    consultarAPI();
  }, []);

  const seleccionarPaisAleatorio = (listaDePaises) => {
    if (listaDePaises.length === 0) {
      setRespuesta("¡Has adivinado todas las banderas! Reiniciando...");
      setTimeout(() => {
        setPaises(todos);
        seleccionarPaisAleatorio(todos);
      }, 2000);
      return;
    }
    const paisAleatorio =
      listaDePaises[Math.floor(Math.random() * listaDePaises.length)];
    setPaisActual(paisAleatorio);
  };

  const handleSubmit = () => {
    let nuevoPuntaje;
    if (paisActual && valor.toLowerCase() === paisActual.name.toLowerCase()) {
      nuevoPuntaje = puntaje + 10;
      setRespuesta("¡Correcto! <3");
    } else {
      nuevoPuntaje = puntaje - 1;
      setRespuesta(
        `Incorrecto!! :P La respuesta correcta es ${paisActual.name}.`
      );
    }

    setPuntaje(nuevoPuntaje);
    localStorage.setItem("puntaje", nuevoPuntaje); // guarda el puntaje en localStorage

    const paisesRestantes = paises.filter(
      (pais) => pais.name !== paisActual.name
    );
    if (paisesRestantes.length === 0) {
      setRespuesta("Nos quedamos sin banderas...");
      setPaises(todos); // Restaura la lista original
      seleccionarPaisAleatorio(todos);
    } else {
      setPaises(paisesRestantes);
      seleccionarPaisAleatorio(paisesRestantes);
    }

    setValor("");
  };

  const handleChange = (e) => {
    setValor(e.target.value);
    localStorage.setItem("valor", e.target.value);
  };
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          <code className={styles.code}>src/app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" Yae y Cami "}
          </a>
        </div>
      </div>
      <div className={styles.card}>
        <p>Puntaje: {puntaje}</p>
        <div className={styles.center}>
          <h1>¡Adivina la bandera!</h1>
        </div>
        <div className={styles.contenido}>
          {paisActual && (
            <div>
              <img src={paisActual.flag} width={200} height={100} id="imagen" />
            </div>
          )}
        </div>
        <div className={styles.contenido}>
          <input type="text" value={valor} onChange={handleChange} />
        </div>
        <div className={styles.contenido}>
          <p id="slato">{respuesta}</p>
        </div>
        
        <div className={styles.contenido2}>
          <button className={styles.button1} type="button" onClick={handleSubmit}>
            Adivinar . . .
          </button>
        </div>
      </div>
    </main>
  );
}
