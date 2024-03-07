type Tuple = [number, number];

type MergedCell = {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
};

interface IMatrixManager {
    matrix: Tuple[];
    mergedCells: MergedCell[];
    dy: [0, 1, 0, -1];
    dx: [1, 0, -1, 0];
    visited: boolean[][];
}

class MatrixManger {
    private x: number;
    private y: number;
    private dx = [0, 1, 0, -1] as const;
    private dy = [1, 0, -1, 0] as const;
    matrix: Tuple[];
    activeCells: boolean[][];
    mergedCellList: MergedCell[];
    mergedCells: boolean[][];

    constructor() {
        this.x = 0;
        this.y = 0;
        this.matrix = [];
        this.activeCells = [];
        this.mergedCellList = [];
        this.mergedCells = [];
    }

    // matrix를 생성합니다.
    createMatrix = (x: number, y: number) => {
        const matrix: Tuple[] = [];
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                matrix.push([i, j]);
            }
        }
        this.x = x;
        this.y = y;
        this.matrix = matrix;
        this.activeCells = Array.from({ length: x }, () => Array(y).fill(false));
        this.mergedCellList = [];
        this.mergedCells = Array.from({ length: x }, () => Array(y).fill(false));
    };

    /**
     * @note 셀을 클릭합니다.
     */
    clickCell = (x: number, y: number) => {
        if (this.isOverflow(x, y)) return;
        this.activeCells[x][y] = !this.activeCells[x][y];

        const adjacentCells: Tuple[] = [];
        const visited = this.createVisited();

        if (this.isMergedCell(x, y)) {
            // bfs로 인접한 셀을 찾는다.
            this.walkAround(x, y, this.mergedCells, visited, (nx, ny) => adjacentCells.push([nx, ny]));

            // 머지된 셀이라면 인접한 셀이 모두 머지된 셀과 동일하게 변경된다.
            for (let cell of adjacentCells) {
                const [nx, ny] = cell;
                this.activeCells[nx][ny] = this.activeCells[x][y];
            }
        } else {
            // bfs로 인접한 셀을 찾는다.
            this.walkAround(x, y, this.activeCells, visited, (nx, ny) => adjacentCells.push([nx, ny]));

            // 머지된 셀이 아니고, 인접하지 않은 셀은 모두 false로 변경된다.
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    if (!visited[i][j]) this.activeCells[i][j] = false;
                }
            }
        }
    };

    /**
     * @note x, y 좌표와 인접한 활성화 된 셀을 머지합니다. 사각형 또는 직선인 경우에만 머지됩니다.
     */
    mergeActiveCells = (x: number, y: number) => {
        if (this.isOverflow(x, y)) return;
        const visited = this.createVisited();
        const adjacentCells: Tuple[] = [[x, y]];
        this.walkAround(x, y, this.activeCells, visited, (nx, ny) => adjacentCells.push([nx, ny]));
        const { sx, sy, ex, ey } = this.findVertex(adjacentCells);
        if (adjacentCells.length <= 1) return;
        if (adjacentCells.length === 2) {
            // * cell이 2개일 경우 머지할 수 있다.
            this.mergedCellList.push({ sx, sy, ex, ey });
            this.addMergedCell(sx, sy, ex, ey);
        } else {
            // * cell이 3개 이상일 경우 사각형인지 체크 후 머지한다.
            if (this.isRectangle(adjacentCells)) {
                this.mergedCellList.push({ sx, sy, ex, ey });
                this.addMergedCell(sx, sy, ex, ey);
            }
        }

        // * 머지가 완료되면 activeCells를 초기화한다.
        this.clearActiveCells();
    };

    /**
     * @note x, y 좌표를 포함하는 머지된 셀이 해제됩니다.
     */
    unmergeActiveCells = (x: number, y: number) => {
        if (this.isOverflow(x, y)) return;
        for (let i = 0; i < this.mergedCellList.length; i++) {
            const list = this.mergedCellList[i];
            if (this.isInside(x, y, list)) {
                this.removeMergedCell(list.sx, list.sy, list.ex, list.ey);
                this.mergedCellList.splice(i, 1);
                this.clearActiveCells();
            }
        }
    };

    /**
     * @note 모든 셀을 비활성화합니다.
     */
    clearActiveCells = () => {
        this.activeCells = Array.from({ length: this.x }, () => Array(this.y).fill(false));
    };
    // * 요기서부터는 안봐도 됨!
    private addMergedCell = (sx: number, sy: number, ex: number, ey: number) => {
        for (let i = sx; i <= ex; i++) {
            for (let j = sy; j <= ey; j++) {
                this.mergedCells[i][j] = true;
            }
        }
    };

    private removeMergedCell = (sx: number, sy: number, ex: number, ey: number) => {
        for (let i = sx; i <= ex; i++) {
            for (let j = sy; j <= ey; j++) {
                this.mergedCells[i][j] = false;
            }
        }
    };

    // 매트릭스의 범위를 벗어났는지 확인
    private isOverflow(x: number, y: number) {
        return x < 0 || x >= this.x || y < 0 || y >= this.y;
    }
    // 셀이 머지된 셀 내부에 있는지 확인
    private isInside(x: number, y: number, cell: MergedCell) {
        return cell.sx <= x && x <= cell.ex && cell.sy <= y && y <= cell.ey;
    }
    // 셀이 머지된 셀인지 확인
    private isMergedCell(x: number, y: number) {
        for (let cell of this.mergedCellList) {
            if (this.isInside(x, y, cell)) return true;
        }
        return false;
    }

    // 머지된 셀의 간선를 찾는다.
    private findVertex = (cell: Tuple[]) => {
        // prettier-ignore
        let sx = Number.MAX_SAFE_INTEGER ,sy = Number.MAX_SAFE_INTEGER,ex = Number.MIN_SAFE_INTEGER,ey = Number.MIN_SAFE_INTEGER
        for (let [x, y] of cell) {
            sx = Math.min(sx, x);
            sy = Math.min(sy, y);
            ex = Math.max(ex, x);
            ey = Math.max(ey, y);
        }

        return { sx, sy, ex, ey };
    };

    // bfs로 인접한 셀을 찾는다.
    private walkAround = (
        x: number,
        y: number,
        ground: boolean[][],
        visited: boolean[][],
        predicate: (nx: number, ny: number) => void
    ) => {
        type CoordinateTuple = { x: number; y: number };
        const queue: CoordinateTuple[] = [];
        queue.push({ x, y });
        visited[x][y] = true;
        while (queue.length !== 0) {
            const { x, y } = queue.shift() as CoordinateTuple;
            for (let i = 0; i < 4; i++) {
                const nx = x + this.dx[i];
                const ny = y + this.dy[i];
                if (this.isOverflow(nx, ny)) continue;
                if (visited[nx][ny]) continue;
                visited[nx][ny] = true;

                if (ground[nx][ny] === false) continue;
                queue.push({ x: nx, y: ny });
                predicate(nx, ny);
            }
        }
    };

    // vistied 생성
    private createVisited = () => {
        const visited: boolean[][] = [];
        for (let i = 0; i < this.x; i++) {
            visited.push([]);
            for (let j = 0; j < this.y; j++) {
                visited[i].push(false);
            }
        }
        return visited;
    };

    // p1, p2의 거리를 계산
    private distance(p1: Tuple, p2: Tuple): number {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }

    // 사각형인지 확인
    private isRectangle(points: Tuple[]): boolean {
        // 점이 4개 미만인 경우 사각형이 아님
        if (points.length < 4) {
            return false;
        }

        // 모든 점 사이의 거리를 계산
        let distances: number[] = [];
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                distances.push(this.distance(points[i], points[j]));
            }
        }

        // 거리가 0인 쌍이 있는지 확인
        if (distances.includes(0)) {
            return false;
        }

        // 거리가 서로 다른 2쌍의 쌍을 찾음
        let A: Tuple | undefined, B: Tuple | undefined;
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (distances.filter(dist => dist === this.distance(points[i], points[j])).length === 2) {
                    A = points[i];
                    B = points[j];
                    break;
                }
            }
            if (A && B) {
                break;
            }
        }

        if (!A || !B) {
            return false; // 거리가 서로 다른 2쌍의 쌍을 찾지 못함
        }

        // 나머지 점들을 찾음
        let otherPoints: Tuple[] = points.filter(point => point !== A && point !== B);

        // 모든 다른 점들이 A, B와 동일한 직선상에 있는지 확인
        if (otherPoints.every(point => (point[0] - A![0]) * (B![1] - A![1]) === (point[1] - A![1]) * (B![0] - A![0]))) {
            return true; // 모든 점이 동일한 직선상에 있으면 사각형
        }

        // 모든 다른 점들에 대해 A, B와의 관계를 확인하고 대각선이 아닌 경우를 찾음
        for (let i = 0; i < otherPoints.length; i++) {
            let C: Tuple = otherPoints[i];
            for (let j = i + 1; j < otherPoints.length; j++) {
                let D: Tuple = otherPoints[j];
                if (this.distance(A, C) === this.distance(B, D) && this.distance(A, D) === this.distance(B, C)) {
                    return true; // 대각선이 아닌 경우를 찾았으므로 사각형이다.
                }
            }
        }
        return false; // 모든 다른 점들이 대각선인 경우 사각형이 아니다.
    }
}

