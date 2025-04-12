import FastGlob from 'fast-glob';
const { glob } = FastGlob
import fs from 'fs/promises';
import path from 'path';
import type { DefaultTheme } from 'vitepress';
import chokidar from 'chokidar';

type SidebarConfig = Record<string, DefaultTheme.SidebarItem[]>;

export async function generateAutoSidebar(): Promise<SidebarConfig> {
    const basePath = path.join(process.cwd(), 'doc/reviews');
    const branches = await glob('*/', {
        cwd: basePath,
        onlyDirectories: true,
        deep: 1
    });

    const sidebar: DefaultTheme.SidebarItem[] = [];

    for (const branchDir of branches) {
        const branchName = branchDir.replace(/\/$/, '');
        const mdFiles = await glob(`${branchDir}/*.md`, {
            cwd: basePath,
            ignore: ['**/_*.md']
        });

        const items: DefaultTheme.SidebarItem[] = mdFiles
            .map(file => {
                const fileName = path.basename(file, '.md');
                return {
                    text: `${fileName}.md`,
                    link: `/reviews/${branchDir}/${fileName}`
                };
            })
            .sort((a, b) => {
                const numA = parseInt(a.text.match(/\d+/)?.[0] || '0');
                const numB = parseInt(b.text.match(/\d+/)?.[0] || '0');
                return numA - numB;
            });

        sidebar.push({
            text: branchName,
            collapsed: false,
            items
        });
    }

    return { '/reviews/': sidebar };
}

export async function writeSidebarConfig(): Promise<void> {
    const sidebarConfig = await generateAutoSidebar();
    const configContent = `// Auto-generated sidebar config
import type { DefaultTheme } from 'vitepress';

export const sidebarConfig: DefaultTheme.Config['sidebar'] = ${JSON.stringify(sidebarConfig, null, 2)};
`;

    var p = path.join(process.cwd(), 'doc/.vitepress/sidebar.generated.ts')
    console.log(p)

    await fs.writeFile(
        p,
        configContent
    );
}


writeSidebarConfig()

// 开发模式文件监听
if (process.env.NODE_ENV === 'development' || process.argv.includes('--watch')) {
    console.log("lllllllllll")
    const watcher = chokidar.watch('doc/reviews/**/*.md', {
        ignored: /(^|[/\\])\../,
        persistent: true
    });

    watcher
        .on('add', () => writeSidebarConfig())
        .on('unlink', () => writeSidebarConfig());

    process.stdin.resume();
    console.log('🚀 Started watching review files...');
}