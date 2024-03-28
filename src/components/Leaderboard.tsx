import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Leaderboard: React.FC = () => {
  const invoices = [
    {
      invoice: "Coming Soon",
      paymentStatus: "Top Players",
      totalAmount: "Will be tracked soon",
      placeHolder: "Stay Tuned",
      paymentMethod: "Stay Tuned",
    },
  ];

  return (
    <div className="mx-20 flex h-screen flex-col place-content-center place-items-center justify-center">
      <h1 className="text-3xl"> Player Leaderboard</h1>
      <Table className="">
        <TableCaption>
          A list of the top players, by server. <b>Work in progress.</b>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Position</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Kills</TableHead>
            <TableHead>Deaths</TableHead>
            <TableHead className="text-right">Kill/Death Ratio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell>{invoice.placeHolder}</TableCell>
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
