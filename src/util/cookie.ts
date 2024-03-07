// 조건에 맞는 쿠키가 없다면 undefined를 반환합니다.
export function getCookie(name: string): any {
    let matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? JSON.parse(decodeURIComponent(matches[1])) : undefined;
}

// expires (Date): 쿠키가 만료되는 날짜와 시간을 나타냅니다. Date 객체로 지정됩니다.

// maxAge (number): 쿠키의 수명을 초 단위로 나타냅니다. 쿠키는 이 시간 이후에 만료됩니다.

// domain (string): 쿠키가 보내질 도메인을 지정합니다.

// path (string): 쿠키가 보내질 경로를 지정합니다. 기본적으로 쿠키는 해당 경로와 그 하위 경로로의 요청에만 포함됩니다.

// secure (boolean): 이 옵션이 true로 설정된 경우, 쿠키는 HTTPS 연결을 통해서만 전송됩니다.

// httpOnly (boolean): 이 옵션이 true로 설정된 경우, 쿠키는 JavaScript를 통해 접근할 수 없습니다. 쿠키는 오로지 HTTP(S) 요청에만 포함됩니다.

// sameSite (string): Strict, Lax, 또는 None 중 하나의 값을 가집니다. 이 옵션은 다른 사이트의 요청을 통해 쿠키가 전송되는 방식을 제한합니다.

// Strict: 쿠키는 오로지 첫 번째 파티 요청에만 포함됩니다.
// Lax: 크로스 사이트 탐색을 통한 GET 요청에만 쿠키가 포함됩니다.
// None: 크로스 사이트 요청에 제한 없이 쿠키가 포함됩니다. 이 값을 사용할 때는 secure 옵션도 true로 설정해야 합니다.

type SetCookieOptions = {
    path: string;
    expires: Date | string;
    httpOnly: boolean;
    "max-age": number;
    domain: string;
    secure: boolean;
    samesite: "Strict" | "Lax" | "None";
};

export function setCookie(name: string, value: unknown = "", options: Partial<SetCookieOptions> = {}) {
    options = {
        path: "/",
        // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(JSON.stringify(value));

    for (let optionKey in options) {
        const key = optionKey as keyof SetCookieOptions;
        updatedCookie += "; " + key;
        let optionValue = options[key];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export function removeCookie(name: string) {
    setCookie(name, "", {
        "max-age": -1
    });
}
