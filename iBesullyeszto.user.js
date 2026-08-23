// ==UserScript==
// @name        iBesullyeszto
// @description Kiemelt termékek helyett pragmatikus, ár szerinti rendezés.
// @include     /^https?://(www\.)?ipon\.hu/shop.*$/
// @grant       none
// @icon        https://raw.githubusercontent.com/NeoCodesRed/iBesullyeszto/refs/heads/main/iBesullyeszto_icon.png
// @downloadURL https://raw.githubusercontent.com/NeoCodesRed/iBesullyeszto/refs/heads/main/iBesullyeszto.user.js
// @updateURL   https://raw.githubusercontent.com/NeoCodesRed/iBesullyeszto/refs/heads/main/iBesullyeszto.user.js
// @version     1.0
// @author      Neo
// ==/UserScript==



// -------------------------------------------------- BEÁLLÍTÁSOK --------------------------------------------------
// Szerkeszd ezt a részt az iBesullyeszto működésének testreszabásához.
// A változtatások életbe lépéséhez a script mentése, majd az oldal újratöltése szükséges (F5).
// Minden beállításnál a "Lehetőségek" részben található értékeket használhatod.
// Másold ki őket pontosan a megjegyezések alatti "const" kezdetű sor végére.
// Figyelj az idézőjelekre (ahol kellenek), illetve a sor végi pontosvessző megtartására,
// különben a script (esetleg) nem fog működni (helyesen).
// -----------------------------------------------------------------------------------------------------------------

// Be- vagy kikapcsolja a kiemelt termékek vizuális kiemelésének eltávolítását.
// A lila keret (KERET) és "Kiemelt" felirat (FELIRAT) eltávolítása külön-külön kapcsolható.
// Ha kikapcsolod, a kiemelt termékek vizuális jelzése megmarad.
// Ez a funkció nem befolyásolja a többit, azokkal párhuzamosan képes működni.
// Lehetőségek:
//     - true = bekapcsolt vizuális eltávolítás
//     - false = kikapcsolt vizuális eltávolítás
const IB_KIEMELES_VIZUALIS_ELTAVOLITASA_KERET = true;
const IB_KIEMELES_VIZUALIS_ELTAVOLITASA_FELIRAT = true;



// Amennyiben ár alapján rendezettek a termékek
// (az oldalon beállított sorrendezés, avagy az itt beállított alapértelmezett sorrendezés alapján),
// a script kezelni tudja azon kiemelt termékeket, amiknek eleve meg sem szabadott volna jelennie (még) áruk alapján,
// de mivel kiemeltek így megjelentek.
// Ez a funkció NEM befolyásolja a kiemelés vizuális eltávolítását, azzal párhuzamosan képes működni.
// Lehetőségek:
//    - "ELREJT" = Az ilyen termékek elrejtése.
//    - "HALVANYIT" = Az ilyen termékek elhalványítása.
//    - "HAGY" = Semmi ne történjen az ilyen termékekkel.
const IB_NEM_OLDALRA_ILLO_KIEMELT_TERMEKEK_KEZELESI_MODJA = "HALVANYIT";



