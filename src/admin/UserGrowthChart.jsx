import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const UserGrowthChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/allusers")
      .then((res) => res.json())
      .then((users) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        let monthlyUsers = new Array(12).fill(0);

        users.forEach((u) => {
          const month = new Date(u.createdAt).getMonth();
          monthlyUsers[month]++;
        });

        let cumulativeUsers = [];
        monthlyUsers.reduce((acc, curr, i) => {
          cumulativeUsers[i] = acc + curr;
          return cumulativeUsers[i];
        }, 0);

        setChartData({
          labels: months,
          datasets: [
            {
              label: "New Users",
              data: monthlyUsers,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.25)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Total Users",
              data: cumulativeUsers,
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.25)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      });
  }, []);

  if (!chartData) return null;

  return (
    <div className="w-full lg:w-2/3 mt-6 ">
      <div className="bg-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-lg">
        <h5 className="text-white text-lg sm:text-xl font-semibold mb-4">
          User Growth
        </h5>

        {/* Chart Container with proper height */}
        <div className="relative w-full h-[220px] sm:h-[280px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "#cbd5f5",
                    boxWidth: 15,
                    font: { size: 12 }, // smaller legend text
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: "#94a3b8", font: { size: 11 } },
                  grid: { color: "rgba(255,255,255,0.05)" },
                },
                y: {
                  ticks: { color: "#94a3b8", font: { size: 11 } },
                  grid: { color: "rgba(255,255,255,0.05)" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;
