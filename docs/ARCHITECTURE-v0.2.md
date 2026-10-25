# ONE NOTE — Architektur 0.2: Persönlichkeit × Puls × Soziometrie

Stand: 25. Oktober 2026. Experimentelles Konzept, keine Diagnostik, keine therapeutische Anwendung.

## Ziele

Eine Person besitzt eine **stabile musikalische Grundidentität** aus getrennt dokumentierten psychometrischen Skalen. Eine **zeitvariable rhythmische Schicht** repräsentiert die gemessene Herzfrequenz in Schlägen pro Minute. Ein zukünftiges **soziales Ensemble** beschreibt zusätzlich gerichtete, kriteriumsabhängige Beziehungen zwischen Personen.

Die musikalischen Beziehungen sind vom Team festgelegte **Gestaltungsregeln**, keine empirisch validierten psychologischen oder physiologischen Korrelate. Keine Übernahme von Lawrence Balls Kompositionssystem.

## Pipeline

1. **Erhebung:** Instrumenten-ID, Version, Auswertungs-/Normierungsverfahren sowie individuelle Skalenwerte getrennt von Puls-Samples (BPM + Sekunden relativ zum Sitzungsbeginn + Herkunft/Qualität).
2. **Validierung:** Schema Draft 2020-12 und zusätzliche Laufzeitprüfungen. Zahlenbereiche, eindeutige IDs und aufsteigende Zeitstempel.
3. **Transformation:** Versioniertes Mapping **one-note-dual-layer-demo-v0.2**. Zwei voneinander unabhängige Generatoren:
   - **Psychometrische Ebene:** Big Five (5 normierte Skalen); optionale, vorerst synthetische 16-Facetten-Struktur.
   - **Biometrische Ebene:** BPM-basierte Impulsfolge, interpoliert zwischen vorhandenen Herzfrequenzmessungen. Die Pulsereignisse verändern **nicht automatisch** das Tempo der gesamten Komposition.
4. **Score:** Einheitliche Notenereignisse mit Quellenangabe **psychometry / biometrics**, Ereignistyp, Startzeit, Dauer, MIDI-Note, Velocity und Kanal.
5. **Player:** Browser/Web Audio ohne Backend. JSON-Score und MIDI exportierbar.

### Betriebsarten

| Modus | Enthält | Schließt bewusst aus |
|---|---|---|
| Personality | Melodien aus Big Five und optionalen 16 Facetten | Puls |
| Pulse | BPM-Impulsfolge | alle Persönlichkeitsskalen |
| Fusion | beide **unabhängig** berechneten Ebenen | keine zusätzliche verdeckte Interpretation |

**Wichtige Eigenschaft:** Änderungen am Puls dürfen den Personality-Score nicht verändern. Änderungen der Persönlichkeit dürfen den Pulse-Score nicht verändern. Automatisierte Regressionstests prüfen diese Trennung.

## Persönlichkeitsmodelle

- Die Big Five sind ein eigener Skalenblock mit Instrumenten-ID, Instrument-Version und Scoring-Metadaten. Die Demodaten stammen **nicht aus einem Fragebogen**.
- Der zweite Block hat vorläufig 16 Facettennamen. Diese Struktur ist **nicht der originale 16PF und auch kein implementierter IPIP-16PF**. Bis zur Instrumentenwahl sind alle 16 Werte nur *synthetische Platzhalter*. Die Demo-Komposition nutzt derzeit die Facetten Imagination, Flexibilität und Durchsetzungsfähigkeit für Nebenparameter; der Großteil der Facetten bleibt in Version 0.2 ohne akustische Wirkung.
- Vor Einsatz echter Instrumente: Urheber-/Nutzungsrechte, deutsche Itemübersetzungen, Validität, Reliabilität, Referenzstichproben, Normierung, Messinvarianz, Umgang mit fehlenden Werten und Doppelgewichtung korrelierter Konstrukte prüfen.
- Bei mehreren Fragebögen kein blindes Addieren überlappender Skalen. Die spätere Gewichtungsmatrix und die Annahmen zu den Konstrukten müssen dokumentiert und experimentell getestet werden.

## Puls: Interpretation und Grenzen

