import { ref, watch } from "vue";
import { useMatrix } from "./useMatrix";
export const useGrid = () => {
    const mx = useMatrix();
    const gridRef = ref(null as HTMLDivElement | null);

    watch(
        mx.mergedCellList,
        () => {
            if (!gridRef.value) throw new Error("gridRef is not defined");
            gridRef.value?.querySelectorAll(".merged-cell").forEach(cell => cell.remove());

            mx.mergedCellList.value.forEach(
                cell => {
                    const { sx, sy, ex, ey } = cell;
                    const mergedCell = document.createElement("div");
                    mergedCell.className = "merged-cell";
                    mergedCell.style.gridColumn = `${sy + 1} / ${ey + 2}`;
                    mergedCell.style.gridRow = `${sx + 1} / ${ex + 2}`;
                    mergedCell.dataset.x = sx.toString();
                    mergedCell.dataset.y = sy.toString();
                    gridRef.value?.appendChild(mergedCell);
                },
                {
                    deep: true
                }
            );
            // 1 / 3 / 3 / 5
            // grid-area: 3 / 1 / 5 / 3;
            // paint rest grid item
            const cells = gridRef.value?.querySelectorAll(".cell");
            if (!cells) throw new Error("cells is not defined");

            gridRef.value.querySelectorAll(".cell").forEach(cell => cell.remove());
            mx.matrix.value.forEach((row, x) => {
                row.forEach((_, y) => {
                    if (mx.isMergedCell(x, y)) return;
                    const cell = document.createElement("div");
                    cell.className = "cell";
                    cell.dataset.x = x.toString();
                    cell.dataset.y = y.toString();
                    gridRef.value?.appendChild(cell);
                });
            });
        },
        {
            deep: true
        }
    );

    // un/mergeActiveCells 함수가 호출될 때 mx.mergedCellList가 변한다.
    watch(mx.mergedCellList, () => {
        if (!gridRef.value) throw new Error("gridRef is not defined");
    });

    // createMatrix 함수가 호출될 때 mx.matrix가 변한다.
    watch(
        mx.matrix,
        () => {
            if (!gridRef.value) throw new Error("gridRef is not defined");
            // paint grid contianer
            gridRef.value.style.gridTemplateColumns = `repeat(${mx.sx.value}, 1fr)`;
            gridRef.value.style.gridTemplateRows = `repeat(${mx.sy.value}, 1fr)`;

            // paint grid item
            gridRef.value.querySelectorAll(".cell").forEach(cell => cell.remove());
            mx.matrix.value.forEach((row, x) => {
                row.forEach((_, y) => {
                    const cell = document.createElement("div");
                    cell.className = "cell";
                    cell.dataset.x = x.toString();
                    cell.dataset.y = y.toString();
                    gridRef.value?.appendChild(cell);
                });
            });
        },
        {
            deep: true
        }
    );

    // .cell을 돌면서 active class를 추가/제거한다.
    watch(
        mx.activeCells,
        () => {
            if (!gridRef.value) throw new Error("gridRef is not defined");

            gridRef.value.querySelectorAll(".cell").forEach((cell, idx) => {
                const x = (cell as HTMLDivElement).dataset["x"];
                const y = (cell as HTMLDivElement).dataset["y"];
                if (!x || !y) throw new Error("x or y is not defined");
                if (mx.activeCells.value[parseInt(x)][parseInt(y)]) {
                    cell.classList.add("active");
                } else {
                    cell.classList.remove("active");
                }
            });

            gridRef.value.querySelectorAll(".merged-cell").forEach((cell, idx) => {
                const x = (cell as HTMLDivElement).dataset["x"];
                const y = (cell as HTMLDivElement).dataset["y"];
                if (!x || !y) throw new Error("x or y is not defined");
                console.log(x, y, mx.activeCells.value[parseInt(x)][parseInt(y)]);

                if (mx.activeCells.value[parseInt(x)][parseInt(y)]) {
                    cell.classList.add("active");
                } else {
                    cell.classList.remove("active");
                }
            });
        },
        {
            deep: true
        }
    );

    return { ...mx, gridRef };
};
