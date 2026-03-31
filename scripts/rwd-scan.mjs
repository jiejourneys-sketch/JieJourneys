import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(process.cwd())
const appDir = path.join(projectRoot, 'app')
const outDir = path.join(projectRoot, 'rwd-report')
const shotsDir = path.join(outDir, 'screenshots')

const VIEWPORTS = [
  { name: '320', width: 320, height: 800 },
  { name: '390', width: 390, height: 800 },
  { name: '430', width: 430, height: 800 },
]

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function walkPages(dir) {
  /** @type {string[]} */
  const out = []
  /** @type {string[]} */
  const stack = [dir]

  while (stack.length) {
    const cur = stack.pop()
    const entries = fs.readdirSync(cur, { withFileTypes: true })
    for (const ent of entries) {
      if (ent.name.startsWith('.')) continue
      const full = path.join(cur, ent.name)
      if (ent.isDirectory()) {
        // ignore next internals and asset folders
        if (ent.name === 'node_modules') continue
        stack.push(full)
      } else if (ent.isFile()) {
        if (ent.name === 'page.tsx' || ent.name === 'page.jsx' || ent.name === 'page.js' || ent.name === 'page.ts') {
          out.push(full)
        }
      }
    }
  }
  return out
}

function segmentToSample(seg) {
  if (/^\[\.\.\..+\]$/.test(seg)) return 'test'
  if (/^\[.+\]$/.test(seg)) return '1'
  return seg
}

function fileToRoute(pageFile) {
  const rel = path.relative(appDir, pageFile).replaceAll(path.sep, '/')
  const noPage = rel.replace(/(^|\/)page\.(t|j)sx?$/i, '')
  const parts = noPage.split('/').filter(Boolean)
  const routeParts = []
  for (const p of parts) {
    // ignore route groups (foo)
    if (/^\(.+\)$/.test(p)) continue
    // ignore parallel routes @foo
    if (p.startsWith('@')) continue
    routeParts.push(segmentToSample(p))
  }
  return '/' + routeParts.join('/')
}

async function markOverflowElements(page) {
  return await page.evaluate(() => {
    const innerWidth = window.innerWidth
    const de = document.documentElement
    const scrollWidth = de.scrollWidth
    const delta = scrollWidth - innerWidth

    const isVisible = (el) => {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false
      const r = el.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) return false
      // Offscreen but still could overflow; keep it if it crosses x boundaries
      return true
    }

    const score = (r) => {
      const overR = Math.max(0, r.right - innerWidth)
      const overL = Math.max(0, -r.left)
      return overR + overL
    }

    // clear previous marks
    document.querySelectorAll('[data-rwd-overflow]').forEach((n) => n.removeAttribute('data-rwd-overflow'))

    /** @type {{el: Element, rect: DOMRect, amount: number}[]} */
    const offenders = []
    const all = Array.from(document.querySelectorAll('body *'))
    for (const el of all) {
      if (!(el instanceof Element)) continue
      if (el.tagName === 'HTML' || el.tagName === 'BODY') continue
      if (!isVisible(el)) continue
      const r = el.getBoundingClientRect()
      if (r.right > innerWidth + 1 || r.left < -1) {
        const amount = score(r)
        if (amount > 1) offenders.push({ el, rect: r, amount })
      }
    }

    offenders.sort((a, b) => b.amount - a.amount)

    // Create a readable selector-ish label
    const labelOf = (el) => {
      const id = el.getAttribute('id')
      if (id) return `#${id}`
      const cls = (el.getAttribute('class') || '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
      if (cls.length) return `${el.tagName.toLowerCase()}.${cls.join('.')}`
      return el.tagName.toLowerCase()
    }

    const top = offenders.slice(0, 8).map((x, idx) => {
      ;(x.el).setAttribute('data-rwd-overflow', String(idx + 1))
      return {
        label: labelOf(x.el),
        tag: x.el.tagName.toLowerCase(),
        id: x.el.getAttribute('id') || '',
        className: x.el.getAttribute('class') || '',
        amount: Math.round(x.amount * 100) / 100,
        rect: {
          left: Math.round(x.rect.left * 100) / 100,
          right: Math.round(x.rect.right * 100) / 100,
          width: Math.round(x.rect.width * 100) / 100,
        },
      }
    })

    return {
      innerWidth,
      scrollWidth,
      delta: Math.round(delta * 100) / 100,
      offenders: top,
    }
  })
}

function mdEscape(s) {
  return String(s).replaceAll('|', '\\|')
}

