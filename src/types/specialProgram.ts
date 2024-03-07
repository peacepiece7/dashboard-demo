export type SpecialProgram = {
    spzPgmDtlMgSqn: number; // 특화프로그램상세관리ID
    rqsMgSqn: number; // 신청관리ID
    spzPgmTpCd: string; // 특화프로그램유형코드
    bzNm: string; // 사업명
    bzTmeCtet: string; // 사업기간내용
    bzPlcCtet: string; // 사업장소내용
    entyTgCtet: string; // 참가대상내용
    entySclCtet: string; // 참가규모내용
    bzCtet: string; // 사업내용
    bzBdgTotalAmt: number; //사업예산총합금액
    bzBdgRqsAmt: number; // 사업예산신청금액
    bzBdgIslfAmt: number; // 사업예산자체금액
    bzBdgEtcAmt: number; // 사업예산기타금액
    spzPgmTpNm: string; // 특화프로그램유형코드명
    pbctMgSqn: string; // 공모관리번호
    rqsNo: string; // 신청번호
    rqsClfcCd: string; // 신청구분코드
    rqsClfcNm: string; // 신청구분명
    apctId: string; // 신청자명
    rqsDttm: string; // 신청일시
    pcsrId: string; // 처리자명
    pcsStCd: string; // 처리상태
    pcsStNm: string; // 처리상태명
    pcsDttm: string; // 처리일시
    siDoCd: string; // 소속지역 시도
    siGunGuCd: string; // 소속지역 시군구
    siDoNm: string; // 소속지역 시도명
    siGunGuNm: string; // 소속지역 시군구명
    sprtClubNm: string; // 스포츠클럽명
    reprNm: string; // 대표자명
    pbctYr: string; // 공모년도
    pbctSq: string; // 공모회차
    pbctNo: string; // 공모번호
};
export type SpecialProgramResponse = {
    zpsRespDto: SpecialProgram[];
    zpsRespListDto: SpecialProgram[];
};
