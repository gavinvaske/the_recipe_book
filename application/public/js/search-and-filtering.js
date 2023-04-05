function findSearchableText(htmlElement) {
    const searchableItems = htmlElement.find('.searchable');
    let searchableText = '';

    searchableItems && searchableItems.each(function() {
        searchableText += $(this).text() + ' ';
    });

    return searchableText.toUpperCase();
};

function showAllNeccessaryTables(tables) {
    tables.each(function() {
        const table = $(this);
        const tableRows = $(this).find('.table-row');

        if (tableRows.length === 0) {
            return true;
        }

        table.show();

        tableRows.each(function() {
            const row = $(this);
            row.show();
        })
    })
};

$('.search-input').on('keyup', function() {
    const searchQuery = $(this).val().toUpperCase();
    const tables = $('.status-section');

    if (!searchQuery) {
        showAllNeccessaryTables(tables);
        return;
    } 
    
    tables && tables.each(function() {
        const table = $(this);
        let shouldRenderTable = false;

        const rows = $(this).find('.table-row');
        
        rows && rows.each(function() {
            const row = $(this);

            const searchableText = findSearchableText(row)
            const isRowAMatch = searchableText.includes(searchQuery)

            if (isRowAMatch) {
                row.show();
                shouldRenderTable = true;
            } else {
                row.hide();
            }
        });

        shouldRenderTable === true ? table.show() : table.hide();
    });
});