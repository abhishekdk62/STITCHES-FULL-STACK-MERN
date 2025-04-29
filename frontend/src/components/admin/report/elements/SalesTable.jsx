import React from 'react';

const SalesTable = ({ salesReportData, selectedFilters, formatCurrency }) => {
  const totaldiscount = salesReportData?.deliveredItems?.reduce((acc, i) => {
    acc +=
      (i.quantity * i.price + i.quantity * i.price * 0.12) *
        (i.coupon.value / 100) || 0;
    return acc;
  }, 0);

  const totalShippingCharge = salesReportData?.deliveredItems?.reduce(
    (acc, i) => {
      acc += i.shippingPrice || 0;
      return acc;
    },
    0
  );

  const totalPrice = salesReportData?.deliveredItems?.reduce((acc, i) => {
    const hasCoupon = i.coupon && i.coupon.value > 0;
    const itemPriceWithTax = i.quantity * i.price + i.quantity * i.price * 0.12;
    return (
      acc +
      (hasCoupon
        ? itemPriceWithTax - (i.coupon.value * itemPriceWithTax) / 100
        : itemPriceWithTax)
    );
  }, 0);

  const ordersCount = salesReportData?.deliveredItems?.reduce(
    (acc, cur) => acc + Number(cur.quantity),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <p className="text-lg font-semibold mt-1">Sales Breakdown</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              {selectedFilters.showDiscount && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coupon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipping Charge
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesReportData.deliveredItems.map((i, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {i.createdAt.split('T')[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(
                    i.coupon && i.coupon.value > 0
                      ? i.quantity * i.price +
                          i.quantity * i.price * 0.12 -
                          (i.coupon.value *
                            (i.quantity * i.price +
                              i.quantity * i.price * 0.12)) /
                            100
                      : i.quantity * i.price + i.quantity * i.price * 0.12 || 0
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {i.quantity}
                </td>
                {selectedFilters.showDiscount && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(
                      ((i.quantity * i.price + i.quantity * i.price * 0.12) *
                        i.coupon.value) /
                        100 || 0
                    )}
                  </td>
                )}
                <td className=" whitespace-nowrap text-sm text-gray-900">
                  <p className="text-green-400">
                    {i.coupon.code || 'NO COUPON USED'}
                  </p>
                </td>
                <td className=" whitespace-nowrap text-sm text-gray-900">
                  <p className="text-red-400 text-center">{i.paymentMethod}</p>
                </td>
                <td className=" whitespace-nowrap text-sm text-gray-900">
                  <p className="text-red-400 text-center">{i.shippingPrice}</p>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {formatCurrency(totalPrice)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {ordersCount}
              </td>
              {selectedFilters.showDiscount && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(totaldiscount)}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                ----------
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                ----------
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-gray-900">
                {totalShippingCharge}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
