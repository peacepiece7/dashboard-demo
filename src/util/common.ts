import dayjs from "dayjs";
import * as XLSX from "xlsx-js-style";

export function sliceArr<T>(data: T[], size: number) {
    const arr = [];

    for (let i = 0; i < data.length; i += size) {
        arr.push(data.slice(i, i + size));
    }

    return arr;
}

export const cloneDeep: <T>(data: T[]) => T[] = data => {
    return data.map(ele => ({ ...ele }));
};

const changeCellformat = (arr: (string | number)[]) => {
    return arr.map(a => {
        return {
            v: a ?? "",
            t: "s",
            s: {
                alignment: { vertical: "center", horizontal: "center" }
            }
        };
    });
};

export const excelDown = ({ title, data, fileName = "" }: { title: string[]; data: any[][]; fileName: string }) => {
    // workbook 생성
    const wb = XLSX.utils.book_new();

    const tableHead = changeCellformat(title);

    const dataCells = data.map(ele => changeCellformat(ele));

    const ws = XLSX.utils.aoa_to_sheet([tableHead, ...dataCells]);

    // 셀넓이
    const wscols = tableHead.map(() => ({ wch: 20 }));
    ws["!cols"] = wscols;

    // 셀높이
    const wsrow = data.map(() => ({ hpt: 30 }));
    wsrow.push({ hpt: 30 });
    ws["!rows"] = wsrow;

    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, fileName + ".xlsx");
};

/**
 * 첫번째 시트만 JSON 형태로 반환합니다.
 */
export const excelUpload = <T>(e: Event, callback: (sheet: T[]) => void) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const result = e.target?.result;
        const workbook = XLSX.read(result, { type: "binary", dateNF: "yyyy-mm-dd" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        for (let key in sheet) {
            if (sheet[key] instanceof Object && sheet[key].v !== undefined) {
                sheet[key].v = sheet[key].w;
            }
        }
        const jsonSheet = XLSX.utils.sheet_to_json(sheet) as T[];
        callback(jsonSheet);
        target.value = "";
    };
    reader.readAsArrayBuffer(file);
};

export const formatDateToYYYYMMDD = (date: Date) => {
    return dayjs(date).format("YYYYMMDD");
};
