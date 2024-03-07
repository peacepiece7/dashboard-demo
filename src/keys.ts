import { InjectionKey, Ref } from "vue";

export const userInfo = Symbol() as InjectionKey<string>;

export const monthValueKey = Symbol("학습포인트 날짜") as InjectionKey<Ref<Date>>;
