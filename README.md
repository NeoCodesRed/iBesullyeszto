# iBesüllyesztő

**Kiemelt termékek helyett pragmatikus, ár szerinti rendezés.**

A te OCD-det is idegesíti, hogy ár szerint sorba rendeznél termékeket az iPon oldalán, de azok a szerencsétlen kiemelt termékek csak nem rendeződnek, hanem ott állnak a lista elején?

Ez a szkript képes
1. Eltávolítani a kiemelt termékek vizuális megkülönböztető elemeit (lila keret és "KIEMELT" felirat, külön-külön szabályozható)
2. Kikényszeríteni az ár szerinti növekvő vagy csökkenő rendezését a termékeknek (akkor is, ha más van beállítva az oldalon)
    - Ebbe természetesen bele tartoznak a kiemelt termékek is, vagyis nem kerülnek többé a táblázat tetejére
4. Ha olyan helyen jelennek meg kiemelt termékek, ahol egyébként nem kellene nekik (pl. ár szerint növekvő sorrendben rendezett N-edik oldalnál jársz, ahol a legdrágább termék még mindig nem éri el a kiemelt termék árát, tehát eleve látnod sem kellene még a kiemelt terméket), akkor lehetőséged van ezeket
    - teljesen elrejteni (amíg nem indokolt, hogy kiemelés nélkül is megjelenjenek)
    - elhalványítani (amíg nem indokolt, hogy kiemelés nélkül is megjelenjenek)
    - változtatás nélkül megjeleníteni (de legalább a megfelelő ár sorrendben)

# Hogyan használd

- Firefox esetén telepítsd
    - a [Greasemonkey plug-int](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
    - vagy a [Tampermonkey plug-int](https://www.tampermonkey.net/index.php?browser=firefox)
- Chrome esetén telepítsd a [Tampermonkey plug-int](https://www.tampermonkey.net/index.php?browser=chrome)

Majd [klikkelj ide](https://github.com/NeoCodesRed/iBesullyeszto/raw/refs/heads/main/iBesullyeszto.user.js), miután a plugin fut a böngésződben (privát ablak esetén valószínűleg külön engedélyezned kell a plugin beállításokban) és fogadd el a felugró ablakban a telepítést.

Kész. Ezután a szkript használatra kész és automatikusan frissülni is fog.

# Testreszabás

A szkript telepítése után a Greasemonkey / Tampermonkey plugin beállításainál meg tudod nyitni a szkript kódját és az elején lévő néhány beállítás értékének módosításával testre szabhatod a viselkedését.

A beállítások lényegében az itt korábban leírt funkciókat kapcsolják ki/be, illetve részletes leírás van előttük a kódban, hogy pontosan mit csinálnak és milyen lehetőségeket adhatsz nekik értékül. Ezért itt csak egy nagyon rövid összefoglalót készítek:

|                   Beállítás                    |                        Rövid leírás                       |        Lehetséges értékek       |       Alapértelmezett érték       |
|------------------------------------------------|-----------------------------------------------------------|---------------------------------|-----------------------------------|
| IB_KIEMELES_VIZUALIS_ELTAVOLITASA_KERET        | Lila keret eltávolítása be/ki                             | true / false                    | true                              |
| IB_KIEMELES_VIZUALIS_ELTAVOLITASA_FELIRAT      | KIEMELT felirat eltávolítása be/ki                        | true / false                    | true                              |
| IB_NEM_ODAILLO_KIEMELT_TERMEKEK_KEZELESI_MODJA | Ár alapján nem odaillő kiemelt termékek kezelésének módja | "ELREJT" / "HALVANYIT" / "HAGY" | "HALVANYIT"                       |
| IB_ALAPERTELMEZETT_RENDEZES                    | Ár szerinti rendezés kikényszerítése                      | "ASC" / "DESC" / null           | null                              |
| IB_BOVEBB_LOGOLAS_ENGEDELYEZVE                 | Bővebb logolás (technikai)                                | true / false                    | false                             |

Kézi módosítás nélkül az alapértelmezett értékek érvényesek.

# Jogi dolgok

Ez egy független, nem hivatalos felhasználói szkript.

Semmilyen kapcsolatban nem állok az iPon.hu oldallal vagy készítőivel, a projekt az ő támogatásuk, jóváhagyásuk és/vagy szponzorációjuk nélkül működik.

A szkript kliens oldalon fut, a felhasználók böngészőjében és kizárólag az oldal által egyébként is a felhasználó számára megjelenített információ küllemét (stílusát, sorrendjét) változtatja meg.
Nem módosít, hatástalanít vagy kerül meg semmilyen hirdetést, reklámot, autentikációt, authorizációt vagy bármilyen biztonsági megoldást az oldalon.
Nem gyűjt semmilyen adatot, sem az oldalról, sem a felhasználóról.

Minden a projekt kódjában vagy leírásában említett védjegy, név, weboldal cím és bármilyen más szellemi tulajdon az eredeti tulajdonosuké.

A szkript használatáért, működéséért nem vállalok felelősséget, sem garanciát. Csak saját felelősségre használható, telepíthető.
