export type CommonCode = {
    commnCd: string;
    grCd: string;
    hrnkCommnCd: string;
    hrnkGrCd: string;
    grCdNm: string;
    cdNm: string;
    cdCtet: string;
    cdLv: string;
    sortSeqNo: string;
    usagYn: "Y" | "N";
    lrnkCdLen: string;
    no1RferCtet: string;
    no2RferCtet: string;
    no3RferCtet: string;
    no4RferCtet: string;
    no5RferCtet: string;
    delYn: "Y" | "N";
    frstRegDttm: string;
    frstRegpMemNo: number;
    lstUpdDttm: string;
    lstAmdrMemNo: number;
};

export type CommonCodeResp = {
    total: number;
    pageSize: number;
    list: CommonCode[];
};
