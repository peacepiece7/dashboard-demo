<script setup lang="ts">
    import { ref } from "vue";

    const tournList = ref([
        { team: "선수1", score: "-1" },
        { team: "선수2", score: "-2" }
    ]);
</script>
<template>
    <div class="STtournament">
        <div class="STtournament-tree">
            <div class="STtournament-tree-team">
                <!-- :class="'team-16-' + index" -->
                <div
                    v-for="index in 16"
                    :key="'team-16-' + index"
                    :class="{ 'lm-6': index >= 9, 'rm-6': index < 9 }"
                    :style="{ 'grid-area': `g16-${index}` }"
                >
                    <div class="STtournament-tree-team-player STtournament-tree-team-player1">
                        <div class="name">{{ tournList[0].team }}</div>
                        <div class="score">{{ tournList[0].score }}</div>
                    </div>
                    <div class="STtournament-tree-team-player STtournament-tree-team-player2">
                        <div class="name">{{ tournList[1].team }}</div>
                        <div class="score">{{ tournList[1].score }}</div>
                    </div>
                </div>
                <div
                    v-for="index in 8"
                    :key="'team-8-' + index"
                    :class="{ 'lm-6': index >= 5, 'rm-6': index < 5 }"
                    :style="{ 'grid-area': `g8-${index}` }"
                >
                    <div class="STtournament-tree-team-player STtournament-tree-team-player1">
                        <div class="name">{{ tournList[0].team }}</div>
                        <div class="score">{{ tournList[0].score }}</div>
                    </div>
                    <div class="STtournament-tree-team-player STtournament-tree-team-player2">
                        <div class="name">{{ tournList[1].team }}</div>
                        <div class="score">{{ tournList[1].score }}</div>
                    </div>
                </div>
                <div
                    v-for="index in 4"
                    :key="'team-4-' + index"
                    :class="{ 'lm-6': index >= 3, 'rm-6': index < 3 }"
                    :style="{ 'grid-area': `g4-${index}` }"
                >
                    <div class="STtournament-tree-team-player STtournament-tree-team-player1">
                        <div class="name">{{ tournList[0].team }}</div>
                        <div class="score">{{ tournList[0].score }}</div>
                    </div>
                    <div class="STtournament-tree-team-player STtournament-tree-team-player2">
                        <div class="name">{{ tournList[1].team }}</div>
                        <div class="score">{{ tournList[1].score }}</div>
                    </div>
                </div>
                <div
                    v-for="index in 2"
                    :key="'team-2-' + index"
                    :class="{ 'lm-6': index > 1, 'rm-6': index < 2 }"
                    :style="{ 'grid-area': `g2-${index}` }"
                >
                    <div class="STtournament-tree-team-player STtournament-tree-team-player1">
                        <div class="name">{{ tournList[0].team }}</div>
                        <div class="score">{{ tournList[0].score }}</div>
                    </div>
                    <div class="STtournament-tree-team-player STtournament-tree-team-player2">
                        <div class="name">{{ tournList[1].team }}</div>
                        <div class="score">{{ tournList[1].score }}</div>
                    </div>
                </div>
                <div v-for="index in 1" :key="'team-1-' + index" :style="{ 'grid-area': `g1-${index}` }">
                    <div class="STtournament-tree-team-player STtournament-tree-team-player1">
                        <div class="name">{{ tournList[0].team }}</div>
                        <div class="score">{{ tournList[0].score }}</div>
                    </div>
                    <div class="STtournament-tree-team-player STtournament-tree-team-player2">
                        <div class="name">{{ tournList[1].team }}</div>
                        <div class="score">{{ tournList[1].score }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    %tour {
        content: "";
        background: #b70711;
        position: absolute;
        width: 6px;
        height: 2px;
        top: 50%;
        transform: translateY(-50%);
    }
    .lm-6 {
        position: relative;
        &::after {
            @extend %tour;
            left: -6px;
        }
    }
    .rm-6 {
        position: relative;
        &::after {
            @extend %tour;
            right: -6px;
        }
    }

    .STtournament {
        &-tree {
            &-team {
                display: grid;
                grid-gap: 8px;
                grid-template-areas:
                    "g16-1 . . . . . . .  g16-9"
                    ". g8-1  . . . . . g8-5 ."
                    "g16-2 . . . . . . . g16-10"
                    ". . g4-1 . . . g4-3 . ."
                    "g16-3 . . . . . . . g16-11"
                    ". g8-2 . . . . . g8-6 ."
                    "g16-4 . . . . . . .  g16-12"
                    ". . . g2-1 g1-1 g2-2 . . ."
                    "g16-5  . . . . . . . g16-13"
                    ". g8-3  . . . . . g8-7 ."
                    "g16-6  . . . . . . . g16-14"
                    ". . g4-2  . . . g4-4 . ."
                    "g16-7   . . . . . . .g16-15"
                    ". g8-4  . . . . . g8-8 ."
                    "g16-8   . . . . . . .g16-16";
                &-player {
                    display: flex;
                    border: 1px solid #111;
                    .score {
                        border-left: 1px solid #111;
                        background-color: #ddd;
                    }
                }
            }
        }
    }
</style>
