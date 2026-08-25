// ==UserScript==

// @name        iBesüllyesztő
// @namespace   Neo
// @description Kiemelt termékek helyett pragmatikus, ár szerinti rendezés.
// @version     1.0.0
// @author      Neo
// @match       https://*.ipon.hu/shop/*

// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand

// @icon        https://raw.githubusercontent.com/NeoCodesRed/iBesullyeszto/refs/heads/master/iBesullyeszto_icon.png
// @downloadURL https://raw.githubusercontent.com/NeoCodesRed/iBesullyeszto/refs/heads/master/iBesullyeszto.user.js
// @updateURL   https://raw.githubusercontent.com/NeoCodesRed/iBesullyeszto/refs/heads/master/iBesullyeszto.user.js

// ==/UserScript==



// -------------------------------------------------- CONFIG CONSTANTS --------------------------------------------------
const IB_CONFIG_ID = "iBesullyesztoConfig";
const IB_CONFIG_TITLE = "iBesüllyesztő Beállítások";
const IB_CONFIG_MENU_TITLE = "Beállítások";
const IB_CONFIG_MENU_SHORTCUT = "B";

const IB_CONFIG_REMOVE_HIGHLIGHTING_TITLE = "Kiemelés vizuális elemeinek eltávolítása";
const IB_CONFIG_REMOVE_HIGHLIGHTING_DESCRIPTION =
`A lila keret és a "KIEMELT" felirat eltávolítása külön-külön kapcsolható.<br/>
Ha nem pipálod be, a vizuális elem megmarad.<br/>
Ez a funkció nem befolyásolja az alábbi funkciókat, azokkal párhuzamosan működik.`;
const IB_CONFIG_REMOVE_HIGHLIGHTING_BORDER_LABEL = "Lila keret eltávolítása";
const IB_CONFIG_REMOVE_HIGHLIGHTING_TEXT_LABEL = `"KIEMELT" felirat eltávolítása`;

const IB_CONFIG_UNFITTING_HANDLE_MODE_TITLE = "Nem odaillő kiemelt termékek kezelésének módja";
const IB_CONFIG_UNFITTING_HANDLE_MODE_DESCRIPTION =
`Amennyiben ár alapján rendezettek a termékek (az oldalon avagy az itt beállított kikényszerített rendezés alapján),
a script kezelni tudja azon kiemelt termékeket, amiknek eleve meg sem szabadott volna jelennie (még) áruk
alapján (pl. mert drágábbak mint a legolcsóbb normál termék).<br/>
Amint indokolt a termékek megjelenítése ár szerint (pl. mert lapoztál), a halványítás / elrejtés lekerül róluk.<br/>
Ez a funkció NEM befolyásolja a kiemelés vizuális elemeinek eltávolítását, azzal párhuzamosan működik.`;
const IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_HIDE = "Rejtsd el őket";
const IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_FADE = "Halványítsd el őket";
const IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_NONE = "Ne csinálj semmit velük";

const IB_CONFIG_DEFAULT_SORT_TITLE = "Ár szerinti rendezés kényszerítése";
const IB_CONFIG_DEFAULT_SORT_DESCRIPTION =
`A script alkalmazkodik a "Legolcsóbb" és "Legdrágább" rendezésekhez amennyiben azok valamelyike aktív,
de a többi fajta rendezés (pl. "Legnépszerűbb") esetén a nem odaillő kiemelt termékek kezelése, illetve sorrendezése nem fog működni.<br/>
Ha szeretnéd, hogy a többi rendezési mód kiválasztása esetén is kikényszerítse a script az ár szerinti rendezést (növekvő vagy csökkenő irányba),
akkor állítsd be ezen lehetőségek egyikét.<br/>
Ha azonban használod a többi rendezési módot is az oldalon, akkor válaszd a "Kikapcsolva" opciót. Ez esetben a kiemelt termékek rendezése az oldalra marad bízva.<br/>
Ezen beállítás semmilyen formában NEM befolyásolja a kiemelés vizuális elemeinek eltávolítását (amennyiben beállítottad fentebb),
csakis a sorrendezést és az ár alapján oda nem illő termékek kezelését.`;
const IB_CONFIG_DEFAULT_SORT_OPTION_ASC = "Növekvő";
const IB_CONFIG_DEFAULT_SORT_OPTION_DESC = "Csökkenő";
const IB_CONFIG_DEFAULT_SORT_OPTION_NONE = "Kikapcsolva";

