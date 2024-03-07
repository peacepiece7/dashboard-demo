<script setup lang="ts">
    import { useForm } from "vee-validate";
    // import useAreaDropdown from "@/composables/useAreaDropdown";
    import * as yup from "yup";
    import { ref } from "vue";
    // import FVID0008P from "@/components/modal/FVID0008P.vue";
    import useSave from "@/composables/useSave";
    import dayjs from "dayjs";
    import { useRoute, useRouter } from "vue-router";
    import ajax from "@/util/ajax";
    import { onMounted } from "vue";

    // 수정시 파람
    const routeParam = useRoute().params.id;
    const router = useRouter();

    const r = "필수 입니다.";

    const schema = yup.object({
        // 키값에 대한 스키마를 지정한다.
        cpttBegnDt: yup.date().required(r),
        cpttEndDt: yup
            .date()
            .required(r)
            .test("", "대회 종료일은 대회시작일보다 과거일수 없습니다.", (val, context) => {
                return dayjs(context.parent.cpttBegnDt).format("YYYY-MM-DD") <= dayjs(val).format("YYYY-MM-DD");
            }),
        entyRqsBegnDt: yup.date().required(r),
        entyRqsEndDt: yup
            .date()
            .required(r)
            .test("", "참가신청 종료일은 참가신청 시작일보다 과거일수 없습니다.", (val, context) => {
                return dayjs(context.parent.entyRqsBegnDt).format("YYYY-MM-DD") <= dayjs(val).format("YYYY-MM-DD");
            }),
        cpttNm: yup.string().required("대회명을 입력하세요.")
    });

    // asdasd: yup.mixed().required(),
    const { handleSubmit, values, resetForm } = useForm<any>({
        validationSchema: schema,
        initialValues: {
            cpttBegnDt: new Date(),
            entyRqsBegnDt: new Date(),
            hldSiDoCd: { cdNm: "전체 시도", commnCd: "" },
            hldSiGunGuCd: { cdNm: "전체 시군구", commnCd: "" }
        }
    });

    const getEditData = async () => {
        try {
            const res = await ajax.get("/competition/" + routeParam);

            res.data.cpttBegnDt = res.data.cpttBegnDt ? dayjs(res.data.cpttBegnDt).toDate() : null;
            res.data.cpttEndDt = res.data.cpttEndDt ? dayjs(res.data.cpttEndDt).toDate() : null;
            res.data.entyRqsBegnDt = res.data.entyRqsBegnDt ? dayjs(res.data.entyRqsBegnDt).toDate() : null;
            res.data.entyRqsEndDt = res.data.entyRqsEndDt ? dayjs(res.data.entyRqsEndDt).toDate() : null;
            res.data.pspnCnlDt = res.data.pspnCnlDt ? dayjs(res.data.pspnCnlDt).toDate() : null;
            res.data.hldSiDoCd = { cdNm: "전체 시도", commnCd: "" };
            res.data.hldSiGunGuCd = { cdNm: "전체 시군구", commnCd: "" };
            res.data.cpttStCd = { commnCd: res.data.cpttStCd ?? "" };
            res.data.cpttClfcCd = { commnCd: res.data.cpttClfcCd ?? "" };

            resetForm({
                values: {
                    ...res.data
                }
            });
        } catch (err) {
            alert("대회 정보가 없습니다.");
            router.push("/FVID0006M");
        }
    };

    // 파람이 있을때 기존 데이터 fetch
    onMounted(() => {
        if (!!routeParam) {
            getEditData();
        }
    });

    const onSubmit = handleSubmit(async values => {
        if (!window.confirm((routeParam ? "수정" : "저장") + "하시겠습니까?")) return;

        for (const key in values) {
            const elekey = key as keyof typeof values;
            if (values[elekey] instanceof Date) {
                values[elekey] = dayjs(values[elekey]).format("YYYYMMDD");
            }
        }

        try {
            await useSave({
                url: "/competition",
                method: "put",
                param: {
                    ...values,
                    hldSiDoCd: values.hldSiDoCd.commnCd,
                    hldSiGunGuCd: values.hldSiGunGuCd.commnCd,
                    cpttStCd: values.cpttStCd.commnCd,
                    cpttClfcCd: values.cpttClfcCd.commnCd,
                    cpttNo: routeParam
                }
            });

            router.push("/FVID0006M");
        } catch (err) {
            console.error(err);
        }
    });

    const deleteCompetition = async () => {
        if (!window.confirm("대회정보를 삭제하시겠습니까?")) return;
        try {
            await useSave({
                url: "/competition",
                method: "put",
                param: {
                    cpttNo: routeParam,
                    delYn: "Y"
                }
            });
            router.push("/FVID0006M");
        } catch (err) {
            alert("삭제 오류");
            console.error(err);
        }
    };

    // 지역
    const { sidoOptions, sigunguOptions } = useAreaDropdown(() => values.hldSiDoCd);

    const thumbnail = ref([]);

    const searchPop = ref(false);
