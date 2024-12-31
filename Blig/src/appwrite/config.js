import { Client, Databases, Storage,ID, Query } from "appwrite";
import conf from '../conf/conf'

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.projectId)
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title,content,featuredImage,status,slug,userId}){
        try {
            await this.databases.createDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite :: config :: Create Post :: error",error);
        }
    }

    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            await this.databases.updateDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
            return true
        } catch (error) {
            console.log("Appwrite :: auth :: update Post :: error",error);
            return false
        }
    }

    async getPost(slug){
        try {
           return await this.databases.getDocument(
                conf.databaseId,
                conf.collectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite :: auth :: get Post :: error",error);
        }
    }

    async deletePost(slug){
        try {
            return await this.databases.deleteDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite :: auth :: delete Post :: error",error);
            return false
        }
    }

    async getAllPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.databaseId,
                conf.collectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite :: auth :: get All Posts :: error",error);
        }
    }


    // File Services

    async uploadFile(fileId){
        try {
            await this.bucket.createFile(
                conf.bucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("Appwrite :: auth :: upload File :: error",error);
        }
    }

    async updateFile(fileId){
        try {
            return await this.bucket.updateFile(
                conf.bucketId,
                fileId,
            )
        } catch (error) {
            console.log("Appwrite :: auth :: Update File :: error",error);
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                conf.bucketId,
                fileId,
            )
        } catch (error) {
            console.log("Appwrite :: auth :: delete File :: error",error);
            return false;
        }
    }

    async getFilePreview(fileId){
        try {
            return await this.bucket.getFilePreview(
                conf.bucketId,
                fileId,
            )
        } catch (error) {
            console.log("Appwrite :: auth :: Get File Preview :: error",error);
            return null
        }
    }
}

const service = new Service();

export default service;