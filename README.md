# ONE NOTE — Lifehouse

Experimentelles Projekt zur **musikalischen Darstellung psychometrischer Merkmale und soziometrischer Beziehungen**. Inspiriert von Pete Townshends Lifehouse-Idee der frühen 1970er-Jahre; **keine Nachbildung von Lawrence Balls Lifehouse Method**.

## Lifehouse Fusion 0.2 — Big Five × erweiterte Persönlichkeit × Puls

**[Fusion Player (GitHub Pages)](./fusion.html)** · **[Architektur 0.2](./docs/ARCHITECTURE-v0.2.md)**

Parallel zum bestehenden soziometrischen Gruppen-Player 0.1 gibt es nun einen eigenständigen Fusion-Player mit drei direkt vergleichbaren Modi:

- **Personality:** Big Five + optionale 16 prototypische Facetten, ohne Puls.
- **Pulse:** ausschließlich zeitlich veränderliche Herzfrequenz (BPM), ohne Persönlichkeitswerte.
- **Fusion:** beide musikalischen Schichten übereinander; die Berechnungswege bleiben voneinander unabhängig.

Enthalten: JSON-Import, manuelle BPM-Eingabe, separate Quellenkennzeichnung jeder Note, deterministische Partitur, MIDI- und Score-Export, Browser-Wiedergabe. Die Architektur hält Instrumenten-ID, -Version und Scoring-Metadaten auseinander und sieht Soziometrie als späteren dritten Einflusskanal vor.

**Forschungsstatus:** Die Big-Five- und 16-Facetten-Werte sind *synthetisch*. Es ist derzeit weder ein 16PF noch ein IPIP-16PF-Fragebogen implementiert. Die musikalischen Zuordnungen sind künstlerische Hypothesen, keine validierte Messinterpretation. Der Puls ist BPM, **keine** HRV und kein emotionaler Zustandsindikator. Beispieldaten dürfen keine echten Gesundheits- oder psychometrischen Werte enthalten.

- [Synthetische Sitzung 0.2](./examples/demo.lifehouse-session.json)
- [Schema Sitzung 0.2](./schemas/lifehouse-session.schema.json)
- [Schema Score 0.2](./schemas/lifehouse-score-v0.2.schema.json)
- [Kompositionsengine](./js/fusion-engine.js)
- [Automatisierte Tests](./tests/fusion-engine.test.mjs) – lokal mit Node.js 20+ und **npm test**

Das alte Format 0.1 bleibt unverändert. Neue und alte Beispieldateien sind nicht ohne Konvertierung austauschbar.

## Player 0.1

Den [Lifehouse Player öffnen](./index.html) (HTML-Datei lokal öffnen oder über GitHub Pages bereitstellen). Läuft ohne Backend und ohne externe JavaScript-Bibliotheken.

- Zwei psychometrische Dimensionen im Demonstrationsmodell: **Agency** und **Communion** (normalisiert auf 0–1).
- Gerichtete, positiv gewichtete soziometrische Wahlen; getrennte Stimmen und musikalische Echo-Ereignisse.
- Browser-Audiowiedergabe, Graphvisualisierung, Stummschalten einzelner Stimmen.
- JSON-Import und Export von Datensatz, Partitur (Score JSON) und Standard-MIDI.
- Alle vorinstallierten Personendaten sind **synthetisch**. Die Regeln sind gestalterische Demonstrationen, keine validierte psychologische Übersetzung.

## Datenformate

| Datei | Zweck |
|---|---|
| [demo.lifehouse.json](./examples/demo.lifehouse.json) | Synthetischer Beispieldatensatz (psychometrische Profile + Soziogramm) |
| [lifehouse.schema.json](./schemas/lifehouse.schema.json) | JSON Schema für Datensätze, Draft 2020-12 |
| [lifehouse-score.schema.json](./schemas/lifehouse-score.schema.json) | JSON Schema für berechnete Notenereignisse |
| [example.lifehouse-score.json](./examples/example.lifehouse-score.json) | Aus dem Beispiel deterministisch berechnete Partitur (156 Noten) |
| [example.mid](./examples/example.mid) | Gleiche Beispielkomposition als Standard-MIDI-Datei |
| `*.lifehouse-score.json` / `*.mid` | Weitere Dateien können direkt im Player exportiert werden |

**Version 0.1:** Maximal 12 Teilnehmende, zwei Dimensionen und gerichtete positive Wahlen. Die Mappings sind mit `circumplex-demo-v0.1` versioniert. Die Unterstützung anderer Messinstrumente und Kriterien ist noch nicht implementiert.

## GitHub Pages

Das Repository ist derzeit privat. GitHub Pages für private Repositories setzt laut GitHub normalerweise Pro/Team/Enterprise voraus; mit GitHub Free müsste es öffentlich sein. Die Pages-Website selbst ist im Regelfall öffentlich, auch wenn das Quellrepository privat bleibt.

Zum Aktivieren in diesem Repository: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**. Startseite: `index.html`. Die voraussichtliche Adresse nach erfolgreicher Aktivierung lautet `https://j0hnhaas.github.io/one-note/`.

**Datenschutz:** Niemals echte psychometrische Profile, Soziogramme oder identifizierende Datensätze in das Repository oder in die Pages-Dateien committen. Der Player verarbeitet manuell geladene Daten im Browser, ohne eigenen Upload-Endpunkt. Ein öffentlicher Dienst muss dennoch separat hinsichtlich Datenschutz, Einwilligung und Erhebungsverfahren geprüft werden.

## Konzeption

Siehe [Architektur und Methodik](./docs/ARCHITECTURE.md). Noch keine wissenschaftliche Validierung, keine Diagnostik.

## Lizenz

Noch keine Lizenz festgelegt. Bis zur Entscheidung über eine Lizenz gelten die allgemeinen urheberrechtlichen Regeln; das Repository ist nicht automatisch Open Source.
