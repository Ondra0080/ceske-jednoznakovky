#target illustrator

/* Czech One-Letter Words for Illustrator 1.1.1 */
(function () {
    var VERSION = "1.1.1";
    var NON_BREAKING_SPACE = "\u00A0";
    var LETTERS = "ksvzouaiKSVZOUAI";
    var ui = {
        title: "České jednoznakovky",
        scope: "Rozsah opravy",
        selected: "Vybrané textové objekty",
        document: "Celý dokument",
        includeLockedTexts: "Zamčené texty",
        includeHiddenTexts: "Skryté texty",
        fix: "Opravit",
        cancel: "Zrušit",
        noDocument: "Nejprve otevřete dokument.",
        noSelection: "Nejsou vybrané žádné textové objekty.",
        result: "Opravených mezer: ",
        processed: "Zpracovaných textových objektů: ",
        skipped: "Přeskočených zamčených, skrytých nebo neupravitelných objektů: ",
        failed: "Objektů s chybou: ",
        restoreFailed: "Objektů s neobnoveným zámkem nebo viditelností: ",
        undo: "Změny lze vracet přes Úpravy > Zpět. Podle historie Illustratoru může být potřeba více kroků.",
        error: "Při zpracování některých objektů nastala chyba. Zkontrolujte dokument a případně použijte Úpravy > Zpět.",
        restoreError: "U některých textových objektů se nepodařilo obnovit původní zámek nebo viditelnost. Zkontrolujte je před uložením dokumentu."
    };

    function isOneLetterWord(character) {
        return character.length === 1 && LETTERS.indexOf(character) !== -1;
    }

    function isWordStart(previousCharacter) {
        return previousCharacter === null || /[\s\u00A0(\[{„“"«]/.test(previousCharacter);
    }

    function isAvailable(item) {
        var current = item;
        while (current && current.typename !== "Document") {
            if (current.typename === "Layer") {
                if (current.locked || !current.visible) {
                    return false;
                }
            } else {
                if (current.locked || current.hidden || current.editable === false) {
                    return false;
                }
            }
            current = current.parent;
        }
        return true;
    }

    function isAllowed(item, options) {
        var current = item;
        while (current && current.typename !== "Document") {
            if (current === item) {
                if ((current.locked && !options.lockedTexts) ||
                    (current.hidden && !options.hiddenTexts)) {
                    return false;
                }
            } else if (current.typename === "Layer") {
                if (current.locked || !current.visible) {
                    return false;
                }
            } else {
                if (current.locked || current.hidden) {
                    return false;
                }
            }
            current = current.parent;
        }
        return true;
    }

    function revealForEdit(item, states) {
        var state = {item: item, locked: item.locked, hidden: item.hidden};
        if (state.locked || state.hidden) {
            states.push(state);
            if (state.locked) {
                item.locked = false;
            }
            if (state.hidden) {
                item.hidden = false;
            }
        }
    }

    function restoreStates(states) {
        var failed = false;
        var i;
        var state;
        for (i = states.length - 1; i >= 0; i--) {
            state = states[i];
            try {
                state.item.hidden = state.hidden;
            } catch (error) {
                failed = true;
            }
            try {
                state.item.locked = state.locked;
            } catch (error2) {
                failed = true;
            }
        }
        return !failed;
    }

    function addSelectedText(item, targets) {
        var i;
        if (!item || !isAvailable(item)) {
            return;
        }
        if (item.typename === "TextFrame") {
            targets.push(item);
        } else if (item.typename === "GroupItem") {
            for (i = 0; i < item.textFrames.length; i++) {
                targets.push(item.textFrames[i]);
            }
            for (i = 0; i < item.groupItems.length; i++) {
                addSelectedText(item.groupItems[i], targets);
            }
        }
    }

    function getTargets(document, wholeDocument) {
        var targets = [];
        var source = wholeDocument ? document.textFrames : document.selection;
        var i;
        if (!source || source.typename === "TextRange") {
            return targets;
        }
        for (i = 0; i < source.length; i++) {
            if (wholeDocument) {
                targets.push(source[i]);
            } else {
                addSelectedText(source[i], targets);
            }
        }
        return targets;
    }

    function fixFrame(frame, result) {
        var characters = frame.textRange.characters;
        var i;
        var previous;
        var current;
        var next;
        for (i = characters.length - 2; i >= 0; i--) {
            current = characters[i].contents;
            if (!isOneLetterWord(current)) {
                continue;
            }
            next = characters[i + 1].contents;
            if (next !== " ") {
                continue;
            }
            previous = i === 0 ? null : characters[i - 1].contents;
            if (!isWordStart(previous)) {
                continue;
            }
            characters[i + 1].contents = NON_BREAKING_SPACE;
            result.fixes++;
        }
    }

    if (app.documents.length === 0) {
        alert(ui.noDocument, ui.title);
        return;
    }

    var dialog = new Window("dialog", ui.title + " — " + VERSION);
    dialog.orientation = "column";
    dialog.alignChildren = "left";
    var scopePanel = dialog.add("panel", undefined, ui.scope);
    scopePanel.orientation = "column";
    scopePanel.alignChildren = "left";
    scopePanel.margins = 16;
    var selectedOption = scopePanel.add("radiobutton", undefined, ui.selected);
    var documentOption = scopePanel.add("radiobutton", undefined, ui.document);
    var lockedTextsOption = scopePanel.add("checkbox", undefined, ui.includeLockedTexts);
    var hiddenTextsOption = scopePanel.add("checkbox", undefined, ui.includeHiddenTexts);
    var accessOptions = [lockedTextsOption, hiddenTextsOption];
    selectedOption.value = true;
    var optionIndex;
    for (optionIndex = 0; optionIndex < accessOptions.length; optionIndex++) {
        accessOptions[optionIndex].value = false;
        accessOptions[optionIndex].enabled = false;
    }
    selectedOption.onClick = function () {
        for (var i = 0; i < accessOptions.length; i++) {
            accessOptions[i].enabled = false;
        }
    };
    documentOption.onClick = function () {
        for (var i = 0; i < accessOptions.length; i++) {
            accessOptions[i].enabled = true;
        }
    };
    var buttons = dialog.add("group");
    buttons.alignment = "right";
    buttons.add("button", undefined, ui.cancel, {name: "cancel"});
    buttons.add("button", undefined, ui.fix, {name: "ok"});
    if (dialog.show() !== 1) {
        return;
    }

    var document = app.activeDocument;
    var targets = getTargets(document, documentOption.value);
    if (!documentOption.value && targets.length === 0) {
        alert(ui.noSelection, ui.title);
        return;
    }

    var result = {fixes: 0, processed: 0, skipped: 0, failed: 0, restoreFailed: 0};
    var options = {
        lockedTexts: documentOption.value && lockedTextsOption.value,
        hiddenTexts: documentOption.value && hiddenTextsOption.value
    };
    var i;
    for (i = 0; i < targets.length; i++) {
        var states = [];
        try {
            if (!isAllowed(targets[i], options)) {
                result.skipped++;
                continue;
            }
            if (documentOption.value) {
                revealForEdit(targets[i], states);
            }
            if (!isAvailable(targets[i])) {
                result.skipped++;
                continue;
            }
            fixFrame(targets[i], result);
            result.processed++;
        } catch (error) {
            result.failed++;
        } finally {
            if (!restoreStates(states)) {
                result.restoreFailed++;
            }
        }
    }

    var message = ui.result + result.fixes + "\n" +
        ui.processed + result.processed + "\n" +
        ui.skipped + result.skipped + "\n" +
        ui.failed + result.failed + "\n" +
        ui.restoreFailed + result.restoreFailed;
    if (result.fixes > 0) {
        message += "\n\n" + ui.undo;
    }
    if (result.failed > 0) {
        message += "\n\n" + ui.error;
    }
    if (result.restoreFailed > 0) {
        message += "\n\n" + ui.restoreError;
    }
    alert(message, ui.title);
}());
