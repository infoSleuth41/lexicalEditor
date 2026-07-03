import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalNode } from "lexical";
import {
    $createTableCellNode,
    $createTableRowNode,
    $isTableCellNode,
    $isTableRowNode,
    $isTableNode,
    TableCellNode,
    TableRowNode,
    TableNode,
    TableCellHeaderStates,
} from "@lexical/table";

export function $getTableCellFromSelection(): TableCellNode | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;
    let node: LexicalNode | null = selection.anchor.getNode();
    while (node !== null) {
        if ($isTableCellNode(node)) return node;
        node = node.getParent();
    }
    return null;
}

export function $getRowFromCell(cell: TableCellNode): TableRowNode {
    const row = cell.getParent();
    if (!row || !$isTableRowNode(row)) {
        throw new Error("Table cell has no row parent");
    }
    return row;
}

export function $getTableFromRow(row: TableRowNode): TableNode {
    const table = row.getParent();
    if (!table || !$isTableNode(table)) {
        throw new Error("Table row has no table parent");
    }
    return table;
}

export function $getColumnIndex(cell: TableCellNode): number {
    const row = $getRowFromCell(cell);
    const cells = row.getChildren().filter($isTableCellNode) as TableCellNode[];
    return cells.indexOf(cell);
}

function $createEmptyCell(): TableCellNode {
    return $createTableCellNode(TableCellHeaderStates.NO_STATUS).append($createParagraphNode());
}

export function $insertRow(row: TableRowNode, position: "above" | "below") {
    const columnCount = row.getChildrenSize();
    const newRow = $createTableRowNode();
    for (let i = 0; i < columnCount; i++) {
        newRow.append($createEmptyCell());
    }
    if (position === "above") {
        row.insertBefore(newRow);
    } else {
        row.insertAfter(newRow);
    }
}

export function $insertColumn(table: TableNode, columnIndex: number, position: "left" | "right") {
    const rows = table.getChildren().filter($isTableRowNode) as TableRowNode[];
    rows.forEach((row) => {
        const cells = row.getChildren().filter($isTableCellNode) as TableCellNode[];
        const targetCell = cells[columnIndex];
        if (!targetCell) return;
        const newCell = $createEmptyCell();
        if (position === "left") {
            targetCell.insertBefore(newCell);
        } else {
            targetCell.insertAfter(newCell);
        }
    });
}

export function $deleteRow(row: TableRowNode) {
    const table = $getTableFromRow(row);
    const rowCount = table.getChildrenSize();
    if (rowCount <= 1) {
        table.remove();
    } else {
        row.remove();
    }
}

export function $deleteColumn(table: TableNode, columnIndex: number) {
    const rows = table.getChildren().filter($isTableRowNode) as TableRowNode[];
    const columnCount = rows[0]?.getChildrenSize() ?? 0;
    if (columnCount <= 1) {
        table.remove();
        return;
    }
    rows.forEach((row) => {
        const cells = row.getChildren().filter($isTableCellNode) as TableCellNode[];
        const targetCell = cells[columnIndex];
        targetCell?.remove();
    });
}