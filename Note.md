# Dev Note

## Example Data Structure

```json
{
  "vorname": "Test",
  "nachname": "Person",
  "mail": "testpe@th-nuernberg.de",
  "semester": "wintersemester",
  "module": "4.2.5 Querschnitt: Kulturelle Diversität",
  "title": "Querschnitt: Kulturelle Diversität",
  "co_dozent": "Krämer, Ulrike & Lachmayr, Tina",
  "rhythmus": "wöchentlich, ein Termin pro Woche",
  "anmerkungen": "",
  "tn_zahl": "",
  "wartelist": "",
  "raumwunsch": "BL- Gebäude",
  "wochentag": 0,
  "von": "10:00",
  "bis": "15:00",
  "time": [
    { "id": 1, "title": "1.Gruppe", "von": "10:00", "bis": "16:00", "datum": "2025-03-28" }, // block
    { "id": 2, "title": "1.Gruppe", "von": "10:00", "bis": "14:00", "datum": "2025-03-29" } // block
  ]
}
```

### Draft for ChangeLog Event

```json
{
  "benId": 80,
  "msg": "Benutzer ... hat folgende Termine storniert. Benutzer ... hat folgende Termin angefragt. Benutzer ... hat folgdende Termin aktuallisiert",
  "gelesen_von": "80, 81, 82, ..."
}
```
