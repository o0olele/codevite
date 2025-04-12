declare module '*.md' {
    import type { ComponentOptions } from 'vue';
    const Component: ComponentOptions;
    export default Component;
  }
  
  declare module 'virtual:sidebar-config' {
    import type { DefaultTheme } from 'vitepress';
    export const sidebarConfig: DefaultTheme.Config['sidebar'];
  }