import JSZip from 'jszip'
import { downloadFile } from './supabase'

export async function exportAsZip(belege, onProgress = () => {}) {
  if (!belege || belege.length === 0) throw new Error('Keine Belege zum Exportieren.')
  const zip = new JSZip()
  const folder = zip.folder('Belege')
  const csvRows = [['Dateiname', 'Lieferant', 'Belegdatum', 'Bezahldatum', 'Betrag', 'Währung', 'Erfassungsdatum', 'Notizen']]
  for (let i = 0; i < belege.length; i++) {
    const beleg = belege[i]
    onProgress(Math.round((i / belege.length) * 85))
    try {
      const blob = await downloadFile(beleg.file_path)
      const ext = beleg.file_name.split('.').pop()
      const safeName = `${String(i+1).padStart(3,'0')}_${(beleg.lieferant||'Unbekannt').replace(/[^a-zA-Z0-9]/g,'_')}_${beleg.belegdatum||'kein-datum'}.${ext}`
      folder.file(safeName, blob)
      csvRows.push([safeName, beleg.lieferant||'', beleg.belegdatum||'', beleg.bezahldatum||'', beleg.betrag!=null?String(beleg.betrag):'', beleg.waehrung||'', beleg.erfassungsdatum?new Date(beleg.erfassungsdatum).toLocaleDateString('de-AT'):'', beleg.notizen||''])
    } catch(err) { console.error(err) }
  }
  const csvContent = '\uFEFF'+csvRows.map(row=>row.map(c=>`"${c.replace(/"/g,'""')}"`).join(';')).join('\n')
  zip.file('index.csv',csvContent)
  onProgress(90)
  const zipBlob = await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}},m=>onProgress(90+Math.round(m.percent*0.1)))
  const url=URL/createObjectURL(zipBlob)
  const a=document.createElement('a')
  a.href=url;a.download=`Belege_Export_${new Date().toISOString().slice(0,10)}.zip`
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)
  onProgress(100)
}
