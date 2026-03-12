/**
 * Pages enum is used to define the pages of the application.
 * It is used to navigate to the pages and to display the pages in the sidebar and navbar.
 * It is also used to define the parent pages of the pages.
 * The parent pages are used to display the pages in the sidebar and navbar.
 */
export enum Pages {
    "dashboard" = "/dashboard",
    "settings" = "/settings",
    "files" = "/dashboard/files",
    "charts" = "/dashboard/charts",
    "login" = "/login",
}

/**
 * NAV_ITEMS is used to define the items of the navbar.
 * It is used to display the items in the navbar.
 * It is also used to define the parent items of the items.
 * The parent items are used to display the items in the sidebar and navbar.
 */
export const NAV_ITEMS: Array<{
    page: Pages;
    label: string;
    parent?: Pages; // undefined = top-level (MainNav)
}> = [
    // dashboard
    {page: Pages.dashboard, label: "Dashboard"},
        {page: Pages.dashboard, label: "Models", parent: Pages.dashboard},
        {page: Pages.files, label: "File management", parent: Pages.dashboard},
        {page: Pages.charts, label: "Charts", parent: Pages.dashboard},
    // settings
    {page: Pages.settings, label: "Settings"},
]


/**
 * NavItem type is used to define the items of the navbar.
 * It is a subset of {@link NAV_ITEMS} with the parent property removed.
 */
export type NavItem = (typeof NAV_ITEMS)[number];

/**
 * Get the main navigation items.
 * @returns The main navigation items.
 * The main navigation items are the items that are not children of any other item.
 */
export const getMainNavItems = (): NavItem[] => NAV_ITEMS.filter(item => item.parent === undefined);

/**
 * Get the sub navigation items for a given parent.
 * @param parent - The parent page.
 * @returns The sub navigation items.
 */
export const getSubNavItems = (parent: Pages): NavItem[] => NAV_ITEMS.filter(item => item.parent === parent);