module.exports = {
    apps: [
        {
            name: 'vitepress',
            script: 'npm',
            args: 'run docs:dev',
            watch: ['doc/.vitepress/sidebar.generated.ts']
        },
        {
            name: 'sidebar-watcher',
            script: 'npm',
            args: 'run dev:sidebar',
            watch: false
        }
    ]
};