const IB_CONFIG_VERBOSE_LOGGING_TITLE = "Részletesebb logolás";
const IB_CONFIG_VERBOSE_LOGGING_DESCRIPTION =
`Be- vagy kikapcsolja az extra infók logolását a konzolra (F12 vagy Ctrl+Shift+I).
Hibakereséshez hasznos (ha tudod mit csinálsz), de a működést nem befolyásolja.<br/>
Megjegyzés: a script mindenképpen logolni fogja a figyelmeztetéseket (warn) és a hibákat (error), függetlenül ettől a beállítástól.`;
const IB_CONFIG_VERBOSE_LOGGING_LABEL = "Részletesebb logolás engedélyezése";

const IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER = "removeHiglightingBorder";
const IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT = "removeHighlightingText";
const IB_CONFIG_KEY_UNFITTING_HANDLING_MODE = "unfittingHandlingMode";
const IB_CONFIG_KEY_DEFAULT_SORT = "defaultSort";
const IB_CONFIG_KEY_VERBOSE_LOGGING = "verboseLogging";

const IB_CONFIG_DEFAULT_VALUE_REMOVE_HIGHLIGHTING_BORDER = true;
const IB_CONFIG_DEFAULT_VALUE_REMOVE_HIGHLIGHTING_TEXT = true;
const IB_CONFIG_DEFAULT_VALUE_UNFITTING_HANDLING_MODE = IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_FADE;
const IB_CONFIG_DEFAULT_VALUE_DEFAULT_SORT = IB_CONFIG_DEFAULT_SORT_OPTION_NONE;
const IB_CONFIG_DEFAULT_VALUE_VERBOSE_LOGGING = false;

const IB_CONFIG_HUN_RESET_LINK_TEXT = "Alapértelmezett értékek";
const IB_CONFIG_HUN_CLOSE_BUTTON_TEXT = "Bezárás";
const IB_CONFIG_HUN_SAVE_BUTTON_TEXT = "Mentés";

const IB_CONFIG_STYLE =
`
/* IB custom styles */
#${IB_CONFIG_ID} /* Applies to the full config modal window. */
{
    position: fixed;
    display: block;
    height: 85%;
    width: 50%;
    top: 48px; /* Same height as the website's header */
    left: 25%;
    right: auto;
    bottom: auto;
    margin: 0px;
    border: none;
    padding: 10px;
    overflow: auto;
    z-index: 1048576;
    background-color: #151515;
    color: #EEEEEE;

    box-shadow:
        0 25px 75px rgba(0, 0, 0, 0.55),
        0 10px 25px rgba(0, 0, 0, 0.30);
    
    #iBesullyesztoConfig_header
    {
        background-color: #5500BB;
        color: #00EE00;
    }

    #iBesullyesztoConfig_buttons_holder
    {
        display: flex;
        justify-content: flex-end;
    }

    /* Save and close buttons. */
    button.saveclose_buttons
    {
        min-width: 100px;
        padding: 10px 20px;
        font-weight: 600;
        border: none;
    }

    #iBesullyesztoConfig_closeBtn
    {
        order: 1;
        background-color: #757575;
        color: #EEEEEE;

        transition:
            filter 0.25s ease;
    }
    #iBesullyesztoConfig_closeBtn:hover
    {
        filter: brightness(1.1);
    }

    #iBesullyesztoConfig_saveBtn
    {
        order: 2;
        background-color: #5500BB;
        color: #00EE00;
        border: none;

        transition:
            filter 0.25s ease;
    }
    #iBesullyesztoConfig_saveBtn:hover
    {
        filter: brightness(1.1);
    }
    
    .reset_holder
    {
        align-self: center;
    }
    
    .reset
    {
        color: #EEEEEE;
        align-self: center;
        margin-right: 20px;
        text-decoration: none;

        transition:
            color 0.25s ease,
            text-decoration-color 0.15s ease;
    }
    .reset:hover
    {
        color: #FFFFFF;
        text-decoration: underline;
    }
    
    input[type="checkbox"]
    {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        border: 1px solid #555555;
        border-radius: 0px;
        cursor: pointer;

        transition:
            border-color 0.15s ease,
    }

    input[type="checkbox"]:hover
    {
        border-color: #818794;
    }

    select
    {
        width: 100%;
        max-width: 300px;
        padding: 10px 40px 10px 10px;
        background-color: #252525;
        color: #EEEEEE;
        border: 1px solid #505050;
        border-radius: 0px;
        cursor: pointer;

        transition:
            border-color 0.15s ease,
    }

    select:hover
    {
        border-color: #757575;
    }

    select option
    {
        background-color: #252525;
        color: #EEEEEE;
    }
}
`;



