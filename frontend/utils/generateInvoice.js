import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFInvoice = (
  order,
  subtotal,
  shipping,
  tax,
  discount,
  grandTotal
) => {
  const doc = new jsPDF();

  // Title and Order Info
  doc.setFontSize(18);
  doc.text('Invoice', 14, 22);
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.orderID || 'Unknown'}`, 14, 32);
  doc.text(
    `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    14,
    40
  );

  // Prepare table data
  const tableColumn = ['Description', 'Amount'];
  const tableRows = [
    ['Subtotal', `$${subtotal.toFixed(2)}`],
    ['Shipping', `$${shipping.toFixed(2)}`],
    ['Tax', `$${tax.toFixed(2)}`],
  ];

  if (discount > 0) {
    tableRows.push(['Discount', `-$${discount.toFixed(2)}`]);
  }

  tableRows.push(['Grand Total', `$${grandTotal.toFixed(2)}`]);

  // Generate table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
  });

  // Save the PDF
  doc.save(`invoice_${order.orderID || 'invoice'}.pdf`);
};
