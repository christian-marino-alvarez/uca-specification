import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { builtinModules } from 'node:module';
import * as esbuild from 'esbuild';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const WEB_DIST = path.join(DIST, 'web');
const CLI = path.join(ROOT, 'cli');

function compileTypeScript(): void {
    console.log('📦 Compiling TypeScript...');
    execSync('npx tsc', { cwd: ROOT, stdio: 'inherit' });
}

function resolveWorkspaces(): string[] {
    const globs = ['src/core', 'src/collection/capabilities', 'src/collection/ucas'];
    const workspaces: string[] = [];
    for (const glob of globs) {
        const dir = path.join(ROOT, glob);
        if (!fs.existsSync(dir)) { continue; }
        const hasPackage = fs.existsSync(path.join(dir, 'package.json'));
        if (hasPackage) {
            workspaces.push(glob);
            continue;
        }
        const children = fs.readdirSync(dir).filter((name) => {
            return fs.statSync(path.join(dir, name)).isDirectory();
        });
        workspaces.push(...children.map((name) => `${glob}/${name}`));
    }
    return workspaces;
}

function buildImportMapEntry(workspace: string): Record<string, string> {
    const packagePath = path.join(ROOT, workspace, 'package.json');
    if (!fs.existsSync(packagePath)) { return {}; }
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const { name, exports: pkgExports } = packageJson;
    if (!name || !pkgExports) { return {}; }
    const distRelative = workspace.replace('src/', '');
    const entries: Record<string, string> = {};
    for (const [exportKey, exportValue] of Object.entries(pkgExports)) {
        const resolved = (exportValue as Record<string, string>)?.import;
        if (!resolved) { continue; }
        const resolvedFile = resolved.replace(/^\.\//, '');
        const specifier = exportKey === '.' ? name : `${name}/${exportKey.replace(/^\.\//, '')}`;
        entries[specifier] = `./${distRelative}/${resolvedFile}`;
    }
    return entries;
}

function generateImportMap(): string {
    const workspaces = resolveWorkspaces();
    const imports: Record<string, string> = {
        'zod': './vendor/zod.js',
    };
    for (const workspace of workspaces) {
        Object.assign(imports, buildImportMapEntry(workspace));
    }
    return JSON.stringify({ imports }, null, 4);
}

async function bundleVendorLibraries(): Promise<void> {
    const vendorDir = path.join(WEB_DIST, 'vendor');
    fs.mkdirSync(vendorDir, { recursive: true });
    await esbuild.build({
        entryPoints: ['zod'],
        outfile: path.join(vendorDir, 'zod.js'),
        format: 'esm',
        bundle: true,
        platform: 'browser',
        target: 'es2022',
    });
}

async function transpileEntry(): Promise<void> {
    await esbuild.build({
        entryPoints: [path.join(CLI, 'entry.ts')],
        outfile: path.join(WEB_DIST, 'app.js'),
        format: 'esm',
        bundle: true,
        packages: 'external',
        platform: 'browser',
        target: 'es2022',
    });
}

function buildHtml(importMap: string): void {
    const template = fs.readFileSync(path.join(CLI, 'index.html'), 'utf-8');
    const html = template.replace('{{IMPORT_MAP}}', importMap);
    fs.writeFileSync(path.join(WEB_DIST, 'index.html'), html);
}

function buildServerEntry(): void {
    const serverEntry = `try {
    process.loadEnvFile?.();
} catch {}

import { Server } from '@uca/server';

const server = new Server();
server.innervate();

console.log('\\n🛑 Presiona [Ctrl + C] para detener el servidor\\n');

const shutdown = () => {
    console.log('\\n👋 Cerrando servidor UCA...');
    server.denervate();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
`;
    fs.writeFileSync(path.join(DIST, 'server.js'), serverEntry);
}

async function build(): Promise<void> {
    console.log('⚡ Building UCA application and server...');
    fs.mkdirSync(WEB_DIST, { recursive: true });
    compileTypeScript();
    await bundleVendorLibraries();
    console.log('📦 Vendor libraries bundled');
    const importMap = generateImportMap();
    console.log('🗺️  Import map generated');
    await transpileEntry();
    console.log('📄 Entry point transpiled');
    buildHtml(importMap);
    console.log(`✔ Web app complete → ${WEB_DIST}`);
    buildServerEntry();
    console.log(`🖥️  Unbundled server entry written → ${path.join(DIST, 'server.js')}`);
}

build();
