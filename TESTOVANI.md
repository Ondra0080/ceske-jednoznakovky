# Praktický test verze 1.1.0 v Illustratoru 2026

Testujte na novém dokumentu nebo kopii existujícího souboru. Scénáře níže slouží ke kontrole chování po instalaci nebo při dalších úpravách skriptu.

1. Vytvořte texty `A doma` (běžný), `K práci` (zamčený textový objekt), `V lese` (skrytý textový objekt) a `S vámi` (textový objekt současně zamčený a skrytý). Dále vytvořte `O domě` ve skryté nebo zamčené skupině a `U vás` ve skryté nebo zamčené vrstvě. Poznamenejte původní zámky a viditelnost.
2. Spusťte JSX přes **File > Scripts > Other Script…**. Při volbě **Vybrané textové objekty** mají být přepínače **Zamčené texty** a **Skryté texty** nedostupné. Po volbě **Celý dokument** mají být dostupné a vypnuté. Žádné další přepínače pro skupiny nebo vrstvy se nemají zobrazit.
3. Nechte oba přepínače vypnuté a klikněte na **Opravit**. Očekává se **1 oprava** v `A doma`.
4. Znovu spusťte skript a zapněte pouze **Zamčené texty**. Očekává se **1 oprava** v `K práci`.
5. Zapněte pouze **Skryté texty**. Očekává se **1 oprava** v `V lese`.
6. Zapněte oba přepínače. Očekává se **1 oprava** v `S vámi`. Texty `O domě` a `U vás` musejí zůstat beze změny, protože skript skupiny ani vrstvy neodemyká a nezobrazuje.
7. Zkontrolujte, že po každém běhu zůstaly původní zámky a viditelnost textových objektů, skupin a vrstev zachované. V souhrnu má být **0** objektů s neobnoveným stavem. Opakované spuštění obou voleb má hlásit **0 oprav**.
8. Zkuste rozdílné místní formátování před a za opravovanou mezerou. Zkontrolujte zachování fontu, barvy a dalších stylů. Na kopii dokumentu vyzkoušejte **Úpravy > Zpět** nebo panel Historie a zkontrolujte také zámky a viditelnost.

Při potížích zaznamenejte přesnou verzi Illustratoru, znění chyby, čísla ve výsledném dialogu a stručný popis testovaného objektu. Screenshot dialogu a malý ukázkový soubor AI bez citlivých dat pomohou chybu zopakovat.
