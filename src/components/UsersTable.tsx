
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserData, CardData } from "@/types";

interface UsersTableProps {
  users: UserData[];
  cards: CardData[];
}

export function UsersTable({ users, cards }: UsersTableProps) {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get card status for a user
  const getCardStatus = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return { status: "Unknown", validated: false };
    
    return {
      status: card.isValid ? "Valid" : "Invalid",
      validated: !!card.validatedAt
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Card Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const { status, validated } = getCardStatus(user.cardId);
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={status === "Valid" ? "default" : "destructive"}>
                        {status}
                      </Badge>
                      {validated && (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No users registered yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default UsersTable;
