import React, { useState, useEffect } from 'react'

import InfoCard from 'example/components/Cards/InfoCard'
import PageTitle from 'example/components/Typography/PageTitle'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'
import { ChatIcon, CartIcon, PeopleIcon } from 'icons'



import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTaskStore } from 'hooks/task/task-store'
import PaymentDashTable from './payment-dash'
import { useCustomerStore } from 'hooks/customer/customer-store'
import { usePaymentStore } from 'hooks/payment/payment-store'
import { useTokenStore } from 'hooks/token/token-store'
import { useUserStore } from 'hooks/user/user-store'

function Dashboard() {
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const [page, setPage] = useState(1)
  const [data, setData] = useState<ITableData[]>([])

  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p: number) {
    setPage(p)
  }

  // Task store integration
  const { customers, fetchCustomers } = useCustomerStore();
  const { tokens, fetchTokens } = useTokenStore();
  const { payments, fetchPayments } = usePaymentStore();
  const { users, fetchUsers } = useUserStore();

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch data from stores on component mount
  useEffect(() => {
    fetchCustomers();
    fetchTokens();
    fetchPayments();
    fetchUsers();
  }, [fetchCustomers, fetchTokens, fetchPayments, fetchUsers]);

  // Update state when store data changes
  useEffect(() => {
    setTotalCustomers(customers?.length || 0);
    setTotalTokens(tokens?.length || 0);
    setTotalPayments(payments?.length || 0);
    setTotalPayments(payments?.length || 0);
    setTotalUsers(users?.length || 0);
  }, [customers, tokens, payments, users]);


  // Paginated data
  const [paginatedPayments, setPaginatedPayments] = useState([]);

  // Fetch tasks from the store on component mount
  useEffect(() => {
    console.log("payments", payments)
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedPayments(payments?.slice(startIndex, endIndex));
  }, [payments, page]);


  return (
    <Layout>
      <PageTitle>Dashboard</PageTitle>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Customer" value={totalCustomers}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>


        <InfoCard title="Total Token" value={totalTokens}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Payment" value={totalPayments}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total User" value={totalUsers}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
      <PaymentDashTable />
    </Layout>
  )
}

export default Dashboard
