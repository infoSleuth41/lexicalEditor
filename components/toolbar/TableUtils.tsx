import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    LexicalNode,
} from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
    $createTableCellNode,
    $createTableRowNode,
    $createTableNode,
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
    if (!row || !$isTableRowNode(row)) throw new Error("Table cell has no row parent");
    return row;
}



export function $getTableFromRow(row: TableRowNode): TableNode {
    const table = row.getParent();
    if (!table || !$isTableNode(table)) throw new Error("Table row has no table parent");
    return table;
}



export function $getRows(table: TableNode): TableRowNode[] {
    return table.getChildren().filter($isTableRowNode) as TableRowNode[];
}

export function $getCells(row: TableRowNode): TableCellNode[] {
    return row.getChildren().filter($isTableCellNode) as TableCellNode[];
}



export function $getRowIndex(row: TableRowNode): number {
    const rows = $getRows($getTableFromRow(row));
    return rows.findIndex((r) => r.getKey() === row.getKey());
}

interface CellInfo {
    cell: TableCellNode;
    rowStart: number;
    colStart: number;
    rowSpan: number;
    colSpan: number;
}

interface TableGrid {
    grid: (CellInfo | undefined)[][]; // grid[row][col] -> occupying cell's info
    infoByKey: Map<string, CellInfo>; // cell key -> its own origin info
    totalCols: number;
}

function $buildTableGrid(table: TableNode): TableGrid {
    const rows = $getRows(table);
    const rowCount = rows.length;
    const grid: (CellInfo | undefined)[][] = Array.from({ length: rowCount }, () => []);
    const infoByKey = new Map<string, CellInfo>();

    rows.forEach((row, rowIndex) => {
        const cells = $getCells(row);
        let colCursor = 0;
        for (const cell of cells) {
            while (grid[rowIndex][colCursor] !== undefined) colCursor++;
            const colSpan = cell.getColSpan();
            const rowSpan = cell.getRowSpan();
            const info: CellInfo = { cell, rowStart: rowIndex, colStart: colCursor, rowSpan, colSpan };
            infoByKey.set(cell.getKey(), info);
            for (let r = 0; r < rowSpan; r++) {
                const rr = rowIndex + r;
                if (rr >= rowCount) continue;
                for (let c = 0; c < colSpan; c++) {
                    grid[rr][colCursor + c] = info;
                }
            }
            colCursor += colSpan;
        }
    });
    const totalCols = grid.reduce((max, row) => Math.max(max, row.length), 0);
    return { grid, infoByKey, totalCols };
}

export function $getColumnIndex(cell: TableCellNode): number {
    const table = $getTableFromRow($getRowFromCell(cell));
    const { infoByKey } = $buildTableGrid(table);
    return infoByKey.get(cell.getKey())?.colStart ?? 0;
}

export function $isHeaderRow(row: TableRowNode): boolean {
    const cells = $getCells(row);
    if (cells.length === 0) return false;
    return cells.every((c) => (c.getHeaderStyles() & TableCellHeaderStates.ROW) !== 0);
}

export function $getHeaderRowCount(table: TableNode): number {
    const rows = $getRows(table);
    let count = 0;
    for (const row of rows) {
        if ($isHeaderRow(row)) count++;
        else break;
    }
    return count;
}

export function $toggleRowHeader(row: TableRowNode) {
    const makeHeader = !$isHeaderRow(row);
    $getCells(row).forEach((cell) => {
        const current = cell.getHeaderStyles();
        cell.setHeaderStyles(
            makeHeader ? current | TableCellHeaderStates.ROW : current & ~TableCellHeaderStates.ROW
        );
    });
}

function $stripColumnHeaderState(cell: TableCellNode) {
    const current = cell.getHeaderStyles();
    if (current & TableCellHeaderStates.COLUMN) {
        cell.setHeaderStyles(current & ~TableCellHeaderStates.COLUMN);
    }
}

export function $stripAllColumnHeaders(table: TableNode) {
    $getRows(table).forEach((row) => $getCells(row).forEach($stripColumnHeaderState));
}

function $createEmptyCell(isHeader = false): TableCellNode {
    const state = isHeader ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS;
    const cell = $createTableCellNode(state).append($createParagraphNode());
    $stripColumnHeaderState(cell);
    return cell;
}

export function $canDeleteRow(row: TableRowNode): boolean {
    const table = $getTableFromRow(row);
    const rows = $getRows(table);
    if (rows.length <= 1) return false;
    if ($isHeaderRow(row)) {
        const headerRows = rows.filter($isHeaderRow);
        if (headerRows.length <= 1) return false;
    }
    return !$getCells(row).some((c) => c.getRowSpan() > 1);
}

