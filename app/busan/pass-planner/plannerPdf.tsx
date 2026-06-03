'use client'

import { Document, Font, Image, Link, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer'

export type PlannerPdfLink = {
  label: string
  href: string
}

export type PlannerPdfStop = {
  order: number
  name: string
  category: string
  color: string
  note?: string
  links: PlannerPdfLink[]
}

export type PlannerPdfDay = {
  title: string
  stops: PlannerPdfStop[]
}

export type PlannerPdfData = {
  title: string
  updatedAt?: string
  days: PlannerPdfDay[]
}

const FONT_FAMILY = 'Noto Sans CJK TC'
const LOGO_SRC = '/assets/logo.jpg'
let fontsRegistered = false

function registerPlannerPdfFonts() {
  if (fontsRegistered) return
  Font.register({
    family: FONT_FAMILY,
    fonts: [
      { src: '/fonts/NotoSansCJKtc-Regular.otf', fontWeight: 400 },
      { src: '/fonts/NotoSansCJKtc-Regular.otf', fontWeight: 700 },
    ],
  })
  fontsRegistered = true
}

function safeFileName(value: string) {
  const cleaned = value
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned || '旅杰規劃'
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 30000)
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingTop: 26,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
    color: '#172033',
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    lineHeight: 1.5,
  },
  coverPage: {
    paddingHorizontal: 40,
    paddingTop: 52,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    color: '#172033',
    fontFamily: FONT_FAMILY,
  },
  coverBrandRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 34,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 9,
  },
  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: {
    color: '#1f4f5d',
    fontSize: 13,
    fontWeight: 700,
  },
  coverTitle: {
    color: '#172033',
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  toc: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#d9e8ec',
    paddingTop: 15,
  },
  tocTitle: {
    marginBottom: 8,
    color: '#3b7786',
    fontSize: 11,
    fontWeight: 700,
  },
  tocLink: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f5',
    color: '#172033',
    textDecoration: 'none',
  },
  tocDay: {
    color: '#172033',
    fontSize: 11,
    fontWeight: 700,
  },
  tocHint: {
    color: '#1f6f85',
    fontSize: 9.5,
    fontWeight: 700,
  },
  dayHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d9e8ec',
  },

  dayTitle: {
    color: '#172033',
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.12,
  },
  backToCover: {
    color: '#1f6f85',
    fontSize: 9.5,
    fontWeight: 700,
    textDecoration: 'none',
  },
  stop: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f5',
  },
  stopTopRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 30,
    flexWrap: 'wrap',
  },
  stopNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    marginTop: -5.4,
    color: '#ffffff',
    fontSize: 11.2,
    fontWeight: 700,
    lineHeight: 1,
    textAlign: 'center',
  },
  stopNameBox: {
    height: 24,
    display: 'flex',
    justifyContent: 'center',
  },
  stopName: {
    color: '#172033',
    fontSize: 13.5,
    fontWeight: 700,
    lineHeight: 1,
    marginTop: -7.0,
  },
  categoryBadge: {
    height: 24,
    borderRadius: 5,
    paddingHorizontal: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    marginTop: -5.4,
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
    textAlign: 'center',
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    marginLeft: 31,
  },
  link: {
    color: '#1f6f85',
    fontSize: 11.5,
    fontWeight: 700,
    textDecoration: 'underline',
  },
  note: {
    marginTop: 5,
    marginLeft: 31,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#b9d7de',
    color: '#475569',
    fontSize: 11,
  },
})

function PlannerPdfDocument({ data }: { data: PlannerPdfData }) {
  return (
    <Document title={`${data.title}｜旅杰規劃`} author="JieJourneys">
      <Page id="cover" size="A4" style={styles.coverPage}>
        <View style={styles.coverBrandRow}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- React PDF Image does not expose an alt prop. */}
          <Image src={LOGO_SRC} style={styles.logo} />
          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>旅杰規劃｜JieJourneys Planner</Text>
          </View>
        </View>
        <Text style={styles.coverTitle}>{data.title}</Text>
        <View style={styles.toc}>
          <Text style={styles.tocTitle}>行程目錄</Text>
          {data.days.map((day, dayIndex) => (
            <Link key={`toc-day-${dayIndex + 1}`} src={`#day-${dayIndex + 1}`} style={styles.tocLink}>
              <Text style={styles.tocDay}>{day.title}</Text>
              <Text style={styles.tocHint}>查看</Text>
            </Link>
          ))}
        </View>
      </Page>

      {data.days.map((day, dayIndex) => (
        <Page key={`day-page-${dayIndex + 1}`} id={`day-${dayIndex + 1}`} size="A4" style={styles.page} wrap>
          <View style={styles.dayHeader} fixed>
            <Text style={styles.dayTitle}>{day.title}</Text>
            <Link src="#cover" style={styles.backToCover}>
              回目錄
            </Link>
          </View>

          {day.stops.map((stop) => (
            <View key={`${dayIndex + 1}-${stop.order}-${stop.name}`} style={styles.stop} wrap={false}>
              <View style={styles.stopTopRow}>
                <View style={[styles.stopNumberCircle, { backgroundColor: stop.color }]}>
                  <Text style={styles.stopNumberText}>{stop.order}</Text>
                </View>
                <View style={styles.stopNameBox}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                </View>
                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor: '#ffffff',
                      borderWidth: 1,
                      borderColor: stop.color,
                    },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: stop.color }]}>{stop.category}</Text>
                </View>
              </View>
              {stop.links.length > 0 ? (
                <View style={styles.links}>
                  {stop.links.map((link, index) => (
                    <Link key={`${link.label}-${link.href}-${index}`} src={link.href} style={styles.link}>
                      {link.label}
                    </Link>
                  ))}
                </View>
              ) : null}
              {stop.note ? <Text style={styles.note}>{stop.note}</Text> : null}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  )
}

export async function downloadPlannerPdf(data: PlannerPdfData) {
  registerPlannerPdfFonts()
  const blob = await pdf(<PlannerPdfDocument data={data} />).toBlob()
  downloadBlob(blob, `${safeFileName(data.title)}.pdf`)
}