// Az alapértelmezett (kikényszerített) rendezés iránya (ha nincs kiválasztva ár szerinti rendezés).
// Lehetőségek:
//     - "ASC" = növekvő (olcsók elől)
//     - "DESC" = csökkenő (drágák elől)
//     - null = ne legyen alapértelmezett rendezés
// Bővebben:
// Az oldalon (jelenleg) a "Legnépszerűbb" az alapértelmezett rendezési sorrend, amíg nem választasz ki egy másikat.
// A script alkalmazkodik a "Legolcsóbb"
// vagy "Legdrágább" rendezésekhez amennyiben azok valamelyike aktív, de a többivel nem tud mit kezdeni (rendezés szempontjából).
// Ha szeretnéd, hogy a többi rendezési mód kiválasztása esetén is "erőltesse" a script
// az ár szerinti rendezést (növekvő vagy csökkenő irányba), akkor állítsd be ezen lehetőségek egyikét.
// Ha azonban használod a többi rendezési módot, akkor adj meg null értéket itt, ilyenkor a script ilyen rendezések kiválasztása
// esetén nem fogja erőltetni az ár szerinti rendezést. Ez esetben a kiemelt termékek rendezése az oldalra marad bízva.
// Ezen beállítás semmilyen formában NEM befolyásolja a termék kiemelés vizuális eltávolítását (amennyiben beállítottad lentebb),
// csakis a sorrendezést (illetve értelem szerűen az ár alapján nem oldalra illő kiemelt termékek kezelésének funkcióját,
// aminek nincs értelme nem ár szerinti rendezésnél).   
const IB_ALAPERTELMEZETT_RENDEZES = null;



// Be- vagy kikapcsolja az extra infók logolását a konzolra (F12 vagy Ctrl+Shift+I).
// Hibakereséshez hasznos (ha tudod mit csinálsz), de a működést nem befolyásolja.
// Lehetőségek:
//     - true = bekapcsolt extra logolás
//     - false = kikapcsolt extra logolás
// Megj.: a script mindenképpen logolni fogja a figyelmeztetéseket (warn) és a hibákat (error), függetlenül ettől a beállítástól.
const IB_BOVEBB_LOGOLAS_ENGEDELYEZVE = false;










// -------------------------------------------------- MOTORHÁZTETŐ ALATT --------------------------------------------------
// Csak akkor nyúlj a kódhoz ezen vonal alatt, ha tudod mit csinálsz.



// -------------------------------------------------- CONSTANTS --------------------------------------------------
const IB_REGEX_WHITESPACE = /\s+/g; // Matches all whitespace characters
const IB_CURRENCY_SYMBOL = "Ft";

const IB_HIGHLIGHTED_TEXT_TO_REMOVE = "Kiemelt";
const IB_HIGHLIGHTED_PRODUCT_CLASSES_TO_REMOVE = ["border-iviolet-700", "border-2"];

const IB_SEARCH_PARAM_SORT_ORDER_NAME = "sortOrder";
const IB_SEARCH_PARAM_SORT_ORDER_ASC = "olcso";
const IB_SEARCH_PARAM_SORT_ORDER_DESC = "draga";

const IB_DATASET_KEY_HIGHLIGHTED = "ib_isHighlighted"; // Used to tag product cards that are (or were at some point) highlighted by the website
const IB_DATASET_KEY_HANDLED = "ib_isHandled"; // Used to tag product cards that have already been stripped from highlight visuals by the script

const IB_CLASS_NAME_HIGHLIGHTED_OUT_OF_PLACE = "ib-outofplace-highlighted-card"; // Marks cards with a CSS style that shouldn't have appeared due to their price
const IB_CSS_STYLE_HIGHLIGHTED_OUT_OF_PLACE =
`div.${IB_CLASS_NAME_HIGHLIGHTED_OUT_OF_PLACE}
{
    opacity: 25% !important;
}`;
const IB_STYLE_DISPLAY_NONE = "none";
const IB_STYLE_DISPLAY_ORIGINAL = "block";

const IB_SELECTOR_SORT_ORDER_SELECTOR = "select.list-order";
const IB_SELECTOR_BORDER_HIGHLIGHTED_CLASS = "." + IB_HIGHLIGHTED_PRODUCT_CLASSES_TO_REMOVE[0];
const IB_SELECTOR_PRODUCT_PRICE = ".product-price";
const IB_SELECTOR_PRODUCT_CARD = ".product-card";
const IB_SELECTOR_PRODUCT_GRID = ".grid:has(" + IB_SELECTOR_PRODUCT_CARD + ")";

const IB_LOG_PREFIX = "---------- [iBesullyeszto]";