// -------------------------------------------------- SCRIPT CONSTANTS --------------------------------------------------
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
`
div.${IB_CLASS_NAME_HIGHLIGHTED_OUT_OF_PLACE}
{
    opacity: 25% !important;
}
`;
const IB_STYLE_DISPLAY_NONE = "none";
const IB_STYLE_DISPLAY_ORIGINAL = "block";

const IB_SELECTOR_SORT_ORDER_SELECTOR = "select.list-order";
const IB_SELECTOR_BORDER_HIGHLIGHTED_CLASS = "." + IB_HIGHLIGHTED_PRODUCT_CLASSES_TO_REMOVE[0];
const IB_SELECTOR_PRODUCT_PRICE = ".product-price";
const IB_SELECTOR_PRODUCT_CARD = ".product-card";
const IB_SELECTOR_PRODUCT_GRID = ".grid:has(" + IB_SELECTOR_PRODUCT_CARD + ")";

const IB_LOG_PREFIX = "---------- [iBesullyeszto]";



// -------------------------------------------------- HELPERS --------------------------------------------------
/** Defines, initalizes and registers the configuration modal window for IB. */
function IB_InitConfig()
{
    // Define the config modal's structure and data fields
    var configStructure =
    {
        [IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER]:
        {
            section:
            [
                IB_CONFIG_REMOVE_HIGHLIGHTING_TITLE,
                IB_CONFIG_REMOVE_HIGHLIGHTING_DESCRIPTION
            ],
            label: IB_CONFIG_REMOVE_HIGHLIGHTING_BORDER_LABEL,
            labelPos: "right",
            type: "checkbox",
            default: IB_CONFIG_DEFAULT_VALUE_REMOVE_HIGHLIGHTING_BORDER,
        },

        [IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT]:
        {
            label: IB_CONFIG_REMOVE_HIGHLIGHTING_TEXT_LABEL,
            labelPos: "right",
            type: "checkbox",
            default: IB_CONFIG_DEFAULT_VALUE_REMOVE_HIGHLIGHTING_TEXT,
        },

        [IB_CONFIG_KEY_UNFITTING_HANDLING_MODE]:
        {
            section:
            [
                IB_CONFIG_UNFITTING_HANDLE_MODE_TITLE,
                IB_CONFIG_UNFITTING_HANDLE_MODE_DESCRIPTION
            ],
            type: "select",
            options:
            [
                IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_HIDE,
                IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_FADE,
                IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_NONE,
            ],
            default: IB_CONFIG_DEFAULT_VALUE_UNFITTING_HANDLING_MODE,
        },

        [IB_CONFIG_KEY_DEFAULT_SORT]:
        {
            section:
            [
                IB_CONFIG_DEFAULT_SORT_TITLE,
                IB_CONFIG_DEFAULT_SORT_DESCRIPTION
            ],
            type: "select",
            options:
            [
                IB_CONFIG_DEFAULT_SORT_OPTION_ASC,
                IB_CONFIG_DEFAULT_SORT_OPTION_DESC,
                IB_CONFIG_DEFAULT_SORT_OPTION_NONE,
            ],
            default: IB_CONFIG_DEFAULT_VALUE_DEFAULT_SORT,
        },

        [IB_CONFIG_KEY_VERBOSE_LOGGING]:
        {
            section:
            [
                IB_CONFIG_VERBOSE_LOGGING_TITLE,
                IB_CONFIG_VERBOSE_LOGGING_DESCRIPTION
            ],
            label: IB_CONFIG_VERBOSE_LOGGING_LABEL,
            labelPos: "right",
            type: "checkbox",
            default: IB_CONFIG_DEFAULT_VALUE_VERBOSE_LOGGING,
        }
    };

    // Initalize the configuration modal
    GM_config.init(
    {
        id: IB_CONFIG_ID,
        title: IB_CONFIG_TITLE,
        fields: configStructure,
        events:
        {
            open: () =>
            {
                IB_LogInfo("iBesullyeszto settings opened.");
            },
            save: () =>
            {
                GM_setValue(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER, GM_config.get(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER));
                GM_setValue(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT,   GM_config.get(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT));
                GM_setValue(IB_CONFIG_KEY_UNFITTING_HANDLING_MODE,    GM_config.get(IB_CONFIG_KEY_UNFITTING_HANDLING_MODE));
                GM_setValue(IB_CONFIG_KEY_DEFAULT_SORT,               GM_config.get(IB_CONFIG_KEY_DEFAULT_SORT));
                GM_setValue(IB_CONFIG_KEY_VERBOSE_LOGGING,            GM_config.get(IB_CONFIG_KEY_VERBOSE_LOGGING));

                IB_LogInfo("Settings saved with the following keys and values:",
                {
                    [IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER]: GM_getValue(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER),
                    [IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT]:   GM_getValue(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT),
                    [IB_CONFIG_KEY_UNFITTING_HANDLING_MODE]:    GM_getValue(IB_CONFIG_KEY_UNFITTING_HANDLING_MODE),
                    [IB_CONFIG_KEY_DEFAULT_SORT]:               GM_getValue(IB_CONFIG_KEY_DEFAULT_SORT),
                    [IB_CONFIG_KEY_VERBOSE_LOGGING]:            GM_getValue(IB_CONFIG_KEY_VERBOSE_LOGGING)
                });

                window.location.reload(); // Reload the page to apply the new settings
            },
        },
        frame: document.body.appendChild(document.createElement("div")),
        css: IB_CONFIG_STYLE
    });

    // Register menu command to open the configuration modal
    GM_registerMenuCommand(IB_CONFIG_MENU_TITLE, IB_OpenConfigModal, IB_CONFIG_MENU_SHORTCUT);
}