export function $insertRow(row: TableRowNode, position: "above" | "below"): boolean {
    const table = $getTableFromRow(row);
    const headerCount = $getHeaderRowCount(table);
    const rowIndex = $getRowIndex(row);
    if (position === "above" && rowIndex < headerCount) return false;
    const insertAtRow = position === "above" ? rowIndex : rowIndex + 1;
    const { grid, totalCols } = $buildTableGrid(table);
    const grown = new Set<string>();
    const needsNewCell: boolean[] = [];
    for (let c = 0; c < totalCols; c++) {
        const aboveSlot = grid[insertAtRow - 1]?.[c];
        const spansThrough = aboveSlot && aboveSlot.rowStart + aboveSlot.rowSpan > insertAtRow;
        if (spansThrough && aboveSlot) {
            if (!grown.has(aboveSlot.cell.getKey())) {
                grown.add(aboveSlot.cell.getKey());
                aboveSlot.cell.setRowSpan(aboveSlot.rowSpan + 1);
            }
            needsNewCell.push(false);
        } else {
            needsNewCell.push(true);
        }
    }
    const newRow = $createTableRowNode();
    needsNewCell.forEach((needed) => {
        if (needed) newRow.append($createEmptyCell(false));
    });
    if (position === "above") row.insertBefore(newRow);
    else row.insertAfter(newRow);
    return true;
}

export function $deleteRow(row: TableRowNode): boolean {
    if (!$canDeleteRow(row)) return false;
    const table = $getTableFromRow(row);
    const rowIndex = $getRowIndex(row);
    const { grid, totalCols } = $buildTableGrid(table);
    const gridRow = grid[rowIndex] ?? [];
    const shrunk = new Set<string>();
    for (let c = 0; c < totalCols; c++) {
        const slot = gridRow[c];
        if (slot && slot.rowSpan > 1 && !shrunk.has(slot.cell.getKey())) {
            shrunk.add(slot.cell.getKey());
            slot.cell.setRowSpan(slot.rowSpan - 1);
        }
    }
    row.remove();
    return true;
}

export function $canDeleteColumn(table: TableNode, columnIndex: number): boolean {
    const { grid } = $buildTableGrid(table);
    for (const gridRow of grid) {
        const slot = gridRow[columnIndex];
        if (slot && slot.colSpan > 1 && slot.colStart === columnIndex) return false;
    }
    return true;
}

export function $insertColumn(table: TableNode, columnIndex: number, position: "left" | "right") {
    const insertAtCol = position === "left" ? columnIndex : columnIndex + 1;
    const { grid, infoByKey } = $buildTableGrid(table);
    const rows = $getRows(table);
    const processed = new Set<string>();

    rows.forEach((row, rowIndex) => {
        const gridRow = grid[rowIndex] ?? [];
        const leftInfo = insertAtCol > 0 ? gridRow[insertAtCol - 1] : undefined;

        if (leftInfo && leftInfo.colStart + leftInfo.colSpan > insertAtCol) {
            if (!processed.has(leftInfo.cell.getKey())) {
                processed.add(leftInfo.cell.getKey());
                leftInfo.cell.setColSpan(leftInfo.colSpan + 1);
            }
            return;
        }
        const cells = $getCells(row);
        const target = cells.find((c) => {
            const info = infoByKey.get(c.getKey());
            return info !== undefined && info.colStart >= insertAtCol;
        });
        const newCell = $createEmptyCell($isHeaderRow(row));
        if (target) target.insertBefore(newCell);
        else row.append(newCell);
    });
}

export function $deleteColumn(table: TableNode, columnIndex: number): boolean {
    const { grid, totalCols } = $buildTableGrid(table);
    if (totalCols <= 1) {
        table.remove();
        return true;
    }
    if (!$canDeleteColumn(table, columnIndex)) return false;

    const rows = $getRows(table);
    const shrunk = new Set<string>();
    rows.forEach((row, rowIndex) => {
        const slot = grid[rowIndex]?.[columnIndex];
        if (!slot) return;
        if (slot.colSpan > 1) {
            if (!shrunk.has(slot.cell.getKey())) {
                shrunk.add(slot.cell.getKey());
                slot.cell.setColSpan(slot.colSpan - 1);
            }
        } else {
            slot.cell.remove();
        }
    });
    return true;
}

function $unionHeaderState(cells: TableCellNode[]): number {
    return cells.reduce((acc, c) => acc | c.getHeaderStyles(), 0);
}

