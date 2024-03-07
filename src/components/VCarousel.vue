<script setup lang="ts">
    import { ref, computed } from "vue";
    import { Carousel, Slide } from "vue3-carousel";
    // import "vue3-carousel/dist/carousel.css";

    const props = withDefaults(
        defineProps<{ images: string[]; title: string; autoplay: number; transition: number }>(),
        {
            autoplay: 2000,
            transition: 300
        }
    );
    const currentSlideIdx = ref(0);
    const autoplay = ref(props.autoplay);
    const transitionTime = ref(props.transition);

    // 화면에 띄울 슬라이드 번호들
    const currentSlideView = computed(() => {
        const str = (currentSlideIdx.value + 1).toString();
        if (str.length === 1) return str.padStart(2, "0");
        return str;
    });
    const totalSlideView = computed(() => {
        const str = (props.images.length - 1).toString();
        if (str.length === 1) return str.padStart(2, "0");
        return str;
    });

    // 슬라이드 이동 버튼
    const handlePrevBtn = throttle(() => {
        if (currentSlideIdx.value === 0) {
            currentSlideIdx.value = props.images.length - 2;
        } else {
            currentSlideIdx.value -= 1;
        }
    }, transitionTime.value);
    const handleNextBtn = throttle(() => {
        if (currentSlideIdx.value >= props.images.length - 2) {
            currentSlideIdx.value = 0;
        } else {
            currentSlideIdx.value += 1;
        }
    }, transitionTime.value);

    // 자동재생 버튼
    const handleAutoPlay = () => {
        autoplay.value = autoplay.value === 0 ? 2000 : 0;
    };

    // transition이 끝나기 전에 버튼을 여러번 누르면 currentSlideIdx가 flickering되는 문제를 해결하기 위한 throttle 함수
    function throttle<T extends Function>(callback: T, wait: number) {
        let waiting = true;
        return () => {
            if (waiting) {
                callback();
                waiting = false;
                setTimeout(() => (waiting = true), wait);
            }
        };
    }
</script>

<template>
    <div class="container">
        <div class="d-flex jc-between mb-30">
            <div class="title">{{ props.title }}</div>
            <div class="navigation">
                <button class="prev-btn" @click="handlePrevBtn">&lt;</button>
                <div class="navigation-display">
                    <span>{{ currentSlideView }}</span>
                    <span> / {{ totalSlideView }}</span>
                </div>
                <button class="next-btn" @click="handleNextBtn">&gt;</button>
                <button @click="handleAutoPlay">{{ autoplay > 0 ? "+" : "-" }}</button>
            </div>
        </div>
        <div class="carousel-container">
            <Carousel
                :items-to-show="1"
                :wrap-around="true"
                :autoplay="autoplay"
                :transition="transitionTime"
                v-model="currentSlideIdx"
            >
                <Slide v-for="(slide, idx) in props.images.length - 1" :key="slide">
                    <img class="carousel-image" :src="props.images[idx]" :alt="`carousel image ${idx}`" />
                </Slide>
            </Carousel>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .container {
        position: relative;
        width: 580px;
        height: 470px;
        padding: 40px 50px 37px;
        border-radius: 14px;
        border: solid 1px #d6dce5;
        background-color: #fff;

        .title {
            @include fontSubtitle;
        }
        .navigation {
            @include flex(end, center);
            font-size: 15px;

            .navigation-display span:first-child {
                color: $fontColor2;
                font-weight: 500;
            }
            .navigation-display span:not(:first-child) {
                color: $fontColor4;
            }
            .next-btn,
            .prev-btn {
                @include flex(center, center);
                width: 20px;
                height: 20px;
                font-size: 20px;
                font-weight: 700;
                color: $fontColor2;
                cursor: pointer;
                margin: 0 10px;
            }
        }

        .carousel-container {
            width: 480px;
            height: 340px;
            border-radius: 14px;
            overflow: hidden;
            .pagenation {
                position: fixed;
                top: 0;
                right: 50px;
                width: 150px;
                .carousel__prev,
                .carousel__next {
                    box-sizing: content-box;
                    text-align: center;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    border: 0;
                    cursor: pointer;
                    margin: 0 10px;
                }
            }
            .carousel-image {
                width: 480px;
                height: 340px;
                object-fit: cover;
            }
        }
    }
</style>
