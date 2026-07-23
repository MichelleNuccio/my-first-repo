const wireframeStyle = { // Definisce lo stile grafico di base del globo.
  version: 8, // Usa la versione 8 della specifica degli stili MapLibre.
  projection: { type: 'globe' }, // Imposta una proiezione sferica tridimensionale.
  sources: {}, // Inizializza lo stile senza sorgenti cartografiche esterne.
  layers: [ // Elenca i livelli presenti appena viene creata la mappa.
    { // Crea il livello uniforme dello spazio.
      id: 'space', // Assegna un identificatore univoco al livello.
      type: 'background', // Specifica che il livello è uno sfondo.
      paint: { 'background-color': '#000000' } // Colora lo spazio di nero.
    } // Chiude la configurazione dello sfondo.
  ], // Chiude l'elenco dei livelli iniziali.
  sky: { // Configura atmosfera, orizzonte e foschia del globo.
    'sky-color': '#000000', // Mantiene nero il cielo lontano dal pianeta.
    'horizon-color': '#e2e2e2', // Crea un alone bianco-grigio sull'orizzonte.
    'fog-color': '#161616', // Imposta una foschia grigio scuro.
    'sky-horizon-blend': 0.14, // Regola la fusione tra cielo e orizzonte.
    'horizon-fog-blend': 0.06, // Regola la fusione tra orizzonte e foschia.
    'fog-ground-blend': 0.35, // Ammorbidisce il passaggio tra foschia e superficie.
    'atmosphere-blend': 0.12 // Controlla l'intensità complessiva dell'atmosfera.
  } // Chiude la configurazione atmosferica.
}; // Termina la definizione dello stile.

const map = new maplibregl.Map({ // Crea l'istanza principale della mappa interattiva.
  container: 'globe', // Inserisce il globo nell'elemento HTML con id "globe".
  style: wireframeStyle, // Applica lo stile minimale definito sopra.
  center: [12, 18], // Posiziona inizialmente il centro su longitudine 12 e latitudine 18.
  zoom: 1.15, // Imposta il livello di zoom iniziale.
  minZoom: 0, // Permette di allontanarsi fino alla vista completa del pianeta.
  maxZoom: 8 // Limita lo zoom massimo per evitare ingrandimenti eccessivi.
}); // Termina la creazione della mappa.

map.addControl( // Aggiunge i pulsanti di navigazione standard.
  new maplibregl.NavigationControl({ visualizePitch: true }), // Abilita zoom, rotazione e indicazione dell'inclinazione.
  'bottom-right' // Posiziona i controlli nell'angolo inferiore destro.
); // Termina l'aggiunta dei controlli.

let interacting = false; // Indica se l'utente sta trascinando o zoomando la mappa.
let interactionTimer; // Conserva il timer usato per riattivare la rotazione automatica.

const countriesPromise = fetch('countries-110m.geojson') // Avvia il caricamento locale dei confini nazionali.
  .then(response => { // Gestisce la risposta HTTP del file dei Paesi.
    if (!response.ok) throw new Error(`HTTP ${response.status}`); // Interrompe il caricamento se il file non è disponibile.
    return response.json(); // Converte il contenuto GeoJSON in un oggetto JavaScript.
  }); // Conserva la Promise per riutilizzarla al clic sui landing point.

