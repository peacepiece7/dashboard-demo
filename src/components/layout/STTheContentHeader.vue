<script setup lang="ts">
    const props = defineProps({
        titles: {
            type: String
        }
    });
</script>

<template>
    <div class="STTheContentHeader">
        <h1 class="title">TITLE</h1>
        <nav>
            <ul>
                <li v-for="title in titles">
                    <a href="#">{{ title.title }}</a>
                </li>
                <li><a href="#"></a></li>
                <li><a href="#"></a></li>
            </ul>
        </nav>
    </div>
</template>

<style scoped lang="scss">
    .STTheContentHeader {
        display: flex;
    }
</style>
