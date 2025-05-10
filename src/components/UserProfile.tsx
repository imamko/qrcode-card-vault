
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Upload } from "lucide-react";
import { UserData } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { updateUserProfileRequest } from "@/lib/auth";

interface UserProfileProps {
  userData: UserData;
}

export function UserProfile({ userData }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(userData.photoUrl || null);
  
  const form = useForm({
    defaultValues: {
      name: userData.name,
      phoneNumber: userData.phoneNumber || "",
      address: userData.address || "",
      extraInfo: userData.extraInfo || "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: any) => {
    try {
      toast.loading("Submitting update request...");
      
      // Convert photo to base64 if available
      let photoBase64 = null;
      if (photoFile) {
        const reader = new FileReader();
        photoBase64 = await new Promise<string | null>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(photoFile);
        });
      }
      
      // Submit update request
      const success = await updateUserProfileRequest({
        ...values,
        userId: userData.userId,
        photoData: photoBase64,
      });
      
      toast.dismiss();
      
      if (success) {
        toast.success("Update request submitted successfully. Waiting for admin approval.");
        setIsEditing(false);
      } else {
        toast.error("Failed to submit update request");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while submitting your request");
      console.error("Profile update error:", error);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border">
              <AvatarImage src={userData.photoUrl || ""} alt={userData.name} />
              <AvatarFallback className="text-lg">
                {userData.name ? userData.name.substring(0, 2).toUpperCase() : ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Card ID</h3>
              <p className="text-base">{userData.cardId}</p>
            </div>
            
            {userData.phoneNumber && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <p className="text-base">{userData.phoneNumber}</p>
              </div>
            )}
          </div>
          
          {userData.address && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p className="text-base">{userData.address}</p>
            </div>
          )}
          
          {userData.extraInfo && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
              <p className="text-base">{userData.extraInfo}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
            <p className="text-base">
              {new Date(userData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={photoPreview || ""} alt="Preview" />
                  <AvatarFallback>
                    {form.getValues("name") ? form.getValues("name").substring(0, 2).toUpperCase() : ""}
                  </AvatarFallback>
                </Avatar>
                
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <Upload className="h-4 w-4" />
                    <span>Upload photo</span>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max 5MB)</p>
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="extraInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit for Approval
                </Button>
              </DialogFooter>
              
              <p className="text-xs text-muted-foreground text-center mt-2">
                Your profile changes will be reviewed by an administrator before they take effect.
              </p>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserProfile;