// -------------------------------------------------- HELPERS --------------------------------------------------
/** Parses price text into a number (e.g. "58 990 Ft" → 58990). */
function IB_ParsePrice(str)
{
    if (!str)
    {
        return Infinity;
    }
    
    var formattedStr = str
        .replace(IB_REGEX_WHITESPACE, "")
        .replace(IB_CURRENCY_SYMBOL, "")
        .trim();

    return Number(formattedStr) || Infinity;
}

/** Gets the price of a product card as a number, or Infinity if not found. */
function IB_GetPrice(card)
{
    var priceEl = card.querySelector(IB_SELECTOR_PRODUCT_PRICE);

    return priceEl ? IB_ParsePrice(priceEl.textContent) : Infinity;
}

/** Compares two product cards by price, based on the given sort direction. */
function IB_CompareCardsByPrice(cardA, cardB, sortDirection)
{
    var priceA = IB_GetPrice(cardA);
    var priceB = IB_GetPrice(cardB);

    return sortDirection === "ASC" ? priceA - priceB : priceB - priceA;
}

/** Gets the sort direction from the product grid header, or returns null if not found. */
function IB_GetSortDirectionFromGridHeader()
{
    var sortOrderSelector = document.querySelector(IB_SELECTOR_SORT_ORDER_SELECTOR);
    if (!sortOrderSelector)
    {
        IB_LogError("No sort order selector found!");
        return null;
    }

    var selectedOption = sortOrderSelector.options[sortOrderSelector.selectedIndex];
    if (!selectedOption)
    {
        IB_LogError("No selected option found in sort order selector!");
        return null;
    }

    switch (selectedOption.value.toLowerCase())
    {
        case IB_SEARCH_PARAM_SORT_ORDER_ASC:
            IB_LogInfo(`Found "${selectedOption.value}" selected option in grid header, using sort direction: "${IB_SEARCH_PARAM_SORT_ORDER_ASC}".`);
            return "ASC";

        case IB_SEARCH_PARAM_SORT_ORDER_DESC:
            IB_LogInfo(`Found "${selectedOption.value}" selected option in grid header, using sort direction: "${IB_SEARCH_PARAM_SORT_ORDER_DESC}".`);
            return "DESC";
        
        default:
            IB_LogWarn(`Unknown selected sort option found in grid header: "${selectedOption.value}"!`);
            return null;
    }
}

/** Gets the sort direction from the URL query parameters, or returns null if not found. May not be needed, but I'm keeping it as a fallback for now. */
function IB_GetSortDirectionFromURL()
{
    var urlParams = new URLSearchParams(window.location.search);
    if (!urlParams)
    {
        IB_LogError("No URL search parameters found to determine sorting order!");
        return null;
    }

    var sortParam = urlParams.get(IB_SEARCH_PARAM_SORT_ORDER_NAME);
    if (!sortParam)
    {
        IB_LogError(`No "${IB_SEARCH_PARAM_SORT_ORDER_NAME}" parameter found in URL!`);
        return null;
    }

    switch (sortParam.toLowerCase())
    {
        case IB_SEARCH_PARAM_SORT_ORDER_ASC:
            IB_LogInfo(`Found "${sortParam}" parameter in URL, using sort direction: "${IB_SEARCH_PARAM_SORT_ORDER_ASC}".`);
            return "ASC";

        case IB_SEARCH_PARAM_SORT_ORDER_DESC:
            IB_LogInfo(`Found "${sortParam}" parameter in URL, using sort direction: "${IB_SEARCH_PARAM_SORT_ORDER_DESC}".`);
            return "DESC";
        
        default:
            IB_LogWarn(`Unknown "${IB_SEARCH_PARAM_SORT_ORDER_NAME}" parameter found in URL: "${sortParam}"!`);
            return null;
    }
}