const matrixManager = new MatrixManger();

export { matrixManager };

// mx.createMatrix(4, 4)

/**
@note 인접하지 않은 셀을 클릭하면 이전 cell은 false가 된다. 인접한 cell일 경우 true가 된다.
@example
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(1, 1)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(2, 2)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(2, 3)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
 */

/**
 * @note 2x2 머지
 * @example
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(0, 1)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(1, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(1, 1)
console.log('mx.activeCells :', mx.activeCells)
mx.mergeActiveCells(1, 1)
console.log('mx.activeCells :', mx.activeCells)
console.log('mx.mergedCellsGround :', mx.mergedCells)
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
*/

/**
 * @note 2x2 머지 해제
 * @example
mx.clickCell(0, 0)
mx.clickCell(0, 1)
mx.clickCell(1, 0)
mx.clickCell(1, 1)
mx.mergeActiveCells(1, 1)
console.log('mx.activeCells :', mx.activeCells)
console.log('mx.mergedCellsGround :', mx.mergedCells)
console.log('mx.mergedCellList :', mx.mergedCellList)
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.unmergeActiveCells(1, 1)
console.log('mx.activeCells :', mx.activeCells)
console.log('mx.mergedCellsGround :', mx.mergedCells)
console.log('mx.mergedCellList :', mx.mergedCellList)
*/

