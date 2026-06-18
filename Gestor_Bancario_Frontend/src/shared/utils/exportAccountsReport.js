import ExcelJS from 'exceljs'

const ACCOUNT_TYPE_LABELS = {
  AHORRO: 'Ahorro',
  MONETARIA: 'Monetaria',
}

const typeLabel = (type) => ACCOUNT_TYPE_LABELS[type] || type || '-'

/** Genera y descarga un reporte Excel de las cuentas recibidas. */
export const exportAccountsReport = async (accounts = []) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Gestor Bancario'
  workbook.created = new Date()
  workbook.modified = new Date()

  const detailsSheet = workbook.addWorksheet('Detalles de Cuentas', {
    properties: { defaultRowHeight: 20 },
    views: [{ state: 'frozen', ySplit: 4 }],
  })

  detailsSheet.mergeCells('A1:H1')
  detailsSheet.getCell('A1').value = 'REPORTE DE CUENTAS'
  detailsSheet.getCell('A1').font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } }
  detailsSheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
  detailsSheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } }

  detailsSheet.mergeCells('A2:H2')
  detailsSheet.getCell('A2').value = `Generado el ${new Date().toLocaleString('es-GT')}`
  detailsSheet.getCell('A2').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF5B6570' } }
  detailsSheet.getCell('A2').alignment = { horizontal: 'right' }

  detailsSheet.addRow([])
  const detailHeaderRow = detailsSheet.addRow([
    'Número de Cuenta',
    'ID Usuario',
    'Tipo de Cuenta',
    'Moneda',
    'Saldo',
    'Estado',
    'Fecha de Creación',
    'Última Actualización',
  ])

  detailHeaderRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F75B5' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFB8C2CC' } },
      left: { style: 'thin', color: { argb: 'FFB8C2CC' } },
      bottom: { style: 'thin', color: { argb: 'FFB8C2CC' } },
      right: { style: 'thin', color: { argb: 'FFB8C2CC' } },
    }
  })

  accounts.forEach((account) => {
    const row = detailsSheet.addRow([
      account.numeroCuenta || '-',
      account.userId || '-',
      typeLabel(account.tipoCuenta),
      account.moneda || '-',
      Number(account.saldo || 0),
      account.estado ? 'Activa' : 'Inactiva',
      account.createdAt ? new Date(account.createdAt) : null,
      account.updatedAt ? new Date(account.updatedAt) : null,
    ])

    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9E2F3' } },
        left: { style: 'thin', color: { argb: 'FFD9E2F3' } },
        bottom: { style: 'thin', color: { argb: 'FFD9E2F3' } },
        right: { style: 'thin', color: { argb: 'FFD9E2F3' } },
      }
      cell.alignment = { vertical: 'middle' }

      if (colNumber === 5) {
        cell.numFmt = '#,##0.00'
        cell.alignment = { horizontal: 'right', vertical: 'middle' }
      }

      if (colNumber === 6) {
        const isActive = cell.value === 'Activa'
        cell.font = { bold: true, color: { argb: isActive ? 'FF1E7A3E' : 'FF7A1E1E' } }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isActive ? 'FFE8F5E9' : 'FFFDECEC' },
        }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
      }
    })

    if (row.number % 2 === 0) {
      row.eachCell((cell, colNumber) => {
        if (colNumber !== 6) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F9FC' } }
        }
      })
    }
  })

  detailsSheet.columns.forEach((column, index) => {
    const widths = [20, 18, 18, 12, 14, 14, 20, 20]
    column.width = widths[index] || 15
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Reporte_Cuentas_${new Date().toISOString().split('T')[0]}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
