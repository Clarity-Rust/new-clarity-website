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

const Leaderboard: React.FC = () => {
  // Changed the sample data as per your request
  const invoices = [
    {
      invoice: "Coming Soon",
      paymentStatus: "Top Players",
      totalAmount: "Will be tracked soon",
      paymentMethod: "Stay Tuned",
    },
  ];

  return (
    <div className="mx-20 flex h-screen flex-col place-content-center place-items-center justify-center">
      <h1 className="text-3xl"> Player Leaderboard</h1>
      <Table className="">
        <TableCaption>A list of the top players, by server.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* Removed the total from TableFooter since we are now dealing with a placeholder */}
      </Table>
    </div>
  );
};

export default Leaderboard;
