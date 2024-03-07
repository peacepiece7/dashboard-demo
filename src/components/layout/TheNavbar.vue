<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import { RouterLink } from "vue-router";
    const logoutHandler = () => {
        if (!window.confirm("로그아웃하시겠습니까?")) return;
        localStorage.removeItem("memberInfo");
        window.location.href = "/login";
    };

    const { locale } = useI18n();

    // 언어 토글 함수
    function toggleLanguage() {
        locale.value = locale.value === "en" ? "ko" : "en";
    }
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand d-flex ai-center" href="#">
            <img src="../../assets/imgs/symbol.png" alt="로고" />
            <h1>관리자 시스템</h1>
        </a>
        <div class="navbar-gnb pr-40">
            <div class="ml-40">
                <VButton class="mr-10" label="사용자 메뉴얼" color="white" mini icon="ic_global" />
                <VButton label="ENG" color="white" mini icon="ic_download" @click="toggleLanguage" />
            </div>
            <div class="d-flex ai-center">
                <div>
                    <VIconFont class="ic-gray" icon="ic_time" />
                    <span class="mr-10 navbar-gnb-time">28분 40초</span>
                    <button type="button" class="extension">연장</button>
                </div>
                <div class="navbar-menu">
                    <a href="#">행정지원</a>
                    <a href="#">클럽관리자</a>
                    <a href="#">대회관리</a>
                </div>
                <p class="mr-10 navbar-user">
                    사용자 정보 없음
                    <!-- {{ $userInfo.intgMemNm }} -->
                    <span class="font-gray">님</span>
                </p>
                <!-- <button type="button" @click="logoutHandler" v-if="$userInfo">
                    <img src="../../assets/imgs/png/btn_logout.png" alt="로그아웃" />
                </button> -->
                <RouterLink class="navbar-login" to="/login">로그인</RouterLink>
            </div>
        </div>
    </nav>
</template>

<style scoped lang="scss">
    .navbar {
        display: flex;
        align-items: center;
        height: 62px;
        color: $fontColor2;
        box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.17);
        z-index: 1;
        flex-shrink: 0;

        &-gnb {
            @include flex(sb, center);
            flex: 1;
            &-time {
                margin-left: 8px;
            }
        }
        &-brand {
            @include flex(center);
            width: 280px;
            h1 {
                margin-left: 10px;
                @include font-style(12);
            }
        }
        &-menu {
            margin: 0 26px 0 26px;
            a {
                display: inline-block;
                padding: 0 16px;
                border-right: 1px solid $uiLine;
                &:last-child {
                    border-right: 0;
                }
            }
        }
        &-user {
            @include font-style(15);
            font-weight: 500;
            .font-gray {
                @include font-style(13);
                color: $fontColor3;
                font-weight: normal;
            }
        }
        &-login {
            padding: 7px 23px;
            color: $fontColor5;
            background-color: $subTransparency;
            border: 1px solid $primary;
            border-radius: 16px;
        }
        .extension {
            padding: 4px 15px;
            color: $white;
            background-color: $bg1;
            border-radius: 8px;
        }
        .ic-gray {
            color: $uiLine;
        }
        p {
            margin-bottom: 0;
        }
    }
</style>
