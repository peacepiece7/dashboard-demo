<script setup lang="ts"></script>

<template>
    <footer id="footer" class="footer">
        <div class="d-flex ai-center">
            <div class="footer-logo"><img src="../../assets/imgs/logo_grey.png" alt="로고" /></div>
            <div class="footer-address">05540 서울특별시 송파구 올림픽로 424올림픽문화(올림픽컨벤션)센터</div>
        </div>
        <div class="footer-copyright">Copyright© 2018 Korean Sport & Olympic Committee. All Rights Reserved.</div>
    </footer>
</template>

<style scoped lang="scss">
    #footer {
        height: 80px;
        background-color: #111;
        flex-shrink: 0;
    }
    .footer {
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-address {
            color: rgba(255, 255, 255, 0.3);
            margin-left: 60px;
        }
        &-copyright {
            color: rgba(255, 255, 255, 0.3);
        }
    }
</style>