/**
 @note 두 개 겹침 머지 & 해제
mx.clickCell(0, 0)
mx.clickCell(0, 1)
mx.clickCell(1, 0)
mx.clickCell(1, 1)
mx.mergeActiveCells(1, 1)
console.log('1 mx.activeCells :', mx.activeCells)
console.log('1 mx.mergedCellsGround :', mx.mergedCells)
console.log('1 mx.mergedCellList :', mx.mergedCellList)

mx.clickCell(2, 0)
mx.clickCell(2, 1)
mx.clickCell(3, 0)
mx.clickCell(3, 1)
mx.mergeActiveCells(3, 1)
console.log('2 mx.activeCells :', mx.activeCells)
console.log('2 mx.mergedCellsGround :', mx.mergedCells)
console.log('2 mx.mergedCellList :', mx.mergedCellList)

mx.clickCell(1, 1)
mx.unmergeActiveCells(1, 1)
console.log('3 mx.activeCells :', mx.activeCells)
console.log('3 mx.mergedCellsGround :', mx.mergedCells)
console.log('3 mx.mergedCellList :', mx.mergedCellList)

mx.unmergeActiveCells(3, 1)
console.log('4 mx.activeCells :', mx.activeCells)
console.log('4 mx.mergedCellsGround :', mx.mergedCells)
console.log('4 mx.mergedCellList :', mx.mergedCellList)
*/

/**
@note 사각형이 아닌 경우 머지되지 않는다.
mx.clickCell(0, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(0, 1)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(1, 0)
console.log('mx.activeCells :', mx.activeCells)
mx.clickCell(1, 1)
mx.clickCell(1, 2)
console.log('mx.activeCells :', mx.activeCells)
mx.mergeActiveCells(1, 1)
console.log('mx.activeCells :', mx.activeCells)
console.log('mx.mergedCellsGround :', mx.mergedCells)
 */
