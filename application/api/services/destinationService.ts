export function groupItemsByDestination(items) {
    const itemsGroupedByDestination = {};

    items.forEach((item) => {
        if (!item.destination) return;

        const {department, departmentStatus} = item.destination;

        if (!department || !departmentStatus) return;

        if (!itemsGroupedByDestination[department]) itemsGroupedByDestination[department] = {};

        if (!itemsGroupedByDestination[department][departmentStatus]) itemsGroupedByDestination[department][departmentStatus] = [];

        itemsGroupedByDestination[department][departmentStatus].push(item);
    });

    return itemsGroupedByDestination;
}