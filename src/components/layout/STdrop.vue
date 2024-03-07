<!-- <script setup lang="ts">
    import { ref } from "vue";

    const props = defineProps<{
        ulLists: Array;
        title: string;
        children: object;
        label: string;
    }>();
    const isShow = ref(false);
    const toggleMenu = () => {
        isShow.value = !isShow.value;
    };
</script>

<template>
    <div class="STdrop">
        <ul class="STdrop-ul">
            <li v-for="ulList in ulLists" :key="ulList.id" @click="toggleMenu">
                <a href="#">
                    <h4>{{ ulList.title }}</h4>
                    <ul class="STdrop-ul-lists" :class="{ show: isShow }">
                        <li v-for="children in ulList.children">
                            <a href="#">{{ children.label }}</a>
                        </li>
                    </ul>
                </a>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
    .STdrop {
        &-ul {
            &-lists {
                display: none;
            }
            .show {
                display: block;
            }
        }
    }
</style> -->

<script setup lang="ts">
    import { ref } from "vue";

    const gridActive = ref([]);

    const gridItems = ref([
        [
            {
                num: 1,
                active: false
            },
            {
                num: 2,
                active: false
            },
            {
                num: 3,
                active: false
            }
        ],
        [
            {
                num: 4,
                active: false
            },
            {
                num: 5,
                active: false
            },
            {
                num: 6,
                active: false
            }
        ],
        [
            {
                num: 7,
                active: false
            },
            {
                num: 8,
                active: false
            },
            {
                num: 9,
                active: false
            }
        ]
    ]);
    //변수를 담고
    //active가 true를  찾아서 show를 false로 만들고  .filter
    //show가 false로인 애들을 찾아서 grid-column과 grid-row를 찾아서 합치기
</script>

<template>
    <div class="STGrid">
        <div v-for="(gridItem, index) in gridItems" :key="index">
            <div
                class="STGrid-item"
                v-for="(item, idx) in gridItem"
                :key="idx"
                @click="item.active = !item.active"
                :class="{ active: item.active }"
            >
                {{ item.num }}
            </div>
        </div>
        <button type="button" class="STGrid-btn btn-outline-primary">합치기</button>
        <button type="button" class="STGrid-btn btn-outline-danger">해제</button>
    </div>
</template>

<style scoped lang="scss">
    .STGrid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        // gap: 5px;
        cursor: pointer;
        &-item {
            border: 1px solid $black;
            width: 100px;
            height: 100px;
        }
        .active {
            background-color: $blue;
        }
        &-btn {
            height: 50px;
        }
    }
</style>
