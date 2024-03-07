<script setup lang="ts">
    import { ref } from "vue";

    const gridItems = ref([
        {
            num: 1,
            active: false,
            show: true
        },
        {
            num: 2,
            active: false,
            show: true
        },
        {
            num: 3,
            active: false,
            show: true
        },
        {
            num: 4,
            active: false,
            show: true
        },
        {
            num: 5,
            active: false,
            show: true
        },
        {
            num: 6,
            active: false,
            show: true
        },
        {
            num: 7,
            active: false,
            show: true
        },
        {
            num: 8,
            active: false,
            show: true
        },
        {
            num: 9,
            active: false,
            show: true
        }
    ]);

    const toggleClass = idx => {
        gridItems.value[idx].active = !gridItems.value[idx].active;
    };

    const mergeIdx = ref("");

    const obj = ref({
        "grid-column": "",
        "grid-row": ""
    });

    const mergeItem = () => {
        const activeItems = gridItems.value.filter(item => item.active);
        if (activeItems.length > 1) {
            const minNum = Math.min(...activeItems.map(item => item.num));
            activeItems.forEach(item => {
                if (item.num !== minNum) {
                    item.show = false;
                }
            });
        }
        obj.value["grid-column"] = "";
    };
</script>

<template>
    <div class="STGrid">
        <div class="STGrid-item">
            <div
                class="STGrid-item-li"
                v-for="(gridItem, idx) in gridItems"
                :key="idx"
                :style="{ gridColumn: gridItem.gridColumn, gridRow: gridItem.gridRow }"
                @click="toggleClass(idx)"
                :class="{ active: gridItem.active }"
                v-show="gridItem.show"
            >
                {{ gridItem.num }}
            </div>
        </div>
        <div>
            <button type="button" class="STGrid-btn btn-outline-primary" @click="mergeItem()">합치기</button>
            <button type="button" class="STGrid-btn btn-outline-danger">해제</button>
        </div>
    </div>
</template>

2번에 grid속성이 들어감 최소값빼고 다 none
<style scoped lang="scss">
    .STGrid {
        width: 100%;
        &-item {
            display: grid;
            grid-template-columns: 100px 100px 100px;
            grid-template-rows: 100px 100px 100px;
            // gap: 5px;
            cursor: pointer;
            &-li {
                border: 1px solid $black;
            }
        }
        .active {
            background-color: $gray-500;
            // &:nth-child(2) {
            //     grid-column: 2 / span 2;
            //     grid-row: 1 / span 2;
            // }
            // &:nth-child(3) {
            //     display: none;
            // }
            // &:nth-child(5),
            // &:nth-child(6) {
            //     display: none;
            // }
        }

        &-btn {
            height: 50px;
        }
    }
</style>