/** Opens the configuration modal and removes default GM_config styling. */
function IB_OpenConfigModal()
{
    // Open the modal
    GM_config.open();

    // After opening has inserted the modal into the DOM we need to make some changes on it
    var configModal = document.querySelector(`#${IB_CONFIG_ID}`);
    if (configModal)
    {
        // Remove the default styling that GM_config adds, since we have our own defined
        configModal.removeAttribute("style");

        // "Hungarianize" reset link text ;)
        var resetLink = configModal.querySelector(`#${IB_CONFIG_ID}_resetLink`);
        if (resetLink)
        {
            resetLink.textContent = IB_CONFIG_HUN_RESET_LINK_TEXT;
        }
        else
        {
            IB_LogError("Cannot find reset link in DOM after opening it!");
        }

        // "Hungarianize" close button text ;)
        var closeButton = configModal.querySelector(`#${IB_CONFIG_ID}_closeBtn`);
        if (closeButton)
        {
            closeButton.textContent = IB_CONFIG_HUN_CLOSE_BUTTON_TEXT;
        }
        else
        {
            IB_LogError("Cannot find close button in DOM after opening it!");
        }

        // "Hungarianize" save button text ;)
        var saveButton = configModal.querySelector(`#${IB_CONFIG_ID}_saveBtn`);
        if (saveButton)
        {
            saveButton.textContent = IB_CONFIG_HUN_SAVE_BUTTON_TEXT;
        }
        else
        {
            IB_LogError("Cannot find save button in DOM after opening it!");
        }
    }
    else
    {
        IB_LogError("Cannot find configuration modal in DOM after opening it!");
    }
}

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

    return sortDirection === IB_CONFIG_DEFAULT_SORT_OPTION_ASC ? priceA - priceB : priceB - priceA;
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
            IB_LogInfo(`Found "${selectedOption.value}" selected option in grid header, using sort direction: "${IB_CONFIG_DEFAULT_SORT_OPTION_ASC}".`);
            return IB_CONFIG_DEFAULT_SORT_OPTION_ASC;

        case IB_SEARCH_PARAM_SORT_ORDER_DESC:
            IB_LogInfo(`Found "${selectedOption.value}" selected option in grid header, using sort direction: "${IB_CONFIG_DEFAULT_SORT_OPTION_DESC}".`);
            return IB_CONFIG_DEFAULT_SORT_OPTION_DESC;

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
            IB_LogInfo(`Found "${sortParam}" parameter in URL, using sort direction: "${IB_CONFIG_DEFAULT_SORT_OPTION_ASC}".`);
            return IB_CONFIG_DEFAULT_SORT_OPTION_ASC;

        case IB_SEARCH_PARAM_SORT_ORDER_DESC:
            IB_LogInfo(`Found "${sortParam}" parameter in URL, using sort direction: "${IB_CONFIG_DEFAULT_SORT_OPTION_DESC}".`);
            return IB_CONFIG_DEFAULT_SORT_OPTION_DESC;

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
    if (GM_getValue(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_BORDER))
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
    if (GM_getValue(IB_CONFIG_KEY_REMOVE_HIGHLIGHTING_TEXT))
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
    if (GM_getValue(IB_CONFIG_KEY_UNFITTING_HANDLING_MODE) === IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_FADE)
    {
        var ibCss = document.createElement("style");
        ibCss.type = "text/css";
        ibCss.innerHTML = IB_CSS_STYLE_HIGHLIGHTED_OUT_OF_PLACE;
        document.head.appendChild(ibCss);
    }
}

