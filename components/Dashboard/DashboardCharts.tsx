'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const lineData = [
  { name: 'السبت', الحجاج: 120, الرحلات: 24 },
  { name: 'الأحد', الحجاج: 132, الرحلات: 30 },
  { name: 'الاثنين', الحجاج: 101, الرحلات: 20 },
  { name: 'الثلاثاء', الحجاج: 156, الرحلات: 35 },
  { name: 'الأربعاء', الحجاج: 129, الرحلات: 28 },
  { name: 'الخميس', الحجاج: 171, الرحلات: 42 },
  { name: 'الجمعة', الحجاج: 145, الرحلات: 38 },
]

const pieData = [
  { name: 'مكتملة', value: 65 },
  { name: 'قيد التنفيذ', value: 25 },
  { name: 'معلقة', value: 10 },
]

const colors = ['#228B22', '#FFA500', '#EF4444']

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">إحصائيات الأسبوع</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="الحجاج"
              stroke="#228B22"
              strokeWidth={2}
              dot={{ fill: '#228B22' }}
            />
            <Line
              type="monotone"
              dataKey="الرحلات"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">حالة الرحلات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
