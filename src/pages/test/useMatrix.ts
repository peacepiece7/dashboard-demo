import { reactive, ref } from "vue";

type Tuple = [number, number];

type MergedCell = {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
};

export function useMatrix() {
    const sx = ref(0);
    const sy = ref(0);
    const dx = reactive([0, 1, 0, -1] as const);
    const dy = reactive([1, 0, -1, 0] as const);
    const matrix = ref<Tuple[][][]>([]);
    const mergedCellList = ref<MergedCell[]>([]);
    const mergedCells = ref<boolean[][]>([]);
    const activeCells = ref<boolean[][]>([]);

    const createMatrix = (x: number, y: number) => {
        sx.value = x;
        sy.value = y;
        matrix.value = Array.from({ length: x }, () => Array(y).fill(true));
        activeCells.value = Array.from({ length: x }, () => Array(y).fill(false));
        mergedCellList.value = [];
        mergedCells.value = Array.from({ length: x }, () => Array(y).fill(false));
    };

    const clickCell = (x: number, y: number) => {
        if (isOverflow(x, y)) return;

        const adjacentCells: Tuple[] = [];
        const visited = createVisited();
        const isActive = activeCells.value[x][y];
        const mergedCell = findMergedCell(x, y);

        // 클릭한 좌표가 merged cell 일 경우
        if (mergedCell) {
            clearActiveCells();
            walkAround(x, y, mergedCells.value, visited, (nx, ny) => {
                // 인접한 cell이 merged cell 내부에 있는지 확인
                if (isInside(nx, ny, mergedCell)) adjacentCells.push([nx, ny]);
            });

            activeCells.value[x][y] = !isActive;

            for (let cell of adjacentCells) {
                const [nx, ny] = cell;
                activeCells.value[nx][ny] = !isActive;
            }
        } else {
            walkAround(x, y, activeCells.value, visited, (nx, ny) => adjacentCells.push([nx, ny]));

            activeCells.value[x][y] = !activeCells.value[x][y];
            for (let i = 0; i < sx.value; i++) {
                for (let j = 0; j < sy.value; j++) {
                    if (!visited[i][j]) activeCells.value[i][j] = false;
                    else if (isMergedCell(i, j)) activeCells.value[i][j] = false;
                }
            }
        }

        console.log(activeCells.value);
    };

    const mergeActiveCells = (x: number, y: number) => {
        if (isOverflow(x, y)) return;
        console.log("merge :", x, y);
        const visited = createVisited();
        const adjacentCells: Tuple[] = [[x, y]];
        walkAround(x, y, activeCells.value, visited, (nx, ny) => adjacentCells.push([nx, ny]));
        const { sx, sy, ex, ey } = findVertex(adjacentCells);
        if (adjacentCells.length <= 1) return;
        else if (adjacentCells.length === 2) {
            mergedCellList.value.push({ sx, sy, ex, ey });
            addMergedCell(sx, sy, ex, ey);
        } else {
            if (isRectangle(adjacentCells)) {
                mergedCellList.value.push({ sx, sy, ex, ey });
                addMergedCell(sx, sy, ex, ey);
            }
        }

        clearActiveCells();
    };

    const unmergeActiveCells = (x: number, y: number) => {
        if (isOverflow(x, y)) return;
        for (let i = 0; i < mergedCellList.value.length; i++) {
            const list = mergedCellList.value[i];
            if (isInside(x, y, list)) {
                removeMergedCell(list.sx, list.sy, list.ex, list.ey);
                mergedCellList.value.splice(i, 1);
                clearActiveCells();
            }
        }
    };

    const addMergedCell = (sx: number, sy: number, ex: number, ey: number) => {
        for (let i = sx; i <= ex; i++) {
            for (let j = sy; j <= ey; j++) {
                mergedCells.value[i][j] = true;
            }
        }
    };

    const removeMergedCell = (sx: number, sy: number, ex: number, ey: number) => {
        for (let i = sx; i <= ex; i++) {
            for (let j = sy; j <= ey; j++) {
                mergedCells.value[i][j] = false;
            }
        }
    };

    const clearActiveCells = () => {
        activeCells.value = Array.from({ length: sx.value }, () => Array(sy.value).fill(false));
    };

    const isOverflow = (x: number, y: number) => {
        return x < 0 || x >= sx.value || y < 0 || y >= sy.value;
    };
    const isInside = (x: number, y: number, cell: MergedCell) => {
        return cell.sx <= x && x <= cell.ex && cell.sy <= y && y <= cell.ey;
    };
    const isMergedCell = (x: number, y: number) => {
        for (let cell of mergedCellList.value) {
            if (isInside(x, y, cell)) return true;
        }
    };
    const findMergedCell = (x: number, y: number) => {
        for (let cell of mergedCellList.value) {
            if (isInside(x, y, cell)) return cell;
        }
    };

    const findVertex = (cell: Tuple[]) => {
        let sx = Number.MAX_SAFE_INTEGER,
            sy = Number.MAX_SAFE_INTEGER,
            ex = Number.MIN_SAFE_INTEGER,
            ey = Number.MIN_SAFE_INTEGER;
        for (let [x, y] of cell) {
            sx = Math.min(sx, x);
            sy = Math.min(sy, y);
            ex = Math.max(ex, x);
            ey = Math.max(ey, y);
        }
        return { sx, sy, ex, ey };
    };

    const walkAround = (
        x: number,
        y: number,
        ground: boolean[][],
        visited: boolean[][],
        predicate: (nx: number, ny: number) => void
    ) => {
        type CoordinateTuple = { x: number; y: number };
        const queue: CoordinateTuple[] = [{ x, y }];
        visited[x][y] = true;
        while (queue.length) {
            const { x, y } = queue.shift()!;
            for (let i = 0; i < 4; i++) {
                const nx = x + dx[i];
                const ny = y + dy[i];
                if (isOverflow(nx, ny) || visited[nx][ny]) continue;
                visited[nx][ny] = true;
                if (ground[nx][ny] === false) continue;
                queue.push({ x: nx, y: ny });
                predicate(nx, ny);
            }
        }
    };

    const createVisited = () => {
        return Array.from({ length: sx.value }, () => Array(sy.value).fill(false));
    };

    const distance = (p1: Tuple, p2: Tuple): number => {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    };
    const isRectangle = (points: Tuple[]): boolean => {
        /**
         * 점이 4개 미만인 경우 사각형이 아니지만, 직선은 Rectangle로 간주하기 때문에 points가 4개 미만인 경우 false를 반환하지 않는다.
         * @example         
         if (points.length < 4) {
             return false;
         }
         */

        // 모든 점 사이의 거리를 계산
        let distances: number[] = [];
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                distances.push(distance(points[i], points[j]));
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
                if (distances.filter(dist => dist === distance(points[i], points[j])).length === 2) {
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
                if (distance(A, C) === distance(B, D) && distance(A, D) === distance(B, C)) {
                    return true; // 대각선이 아닌 경우를 찾았으므로 사각형이다.
                }
            }
        }
        return false; // 모든 다른 점들이 대각선인 경우 사각형이 아니다.
    };

    return {
        sx,
        sy,
        matrix,
        mergedCellList,
        mergedCells,
        activeCells,
        createMatrix,
        clickCell,
        clearActiveCells,
        mergeActiveCells,
        isMergedCell,
        isOverflow,
        isInside,
        unmergeActiveCells
    };
}