/** Logs an info message to the console with a prefix if extra logging is enabled in settings. */
function IB_LogInfo(message, obj)
{
    if (!GM_getValue(IB_CONFIG_KEY_VERBOSE_LOGGING))
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
        highlightedCards = allCards.filter(card =>  IB_IsTagged(card));
        normalCards      = allCards.filter(card => !IB_IsTagged(card));

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
            IB_LogWarn(`Failed to determine sort direction from grid header or URL, attempting to use default ordering direction: "${GM_getValue(IB_CONFIG_KEY_DEFAULT_SORT)}".`);

            sortDirection = GM_getValue(IB_CONFIG_KEY_DEFAULT_SORT);
            if (sortDirection !== IB_CONFIG_DEFAULT_SORT_OPTION_ASC && sortDirection !== IB_CONFIG_DEFAULT_SORT_OPTION_DESC)
            {
                IB_LogError("Failed to determine sort direction, ordering is skipped!");
                return;
            }
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
                (sortDirection === IB_CONFIG_DEFAULT_SORT_OPTION_ASC  && highlightedPrice > maxNormalPrice) ||
                (sortDirection === IB_CONFIG_DEFAULT_SORT_OPTION_DESC && highlightedPrice < minNormalPrice);

            if (isHighlightedPriceOutsideNormalRange)
            {
                switch (GM_getValue(IB_CONFIG_KEY_UNFITTING_HANDLING_MODE))
                {
                    case IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_HIDE:
                        highlightedCard.style.display = IB_STYLE_DISPLAY_NONE;
                        IB_LogInfo(`Found highlighted card with price of ${highlightedPrice} outside price range and hid it.`);
                        break;
                    case IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_FADE:
                        highlightedCard.classList.add(IB_CLASS_NAME_HIGHLIGHTED_OUT_OF_PLACE);
                        IB_LogInfo(`Found highlighted card with price of ${highlightedPrice} outside price range and applied custom style on it.`);
                        break;
                    case IB_CONFIG_UNFITTING_HANDLE_MODE_OPTION_NONE:
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



// Initialize the configuration modal
IB_InitConfig();



// Start observing the document body for changes to find the product grid (this triggers the main logic observer once the grid is found)
IB_pageLoadObserver.observe(document.body,
    {
        childList: true,
        subtree: true
    });
