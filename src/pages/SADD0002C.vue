<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { useGrid } from "./test/useGrid";
    const mx = useGrid();
    const xRef = ref(-1);
    const yRef = ref(-1);

    onMounted(() => {
        mx.createMatrix(2, 2);
        // mx.mergeActiveCells(1, 1);
    });

    function handleClick(e: MouseEvent) {
        const target = e.target as HTMLDivElement;
        const x = target.dataset["x"];
        const y = target.dataset["y"];
        if (!x || !y) return;
        const nx = parseInt(x);
        const ny = parseInt(y);

        xRef.value = nx;
        yRef.value = ny;

        mx.clickCell(nx, ny);
    }
</script>

<template>
    <div class="container">
        <h1>foo</h1>
        <button @click="mx.mergeActiveCells(xRef, yRef)">Merge</button>
        <span class="space"></span>
        <button @click="mx.unmergeActiveCells(xRef, yRef)">Split</button>
        <span class="space"></span>
        <button @click="mx.clearActiveCells()">Clear</button>
        <div class="grid-container" :ref="mx.gridRef" @click="handleClick"></div>
    </div>
</template>

<style lang="scss">
    .container {
        height: 85dvh;
        width: 95vw;
        margin: auto;
        margin-top: 50px;
    }
    .grid-container {
        display: grid;
        height: 100%;
        .cell,
        .merged-cell {
            border: 1px solid black;
        }
        .cell:hover,
        .merged-cell:hover {
            background-color: #f1f1f1;
            cursor: pointer;
        }
        .cell.active,
        .merged-cell.active {
            background-color: #c2c2c2;
        }
    }
    .space {
        margin: 10px;
    }
</style>
