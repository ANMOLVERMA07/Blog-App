import { Client, Account, ID } from "appwrite";
import conf from '../conf/conf'


export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.projectId)
        this.account = new Account(this.client);
    }

    async createAccount({name,email,password}){
        try {
            const account = await this.account.create(
                ID.unique(),
                name,
                email,
                password
            )

            if(account){
                return this.login({email,password});
            }else{
                return account;
            }

        } catch (error) {
            console.log("Appwrite :: auth :: Create Account :: error",error);
            
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
            
        } catch (error) {
            console.log("Appwrite :: auth :: Login :: error",error);
        }
    }

    async logout(){
        try {
          await this.account.deleteSessions();
          return true;
        } catch (error) {
            console.log("Appwrite :: auth :: logout :: error",error);
            return false;
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
            
        } catch (error) {
            console.log("Appwrite :: auth :: Get Current User :: error",error);
        }
    }
}

const authService = new AuthService();

export default authService;