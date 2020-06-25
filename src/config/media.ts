/**
 * Reference - Screen Resolution Stats Worldwide:
 * https://gs.statcounter.com/screen-resolution-stats
 *
 * 16px - scrollbar width on Windows,
 * some browsers doesn't include scrollbar width when calculate media queries
 **/
import { createMediaMixin } from '../utils/mixin';

const breakpoints = {
  /** iPhone 5/SE */
  mobileSmall: 320,
  /** iPhone 6/7/8/X */
  mobileMedium: 375,
  /** iPhone 6/7/8 Plus */
  mobileLarge: 414,
  /** iPad 1, 2, Mini and Air */
  tabletSmall: 768,
  tabletLarge: 1024,
  /** 1280 - 16 = 1264 -> 1260 - more beautiful number :) */
  laptop: 1260,
  /** 1536 - 16 = 1520 -> 1500 - more beautiful number :) */
  desktop: 1500,
};

/**
 * Reference: https://get.foundation/sites/docs/media-queries.html#working-with-media-queries
 *
 * Media queries name convention: {breakpoint_name + modifier_name}
 * Modifiers: "up" | "only" | "down" (default)
 * "down" is default modifier, because we use desktop-first approach
 *
 * Examples:
 *
 * "tablet", "tabletDown" - tablet or smaller
 * "tabletOnly" - only tablet
 * "tabletUp" - tablet or larger
 */
export const media = {
  mobileSmall: createMediaMixin({
    max: breakpoints.mobileMedium,
  }),
  mobileMedium: createMediaMixin({
    max: breakpoints.mobileLarge,
  }),
  mobileMediumOnly: createMediaMixin({
    min: breakpoints.mobileSmall,
    max: breakpoints.mobileLarge,
  }),
  mobileLarge: createMediaMixin({
    max: breakpoints.tabletSmall,
  }),
  mobileLargeOnly: createMediaMixin({
    min: breakpoints.mobileLarge,
    max: breakpoints.tabletSmall,
  }),
  mobile: createMediaMixin({
    max: breakpoints.tabletSmall,
  }),
  noMobile: createMediaMixin({
    min: breakpoints.tabletSmall,
  }),
  tabletSmall: createMediaMixin({
    max: breakpoints.tabletLarge,
  }),
  tabletSmallOnly: createMediaMixin({
    min: breakpoints.tabletSmall,
    max: breakpoints.tabletLarge,
  }),
  tabletLarge: createMediaMixin({
    max: breakpoints.laptop,
  }),
  tabletLargeOnly: createMediaMixin({
    min: breakpoints.tabletLarge,
    max: breakpoints.laptop,
  }),
  tablet: createMediaMixin({
    max: breakpoints.laptop,
  }),
  tabletOnly: createMediaMixin({
    min: breakpoints.tabletSmall,
    max: breakpoints.laptop,
  }),
  laptop: createMediaMixin({
    max: breakpoints.desktop,
  }),
  laptopOnly: createMediaMixin({
    min: breakpoints.laptop,
    max: breakpoints.desktop,
  }),
  desktopOnly: createMediaMixin({
    min: breakpoints.desktop,
  }),
};
