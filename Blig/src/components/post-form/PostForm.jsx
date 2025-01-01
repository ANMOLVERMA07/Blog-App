import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import service from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    // Check if there is an existing post to update
    if (post) {
      // Upload the new image if it exists
    const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
      // If a new file was uploaded, delete the old featured image
       if (file) {
          appwriteService.deleteFile(post.featuredImage);
       }
      // Update the post with the new data and the new file ID (if available)
    const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
      // If the post was successfully updated, navigate to the updated post's page
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      // If no existing post, upload the new image
      const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;
      if (file) {
        // Add the file ID to the data
        const fileId = file.$id;
        data.featuredImage = fileId;
        // Create a new post with the updated data and user ID
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        // If the post was successfully created, navigate to the new post's page
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string'){
            return value
                   .trim()
                   .toLowerCase()
                   .replace(/^[a-zA-Z\d\s]+/g,'-')
                   .replace(/\s/g,'-')
        }
        return ""
  },[])

  useEffect(() => {
    const subscription = watch((value,{name}) => {
        if(name === 'title'){
            setValue('slug',setValue(slugTransform(value.title,{shouldValidate : true})));
        }
    })


    return () => {
        subscription.unsubscribe()
    }
  },[watch,slugTransform,setValue])
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button children={post ? "Update" : "Submit"} type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" />
                  
            </div>
        </form>
  )
}

export default PostForm;