</script>

<template>
    <!-- 개최클럽 생성 -->
    <FVID0008P v-if="searchPop" @close="searchPop = false" />

    <VContentHeader
        :title="routeParam ? '대회정보수정' : '대회정보등록'"
        :location="['maMn', '대회 정보', '대회 목록']"
    />

    <form @submit="onSubmit">
        <VTable :type="'horizon'">
            <template #tbody>
                <tr>
                    <th style="width: 150px">대회 기간*</th>
                    <td colspan="3">
                        <div class="d-flex">
                            <VFormDatepicker name="cpttBegnDt" width="180px" />
                            <span class="water"> ~ </span>
                            <VFormDatepicker name="cpttEndDt" width="180px" />
                        </div>
                    </td>
                    <th style="width: 150px">참가신청기간*</th>
                    <td>
                        <div class="d-flex">
                            <VFormDatepicker name="entyRqsBegnDt" width="180px" />
                            <span class="water"> ~ </span>
                            <VFormDatepicker name="entyRqsEndDt" width="180px" />
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>대회명*</th>
                    <td colspan="3">
                        <VFormTextInput name="cpttNm" style="width: 460px" />
                    </td>
                    <th>대회분류*</th>
                    <td>
                        <VFormDropdown name="cpttClfcCd" code="001" />
                    </td>
                </tr>

                <tr>
                    <th>개최클럽</th>
                    <td colspan="3">
                        <VFormTextInput
                            name="hldSprtClubNo"
                            search-input
                            style="width: 460px"
                            readonly
                            @search="searchPop = true"
                        />
                    </td>
                    <th>지역</th>
                    <td>
                        <VFormDropdown
                            name="hldSiDoCd"
                            :options="sidoOptions"
                            class="mr-10"
                            label-property="cdNm"
                            value-property="commnCd"
                        />
                        <VFormDropdown
                            name="hldSiGunGuCd"
                            :options="sigunguOptions"
                            label-property="cdNm"
                            value-property="commnCd"
                        />
                    </td>
                </tr>
                <tr>
                    <th>대회상태*</th>
                    <td>
                        <VFormDropdown name="cpttStCd" code="VI010" label-property="cdNm" value-property="commnCd" />
                    </td>

                    <th>연기/취소일자</th>
                    <td><VFormDatepicker name="pspnCnlDt" /></td>
                    <th>연기/취소사유</th>
                    <td><VFormTextInput name="pspnCnlRsn" style="width: 460px" /></td>
                </tr>
            </template>
        </VTable>

        <VTableTitle title="대회 요강" />

        <VTable :type="'horizon'">
            <template #colgroup>
                <col style="width: 100px" />
                <col style="width: 500px" />
            </template>
            <template #tbody>
                <tr>
                    <th>목적</th>
                    <td>
                        <VFormTextArea name="cpttGdCtet" />
                    </td>
                </tr>
                <tr>
                    <th>개회식 및 환영 리셉션</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="opcmCtet" />
                    </td>
                </tr>
                <tr>
                    <th>폐회식</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="cloceCtet" />
                    </td>
                </tr>
                <tr>
                    <th>장소</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="cpttPlcNm" />
                    </td>
                </tr>
                <tr>
                    <th>참가 클럽</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="cpttEntyClubCtet" />
                    </td>
                </tr>
                <tr>
                    <th>종목</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="hldEvfxCtet" />
                    </td>
                </tr>
                <tr>
                    <th>주최</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="cpttHostInsNm" />
                    </td>
                </tr>
                <tr>
                    <th>주관</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="cpttMnnstNm" />
                    </td>
                </tr>
                <tr>
                    <th>후원</th>
                    <td>
                        <VFormTextInput style="width: 460px" name="cpttSuprtInsNm" />
                    </td>
                </tr>
                <tr>
                    <th>썸네일 첨부</th>
                    <td>
                        <VUploadFile v-model="thumbnail" :file-format="['jpg', 'jpeg', 'png']" />
                    </td>
                </tr>
            </template>
        </VTable>

        <div class="mt-30 text-right d-flex jc-between">
            <div>
                <VButton color="white" @click="$router.push('/FVID0006M')" label="목록"></VButton>
            </div>
            <div>
                <VButton color="grey" class="mr-10" @click="deleteCompetition" v-if="!!routeParam">삭제</VButton>
                <VButton type="submit"> {{ routeParam ? "수정" : "저장" }}</VButton>
            </div>
        </div>
    </form>
</template>