/** Identifies highlighted cards (purple border OR "Kiemelt" label). */
function IB_IsHighlighted(card)
{
    var hasHighlightedBorder = card.querySelector(IB_SELECTOR_BORDER_HIGHLIGHTED_CLASS);
    var hasHighlightedText = card.textContent
        .toLowerCase()
        .includes(IB_HIGHLIGHTED_TEXT_TO_REMOVE.toLowerCase());
    
    return hasHighlightedBorder || hasHighlightedText;
}

/** Tags a product card as highlighted by adding a dataset entry to it. */
function IB_TagIfHighlighted(card)
{
    if (IB_IsHighlighted(card))
    {
        card.dataset[IB_DATASET_KEY_HIGHLIGHTED] = "true";
    }
}

/** Determines if a dataset entry by the given key is present on the given product card. */
function IB_IsDatasetEntryPresentOnCard(card, entryKey)
{
    return card.dataset[entryKey] === "true";
}

/** Determines if a product card was tagged as highlighted by the script. */
function IB_IsTagged(card)
{
    return IB_IsDatasetEntryPresentOnCard(card, IB_DATASET_KEY_HIGHLIGHTED);
}

/** Determines if a product card was tagged as already been handled by the script. */
function IB_IsHandled(card)
{
    return IB_IsDatasetEntryPresentOnCard(card, IB_DATASET_KEY_HANDLED);
}

/** Removes the visual highlighting from a product card (purple border AND "Kiemelt" label) if it hasn't been done before. */
function IB_RemoveHighlighting(card)
{
    // Note: For removal, it would be enough / better to just remove "product.isHighlighted" sections from the templates in the HTML.
    // However, for detection, we rely on the presence of the violet border and the highlighted text.
    // So for now, I'm leaving the detection and removal logic as they are.



    // Only process cards that haven't yet been processed by this function
    if (IB_IsHandled(card))
    {
        return;
    }

    // Remove purple border if exists and if enabled in settings
    if (IB_KIEMELES_VIZUALIS_ELTAVOLITASA_KERET)
    {
        var borderElem = card.querySelector(IB_SELECTOR_BORDER_HIGHLIGHTED_CLASS);
        if (borderElem)
        {
            borderElem.classList.remove(...IB_HIGHLIGHTED_PRODUCT_CLASSES_TO_REMOVE);
        }
        else
        {
            IB_LogWarn("No highlighted border found for the following card:", card);
        }
    }

    // Remove "Kiemelt" label if enabled in settings
    if (IB_KIEMELES_VIZUALIS_ELTAVOLITASA_FELIRAT)
    {
        var highlightedTextFound = false;

        var cardElements = card.querySelectorAll("*");
        for (var i = 0; i < cardElements.length; i++)
        {
            var currentElement = cardElements[i];
            if (currentElement.textContent.trim().toLowerCase() === IB_HIGHLIGHTED_TEXT_TO_REMOVE.toLowerCase())
            {
                currentElement.remove();
                highlightedTextFound = true;
                break; // Stop after removing the first occurrence of the highlighted text
            }
        }

        if (!highlightedTextFound)
        {
            IB_LogWarn("No highlighted text found for the following card:", card);
        }
    }

    // Tagging as handled so we don't process this card again in this function
    card.dataset[IB_DATASET_KEY_HANDLED] = "true";
}

/** Injects custom CSS to the document head, that can be used to mark highlighted cards that are out of place if their handling mode is set so. */
function IB_InjectIbCssIfNeeded()
{
    if (IB_NEM_OLDALRA_ILLO_KIEMELT_TERMEKEK_KEZELESI_MODJA.toUpperCase() === "HALVANYIT")
    {
        var ibCss = document.createElement('style');
        ibCss.innerHTML = IB_CSS_STYLE_HIGHLIGHTED_OUT_OF_PLACE;
        document.head.appendChild(ibCss);
    }
}

/** Logs an info message to the console with a prefix if extra logging is enabled in settings. */
function IB_LogInfo(message, obj)
{
    if (!IB_BOVEBB_LOGOLAS_ENGEDELYEZVE)
    {
        return;
    }

    (obj)
        ? console.log(`${IB_LOG_PREFIX}: ${message}`, obj)
        : console.log(`${IB_LOG_PREFIX}: ${message}`);
}

