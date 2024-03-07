import { GComponents, GProperties } from "k-sport-common-library";

export {};

declare module "vue" {
    interface GlobalComponents extends GComponents {}
    interface ComponentCustomProperties extends GProperties {}
}
