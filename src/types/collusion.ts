/**
pbctMgSqn	integer($int32)
공모관리ID

spvsOgzClfcCd	string
주관조직구분코드

spvsSiDoCd	string
주관시도코드

spvsSiGunGuCd	string
주관시군구코드

pbctWorkClfcCd	string
공모업무구분코드

pbctYr	string
공모년도

pbctSq	string
공모회차

pbctNo	string
공모번호

pbancTtl	string
공고제목

pbctTgClfcCd	string
공모대상구분코드

pbctOutlCtet	string
공모개요내용

pbctPotdDt	string
공모게시일자

pbctBegnDt	string
공모시작일자

pbctEndDt	string
공모종료일자

sbmsnLmtnDttm	string
제출기한일시

pbctChpsIntgMemNo	string
공모담당자id

pbctChpsTelno	string
공모담당자전화번호

pbctChpsEmail	string
공모담당자이메일

pbctPrgStCd	string
공모진행상태코드

notiMtrTnsfYn	string
공지사항이관여부

popuPotdYn	string
팝업게시여부

delYn	string
삭제여부

frstRegDttm	string
최초등록일시

frstRegpMemNo	integer($int32)
최초등록자id

lstUpdDttm	string
최종수정일시

lstAmdrMemNo	integer($int32)
최종수정자id
 */
export type CollusionDetail = {
    pbctMgSqn: number;
    spvsOgzClfcCd: string;
    spvsSiDoCd: string;
    spvsSiGunGuCd: string;
    pbctWorkClfcCd: string;
    pbctYr: string;
    pbctSq: string;
    pbctNo: string;
    pbancTtl: string;
    pbctTgClfcCd: string;
    pbctOutlCtet: string;
    pbctPotdDt: string;
    pbctBegnDt: string;
    pbctEndDt: string;
    sbmsnLmtnDttm: string;
    pbctChpsIntgMemNo: string;
    pbctChpsTelno: string;
    pbctChpsEmail: string;
    pbctPrgStCd: string;
    notiMtrTnsfYn: string;
    popuPotdYn: string;
    delYn: string;
    frstRegDttm: string;
    frstRegpMemNo: number;
    lstUpdDttm: string;
    lstAmdrMemNo: number;
};

export type CollusionDetailResponse = {
    pbctRespDto: CollusionDetail[];
    pbctRespListDto: CollusionDetail[];
};
