import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3Fwr1TObpYvWxYI.ttf',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1f2937',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
  },
  value: {
    fontSize: 12,
    fontWeight: 600,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  cell: {
    flex: 1,
    padding: 6,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 10,
  },
})

const formatCurrency = (value) =>
  `KES ${Number(value || 0).toLocaleString('en-KE')}`

const PayrollPDF = ({ payroll }) => {
  const payrollItems = payroll?.payrollItems || []

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {payroll?.month}/{payroll?.year} Payroll Report
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Payroll ID:</Text>
          <Text style={styles.value}>{payroll?._id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Generated On:</Text>
          <Text style={styles.value}>
            {new Date(payroll?.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total Employees:</Text>
          <Text style={styles.value}>
            {payroll?.summary?.totalEmployees || 0}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gross Pay:</Text>
          <Text style={styles.value}>
            {formatCurrency(payroll?.summary?.totalGrossPay)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total Deductions:</Text>
          <Text style={styles.value}>
            {formatCurrency(payroll?.summary?.totalDeductions)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Net Pay:</Text>
          <Text style={styles.value}>
            {formatCurrency(payroll?.summary?.totalNetPay)}
          </Text>
        </View>

        {payrollItems.length > 0 && (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.bold]}>Employee</Text>
              <Text style={[styles.cell, styles.bold]}>Gross</Text>
              <Text style={[styles.cell, styles.bold]}>PAYE</Text>
              <Text style={[styles.cell, styles.bold]}>NHIF</Text>
              <Text style={[styles.cell, styles.bold]}>NSSF</Text>
              <Text style={[styles.cell, styles.bold]}>Housing</Text>
              <Text style={[styles.cell, styles.bold]}>Other</Text>
              <Text style={[styles.cell, styles.bold]}>Deductions</Text>
              <Text style={[styles.cell, styles.bold]}>Net Pay</Text>
            </View>

            {payrollItems.map((item, i) => {
              const d = item.deductions || {}
              const other =
                item.totalDeductions -
                (d.PAYE || 0) -
                (d.NHIF || 0) -
                (d.NSSF || 0) -
                (d['Housing Levy'] || 0)

              return (
                <View style={styles.tableRow} key={i}>
                  <Text style={styles.cell}>
                    {item.employeeName} ({item.employeeId})
                  </Text>
                  <Text style={styles.cell}>
                    {formatCurrency(item.grossSalary)}
                  </Text>
                  <Text style={styles.cell}>{formatCurrency(d.PAYE)}</Text>
                  <Text style={styles.cell}>{formatCurrency(d.NHIF)}</Text>
                  <Text style={styles.cell}>{formatCurrency(d.NSSF)}</Text>
                  <Text style={styles.cell}>
                    {formatCurrency(d['Housing Levy'])}
                  </Text>
                  <Text style={styles.cell}>{formatCurrency(other)}</Text>
                  <Text style={styles.cell}>
                    {formatCurrency(item.totalDeductions)}
                  </Text>
                  <Text style={styles.cell}>
                    {formatCurrency(item.netSalary)}
                  </Text>
                </View>
              )
            })}
          </View>
        )}

        <View style={styles.footer}>
          <Text>Approved By: ___________________________</Text>
          <Text>Date: ____________________</Text>
          <Text style={{ marginTop: 12 }}>
            This document was system-generated on{' '}
            {new Date().toLocaleDateString()}.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default PayrollPDF