- Ein BPM-Sample sagt nur etwas über die mittlere Herzfrequenz während seines Messfensters aus. Die Demo interpoliert zwischen Samples, um **hörbare Impulsabstände modellhaft** zu erzeugen. Daraus entstehen **keine gemessenen Herzschläge**.
- Ein einzelner BPM-Wert erzeugt einen synthetischen gleichmäßigen Impuls. Keine HRV, keine R–R-Intervalle, keine Aussagen zu Stress, Erregung oder Gesundheit.
- Die BPM-Baseline ist entweder separat anzugeben oder wird in der derzeitigen Engine aus den vorhandenen BPM-Werten arithmetisch gemittelt; dies ist **kein wissenschaftlich normierter individueller Ruhepuls**.
- Qualitätsflags **measured**, **manual**, **simulated** sind Provenienz, kein Validitätszertifikat.
- Eine spätere Sensoranbindung sollte Adapter pro Quelle sowie Latenz, Sampling-Intervall, Artefaktkorrektur und Signalqualität explizit implementieren; keine Speicherung im Repository.

## Dateiformate und Kompatibilität

| Datei | Rolle |
|---|---|
| examples/demo.lifehouse-session.json | Vollständige synthetische Sitzung für drei Personen |
| schemas/lifehouse-session.schema.json | Rohdaten-/Sitzungsformat 0.2.0 |
| schemas/lifehouse-score-v0.2.schema.json | Exportiertes Partiturformat 0.2.0 |
| js/fusion-engine.js | Deterministische Generierung und MIDI-Export, keine DOM-Abhängigkeit |
| js/fusion-ui.js | Browseroberfläche und Web-Audio-Ausgabe |
| fusion.html | Neue drei Modi als GitHub-Pages-Seite |
| index.html | Bisheriger Gruppenplayer 0.1 |
| schemas/lifehouse.schema.json | Historisches 0.1-Datenschema |

**Breaking Change:** 0.1-Datensätze sind nicht automatisch 0.2-Datensätze. Beide Formate bleiben getrennt, bis wir eine dokumentierte Migration entwickeln. Score- und Rohdatenformate bleiben unabhängig: einmal erzeugte Score-Dateien müssen ohne erneutes psychometrisches Scoring abgespielt werden können (eigener Score-Import folgt).

## Soziometrie

Das Feld für Soziometrie ist im 0.2-Datenformat als gerichteter Graph mit explizitem Wahlkriterium reserviert. Es beeinflusst die neue Fusion-Engine **noch nicht**. Für die vorhandene musikalische Gruppeninteraktion steht der Player 0.1 zur Verfügung. Eine spätere soziale Engine soll eigene soziometrische Ereignisse und explizite Wahlkriterien unterstützen; Soziometrie wird **nicht** unbemerkt in den Personality- oder Pulse-Modus hineingerechnet.

## Datenschutz und Ethik

Psychometrische und physiologische Messwerte sind personenbezogen und in konkreten Kontexten sensibel. Bei realen Personen brauchen wir Zweckbindung, Datenminimierung, Aufklärung/Einwilligung bzw. geeignete Rechtsgrundlage, Sicherheits- und Löschkonzept sowie Vermeidung identifizierbarer Netzwerkgraphen. GitHub Pages ist eine öffentliche Anwendung; es darf **niemals reale Rohdatensätze** enthalten. Alle eingebauten Demo-Profile sind erfunden. Das Laden einer lokalen Datei verarbeitet diese im Browser; ob ein veröffentlichtes Angebot rechtskonform ist, bedarf einer gesonderten Prüfung.

## Offene Forschungsfragen

1. Freies, deutschsprachiges, wissenschaftlich vertretbares 16-Facetten-Instrument auswählen (z. B. prüfen, ob eine geeignete IPIP-Alternative und valide deutschsprachige Übersetzung verfügbar sind); keine geschützten 16PF-Items übernehmen.
2. Rohitems strikt von Skalenwerten trennen; Scoring, fehlende Antworten, Reverse-Keys, Normierungsgrundlagen und Itemrechte versionieren.
3. Zuordnungsmatrix auditierbar machen: welcher Score beeinflusst welche Musikdimension mit welchem Gewicht?
4. Musikalische Plausibilität, Wiedererkennbarkeit und Varianz mit Blindtests gegen Zufallsmappings evaluieren.
5. Einheitliches zeitabhängiges Ensemble mit soziometrischen Interaktionen und optionaler Sensor-Liveanbindung entwerfen.
6. Weitere MIDI-Instrumente, Klangbibliotheken, Echtzeitvisualisierung und Audioexport testen.

## Entwicklung und Qualitätssicherung

Lokal mit Node.js 20+: **npm test** (keine Dependencies). Der Browsermodus benötigt einen HTTP-Server/GitHub Pages, da Module und Beispieldatei über relative URLs geladen werden. Die Tests sichern Grundplausibilität, Determinismus, Quellentrennung, MIDI-Header und fehlende Messkanäle ab; sie ersetzen **keine psychometrische Validierung**.