export function $mergeCellDown(cell: TableCellNode): boolean {
    const table = $getTableFromRow($getRowFromCell(cell));
    const { grid, infoByKey } = $buildTableGrid(table);
    const info = infoByKey.get(cell.getKey());
    if (!info) return false;

    const targetRow = info.rowStart + info.rowSpan;
    if (targetRow >= grid.length) return false;

    const targetRowGrid = grid[targetRow] ?? [];
    const below = new Set<TableCellNode>();
    for (let c = info.colStart; c < info.colStart + info.colSpan; c++) {
        const slot = targetRowGrid[c];
        if (!slot) return false;
        below.add(slot.cell);
    }

    let minCol = Infinity;
    let maxCol = -Infinity;
    let maxRowSpan = 1;
    for (const belowCell of below) {
        const belowInfo = infoByKey.get(belowCell.getKey())!;
        if (belowInfo.rowStart !== targetRow) return false; // mid-span cell, ambiguous
        minCol = Math.min(minCol, belowInfo.colStart);
        maxCol = Math.max(maxCol, belowInfo.colStart + belowInfo.colSpan);
        maxRowSpan = Math.max(maxRowSpan, belowInfo.rowSpan);
    }
    if (minCol !== info.colStart || maxCol !== info.colStart + info.colSpan) {
        return false; // doesn't tile cleanly — refuse rather than corrupt the grid
    }

    cell.setHeaderStyles($unionHeaderState([cell, ...below]));
    $stripColumnHeaderState(cell);
    cell.setRowSpan(info.rowSpan + maxRowSpan);
    below.forEach((b) => b.remove());
    return true;
}

export function $mergeCellRight(cell: TableCellNode): boolean {
    const table = $getTableFromRow($getRowFromCell(cell));
    const { grid, infoByKey, totalCols } = $buildTableGrid(table);
    const info = infoByKey.get(cell.getKey());
    if (!info) return false;

    const targetCol = info.colStart + info.colSpan;
    if (targetCol >= totalCols) return false;

    const right = new Set<TableCellNode>();
    for (let r = info.rowStart; r < info.rowStart + info.rowSpan; r++) {
        const slot = grid[r]?.[targetCol];
        if (!slot) return false;
        right.add(slot.cell);
    }

    let minRow = Infinity;
    let maxRow = -Infinity;
    let maxColSpan = 1;
    for (const rightCell of right) {
        const rightInfo = infoByKey.get(rightCell.getKey())!;
        if (rightInfo.colStart !== targetCol) return false; // mid-span cell, ambiguous
        minRow = Math.min(minRow, rightInfo.rowStart);
        maxRow = Math.max(maxRow, rightInfo.rowStart + rightInfo.rowSpan);
        maxColSpan = Math.max(maxColSpan, rightInfo.colSpan);
    }
    if (minRow !== info.rowStart || maxRow !== info.rowStart + info.rowSpan) {
        return false;
    }

    cell.setHeaderStyles($unionHeaderState([cell, ...right]));
    $stripColumnHeaderState(cell);
    cell.setColSpan(info.colSpan + maxColSpan);
    right.forEach((r) => r.remove());
    return true;
}

export function $splitCell(cell: TableCellNode) {
    const row = $getRowFromCell(cell);
    const table = $getTableFromRow(row);
    const { infoByKey } = $buildTableGrid(table);
    const info = infoByKey.get(cell.getKey());
    if (!info) return;

    const { rowStart, colStart, rowSpan, colSpan } = info;
    const isHeader = $isHeaderRow(row);

    cell.setColSpan(1);
    cell.setRowSpan(1);

    for (let i = 1; i < colSpan; i++) {
        cell.insertAfter($createEmptyCell(isHeader));
    }

    if (rowSpan > 1) {
        const rows = $getRows(table);
        for (let r = 1; r < rowSpan; r++) {
            const targetRow = rows[rowStart + r];
            if (!targetRow) continue;
            const { infoByKey: freshInfo } = $buildTableGrid(table);
            const targetCells = $getCells(targetRow);
            const insertBefore = targetCells.find((c) => {
                const ci = freshInfo.get(c.getKey());
                return ci !== undefined && ci.colStart >= colStart;
            });
            for (let i = 0; i < colSpan; i++) {
                const newCell = $createEmptyCell($isHeaderRow(targetRow));
                if (insertBefore) insertBefore.insertBefore(newCell);
                else targetRow.append(newCell);
            }
        }
    }
}

export function $createSimpleTable(rows: number, columns: number): TableNode {
    const table = $createTableNode();
    for (let r = 0; r < rows; r++) {
        const row = $createTableRowNode();
        for (let c = 0; c < columns; c++) row.append($createEmptyCell(r === 0));
        table.append(row);
    }
    $stripAllColumnHeaders(table);
    return table;
}

export function $insertSimpleTable(rows: number, columns: number) {
    const table = $createSimpleTable(rows, columns);
    $insertNodeToNearestRoot(table);
    const firstCell = $getCells($getRows(table)[0]);
    firstCell[0]?.selectStart();
}