/** Logs a warn message to the console with a prefix. */
function IB_LogWarn(message, obj)
{
    (obj)
        ? console.warn(`${IB_LOG_PREFIX}: ${message}`, obj)
        : console.warn(`${IB_LOG_PREFIX}: ${message}`);
}

/** Logs an error message to the console with a prefix. */
function IB_LogError(message, obj)
{
    // Because errors have stack traces, the console puts a right arrow and a space in front of it.
    // Slice(2) makes it so they are still vertically aligned with other type of logs from this script.
    (obj)
        ? console.error(`${IB_LOG_PREFIX.slice(2)}: ${message}`, obj)
        : console.error(`${IB_LOG_PREFIX.slice(2)}: ${message}`);
}



// -------------------------------------------------- MAIN LOGIC --------------------------------------------------
/** Main logic for iBesullyeszto. */
function IB_Main(grid)
{
    IB_LogInfo("Main logic triggered...");

    IB_gridObserver.disconnect(); // Stop observing the grid while we are modifying it to avoid infinite loops

    try
    {
        var allCards = [];
        var highlightedCards = [];
        var normalCards = [];

        // Getting all product cards
        allCards = [...grid.querySelectorAll(IB_SELECTOR_PRODUCT_CARD)];

        if (!allCards)
        {
            console.error("No product cards found in product grid. Cancelling run!");
            return;
        }

        // Tagging highlighted product cards if they haven't been tagged in a previous run
        allCards.forEach(card =>
        {
            if (!IB_IsTagged(card))
            {
                IB_TagIfHighlighted(card);
            }
        });

        // Getting highlighted cards (that were tagged in the previous step or in a previous run) and normal cards
        highlightedCards = allCards.filter(card => IB_IsTagged(card));
        normalCards = allCards.filter(card => !IB_IsTagged(card));

        if (!highlightedCards || highlightedCards?.length < 1)
        {
            console.warn("No highlighted cards found in product grid. There is no reason to run main logic.");
            return;
        }

        IB_LogInfo(`Found ${allCards.length} cards total in the product grid, out of which ${allCards.length - highlightedCards.length} are normal and ${highlightedCards.length} are highlighted.`);

        // Remove the visual highlighting from highlighted (but not yet processed) cards as configured in settings
        var unprocessedHighlightedCards = highlightedCards.filter(card => !IB_IsHandled(card));

        if (unprocessedHighlightedCards && unprocessedHighlightedCards.length > 0)
        {
            unprocessedHighlightedCards.forEach(card => IB_RemoveHighlighting(card));
            IB_LogInfo(`Removed highlighted visuals from ${unprocessedHighlightedCards.length} cards.`);
        }

        // Getting sort direction from the grid header or from the URL query parameters as a fallback
        var sortDirection = IB_GetSortDirectionFromGridHeader() ?? IB_GetSortDirectionFromURL();
        if (!sortDirection)
        {
            IB_LogWarn(`Failed to determine sort direction from grid header or URL, attempting to use default ordering direction: "${IB_ALAPERTELMEZETT_RENDEZES.toUpperCase()}".`);
        }

        sortDirection = IB_ALAPERTELMEZETT_RENDEZES.toUpperCase();
        if (!sortDirection)
        {
            IB_LogError("Failed to determine sort direction, ordering is skipped!");
            return;
        }

        // Sorting ALL cards by price based on the determined sort direction
        allCards.sort((a, b) => IB_CompareCardsByPrice(a, b, sortDirection));

        // Reordering DOM to match sort for ALL cards
        allCards.forEach(card => grid.appendChild(card));

        IB_LogInfo(`Sorted ALL cards by price in "${sortDirection}" order.`);



        // Now that ordering is done, we'll check each higlighted card for being "out of place",
        // meaning that they would not even appear in the grid were they not highlighted and deal with them as configured

        // First, we calculate the price range of normal product cards
        var normalPrices = normalCards.map(card => IB_GetPrice(card));
        var minNormalPrice = Math.min(...normalPrices);
        var maxNormalPrice = Math.max(...normalPrices);

        IB_LogInfo(`Price range of normal cards is ${minNormalPrice} - ${maxNormalPrice}.`);

        // Then we iterate over the highlighted cards and deal with them as configured in settings
        // or restore them to look like normal cards if they now fit in the price range of normal products
        for (var i = 0; i < highlightedCards.length; i++)
        {
            var highlightedCard = highlightedCards[i];
            var highlightedPrice = IB_GetPrice(highlightedCard);

            var isHighlightedPriceOutsideNormalRange =
                (sortDirection === "ASC"  && highlightedPrice > maxNormalPrice) ||
                (sortDirection === "DESC" && highlightedPrice < minNormalPrice);
            
            if (isHighlightedPriceOutsideNormalRange)
            {
                switch (IB_NEM_OLDALRA_ILLO_KIEMELT_TERMEKEK_KEZELESI_MODJA.toUpperCase())
                {
                    case "ELREJT":
                        highlightedCard.style.display = IB_STYLE_DISPLAY_NONE;
                        IB_LogInfo(`Found highlighted card with price of ${highlightedPrice} outside price range and hid it.`);
                        break;
                    case "HALVANYIT":
                        highlightedCard.classList.add(IB_CLASS_NAME_HIGHLIGHTED_OUT_OF_PLACE);
                        IB_LogInfo(`Found highlighted card with price of ${highlightedPrice} outside price range and applied custom style on it.`);
                        break;
                    case "HAGY":
                    default:
                        IB_LogInfo(`Found highlighted card with price of ${highlightedPrice} outside price range and did nothing with it.`);
                        break;
                }
            }
            else
            {
                // Reverting any change that may have been previously made to the card, because now it is supposed to appear
                // These are idempotent ops, so no need to switch on handling modes, check if they've been applied, etc.
                highlightedCard.style.display = IB_STYLE_DISPLAY_ORIGINAL;
                highlightedCard.classList.remove(IB_CLASS_NAME_HIGHLIGHTED_OUT_OF_PLACE);
            }
        };

        IB_LogInfo("Main logic completed.");
    }
    finally
    {
        // Resume watching for changes in the product grid
        IB_gridObserver.observe(grid, {
            childList: true,
            subtree: false
        });
    }
};



