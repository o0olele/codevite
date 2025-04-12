import { defineConfig } from 'vitepress'
import { sidebarConfig } from './sidebar.generated.js';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "coding",
  description: "code review helper",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reviews', link: '/reviews' }
    ],

    sidebar: sidebarConfig,
  },
  async buildEnd() {
    const { writeSidebarConfig } = await import('./utils/generateSidebar.js');
    await writeSidebarConfig();
  }
})