map.on('load', async () => { // Attende che MapLibre abbia inizializzato completamente lo stile.
  try { // Avvia un blocco protetto per intercettare errori di caricamento.
    const bathymetry = [ // Elenca le sette fasce batimetriche visualizzate.
      { id: 'depth-6000', file: 'bathymetry_E_6000.geojson', color: '#555860', opacity: 0.38, width: 0.72, fill: 0.025 }, // Configura la curva a -6000 metri.
      { id: 'depth-5000', file: 'bathymetry_F_5000.geojson', color: '#5e6168', opacity: 0.41, width: 0.76, fill: 0.028 }, // Configura la curva a -5000 metri.
      { id: 'depth-4000', file: 'bathymetry_G_4000.geojson', color: '#64676e', opacity: 0.44, width: 0.79, fill: 0.030 }, // Configura la curva a -4000 metri.
      { id: 'depth-3000', file: 'bathymetry_H_3000.geojson', color: '#686b72', opacity: 0.46, width: 0.82, fill: 0.032 }, // Configura la curva a -3000 metri.
      { id: 'depth-2000', file: 'bathymetry_I_2000.geojson', color: '#767980', opacity: 0.50, width: 0.88, fill: 0.036 }, // Configura la curva a -2000 metri.
      { id: 'depth-1000', file: 'bathymetry_J_1000.geojson', color: '#85888f', opacity: 0.55, width: 0.94, fill: 0.040 }, // Configura la curva a -1000 metri.
      { id: 'depth-200', file: 'bathymetry_K_200.geojson', color: '#a7aab0', opacity: 0.68, width: 1.08, fill: 0.050 } // Configura la curva costiera a -200 metri.
    ]; // Chiude l'elenco dei livelli batimetrici.

    bathymetry.forEach(level => { // Ripete la creazione dei livelli per ogni profondità.
      map.addSource(level.id, { type: 'geojson', data: level.file }); // Collega il relativo file GeoJSON alla mappa.
      map.addLayer({ // Aggiunge un riempimento molto trasparente alla fascia.
        id: `${level.id}-fill`, // Costruisce un id specifico per il riempimento.
        type: 'fill', // Imposta il livello come poligono pieno.
        source: level.id, // Usa la sorgente della profondità corrente.
        paint: { 'fill-color': level.color, 'fill-opacity': level.fill } // Applica colore e trasparenza configurati.
      }); // Termina il livello di riempimento.
      map.addLayer({ // Aggiunge il contorno batimetrico sopra il riempimento.
        id: level.id, // Usa l'id della profondità come id del contorno.
        type: 'line', // Imposta il livello come linea.
        source: level.id, // Usa la stessa sorgente GeoJSON.
        paint: { // Definisce l'aspetto della curva batimetrica.
          'line-color': level.color, // Applica il grigio assegnato alla profondità.
          'line-width': ['interpolate', ['linear'], ['zoom'], 0, level.width, 6, level.width * 1.8], // Aumenta gradualmente lo spessore durante lo zoom.
          'line-opacity': level.opacity, // Applica l'opacità configurata.
          'line-blur': 0.15 // Ammorbidisce leggermente il contorno.
        } // Chiude le proprietà grafiche della linea.
      }); // Termina il livello della curva.
    }); // Termina la creazione delle batimetrie.

    const response = await fetch('cable-geo.json'); // Carica le geometrie aggiornate dei cavi.
    if (!response.ok) throw new Error(`HTTP ${response.status}`); // Verifica che il GeoJSON sia stato caricato correttamente.
    const data = await response.json(); // Converte il GeoJSON dei cavi in un oggetto JavaScript.

    const yearsResponse = await fetch('cable-years.json'); // Carica la tabella locale degli anni RFS.
    if (!yearsResponse.ok) throw new Error(`Years HTTP ${yearsResponse.status}`); // Verifica che il file temporale sia disponibile.
    const years = await yearsResponse.json(); // Converte la tabella temporale in un oggetto JavaScript.

    data.features.forEach(feature => { // Visita ogni feature geografica del dataset.
      feature.properties.year = Number(years[feature.properties.id]) || 9999; // Associa l'anno RFS oppure 9999 se sconosciuto.
    }); // Termina l'arricchimento temporale.

    const particleData = createCableParticles(data, 0.38); // Genera particelle distribuite lungo le rotte.
    const landingData = createLandingPoints(data); // Estrae i landing point come feature puntuali.

    map.addSource('cables', { type: 'geojson', data }); // Registra la sorgente delle linee dei cavi.
    map.addSource('particles', { type: 'geojson', data: particleData }); // Registra la sorgente delle particelle.
    map.addSource('landings', { type: 'geojson', data: landingData }); // Registra la sorgente dei landing point.
    map.addImage('landing-plus', createPlusIcon()); // Crea e registra il simbolo bianco "+".

    map.addLayer({ // Disegna le linee continue dei cavi.
      id: 'cable-traces', // Assegna un id al livello delle rotte.
      type: 'line', // Imposta il tipo di geometria visualizzata.
      source: 'cables', // Usa il GeoJSON aggiornato dei cavi.
      layout: { 'line-cap': 'round', 'line-join': 'round' }, // Arrotonda estremità e giunzioni.
      paint: { // Configura il colore e lo spessore delle rotte.
        'line-color': '#ff2bd6', // Colora i cavi di fucsia.
        'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.42, 6, 1.05], // Mantiene sottili le linee adattandole allo zoom.
        'line-opacity': 0.86 // Rende i cavi ben visibili senza saturarli.
      } // Chiude le proprietà grafiche.
    }); // Termina il livello dei cavi.

    map.addLayer({ // Crea un alone quasi impercettibile attorno alle particelle.
      id: 'particle-halo', // Assegna un id al livello dell'alone.
      type: 'circle', // Disegna ogni particella come cerchio.
      source: 'particles', // Usa i punti generati lungo le rotte.
      paint: { 'circle-color': '#6e4da8', 'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 1.3, 6, 2.7], 'circle-opacity': 0.04, 'circle-blur': 0.92 } // Configura un alone viola molto tenue.
    }); // Termina il livello dell'alone.

    map.addLayer({ // Disegna le particelle visibili lungo i cavi.
      id: 'particles', // Assegna un id al livello delle particelle.
      type: 'circle', // Visualizza i campioni come piccoli cerchi.
      source: 'particles', // Usa la sorgente puntuale generata.
      paint: { 'circle-color': '#9b8ab8', 'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 0.3, 6, 0.68], 'circle-opacity': 0.18 } // Mantiene le particelle piccole e discrete.
    }); // Termina il livello delle particelle.

    map.addLayer({ // Disegna i landing point come simboli bianchi.
      id: 'landings', // Assegna un id al livello dei landing point.
      type: 'symbol', // Usa un'immagine simbolica invece di un cerchio.
      source: 'landings', // Collega la sorgente dei punti di approdo.
      layout: { // Configura dimensione e sovrapposizione dei simboli.
        'icon-image': 'landing-plus', // Usa il simbolo "+" creato nel canvas.
        'icon-size': ['interpolate', ['linear'], ['zoom'], 0, 0.48, 6, 0.85], // Ingrandisce gradualmente il simbolo con lo zoom.
        'icon-allow-overlap': true, // Permette la visualizzazione di punti vicini.
        'icon-ignore-placement': true // Evita che MapLibre nasconda simboli sovrapposti.
      }, // Chiude la configurazione geometrica.
      paint: { 'icon-opacity': 0.95 } // Mantiene i simboli bianchi quasi opachi.
    }); // Termina il livello dei landing point.

    map.on('mouseenter', 'landings', () => { map.getCanvas().style.cursor = 'pointer'; }); // Mostra il cursore cliccabile sopra un landing point.
    map.on('mouseleave', 'landings', () => { map.getCanvas().style.cursor = ''; }); // Ripristina il cursore fuori dai landing point.
    map.on('click', 'landings', event => { showLandingInfo(event.features[0].properties); }); // Apre la scheda informativa del punto selezionato.
    map.on('mouseenter', 'cables', () => { map.getCanvas().style.cursor = 'pointer'; }); // Mostra il cursore cliccabile sopra un cavo.
    map.on('mouseleave', 'cables', () => { map.getCanvas().style.cursor = ''; }); // Ripristina il cursore quando si lascia un cavo.

    const slider = document.querySelector('#year-slider'); // Seleziona la slider temporale nell'HTML.
    const applyYear = () => { // Definisce la funzione che aggiorna la mappa in base all'anno.
      const year = Number(slider.value); // Legge l'anno attualmente scelto.
      const filter = ['<=', ['get', 'year'], year]; // Crea un filtro cumulativo fino all'anno selezionato.
      ['cable-traces', 'particle-halo', 'particles', 'landings'].forEach(id => { map.setFilter(id, filter); }); // Applica lo stesso filtro a tutti i livelli temporali.
      document.querySelector('#selected-year').textContent = year; // Aggiorna l'etichetta dell'anno.
      const visibleIds = new Set(data.features.filter(feature => feature.properties.year <= year).map(feature => feature.properties.id)); // Conta una sola volta ogni cavo visibile.
      document.querySelector('#year-count').textContent = `${visibleIds.size} cables`; // Mostra il numero di cavi attivi.
    }; // Termina la funzione di aggiornamento temporale.
    slider.addEventListener('input', applyYear); // Aggiorna la mappa mentre la slider viene trascinata.
    applyYear(); // Applica immediatamente il valore iniziale 2026.
  } catch (error) { // Intercetta errori di rete o di parsing.
    console.error('GeoJSON loading error:', error); // Scrive il dettaglio dell'errore nella console.
  } // Chiude la gestione degli errori.
}); // Termina la funzione eseguita al caricamento della mappa.

map.on('mousedown', () => { interacting = true; }); // Mette in pausa la rotazione quando inizia il trascinamento con il mouse.
map.on('touchstart', () => { interacting = true; }); // Mette in pausa la rotazione quando inizia un gesto touch.
map.on('mouseup', () => { interacting = false; }); // Riattiva la rotazione quando termina il trascinamento.
map.on('touchend', () => { interacting = false; }); // Riattiva la rotazione quando termina il gesto touch.

map.getCanvas().addEventListener('wheel', () => { // Intercetta lo zoom tramite rotellina.
  interacting = true; // Sospende temporaneamente la rotazione automatica.
  clearTimeout(interactionTimer); // Annulla un eventuale timer precedente.
  interactionTimer = setTimeout(() => { interacting = false; }, 700); // Riprende la rotazione 700 ms dopo lo zoom.
}, { passive: true }); // Mantiene efficiente la gestione della rotellina.

map.on('zoomstart', () => { interacting = true; }); // Mette in pausa la rotazione all'inizio di ogni zoom.
map.on('zoomend', () => { // Gestisce la fine dello zoom.
  clearTimeout(interactionTimer); // Elimina un timer di riattivazione precedente.
  interactionTimer = setTimeout(() => { interacting = false; }, 350); // Riprende dolcemente la rotazione dopo 350 ms.
}); // Termina la gestione della fine dello zoom.

function spin() { // Definisce il ciclo della rotazione automatica.
  if (!interacting && map.getZoom() < 5) { // Ruota soltanto se l'utente non interagisce e lo zoom non è troppo alto.
    const center = map.getCenter(); // Legge il centro geografico attuale.
    center.lng -= 0.012 / Math.max(1, map.getZoom()); // Sposta lentamente la longitudine in funzione dello zoom.
    map.setCenter(center); // Applica il nuovo centro senza bloccare lo zoom manuale.
  } // Chiude la condizione di rotazione.
  requestAnimationFrame(spin); // Richiede il fotogramma successivo dell'animazione.
} // Termina la funzione di rotazione.

map.once('idle', spin); // Avvia la rotazione quando la mappa è pronta e inattiva.

function createCableParticles(data, spacing) { // Converte le linee dei cavi in una nuvola di punti.
  const features = []; // Prepara l'array che conterrà tutte le particelle GeoJSON.
  data.features.forEach((feature, featureIndex) => { // Analizza ogni cavo del dataset.
    const groups = feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates : [feature.geometry.coordinates]; // Uniforma LineString e MultiLineString.
    groups.forEach(line => { // Analizza ogni segmento continuo del cavo.
      for (let index = 0; index < line.length - 1; index += 1) { // Visita ogni coppia consecutiva di coordinate.
        const a = line[index]; // Memorizza il punto iniziale del segmento.
        const b = line[index + 1]; // Memorizza il punto finale del segmento.
        let deltaLng = b[0] - a[0]; // Calcola la differenza di longitudine.
        if (deltaLng > 180) deltaLng -= 360; // Corregge l'attraversamento dell'antimeridiano verso est.
        if (deltaLng < -180) deltaLng += 360; // Corregge l'attraversamento dell'antimeridiano verso ovest.
        const deltaLat = b[1] - a[1]; // Calcola la differenza di latitudine.
        const distance = Math.hypot(deltaLng * Math.cos((a[1] + b[1]) * Math.PI / 360), deltaLat); // Stima la distanza angolare del segmento.
        const steps = Math.max(1, Math.ceil(distance / spacing)); // Determina quante particelle distribuire sul segmento.
        for (let step = 0; step < steps; step += 1) { // Genera ogni particella del segmento.
          const t = step / steps; // Calcola la posizione normalizzata tra inizio e fine.
          let lng = a[0] + deltaLng * t; // Interpola la longitudine.
          if (lng > 180) lng -= 360; // Riporta la longitudine dentro l'intervallo geografico.
          if (lng < -180) lng += 360; // Riporta la longitudine dentro l'intervallo geografico.
          features.push({ // Aggiunge la nuova particella alla collezione.
            type: 'Feature', // Dichiara una feature GeoJSON.
            properties: { energy: hashEnergy(featureIndex, index, step), year: feature.properties.year }, // Salva variazione luminosa e anno RFS.
            geometry: { type: 'Point', coordinates: [lng, a[1] + deltaLat * t] } // Salva la posizione interpolata.
          }); // Termina la feature puntuale.
        } // Termina la generazione delle particelle sul segmento.
      } // Termina la visita dei segmenti della linea.
    }); // Termina la visita delle linee del cavo.
  }); // Termina la visita di tutti i cavi.
  return { type: 'FeatureCollection', features }; // Restituisce la collezione GeoJSON delle particelle.
} // Termina la funzione di generazione delle particelle.

function createLandingPoints(data) { // Estrae dal dataset le coordinate dei landing point.
  return { // Restituisce una nuova collezione GeoJSON.
    type: 'FeatureCollection', // Dichiara il tipo della collezione.
    features: data.features // Parte dalle feature originali dei cavi.
      .filter(feature => Array.isArray(feature.properties.coordinates)) // Mantiene soltanto i record con coordinate di approdo.
      .map(feature => ({ // Converte ogni record in una feature puntuale.
        type: 'Feature', // Dichiara una feature GeoJSON.
        properties: { // Copia le informazioni necessarie alla scheda.
          name: feature.properties.name || 'Unnamed cable', // Salva il nome del cavo.
          id: feature.properties.id || feature.properties.feature_id || '—', // Salva l'id disponibile.
          latitude: feature.properties.coordinates[1], // Salva la latitudine del landing point.
          longitude: feature.properties.coordinates[0], // Salva la longitudine del landing point.
          year: feature.properties.year // Salva l'anno RFS per il filtro temporale.
        }, // Chiude le proprietà del landing point.
        geometry: { type: 'Point', coordinates: feature.properties.coordinates } // Crea la geometria puntuale.
      })) // Termina la conversione dei record.
  }; // Restituisce la collezione completa.
} // Termina la funzione dei landing point.

function hashEnergy(a, b, c) { // Genera un valore pseudo-casuale stabile per ogni particella.
  const value = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; // Combina gli indici in una funzione deterministica.
  return value - Math.floor(value); // Restituisce un numero compreso tra zero e uno.
} // Termina la funzione di variazione energetica.

function createPlusIcon() { // Disegna il simbolo "+" dei landing point.
  const size = 32; // Imposta la dimensione dell'immagine in pixel.
  const canvas = document.createElement('canvas'); // Crea un canvas temporaneo fuori dal documento.
  canvas.width = size; // Imposta la larghezza del canvas.
  canvas.height = size; // Imposta l'altezza del canvas.
  const context = canvas.getContext('2d'); // Ottiene il contesto grafico bidimensionale.
  context.clearRect(0, 0, size, size); // Rende trasparente l'intera immagine.
  context.strokeStyle = '#ffffff'; // Imposta il simbolo in bianco puro.
  context.lineWidth = 2.4; // Definisce lo spessore dei due tratti.
  context.lineCap = 'square'; // Usa estremità nette e geometriche.
  context.beginPath(); // Inizia il tracciato del simbolo.
  context.moveTo(16, 7); // Posiziona l'inizio del tratto verticale.
  context.lineTo(16, 25); // Disegna il tratto verticale.
  context.moveTo(7, 16); // Posiziona l'inizio del tratto orizzontale.
  context.lineTo(25, 16); // Disegna il tratto orizzontale.
  context.stroke(); // Renderizza i due tratti sul canvas.
  return context.getImageData(0, 0, size, size); // Restituisce l'immagine a MapLibre.
} // Termina la creazione dell'icona.

async function showLandingInfo(properties) { // Aggiorna la legenda quando viene selezionato un landing point.
  const latitude = Number(properties.latitude); // Converte la latitudine in un numero.
  const longitude = Number(properties.longitude); // Converte la longitudine in un numero.
  const countryField = document.querySelector('#info-country'); // Seleziona il campo HTML dedicato al Paese.
  document.querySelector('#info-name').textContent = properties.name; // Mostra il nome del cavo.
  document.querySelector('#info-id').textContent = properties.id; // Mostra l'id del cavo.
  document.querySelector('#info-lat').textContent = `${latitude.toFixed(5)}°`; // Mostra la latitudine con cinque decimali.
  document.querySelector('#info-lng').textContent = `${longitude.toFixed(5)}°`; // Mostra la longitudine con cinque decimali.
  countryField.textContent = 'Identifying…'; // Comunica che il riconoscimento locale è in corso.
  document.querySelector('#landing-info').hidden = false; // Rende visibile la scheda informativa.
  try { // Avvia la ricerca protetta del Paese.
    const countries = await countriesPromise; // Attende il caricamento dei confini nazionali.
    countryField.textContent = findCountry([longitude, latitude], countries) || 'Offshore / not identified'; // Mostra il Paese o segnala un punto offshore.
  } catch (error) { // Gestisce un errore nel file dei confini.
    countryField.textContent = 'Not available'; // Informa che il Paese non è disponibile.
    console.warn('Local country lookup failed:', error); // Scrive il dettaglio nella console.
  } // Chiude la gestione degli errori.
} // Termina l'aggiornamento della scheda.

function findCountry(point, data) { // Cerca il Paese che contiene una coordinata.
  for (const feature of data.features) { // Analizza ogni Paese del GeoJSON Natural Earth.
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates; // Uniforma Polygon e MultiPolygon.
    if (polygons.some(polygon => pointInPolygon(point, polygon))) return feature.properties.NAME_EN || feature.properties.NAME || feature.properties.ADMIN; // Restituisce il nome del primo Paese contenente il punto.
  } // Termina la ricerca per inclusione.
  return nearestCountry(point, data, 3); // Cerca la costa più vicina entro tre gradi se il punto è offshore.
} // Termina la funzione di riconoscimento del Paese.

function pointInPolygon(point, polygon) { // Verifica se un punto appartiene a un poligono con eventuali buchi.
  if (!pointInRing(point, polygon[0])) return false; // Esclude il punto se è fuori dal perimetro esterno.
  for (let index = 1; index < polygon.length; index += 1) if (pointInRing(point, polygon[index])) return false; // Esclude il punto se cade dentro un buco.
  return true; // Conferma che il punto appartiene al poligono.
} // Termina il test sul poligono.

function pointInRing([x, y], ring) { // Applica l'algoritmo ray-casting a un anello geografico.
  let inside = false; // Inizializza il risultato come esterno.
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) { // Visita ogni lato dell'anello.
    const xi = ring[i][0]; // Legge la longitudine del vertice corrente.
    const yi = ring[i][1]; // Legge la latitudine del vertice corrente.
    const xj = ring[j][0]; // Legge la longitudine del vertice precedente.
    const yj = ring[j][1]; // Legge la latitudine del vertice precedente.
    if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) inside = !inside; // Alterna lo stato a ogni intersezione del raggio.
  } // Termina la visita dei lati.
  return inside; // Restituisce il risultato del test.
} // Termina il ray-casting.

