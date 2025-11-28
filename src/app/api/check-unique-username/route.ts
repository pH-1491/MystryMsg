import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValiation} from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValiation,
})


export async function GET(request: Request){
    //check the type of the request
    // if (request.method !== "GET"){
    //     return Response.json({
    //         success: false,
    //         message: "Method not allowed"
    //     },{status: 405});
    // }

    await dbConnect()

    try{
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);

        if (!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors?.join(", ")
                    : 'Invalid query parameters'
            },{status: 400});
        }

        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({username: username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is already in use',
            },{status: 400});
        }

        return Response.json({
            success: true,
            message: 'Username is available'
        },{status: 400});

    }catch(err){
        console.error("error checking username",err);
        return Response.json({
            success: false,
            message: 'Error checking username',
        },
            {status:500}
        )
    }
}