
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserData, CardData } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UsersTableProps {
  users: UserData[];
  cards: CardData[];
}

export function UsersTable({ users, cards }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

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

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const getUserCard = (cardId: string) => {
    return cards.find(c => c.id === cardId);
  };

  return (
    <>
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
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleUserClick(user)}
                  >
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

      {selectedUser && (
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.photoUrl || ""} alt={selectedUser.name} />
                  <AvatarFallback>
                    {selectedUser.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm">{selectedUser.userId}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Card ID</p>
                  <p className="text-sm">{selectedUser.cardId}</p>
                </div>
              </div>
              
              {selectedUser.phoneNumber && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{selectedUser.phoneNumber}</p>
                </div>
              )}
              
              {selectedUser.address && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{selectedUser.address}</p>
                </div>
              )}
              
              {selectedUser.extraInfo && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Extra Information</p>
                  <p className="text-sm">{selectedUser.extraInfo}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
              </div>
              
              {getUserCard(selectedUser.cardId)?.validatedAt && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Validated</p>
                  <p className="text-sm">
                    {formatDate(getUserCard(selectedUser.cardId)?.validatedAt || "")}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default UsersTable;
