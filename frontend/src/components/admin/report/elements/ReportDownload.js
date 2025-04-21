import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

export const downloadExcel = (data) => {
  const workbook = XLSX.utils.book_new();
  const header = ["ORDER DATE", "QUANTITY", "SALES", "DISCOUNT", "COUPON USED", "PAYMENT METHOD", "SHIPPING CHARGE"];
  const rows = data.deliveredItems.map((i) => ({
    "ORDER DATE": i.createdAt?.split("T")[0] || "N/A",
    QUANTITY: i.quantity,
    SALES:
      i.coupon && i.coupon.value > 0
        ? i.quantity * i.price + i.quantity * i.price * 0.12 - (i.coupon.value * (i.quantity * i.price + i.quantity * i.price * 0.12)) / 100
        : i.quantity * i.price + i.quantity * i.price * 0.12 || 0,
    DISCOUNT: ((i.quantity * i.price + i.quantity * i.price * 0.12) * i.coupon.value) / 100 || 0,
    "COUPON USED": i.coupon.code || "—",
    "PAYMENT METHOD": i.paymentMethod,
    "SHIPPING CHARGE": i.shippingPrice,
  }));
  const dataWorksheet = XLSX.utils.json_to_sheet(rows, { header });
  XLSX.utils.book_append_sheet(workbook, dataWorksheet, "Sales Data");
  XLSX.writeFile(workbook, "sales_report.xlsx");
};

export const downloadPDF = (data) => {
  const doc = new jsPDF();
  doc.text("Sales Report", 15, 20);
  autoTable(doc, {
    head: [["ORDER DATE", "ORDERS", "SALES", "DISCOUNT", "COUPON USED", "PAYMENT METHOD", "SHIPPING CHARGE"]],
    body: data.deliveredItems.map((i) => [
      i.createdAt?.split("T")[0] || "N/A",
      i.quantity,
      i.coupon && i.coupon.value > 0
        ? i.quantity * i.price + i.quantity * i.price * 0.12 - (i.coupon.value * (i.quantity * i.price + i.quantity * i.price * 0.12)) / 100
        : i.quantity * i.price + i.quantity * i.price * 0.12 || 0,
      ((i.quantity * i.price + i.quantity * i.price * 0.12) * i.coupon.value) / 100 || 0,
      i.coupon.code || "—",
      i.paymentMethod,
      i.shippingPrice,
    ]),
  });
  doc.save("sales_report.pdf");
};