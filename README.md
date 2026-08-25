# iBesüllyesztő

**Kiemelt termékek helyett pragmatikus, ár szerinti rendezés.**

A te OCD-det is idegesíti, hogy ár szerint sorba rendeznél termékeket az iPon oldalán, de azok a szerencsétlen kiemelt termékek csak nem rendeződnek, hanem ott állnak a lista elején?

Na, ez a szkript képes
1. Eltávolítani a kiemelt termékek vizuális megkülönböztető elemeit (lila keret és "KIEMELT" felirat, külön-külön szabályozható)
2. Kikényszeríteni az ár szerinti növekvő vagy csökkenő rendezését a termékeknek (akkor is, ha más van beállítva az oldalon)
    - Ebbe természetesen bele tartoznak a kiemelt termékek is, vagyis nem kerülnek többé a táblázat tetejére
4. Ha olyan helyen jelennek meg kiemelt termékek, ahol egyébként nem kellene nekik (pl. ár szerint növekvő sorrendben rendezett N-edik oldalnál jársz, ahol a legdrágább termék még mindig nem éri el a kiemelt termék árát, tehát eleve látnod sem kellene még a kiemelt terméket), akkor lehetőséged van ezeket
    - teljesen elrejteni (amíg nem indokolt, hogy kiemelés nélkül is megjelenjenek)
    - elhalványítani (amíg nem indokolt, hogy kiemelés nélkül is megjelenjenek)
    - változtatás nélkül megjeleníteni (de legalább a megfelelő ár sorrendben)

# Hogyan használd

- Telepítsd a Tampermonkey extensiont
    - [Firefoxra](https://www.tampermonkey.net/index.php?browser=firefox)
    - [Chromera](https://www.tampermonkey.net/index.php?browser=chrome)

(Firefoxra a [Greasemonkey extensiont](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) is használhatod, de nálam valamiért nem működik vele a beállítások megnyitása.)

Majd [klikkelj ide](https://github.com/NeoCodesRed/iBesullyeszto/raw/refs/heads/master/iBesullyeszto.user.js), miután az extension fut a böngésződben (privát ablak esetén valószínűleg külön engedélyezned kell a beállításokban) és fogadd el a felugró ablakban a telepítést.

Kész. Ezután a szkript használatra kész és automatikusan frissülni is fog.

# Testreszabás

A szkript telepítése után nyiss meg egy olyan oldalt az iPon.hu-n, ahol betöltődnek termékek, majd a Tampermonkey extension ikonjára kattintva látni fogod a "Beállítások" opciót. Erre klikkelve megnyílik a beállítások ablak.

A beállítások lényegében az itt fentebb leírt funkciókat kapcsolják ki/be, illetve részletes leírás van hozzájuk a beállítások panelen.

# Jogi dolgok

Ez egy független, nem hivatalos felhasználói szkript.

Semmilyen kapcsolatban nem állok az iPon.hu oldallal vagy készítőivel, a projekt az ő támogatásuk, jóváhagyásuk és/vagy szponzorációjuk nélkül működik.

A szkript kliens oldalon fut, a felhasználók böngészőjében és kizárólag az oldal által egyébként is a felhasználó számára megjelenített információ küllemét (stílusát, sorrendjét) változtatja meg.
Nem módosít, hatástalanít vagy kerül meg semmilyen hirdetést, reklámot, autentikációt, authorizációt vagy bármilyen biztonsági megoldást az oldalon.
Nem gyűjt semmilyen adatot, sem az oldalról, sem a felhasználóról.

Minden a projekt kódjában vagy leírásában említett védjegy, név, weboldal cím és bármilyen más szellemi tulajdon az eredeti tulajdonosuké.

A szkript használatáért, működéséért nem vállalok felelősséget, sem garanciát. Csak saját felelősségre használható, telepíthető.
