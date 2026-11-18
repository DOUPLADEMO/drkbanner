# DRK Everest – Időjárás kreatív: használati útmutató

## 1. Belépés
- Jelszó: `jhlykrvsz26`. A böngésző megjegyzi, a jobb felső **Kilépés** gombbal léphetsz ki.

## 2. Napi munkamenet (5 lépés)
1. **Időjárás fül → Időkép szerint javítás.** Betöltéskor a program lekéri Budapest adatait az Open-Meteóból (a **Frissítés** gombbal bármikor újra). Nyisd meg az Időképet (a fül tetején lévő link), és írd át a mezőket, ha eltér: aktuális fok, max/min, szél, állapotkód, a 6 órás sor és a heti sor (óra, fok, ikon). Szerkesztés után megjelenik az **„Időkép szerint korrigálva”** jelölő. A **Visszaállítás API-ra** gomb eldobja a kézi javításokat.
2. **Állapot fül → ellenőrzés.** A program a kód, a hőmérséklet és a szél alapján magától választ állapotot (Havas → Jeges → Esős → Szeles → Ködös → Napos hideg → Általános hideg). Ha mást szeretnél, az **Állapot felülírása** legördülőben kiválaszthatod. Itt szerkeszthető az állapot felirata (pl. „Erős szél”) és a figyelmeztetés-kártya címkéje (Figyelmeztetés / Fagyriasztás / Hóriasztás).
3. **Szlogen kiválasztása.** Ugyanezen a fülön az A / B / C körökre kattintva választhatsz, vagy a ✎ sorba írhatsz egyedi szöveget. Az A/B/C szövegek is átírhatók. Minden állapotnak megvan az alapértelmezett párosítása (a **Alapértelmezett párosítás visszaállítása** gombbal vissza lehet állítani).
4. **Képek igazítása.** A rácsban egy méretre kattintva megnyílik a nagy szerkesztő nézet:
   - húzd a képet az előnézeten a mozgatáshoz, a görgővel nagyíthatsz (a csúszkák is működnek);
   - mozgatáshoz kell egy kis nagyítás (100%-on nincs hová húzni);
   - az **Alaphelyzet** gomb visszaállítja az automatikus igazítást;
   - a **Bakancs zóna és safe zone** kapcsolóval megjelenik a kék bakancs-zóna, a sárga biztonsági margó és a 9:16-os piros sávok (Stories UI). Az exportban az overlay nem látszik.
   - a pozíció állapotonként és méretenként külön tárolódik.
5. **Export.**
   - **PNG letöltés** egy méretre (rács vagy szerkesztő nézet).
   - **Összes letöltése (ZIP)**: a 6 méret az aktuális szlogennel.
   - **Batch export · 3×6**: mind a 3 szlogen × 6 méret (18 PNG) egy ZIP-ben.
   - Fájlnév: `DRK_Everest_{állapot}_{szlogen}_{méret}_{ÉÉÉÉHHNN}.png`, pontos pixelmérettel.

## 3. Méretek
| Méret | Arány | Megjegyzés |
|---|---|---|
| 1080×1350, 960×1200 | 4:5 | hőfok, órás és heti kártya balra, szlogen balra lent |
| 1080×1080, 1200×1200 | 1:1 | heti kártya alapból nincs, az Elemek fülön bekapcsolható |
| 1080×1920 | 9:16 | felső 250 px csak logó, alsó 15% szöveg nélkül |
| 1200×628 | fekvő | heti kártya nincs |

## 4. Képek fül (háttérképek)
- Válaszd ki az állapotot, majd állapotonként 4 arányhoz (1:1, 4:5, 9:16, 16:9) húzz rá egy képet, vagy kattints a mezőre.
- A feltöltés a böngészőben (IndexedDB) tárolódik, nem kell újra feltölteni.
- Az **alapkép** gombbal visszatérhetsz a beépített képre.
- Az Általános hideg állapotnak nincs saját képe, ezért a Napos hideg képeit használja, amíg nem töltesz fel sajátot.
- A saját feltöltött képeknél nincs automatikus igazítás, azokat kézzel kell mozgatni.

## 5. Elemek fül
- **CTA gomb** ki/be, a felirata szerkeszthető (alapból „Vásárolj most”).
- **Heti kártya az 1:1 méreteken** ki/be.
- **Logó módja**: Auto (a háttér világossága alapján fehér vagy fekete), vagy kézzel Fehér / Fekete / Bézs.
- **DRK logó feltöltése** (PNG/SVG, átlátszó háttér): a három mezőbe külön tölthető. Ha csak egy van feltöltve, a többi szín belőle készül.
- **Saját DRK font** feltölthető (.ttf/.otf/.woff). Az **Inter** gombbal vissza lehet állni az alapfontra. Az alapértelmezett betű a Montserrat.

## 6. Tudnivalók
- Ha az Open-Meteo nem érhető el, sárga jelzés látszik, a kézi mezőkkel tovább lehet dolgozni.
- Minden beállítás (kézi időjárás, szlogenek, pozíciók, kapcsolók) a böngészőben marad. Másik gépen vagy böngészőben újra kell állítani.
- A kártyák hátterében a matt üveghatás (blur 20 px) látszik. Letöltés előtt érdemes az exportált PNG-t egyszer megnézni a végleges méreten.