// -------------------------------------------------- STARTUP --------------------------------------------------
/** An observer that watches for changed on the product grid and triggers the main logic. */
var IB_gridObserver = new MutationObserver(() =>
{
    IB_LogInfo("Starting to watch for changes in product grid...");

    // Getting product grid - at this point it is assumed to exist
    var grid = document.querySelector(IB_SELECTOR_PRODUCT_GRID);

    IB_Main(grid); // Main logic
});

/** An observer that watches the page and locates the product grid once loaded. */
var IB_pageLoadObserver = new MutationObserver(() =>
{
    IB_LogInfo("Starting to watch for existence of product grid...");

    // Finding the product grid
    var grid = document.querySelector(IB_SELECTOR_PRODUCT_GRID);
    if (!grid)
    {
        IB_LogInfo("Product grid not found yet!");
        return;
    }

    IB_LogInfo("Product grid found.");

    IB_pageLoadObserver.disconnect(); // Stop observing once the grid is found

    // Start observing the product grid for changes (new cards loaded)
    IB_gridObserver.observe(grid,
        {
            childList: true,
            subtree: false
        });
});



// Inject CSS into <head> if needed
IB_InjectIbCssIfNeeded();

// Start observing the document body for changes to find the product grid (this triggers the main logic observer once the grid is found)
IB_pageLoadObserver.observe(document.body,
    {
        childList: true,
        subtree: true
    });
