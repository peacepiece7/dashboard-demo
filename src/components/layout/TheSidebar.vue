<script setup lang="ts">
    import gloablNavigation from "@/assets/globalNavigation";
    import { useSideBarStore } from "@/store/useSideBarStore";
    import { cloneDeep } from "@/util/common";
    import { watch, ref } from "vue";

    const menu = ref<"menu" | "star">("menu");

    const navList = ref(cloneDeep(gloablNavigation));
    const sideBarStore = useSideBarStore();
    const toggleDropdown = ref(false);

    const allToggleMenu = () => {
        navList.value.forEach(ele => {
            ele.active = !toggleDropdown.value;
        });
    };

    watch(
        navList,
        () => {
            toggleDropdown.value = navList.value.some(ele => ele.active);
        },
        { deep: true }
    );
</script>

<template>
    <aside class="side-bar" :class="{ 'is-active': sideBarStore.toggleLnb }">
        <button type="button" class="toggle-lnb" @click="sideBarStore.toggle(!sideBarStore.toggleLnb)">
            <VIconFont icon="ic_triangle" />
        </button>
        <template v-if="!sideBarStore.toggleLnb">
            <!-- 메뉴 -->
            <ul class="side-bar-menu">
                <li :class="{ 'is-active': menu === 'menu' }" @click="menu = 'menu'">메뉴</li>
                <li :class="{ 'is-active': menu === 'star' }" @click="menu = 'star'">즐겨찾기</li>
            </ul>
            <template v-if="menu === 'menu'">
                <div class="bar-menu-warp">
                    <button type="button" class="bar-menu-all" aria-label="모든 메뉴 버튼 오픈" @click="allToggleMenu">
                        <VIconFont icon="ic_plus_w" /> ALL
                    </button>
                    <ul class="side-bar-list">
                        <li v-for="list of navList" :key="list.label">
                            <!-- nest route가 있을때 -->
                            <div class="depth-title" v-if="!!list.children.length" @click="list.active = !list.active">
                                <h3 class="depth-label">{{ list.label }}</h3>
                                <div
                                    class="depth-arrow"
                                    :style="{ transform: list.active ? 'rotate(180deg)' : 'rotate(0deg)' }"
                                >
                                    <VIconFont icon="ic_arrow" />
                                </div>
                            </div>

                            <!-- 1depth뿐일때 -->
                            <div class="depth-title" v-else @click="$router.push(list.href)">
                                <h3 class="depth-label">{{ list.label }}</h3>
                            </div>
                            <!-- 2depth list -->
                            <ol class="depth2-list" v-if="list.active">
                                <li
                                    v-for="ele of list.children"
                                    :key="ele.href"
                                    @click="$router.push(ele.href)"
                                    :class="{ 'is-active': $route.path.startsWith(ele.href) }"
                                >
                                    {{ ele.label }}
                                </li>
                            </ol>
                        </li>
                    </ul>
                </div>
            </template>
            <!-- 즐겨찾기 -->
            <template v-else>즐겨찾기 입니다. </template>
        </template>
    </aside>
</template>

<style scoped lang="scss">
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
    .side-bar {
        color: rgb(38, 40, 36);
        background-color: #283142;
        width: 280px;
        height: 100%;
        color: #fff;
        position: relative;
        flex-shrink: 0;

        &.is-active {
            width: 12px;

            .toggle-lnb {
                i {
                    transform: translateX(-50%) rotate(90deg);
                }
            }
        }

        .toggle-lnb {
            width: 25px;
            height: 70px;
            position: absolute;
            background-image: url("../../assets/imgs/png/btn_lnb_fold.png");
            background-position: center;
            background-size: cover;
            right: -21px;
            top: 42px;
            @include flex;

            i {
                position: absolute;
                top: 21px;
                left: 50%;
                transform: translateX(-50%) rotate(-90deg);
                z-index: 1;
                font-size: 20px;
            }

            &::after {
                content: "";
                display: inline-block;
                width: 15px;
                height: 16px;
                background-color: #fff;
                position: relative;
                top: -2px;
            }
        }

        &-menu {
            display: flex;

            li {
                flex: 1;
                @include flex;
                border-bottom: 1px solid rgba(214, 220, 229, 0.1);
                height: 47px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.6);

                &.is-active {
                    border-bottom: 1px solid #fff;
                    color: #fff;
                }
            }

            &-all {
                margin-bottom: 14px;
            }
        }

        /* depth */
        &-list {
            max-height: 650px;
            overflow-y: auto;
            .depth-title {
                min-height: 36px;
                border-radius: 12px;
                font-size: 14px;
                padding: 6px 16px;
                cursor: pointer;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: space-between;

                h3 {
                    font-size: 15px;
                    font-weight: 500;
                    line-height: 23px;
                    word-break: keep-all;
                }

                i {
                    font-size: 20px;
                }

                &:hover {
                    background-color: #197ffa;
                    color: #fff;
                }
            }

            & > li {
                margin-bottom: 6px;
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    bottom: -3px;
                    left: 0;
                    background-color: rgba(214, 220, 229, 0.1);
                }
            }

            .depth2-list {
                li {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    min-height: 36px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 6px 0;
                    padding-left: 27px;
                    cursor: pointer;

                    &:hover {
                        color: #fff;
                        background-color: #1b2435;
                    }

                    &.is-active {
                        color: #fff;
                        background-color: #1b2435;
                    }
                }
            }
        }

        .bar-menu-all {
            height: 30px;
            width: 100%;
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            color: #fff;
            margin-bottom: 14px;

            i {
                font-size: 18px;
            }
        }

        .bar-menu-warp {
            padding: 12px 18px;
        }
    }
</style>
