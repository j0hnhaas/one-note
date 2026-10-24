# Lifehouse — Methodik und Architektur (Stand 0.1)

## Leitgedanke

Menschen werden ausschließlich über **psychometrische Merkmale** repräsentiert und ihre Beziehungen ausschließlich über **soziometrische Daten**. Keine astrologischen, biografischen, körperlichen, akustischen oder bildlichen personenbezogenen Eingangsdaten.

Die Idee ist von Pete Townshends Lifehouse-Konzept (1971) inspiriert. Das Verfahren nach Lawrence Ball (2007) wird nicht nachgebaut.

## Schichten

1. **Input:** versionierter Datensatz `lifehouse-psychosocial`; Personen-IDs, psychometrische normierte Skalenwerte, soziometrische gerichtete Wahlbeziehungen und das Erhebungskriterium.
2. **Mapping:** deterministische Regelversion `circumplex-demo-v0.1`. Agency steuert im Demonstrator u. a. Register, Notendichte und Velocity; Communion u. a. melodische Motive und Tondauer.
3. **Interaktion:** A → B bedeutet: A übernimmt zeitweilig Motivelemente von B (Echo), ohne eine Gegenwahl von B zu implizieren.
4. **Score:** `lifehouse-score` enthält Noten, Kanal, Ereignisquelle und Zeitposition; keine unmittelbare Klangerzeugung.
5. **Player:** Web Audio API; jeder Browser kann einen anderen Klang rendern. Zusätzlich MIDI-Export.

## Wissenschaftliche Einschränkungen

Die Demo-Zuordnungen sind **keine psychologischen Forschungsergebnisse**. Echte Instrumente verlangen Angabe des Instruments, Version, Normierung, Reliabilität, Messinvarianz und Nutzungsrechte. Soziometrische Wahlen sind kriteriums- und kontextgebunden. Ein nicht erwidertes Verhältnis soll nicht als psychologisches Urteil über die Person dargestellt werden.

## Datenschutz

Das öffentliche Demo enthält nur synthetische Werte. Datenuploads werden ausschließlich clientseitig gelesen; es gibt keinen Server zur Verarbeitung. **Realdaten dürfen nicht in öffentlich ausgelieferte Dateien oder das Repository gelangen.** Für eine reale Gruppenerhebung sind Einwilligung, Datenminimierung, Sicherheitskonzept, Löschverfahren und rechtliche Prüfung erforderlich.

## Nächste Schritte

- Messmodell auswählen und Instrumenten-/Normierungsmetadaten definieren.
- Trennung von Datenschema, Mappings und Klangerzeugung modularisieren.
- Mappings im Blindtest auf Wiedererkennbarkeit und wahrgenommene Kohärenz untersuchen.
- Soziometrische Kriterien und zeitliche Veränderungen der Gruppe modellieren.
