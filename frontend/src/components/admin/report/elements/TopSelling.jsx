import React, { useEffect, useState } from "react";
import { getTopSellersApi } from "../../../../services/salesReportService";
import Table from "./Table";


const TopSelling = () => {
  const [topProducts, setTopProducts] = useState({});
  const [topCategories, setTopCategories] = useState({});
  const [topBrands, setTopBrands] = useState({});

  const getTopSellers = async () => {
    try {
      const { data } = await getTopSellersApi();
      if (data) {
        setTopProducts(data.topProduct || {});
        setTopCategories(data.topCategory || {});
        setTopBrands(data.topBrands || {});
      }
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching top sellers:", error);
    }
  };

  useEffect(() => {
    getTopSellers();
  }, []);

  // Sort and map data into array of {key, value}
  const sortDataByValue = (data) =>
    Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({ key, value }));

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Prepare rows for each table
  const productRows = sortDataByValue(topProducts).slice(0, 10);
  const categoryRows = sortDataByValue(topCategories).slice(0, 10);
  const brandRows = sortDataByValue(topBrands).slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Best Selling Products */}
      <section>
        <div className="p-6 border-b border-gray-200">
          <p className="text-lg font-semibold mt-1">
            Best Selling Products (Top 10)
          </p>
        </div>
        <Table
          columns={[
            { key: 'rank', label: '#', render: (_, idx) => idx + 1 },
            { key: 'product', label: 'Product Name', render: (row) => row.key },
            { key: 'orders', label: 'Total Orders', render: (row) => row.value },
          ]}
          rows={productRows}
        />
      </section>

      {/* Best Selling Categories */}
      <section>
        <div className="p-6 border-b border-gray-200">
          <p className="text-lg font-semibold mt-1">
            Best Selling Categories (Top 10)
          </p>
        </div>
        <Table
          columns={[
            { key: 'rank', label: '#', render: (_, idx) => idx + 1 },
            { key: 'category', label: 'Category', render: (row) => row.key },
            { key: 'sold', label: 'Total Products Sold', render: (row) => row.value },
          ]}
          rows={categoryRows}
        />
      </section>

      {/* Best Selling Brands */}
      <section>
        <div className="p-6 border-b border-gray-200">
          <p className="text-lg font-semibold mt-1">
            Best Selling Brands (Top 10)
          </p>
        </div>
        <Table
          columns={[
            { key: 'rank', label: '#', render: (_, idx) => idx + 1 },
            { key: 'brand', label: 'Brand', render: (row) => row.key },
            { key: 'sales', label: 'Total Sales', render: (row) => row.value },
          ]}
          rows={brandRows}
        />
      </section>
    </div>
  );
};

export default TopSelling;
