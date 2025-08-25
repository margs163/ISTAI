import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    billingDate: "Dec 06, 2025",
    status: "Paid",
    Plan: "Pro Plan",
    Credits: 300,
  },
  {
    invoice: "INV002",
    billingDate: "Jan 06, 2025",
    status: "Paid",
    Plan: "Pro Plan",
    Credits: 300,
  },
  {
    invoice: "INV003",
    billingDate: "March 06, 2025",
    status: "Paid",
    Plan: "Ultimate Plan",
    Credits: 700,
  },
  {
    invoice: "INV004",
    billingDate: "Apr 06, 2025",
    status: "Unpaid",
    Plan: "Pro Plan",
    Credits: 300,
  },
  {
    invoice: "INV005",
    billingDate: "Mat 06, 2025",
    status: "Pending",
    Plan: "Pro Plan",
    Credits: 300,
  },
];

import React from "react";

export default function BillingHistory() {
  return (
    <Table className="overflow-x-scroll">
      <TableHeader>
        <TableRow className="bg-gray-100 p-2 px-4 rounded-md">
          <TableHead className="">Invoice</TableHead>
          <TableHead>Billing date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead className="text-right">Credits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm font-normal text-gray-700">
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice} className="">
            <TableCell className="font-medium py-3">
              {invoice.invoice}
            </TableCell>
            <TableCell className="">{invoice.billingDate}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell className="text-right">{invoice.Plan}</TableCell>
            <TableCell className="text-right">{invoice.Credits}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
