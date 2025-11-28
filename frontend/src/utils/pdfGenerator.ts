import jsPDF from 'jspdf'

interface ChecklistPDFData {
  clientName?: string
  supervisorName?: string
  date: string
  checklistName: string
  locations: string[]
  turno?: string
  nomeColaborador?: string
  setor?: string
}

export async function generateChecklistPDF(data: ChecklistPDFData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Cores MAXPREMIER
  const blueDark = [3, 31, 95] // #031f5f
  const blueBright = [0, 175, 238] // #00afee
  const yellowGreen = [204, 255, 0] // #ccff00

  // Header com logo (simulado com texto)
  doc.setFillColor(...blueDark)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('MAXPREMIER', margin, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('FACILITIES', margin, 32)

  yPosition = 50

  // Título do Checklist
  doc.setTextColor(...blueDark)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('CHECKLIST DE INSPEÇÃO', margin, yPosition)
  yPosition += 10

  // Informações do Checklist
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Checklist:', margin, yPosition)
  doc.setFont('helvetica', 'normal')
  doc.text(data.checklistName, margin + 30, yPosition)
  yPosition += 8

  // Linha divisória
  doc.setDrawColor(...blueBright)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  // Campos de preenchimento
  doc.setFont('helvetica', 'bold')
  doc.text('DADOS DA VISITA', margin, yPosition)
  yPosition += 8

  // Cliente
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Nome do Cliente: ___________________________________________', margin, yPosition)
  yPosition += 7
  if (data.clientName) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.clientName, margin + 45, yPosition - 7)
    doc.setFont('helvetica', 'normal')
  }

  // Supervisor
  doc.text('Nome do Supervisor: ________________________________________', margin, yPosition)
  yPosition += 7
  if (data.supervisorName) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.supervisorName, margin + 48, yPosition - 7)
    doc.setFont('helvetica', 'normal')
  }

  // Data
  doc.text('Data: ___________________', margin, yPosition)
  yPosition += 7
  doc.setFont('helvetica', 'bold')
  doc.text(data.date, margin + 20, yPosition - 7)
  doc.setFont('helvetica', 'normal')
  yPosition += 5

  // Setor
  doc.text('Setor: ___________________', margin, yPosition)
  yPosition += 7
  if (data.setor) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.setor, margin + 25, yPosition - 7)
    doc.setFont('helvetica', 'normal')
  }

  // Turno
  doc.text('Turno: ___________________', margin, yPosition)
  yPosition += 7
  if (data.turno) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.turno, margin + 25, yPosition - 7)
    doc.setFont('helvetica', 'normal')
  }

  // Colaborador
  doc.text('Colaborador: ________________________________________', margin, yPosition)
  yPosition += 7
  if (data.nomeColaborador) {
    doc.setFont('helvetica', 'bold')
    doc.text(data.nomeColaborador, margin + 38, yPosition - 7)
    doc.setFont('helvetica', 'normal')
  }
  yPosition += 8

  // Linha divisória
  doc.setDrawColor(...blueBright)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  // Locais de Inspeção
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('LOCAIS A SEREM VISTORIADOS', margin, yPosition)
  yPosition += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  data.locations.forEach((location, index) => {
    // Verificar se precisa de nova página
    if (yPosition > 250) {
      doc.addPage()
      yPosition = margin
    }

    const itemNumber = (index + 1).toString().padStart(2, '0')
    
    // Checkbox e nome do local
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.rect(margin, yPosition - 4, 4, 4) // Checkbox
    
    doc.text(`${itemNumber}. ${location}`, margin + 7, yPosition)
    
    // Linha pontilhada para observações
    const lineY = yPosition + 2
    doc.setLineWidth(0.1)
    doc.setDrawColor(200, 200, 200)
    let xPos = margin + 7
    while (xPos < pageWidth - margin - 20) {
      doc.circle(xPos, lineY, 0.3, 'F')
      xPos += 2
    }
    
    yPosition += 8
  })

  // Espaço para observações gerais
  if (yPosition > 220) {
    doc.addPage()
    yPosition = margin
  } else {
    yPosition += 10
  }

  doc.setDrawColor(...blueBright)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('OBSERVAÇÕES GERAIS:', margin, yPosition)
  yPosition += 10

  doc.setFont('helvetica', 'normal')
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.1)
  for (let i = 0; i < 6; i++) {
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 5
  }

  // Assinatura
  yPosition += 5
  if (yPosition > 250) {
    doc.addPage()
    yPosition = margin
  }

  doc.setDrawColor(...blueBright)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Assinatura do Cliente:', margin, yPosition)
  yPosition += 15

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 5

  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Nome e assinatura', margin, yPosition)

  // Rodapé
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Página ${i} de ${totalPages} - MAXPREMIER Facilities`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Gerar nome do arquivo
  const fileName = `checklist-${data.checklistName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
  
  // Salvar PDF
  doc.save(fileName)
}

