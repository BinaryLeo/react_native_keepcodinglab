
export interface USERPROPS {
    userName: string; 
    userEmail: string; 
    userPhone: string; 
    userPassword: string; 
}
export type IAuthSate = {
  
    authState: {
      logged: boolean;
      userPassword: string; 
      userEmail: string; 
      userName: string; 
      userRole: string; 
    };
};