async function main() {
  ensureDir(outDir)
  ensureDir(shotsDir)

  const baseURL = process.env.BASE_URL || 'http://localhost:3000'
  const pageFiles = walkPages(appDir)
  const routes = Array.from(new Set(pageFiles.map(fileToRoute))).sort()

  /** @type {any[]} */
  const results = []

  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.addStyleTag({
    content: `
      [data-rwd-overflow]{
        outline: 3px solid #ff1b1b !important;
        outline-offset: -2px !important;
        box-shadow: 0 0 0 3px rgba(255,27,27,0.35) !important;
      }
      [data-rwd-overflow]::before{
        content: attr(data-rwd-overflow);
        position: absolute;
        z-index: 2147483647;
        transform: translateY(-110%);
        background: #ff1b1b;
        color: #fff;
        font: 700 12px/1 ui-sans-serif, system-ui;
        padding: 4px 6px;
        border-radius: 8px;
        pointer-events: none;
      }
    `,
  })

  for (const route of routes) {
    const url = baseURL.replace(/\/$/, '') + route
    const row = { route, url, widths: {} }

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      const nav = await page
        .goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        .catch((e) => ({ error: String(e) }))
      const status = nav?.error ? 'NAV_ERROR' : typeof nav?.status === 'function' ? nav.status() : 'OK'
      // give layout a moment (fonts/images)
      await page.waitForTimeout(350)

      const measurement = await markOverflowElements(page)
      const overflow = measurement.delta > 0.5

      let screenshot = null
      if (overflow) {
        const safeRoute = route === '/' ? '_root' : route.slice(1).replaceAll('/', '__')
        const name = `${safeRoute}__w${vp.name}.png`
        const p = path.join(shotsDir, name)
        await page.screenshot({ path: p, fullPage: true })
        screenshot = `screenshots/${name}`
      }

      row.widths[vp.name] = {
        viewport: { width: vp.width, height: vp.height },
        status,
        overflow,
        innerWidth: measurement.innerWidth,
        scrollWidth: measurement.scrollWidth,
        delta: measurement.delta,
        offenders: measurement.offenders,
        screenshot,
      }
    }

    results.push(row)
  }

  await browser.close()

  const jsonPath = path.join(outDir, 'report.json')
  fs.writeFileSync(jsonPath, JSON.stringify({ baseURL, viewports: VIEWPORTS, results }, null, 2), 'utf8')

  const mdPath = path.join(outDir, 'report.md')
  const lines = []
  lines.push(`# RWD Overflow Report`)
  lines.push(``)
  lines.push(`- Base URL: \`${baseURL}\``)
  lines.push(`- Viewports: ${VIEWPORTS.map((v) => `${v.width}px`).join(', ')}`)
  lines.push(``)
  lines.push(`## Summary`)
  lines.push(``)
  lines.push(`| Route | 320 | 390 | 430 |`)
  lines.push(`|---|---:|---:|---:|`)

  for (const r of results) {
    const c = (w) => (r.widths[w].overflow ? '❌' : '✅')
    lines.push(`| ${mdEscape(r.route)} | ${c('320')} | ${c('390')} | ${c('430')} |`)
  }

  lines.push(``)
  lines.push(`## Details (overflow only)`)
  lines.push(``)

  for (const r of results) {
    const any = Object.values(r.widths).some((x) => x.overflow)
    if (!any) continue
    lines.push(`### ${mdEscape(r.route)}`)
    lines.push(``)
    lines.push(`URL: \`${r.url}\``)
    lines.push(``)

    for (const vp of VIEWPORTS) {
      const w = r.widths[vp.name]
      if (!w.overflow) continue
      lines.push(`- Width **${vp.width}px**: scrollWidth=${w.scrollWidth}, innerWidth=${w.innerWidth}, delta=${w.delta}`)
      if (w.screenshot) lines.push(`  - Screenshot: \`${w.screenshot}\``)
      if (w.offenders?.length) {
        lines.push(`  - Top offenders:`)
        for (const o of w.offenders) {
          lines.push(
            `    - ${mdEscape(o.label)} (amount=${o.amount}, rect.left=${o.rect.left}, rect.right=${o.rect.right}, width=${o.rect.width})`
          )
        }
      }
    }
    lines.push(``)
  }

  fs.writeFileSync(mdPath, lines.join('\n'), 'utf8')

  // eslint-disable-next-line no-console
  console.log(`Wrote: ${mdPath}`)
  // eslint-disable-next-line no-console
  console.log(`Wrote: ${jsonPath}`)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})

