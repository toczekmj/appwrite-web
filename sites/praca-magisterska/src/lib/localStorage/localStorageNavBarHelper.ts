import { Pages } from "#/enums/Pages";
import { NAV_LAST_SUBROUTE } from "#/generated/appwrite/constants";

export type LastSubRouteByParent = Partial<Record<Pages, string>>

export function getStoredLastSubRoutes(): LastSubRouteByParent {
    if(typeof window === 'undefined') return {};
    const getRoute = localStorage.getItem(NAV_LAST_SUBROUTE)
    if (!getRoute) {
        return {};
    }

    try {
        return JSON.parse(getRoute) as LastSubRouteByParent;
    } catch (error) {
        localStorage.removeItem(NAV_LAST_SUBROUTE);
        return {};
    }
}

export function setStoredLastSubRoutes(map: LastSubRouteByParent): void {
    if(typeof window === 'undefined') return;
    localStorage.setItem(NAV_LAST_SUBROUTE, JSON.stringify(map));
}