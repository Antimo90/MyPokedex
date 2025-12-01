💎 MyPokedex: Il Tracker di Kanto 🌿
Un Pokedex web Full Stack, moderno e interattivo, incentrato sui 151 Pokémon originali, con una funzionalità unica di tracker per la collezione personale.

🌟 Panoramica del Progetto
MyPokedex è un solido Progetto Capstone Full-Stack ideato per mostrare competenze avanzate nello sviluppo web moderno, nella gestione dei dati e nell'implementazione della logica di business. Fornisce un riferimento completo per tutti i 151 Pokémon della regione di Kanto (Generazione 1), comprese le loro rare varianti Shiny — per un totale di 302 voci consultabili.

Questa applicazione è costruita per dimostrare l'efficiente gestione dei dati e l'impegno verso una UI/UX pulita e responsiva.

✨ Funzionalità e Caratteristiche Principali
🛡️	Tracker di Cattura Personale,	La funzionalità centrale! Tutte le schede Pokémon sono inizialmente oscurate (scontornate/in silhouette). L'utente può contrassegnare un Pokémon come 'Catturato' per rivelarne i dettagli completi, l'immagine a colori e accedere a tutte le sue informazioni, simulando una sfida di collezione nel mondo reale.
🔎	Ricerca Intuitiva,	Una barra di ricerca predittiva in tempo reale consente agli utenti di trovare rapidamente qualsiasi Pokémon tramite il suo Nome o ID Pokedex.
🎨	Toggle per la Variante Shiny,	Un controllo dedicato su ogni scheda dettagliata per alternare istantaneamente tra la versione Standard e la rara versione Shiny del Pokémon.
📊 Statistiche Dettagliate, Schede individuali complete che mostrano le statistiche base (HP, Attacco, Difesa, $HP, Attacco, Difesa, ecc.) e le descrizioni dettagliate del Pokedex.
📱	Design Responsivo,	Un'esperienza di visualizzazione fluida ottimizzata per tutti i dispositivi, da desktop a mobile.

🎯 Obiettivi Tecnici e Valore
L'architettura del progetto è stata progettata per dimostrare la competenza nell'intero stack di sviluppo:
Backend (Java/Spring Boot) ⚙️
- Livello Dati Robusto: Gestione e fornitura efficiente dell'intero set di dati Pokémon (151 voci). Tutti i dati sono stati curati e duplicati in un database dedicato, garantendo stabilità e prestazioni indipendenti da API esterne.
- Logica di Business: Implementazione di tecniche di caching e pre-elaborazione dei dati per garantire che l'API risponda alle richieste del frontend con una latenza minima.
- API Sicura: Creazione di un'API RESTful ben strutturata che fornisce endpoint per il recupero di tutti i dati e per l'aggiornamento dello stato di cattura personale dell'utente.

Frontend (React) ⚛️
- UI Dinamica: Costruzione di una Single Page Application (SPA) ad alte prestazioni con React, gestendo complesse modifiche di stato, in particolare per lo stato 'Catturato' e la visibilità dei dati dei Pokémon.
- UX Pulita: Focus su un'estetica moderna, utilizzando componenti per la riutilizzabilità e la manutenibilità.
- Interazione Client-Server: Comunicazione asincrona efficace con l'API Spring Boot per il recupero dei dati e l'aggiornamento dello stato della collezione dell'utente.

💻 Stack Tecnologico
- Backend,	Java ☕	Linguaggio di programmazione principale.
- Framework Backend,	Spring Boot 🌱	Utilizzato per lo sviluppo rapido dell'API RESTful.
- Frontend,	React ⚛️	Costruzione dell'interfaccia utente dinamica basata su componenti.
- Database,	SQL (PostgreSQL)	Archiviazione persistente per tutti i dati Pokémon e lo stato di collezione dell'utente.
- Styling,	Bootstrap e CSS Styling e design responsivo.
- Data Fetching, Fetch	Gestione delle richieste asincrone tra React e Spring Boot.
