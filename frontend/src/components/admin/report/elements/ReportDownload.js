import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

export const downloadExcel = (data) => {
  const workbook = XLSX.utils.book_new();

  const total_stats = [
    { Title: 'Total_Sales', value: data.totPrice },
    { Title: 'Total_Orders', value: data.totQuantity },
    { Title: 'Total_Discount', value: data.totDiscount },
  ];

  const total = XLSX.utils.json_to_sheet(total_stats);
  XLSX.utils.book_append_sheet(workbook, total, 'Overall Summary');

  const header = [
    'ORDER DATE',
    'QUANTITY',
    'SALES',
    'DISCOUNT',
    'COUPON USED',
    'PAYMENT METHOD',
    'SHIPPING CHARGE',
  ];
  const rows = data.deliveredItems.map((i) => ({
    'ORDER DATE': i.createdAt?.split('T')[0] || 'N/A',
    QUANTITY: i.quantity,
    SALES:
      i.coupon && i.coupon.value > 0
        ? i.quantity * i.price +
          i.quantity * i.price * 0.12 -
          (i.coupon.value *
            (i.quantity * i.price + i.quantity * i.price * 0.12)) /
            100
        : i.quantity * i.price + i.quantity * i.price * 0.12 || 0,
    DISCOUNT:
      ((i.quantity * i.price + i.quantity * i.price * 0.12) * i.coupon.value) /
        100 || 0,
    'COUPON USED': i.coupon.code || '—',
    'PAYMENT METHOD': i.paymentMethod,
    'SHIPPING CHARGE': i.shippingPrice,
  }));
  const dataWorksheet = XLSX.utils.json_to_sheet(rows, { header });
  XLSX.utils.book_append_sheet(workbook, dataWorksheet, 'Sales Data');
  XLSX.writeFile(workbook, 'sales_report.xlsx');
};

export const downloadPDF = (data) => {
  const doc = new jsPDF();

  // 🔥 Title comes first
  doc.text('Sales Report', 15, 20);

  // 🔽 Summary data
  const Summary = [
    ['Total Sales', data.totPrice],
    ['Total Orders', data.totQuantity],
    ['Total Discount', data.totDiscount],
  ];

  // 📊 Summary table
  autoTable(doc, {
    startY: 30, // right below the title
    head: [['Metric', 'Value']],
    body: Summary,
    theme: 'grid',
  });

  // Get Y position where next table should start
  const finalY = doc.lastAutoTable.finalY + 10;

  // 🧾 Sales data table
  autoTable(doc, {
    startY: finalY,
    head: [
      [
        'ORDER DATE',
        'ORDERS',
        'SALES',
        'DISCOUNT',
        'COUPON USED',
        'PAYMENT METHOD',
        'SHIPPING CHARGE',
      ],
    ],
    body: data.deliveredItems.map((i) => [
      i.createdAt?.split('T')[0] || 'N/A',
      i.quantity,
      i.coupon && i.coupon.value > 0
        ? i.quantity * i.price +
          i.quantity * i.price * 0.12 -
          (i.coupon.value *
            (i.quantity * i.price + i.quantity * i.price * 0.12)) /
            100
        : i.quantity * i.price + i.quantity * i.price * 0.12 || 0,
      ((i.quantity * i.price + i.quantity * i.price * 0.12) * i.coupon.value) /
        100 || 0,
      i.coupon.code || '—',
      i.paymentMethod,
      i.shippingPrice,
    ]),
  });

  // 💾 Save the file
  doc.save('sales_report.pdf');
};