function nearestCountry([x, y], data, maxDegrees) { // Trova la costa nazionale più vicina a un punto offshore.
  let nearest = null; // Conserva il Paese più vicino trovato.
  let best = maxDegrees * maxDegrees; // Imposta la distanza massima accettata.
  for (const feature of data.features) { // Analizza ogni Paese.
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates; // Uniforma Polygon e MultiPolygon.
    for (const polygon of polygons) { // Analizza ogni poligono del Paese.
      for (const coordinate of polygon[0]) { // Analizza i vertici del contorno esterno.
        let dx = Math.abs(coordinate[0] - x); // Calcola la distanza longitudinale.
        dx = Math.min(dx, 360 - dx) * Math.cos(y * Math.PI / 180); // Corregge antimeridiano e convergenza dei meridiani.
        const dy = coordinate[1] - y; // Calcola la distanza latitudinale.
        const distance = dx * dx + dy * dy; // Calcola una distanza quadratica approssimata.
        if (distance < best) { best = distance; nearest = feature; } // Aggiorna il Paese più vicino.
      } // Termina la visita dei vertici.
    } // Termina la visita dei poligoni.
  } // Termina la visita dei Paesi.
  return nearest ? `${nearest.properties.NAME_EN || nearest.properties.NAME || nearest.properties.ADMIN} (nearest coast)` : null; // Restituisce il Paese costiero o nessun risultato.
} // Termina la ricerca della costa più vicina.

document.querySelector('#close-info').addEventListener('click', () => { // Ascolta il clic sul pulsante di chiusura.
  document.querySelector('#landing-info').hidden = true; // Nasconde la scheda del landing point.
}); // Termina la gestione del pulsante.
