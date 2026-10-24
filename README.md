# ONE NOTE — Lifehouse

Experimentelles Projekt zur **musikalischen Darstellung psychometrischer Merkmale und soziometrischer Beziehungen**. Inspiriert von Pete Townshends Lifehouse-Idee der frühen 1970er-Jahre; **keine Nachbildung von Lawrence Balls Lifehouse Method**.

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
| `*.lifehouse-score.json` | Über den Player exportierbare deterministische Partitur |
| `*.mid` | Über den Player exportierbare MIDI-Datei |

**Version 0.1:** Maximal 12 Teilnehmende, zwei Dimensionen und gerichtete positive Wahlen. Die Mappings sind mit `circumplex-demo-v0.1` versioniert. Die Unterstützung anderer Messinstrumente und Kriterien ist noch nicht implementiert.

## GitHub Pages

Das Repository ist derzeit privat. GitHub Pages für private Repositories setzt laut GitHub normalerweise Pro/Team/Enterprise voraus; mit GitHub Free müsste es öffentlich sein. Die Pages-Website selbst ist im Regelfall öffentlich, auch wenn das Quellrepository privat bleibt.

Zum Aktivieren in diesem Repository: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**. Startseite: `index.html`. Die voraussichtliche Adresse nach erfolgreicher Aktivierung lautet `https://j0hnhaas.github.io/one-note/`.

**Datenschutz:** Niemals echte psychometrische Profile, Soziogramme oder identifizierende Datensätze in das Repository oder in die Pages-Dateien committen. Der Player verarbeitet manuell geladene Daten im Browser, ohne eigenen Upload-Endpunkt. Ein öffentlicher Dienst muss dennoch separat hinsichtlich Datenschutz, Einwilligung und Erhebungsverfahren geprüft werden.

## Konzeption

Siehe [Architektur und Methodik](./docs/ARCHITECTURE.md). Noch keine wissenschaftliche Validierung, keine Diagnostik.

## Lizenz

Noch keine Lizenz festgelegt. Bis zur Entscheidung über eine Lizenz gelten die allgemeinen urheberrechtlichen Regeln; das Repository ist nicht automatisch Open Source.
